const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

// GET all products
router.get("/", async (req, res) => {
	try {
		const result = await query("SELECT * FROM products ORDER BY id");
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

// GET product by ID
router.get("/:id", async (req, res) => {
	try {
		const result = await query("SELECT * FROM products WHERE id = $1", [
			req.params.id,
		]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Not found" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

// CREATE product
router.post("/", async (req, res) => {
	try {
		const { name, description, price } = req.body;
		const result = await query(
			"INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *",
			[name, description, price]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

// UPDATE product
router.put("/:id", async (req, res) => {
	try {
		const { name, description, price } = req.body;
		const result = await query(
			"UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
			[name, description, price, req.params.id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Not found" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

// DELETE product
router.delete("/:id", async (req, res) => {
	try {
		const result = await query(
			"DELETE FROM products WHERE id = $1 RETURNING *",
			[req.params.id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Not found" });
		}
		res.json({ message: "Deleted", product: result.rows[0] });
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

module.exports = router;
