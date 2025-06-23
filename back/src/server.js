const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_PREFIX = process.env.API_PREFIX || "/api";
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);

app.use((req, res) => {
	res.status(404).json({
		error: "Not Found",
		message: "The requested resource does not exist",
	});
});

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Internal Server Error";

	res.status(status).json({
		success: false,
		error: {
			message,
			status,
		},
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
