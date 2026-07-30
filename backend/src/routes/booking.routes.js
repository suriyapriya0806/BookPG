const express = require("express");
const controller = require("../controllers/booking.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/error.middleware");
const { body } = require("express-validator");
const { bookingRules, mongoId } = require("../validators/common.validators");

const router = express.Router();

router.use(authenticate);
router.get("/", controller.list);
router.post("/", authorize("GUEST"), bookingRules, validate, controller.create);
const confirmRules = [
  mongoId(),
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be a positive number."),
  body("paymentMethod").isIn(["CASH", "UPI", "BANK_TRANSFER"]).withMessage("Payment method must be CASH, UPI, or BANK_TRANSFER."),
  body("referenceNumber").optional().trim()
];
router.patch("/:id/confirm", authorize("SUPER_ADMIN"), confirmRules, validate, controller.confirm);
const walkInRules = [
  body("guestName").trim().notEmpty().withMessage("Guest name is required."),
  body("phone").trim().notEmpty().withMessage("Phone is required."),
  body("email").optional().trim().isEmail().withMessage("Valid email is required."),
  body("branch").isMongoId().withMessage("Branch must be a valid Mongo id."),
  body("room").isMongoId().withMessage("Room must be a valid Mongo id."),
  body("bed").isMongoId().withMessage("Bed must be a valid Mongo id."),
  body("moveInDate").isISO8601().withMessage("Move-in date is required."),
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be a positive number."),
  body("paymentMethod").isIn(["CASH", "UPI", "BANK_TRANSFER"]).withMessage("Payment method must be CASH, UPI, or BANK_TRANSFER."),
  body("referenceNumber").optional().trim()
];
router.post("/walk-in", authorize("SUPER_ADMIN"), walkInRules, validate, controller.walkIn);
router.patch("/:id/reject", authorize("SUPER_ADMIN"), mongoId(), validate, controller.reject);

module.exports = router;
