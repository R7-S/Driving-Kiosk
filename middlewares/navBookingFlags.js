// middlewares/navBookingFlags.js
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // safe defaults so EJS never errors
  res.locals.HasGBooking = false;
  res.locals.HasG2Booking = false;

  try {
    const isDriver = String(req.session?.userType || "").toLowerCase() === "driver";
    if (req.session?.userId && isDriver) {
      const user = await User.findById(req.session.userId).select("TestType appointment");
      const hasAppt = !!user?.appointment?.appointmentId;
      if (hasAppt) {
        res.locals.HasGBooking  = user?.TestType === "G";
        res.locals.HasG2Booking = user?.TestType === "G2";
      }
    }
  } catch (e) {
    console.error("navBookingFlags error:", e);
    // continue with defaults
  }
  next();
};
