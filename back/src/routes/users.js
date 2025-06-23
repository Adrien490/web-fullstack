const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

router.get("/:id", async (req, res) => {
	try {
		const result = await query(
			"SELECT id, email, name, firstname, lastname, address, phone, created_at FROM users WHERE id = $1",
			[req.params.id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Utilisateur non trouvé" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Erreur de base de données" });
	}
});

router.get("/:id/orders", async (req, res) => {
	try {
		const ordersResult = await query(
			`SELECT o.*, 
				(SELECT COUNT(*) FROM order_products WHERE order_id = o.id) as items_count
			FROM orders o 
			WHERE o.user_id = $1 
			ORDER BY o.created_at DESC`,
			[req.params.id]
		);

		const orders = [];
		for (const order of ordersResult.rows) {
			const productsResult = await query(
				`SELECT p.name, p.price, op.quantity 
				FROM order_products op
				JOIN products p ON op.product_id = p.id
				WHERE op.order_id = $1`,
				[order.id]
			);

			orders.push({
				...order,
				products: productsResult.rows,
			});
		}

		res.json(orders);
	} catch (error) {
		res.status(500).json({ error: "Erreur de base de données" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { email, name, firstname, lastname, address, phone } = req.body;
		const result = await query(
			"UPDATE users SET email = $1, name = $2, firstname = $3, lastname = $4, address = $5, phone = $6 WHERE id = $7 RETURNING id, email, name, firstname, lastname, address, phone, created_at",
			[email, name, firstname, lastname, address, phone, req.params.id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Utilisateur non trouvé" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Erreur de base de données" });
	}
});

module.exports = router;
