const Booking = require("../models/Booking");
const Bed = require("../models/Bed");
const { emitBedAvailability } = require("./socket.service");

const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

const sweep = async () => {
  const now = new Date();

  const expiredBookings = await Booking.find({
    status: "BLOCKED",
    blockedUntil: { $lte: now }
  });

  for (const booking of expiredBookings) {
    booking.status = "EXPIRED";
    await booking.save();
  }

  const expiredBeds = await Bed.find({
    status: "BLOCKED",
    blockedUntil: { $lte: now }
  });

  for (const bed of expiredBeds) {
    bed.status = "AVAILABLE";
    bed.blockedUntil = undefined;
    await bed.save();
    emitBedAvailability(bed);
  }

  if (expiredBookings.length || expiredBeds.length) {
    console.log(`[expiry] Expired ${expiredBookings.length} bookings and ${expiredBeds.length} beds.`);
  }
};

const start = () => {
  console.log(`[expiry] Sweep service started (interval: ${SWEEP_INTERVAL_MS / 1000}s).`);
  sweep();
  return setInterval(sweep, SWEEP_INTERVAL_MS);
};

module.exports = { start, sweep };
