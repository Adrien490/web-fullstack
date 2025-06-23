const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

app.get("/", (req, res) => {
	res.json({ message: "API Web Full Stack" });
});

app.use("*", (req, res) => {
	res.status(404).json({
		error: "Page non trouvée",
		message: "Cette route n'existe pas",
	});
});

app.use((err, req, res, next) => {
	res.status(500).json({
		error: {
			message: "Erreur interne du serveur",
			...(process.env.NODE_ENV === "development" && { stack: err.stack }),
		},
	});
});

app.listen(PORT, () => {
	console.log(`Serveur démarré sur le port ${PORT}`);
});
