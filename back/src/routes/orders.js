const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

router.get("/", async (req, res) => {
	try {
		const result = await query(`
			SELECT o.*, 
				(SELECT COUNT(*) FROM order_products WHERE order_id = o.id) as items_count
			FROM orders o 
			ORDER BY o.created_at DESC
		`);
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: "Erreur de base de données" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { user_id, items } = req.body;

		if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
			return res.status(400).json({ error: "Données invalides" });
		}

		// Calculer le total
		let total = 0;
		for (const item of items) {
			const productResult = await query(
				"SELECT price FROM products WHERE id = $1",
				[item.product_id]
			);
			if (productResult.rows.length === 0) {
				return res
					.status(400)
					.json({ error: `Produit ${item.product_id} non trouvé` });
			}
			total += productResult.rows[0].price * item.quantity;
		}

		// Créer la commande
		const orderResult = await query(
			"INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
			[user_id, total]
		);

		const order = orderResult.rows[0];

		// Ajouter les produits à la commande
		for (const item of items) {
			const productResult = await query(
				"SELECT price FROM products WHERE id = $1",
				[item.product_id]
			);
			const price = productResult.rows[0].price;

			await query(
				"INSERT INTO order_products (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
				[order.id, item.product_id, item.quantity, price]
			);
		}

		res.status(201).json(order);
	} catch (error) {
		console.error("Erreur création commande:", error);
		res.status(500).json({ error: "Erreur de base de données" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const result = await query("DELETE FROM orders WHERE id = $1 RETURNING *", [
			req.params.id,
		]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Commande non trouvée" });
		}
		res.json({ message: "Supprimé", order: result.rows[0] });
	} catch (error) {
		res.status(500).json({ error: "Erreur de base de données" });
	}
});

module.exports = router;
