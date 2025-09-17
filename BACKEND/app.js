const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const connectDB = require("./lib/db");

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    credentials: true,
  })
);

// Connect DB before routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ message: "DB connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Dynamic route loading
function loadRoutes(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    const route = require(filePath);
    const routeName = path.basename(file, path.extname(file));
    app.use(`/${routeName}`, route);
  });
}
const routesDirectory = path.join(__dirname, "routes");
loadRoutes(routesDirectory);

// 🚨 REMOVE app.listen when deploying to Vercel
// app.listen(port, () => console.log(`Server running on ${port}`));

module.exports = app; // Export for Vercel
