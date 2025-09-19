// middlewares/redirectIfGTestBookedMiddleware.js
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect("/login");

    const user = await User.findById(userId).select("TestType appointment");
    const hasGBooking = user?.TestType === "G" && !!user?.appointment?.appointmentId;

    if (hasGBooking) {
      
      return res.redirect("/g_test");
    }

    return next();
  } catch (err) {
    console.error("redirectIfGTestBookedMiddleware error:", err);
    return res.status(500).send("Server error");
  }
};
