const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

const DEFAULT_USER_ID = 1;

router.get("/", async (req, res) => {
	try {
		const result = await query(`
			SELECT o.*, u.name as user_name, u.email as user_email 
			FROM orders o 
			JOIN users u ON o.user_id = u.id 
			ORDER BY o.created_at DESC
		`);
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const orderResult = await query(
			`
			SELECT o.*, u.name as user_name, u.email as user_email 
			FROM orders o 
			JOIN users u ON o.user_id = u.id 
			WHERE o.id = $1
		`,
			[req.params.id]
		);

		if (orderResult.rows.length === 0) {
			return res.status(404).json({ error: "Not found" });
		}

		const productsResult = await query(
			`
			SELECT op.*, p.name, p.description 
			FROM order_products op 
			JOIN products p ON op.product_id = p.id 
			WHERE op.order_id = $1
		`,
			[req.params.id]
		);

		const order = orderResult.rows[0];
		order.products = productsResult.rows;

		res.json(order);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { products } = req.body;

		let total = 0;
		const productDetails = [];

		for (const item of products) {
			const productResult = await query(
				"SELECT * FROM products WHERE id = $1",
				[item.product_id]
			);
			if (productResult.rows.length === 0) {
				return res
					.status(400)
					.json({ error: `Product ${item.product_id} not found` });
			}
			const product = productResult.rows[0];
			const subtotal = product.price * item.quantity;
			total += subtotal;
			productDetails.push({
				...item,
				price: product.price,
				subtotal,
			});
		}

		const orderResult = await query(
			"INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
			[DEFAULT_USER_ID, total]
		);
		const order = orderResult.rows[0];

		for (const detail of productDetails) {
			await query(
				"INSERT INTO order_products (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
				[order.id, detail.product_id, detail.quantity, detail.price]
			);
		}

		res.status(201).json(order);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const result = await query("DELETE FROM orders WHERE id = $1 RETURNING *", [
			req.params.id,
		]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Not found" });
		}
		res.json({ message: "Deleted", order: result.rows[0] });
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

module.exports = router;
