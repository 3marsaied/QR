const mongoose = require("mongoose");

let isConnected;

async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGOURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

module.exports = connectDB;
