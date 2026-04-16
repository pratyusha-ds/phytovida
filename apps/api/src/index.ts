import "dotenv/config"; // Load environment variables from .env file
import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date(Date.now()).toUTCString(),
	});
});

// Example route
app.get("/", (req, res) => {
	res.send("API is running");
});

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server running on http://localhost:${PORT}`);
});
