const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

router.get("/", async (req, res) => {
	try {
		const result = await query(
			"SELECT id, email, name, created_at FROM users ORDER BY id"
		);
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const result = await query(
			"SELECT id, email, name, created_at FROM users WHERE id = $1",
			[req.params.id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Not found" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { email, password, name } = req.body;
		const result = await query(
			"INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at",
			[email, password, name]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { email, name } = req.body;
		const result = await query(
			"UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING id, email, name, created_at",
			[email, name, req.params.id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Not found" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const result = await query(
			"DELETE FROM users WHERE id = $1 RETURNING id, email, name",
			[req.params.id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Not found" });
		}
		res.json({ message: "Deleted", user: result.rows[0] });
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
});

module.exports = router;
