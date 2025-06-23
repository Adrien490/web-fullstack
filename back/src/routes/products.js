const express = require("express");
const router = express.Router();
const { query } = require("../config/database");

router.get("/", async (req, res) => {
	try {
		const result = await query("SELECT * FROM products ORDER BY id");
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: "Erreur de base de données" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const result = await query("SELECT * FROM products WHERE id = $1", [
			req.params.id,
		]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Produit non trouvé" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Erreur de base de données" });
	}
});

module.exports = router;
