const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    bed: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", required: true },
    moveInDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["BLOCKED", "CONFIRMED", "REJECTED", "CANCELLED", "CHECKED_IN", "EXPIRED"],
      default: "BLOCKED"
    },
    notes: { type: String },
    confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    confirmedAt: { type: Date },
    rejectionReason: { type: String },
    blockedUntil: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
