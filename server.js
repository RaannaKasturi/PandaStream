require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Endpoint to provide API key securely
app.get("/getApiKey", (req, res) => {
  res.json({ apiKey: process.env.TMDB_API_KEY });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
