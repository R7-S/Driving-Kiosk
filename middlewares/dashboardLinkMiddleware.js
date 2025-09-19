// middlewares/dashboardLinkMiddleware.js
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // defaults
  res.locals.DashboardURL = "/login";
  res.locals.DashboardLabel = "Dashboard";

  try {
    const userId = req.session?.userId;
    if (!userId) return next();

    const user = await User.findById(userId).select("userType");
    const role = String(user?.userType || "").toLowerCase();

    if (role === "examiner") {
      res.locals.DashboardURL = "/examiner-dashboard";
      res.locals.DashboardLabel = "Examiner Dashboard";
    } else if (role === "admin") {
      res.locals.DashboardURL = "/appointment";
      res.locals.DashboardLabel = "Admin Dashboard";
    } else {
      // driver
      res.locals.DashboardURL = "/";
      res.locals.DashboardLabel = "Dashboard";
    }
  } catch (e) {
    console.error("dashboardLinkMiddleware error:", e);
  }
  next();
};
