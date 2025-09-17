const qrCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uuid: { type: String, required: true }, // UUID v4
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QRCode", qrCodeSchema);