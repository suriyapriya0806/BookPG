const mongoose = require("mongoose");
const Bed = require("../models/Bed");
const Booking = require("../models/Booking");
const Branch = require("../models/Branch");
const Payment = require("../models/Payment");
const Resident = require("../models/Resident");
const Room = require("../models/Room");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const { emitBedAvailability } = require("../services/socket.service");

const lazyExpire = (booking) => {
  if (booking.status === "BLOCKED" && booking.blockedUntil && new Date() > booking.blockedUntil) {
    booking.status = "EXPIRED";
  }
  return booking;
};

const list = catchAsync(async (req, res) => {
  const filter = {};
  if (req.user.role === "GUEST") filter.guest = req.user._id;
  if (req.user.role === "WARDEN" && req.user.branch) filter.branch = req.user.branch;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.branch && req.user.role === "SUPER_ADMIN") filter.branch = req.query.branch;

  let data = await Booking.find(filter)
    .populate("guest branch room bed confirmedBy")
    .sort({ createdAt: -1 });

  data = data.map(lazyExpire);

  res.json({ success: true, data });
});

const create = catchAsync(async (req, res) => {
  const { branch, room, bed, moveInDate, notes } = req.body;
  const session = await mongoose.startSession();

  let booking;
  await session.withTransaction(async () => {
    const selectedBed = await Bed.findOne({ _id: bed, room, branch }).session(session);
    if (!selectedBed || selectedBed.status !== "AVAILABLE") {
      throw new ApiError(409, "Selected bed is not available.");
    }

    const roomDoc = await Room.findById(room).session(session);
    if (!roomDoc) throw new ApiError(404, "Room not found.");

    const branchDoc = await Branch.findById(branch).session(session);
    if (!branchDoc) throw new ApiError(404, "Branch not found.");

    const expiryHours = branchDoc.blockExpiryHours || 24;
    const blockedUntil = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    selectedBed.status = "BLOCKED";
    selectedBed.blockedUntil = blockedUntil;
    await selectedBed.save({ session });

    booking = await Booking.create(
      [
        {
          guest: req.user._id,
          branch,
          room,
          bed,
          moveInDate,
          notes,
          status: "BLOCKED",
          blockedUntil
        }
      ],
      { session }
    );

    emitBedAvailability(selectedBed);
  });

  session.endSession();
  res.status(201).json({ success: true, data: booking[0] });
});

const confirm = catchAsync(async (req, res) => {
  const { amount, paymentMethod, referenceNumber } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found.");
  if (booking.status !== "BLOCKED") throw new ApiError(409, "Booking is not in blocked status.");

  const bed = await Bed.findById(booking.bed);
  if (!bed || bed.status !== "BLOCKED") throw new ApiError(409, "Bed is not blocked.");

  booking.status = "CONFIRMED";
  booking.confirmedBy = req.user._id;
  booking.confirmedAt = new Date();

  const resident = await Resident.create({
    user: booking.guest,
    booking: booking._id,
    branch: booking.branch,
    room: booking.room,
    bed: booking.bed,
    moveInDate: booking.moveInDate
  });

  bed.currentResident = resident._id;
  await booking.save();
  await bed.save();

  await Payment.create({
    booking: booking._id,
    guest: booking.guest,
    branch: booking.branch,
    amount,
    type: "OTHER",
    status: "PAID",
    method: paymentMethod,
    reference: referenceNumber || undefined,
    collectedBy: req.user._id,
    paidAt: new Date()
  });

  emitBedAvailability(bed);

  res.json({ success: true, data: booking });
});

const reject = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found.");

  const bed = await Bed.findById(booking.bed);
  booking.status = "REJECTED";
  booking.rejectionReason = req.body.reason || "Rejected by Super Admin";
  if (bed && bed.status !== "OCCUPIED") {
    bed.status = "AVAILABLE";
    bed.blockedUntil = undefined;
    await bed.save();
    emitBedAvailability(bed);
  }
  await booking.save();

  res.json({ success: true, data: booking });
});

const walkIn = catchAsync(async (req, res) => {
  const { guestName, phone, email, branch, room, bed, moveInDate, amount, paymentMethod, referenceNumber } = req.body;

  let guest = await User.findOne({ $or: [{ phone }, ...(email ? [{ email }] : [])] });
  if (!guest) {
    const tempEmail = email || `walkin-${Date.now()}@placeholder.pg`;
    guest = await User.create({
      name: guestName,
      email: tempEmail,
      phone,
      role: "GUEST",
      provider: "local"
    });
  }

  const session = await mongoose.startSession();
  let bookingRecord;
  await session.withTransaction(async () => {
    const selectedBed = await Bed.findOne({ _id: bed, room, branch }).session(session);
    if (!selectedBed || selectedBed.status !== "AVAILABLE") {
      throw new ApiError(409, "Selected bed is not available.");
    }

    const branchDoc = await Branch.findById(branch).session(session);
    if (!branchDoc) throw new ApiError(404, "Branch not found.");

    selectedBed.status = "BLOCKED";
    await selectedBed.save({ session });

    bookingRecord = await Booking.create(
      [
        {
          guest: guest._id,
          branch,
          room,
          bed,
          moveInDate,
          status: "CONFIRMED",
          confirmedBy: req.user._id,
          confirmedAt: new Date()
        }
      ],
      { session }
    );

    await Payment.create(
      [
        {
          booking: bookingRecord[0]._id,
          guest: guest._id,
          branch,
          amount,
          type: "OTHER",
          status: "PAID",
          method: paymentMethod,
          reference: referenceNumber || undefined,
          collectedBy: req.user._id,
          paidAt: new Date()
        }
      ],
      { session }
    );

    emitBedAvailability(selectedBed);
  });

  session.endSession();
  res.status(201).json({ success: true, data: bookingRecord[0] });
});

module.exports = { list, create, confirm, reject, walkIn };
