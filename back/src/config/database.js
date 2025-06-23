const { Pool } = require("pg");

const pool = new Pool({
	connectionString:
		"postgresql://neondb_owner:npg_mifpwG5VaOz8@ep-mute-tooth-a8xtg1gm-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
	ssl: {
		rejectUnauthorized: false,
	},
});

module.exports = {
	pool,
	query: (text, params) => pool.query(text, params),
};
