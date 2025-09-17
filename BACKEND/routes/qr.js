const express = require("express");
const { v5: uuidv5 } = require("uuid");
const { authenticateToken, verifyAccessToken } = require("../utils/oauth2");

const router = express.Router();

// A namespace for UUID v5 (fixed constant)
const NAMESPACE = uuidv5.DNS; // You can also use a custom namespace

router.get("/current", authenticateToken, async (req, res) => {
  try {
    const userId = verifyAccessToken(req.token);
    if (!userId) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    // Use the current minute as a "time slot"
    const now = Date.now();
    const currentMinute = Math.floor(now / 60000); // epoch minutes

    // Seed = userId + currentMinute
    const seed = `${userId}-${currentMinute}`;

    // Deterministic UUID that changes every 60s
    const currentUuid = uuidv5(seed, NAMESPACE);

    res.status(200).json({
      uuid: currentUuid
    });
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
