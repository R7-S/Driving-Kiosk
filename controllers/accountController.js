const User = require("../models/User");
const Appointment = require("../models/Appointment");

const deleteConfirm = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("account_delete"); 
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect("/login");

    
    const user = await User.findById(userId).select("appointment");
    const apptId = user?.appointment?.appointmentId;
    if (apptId) {
      await Appointment.findByIdAndUpdate(apptId, { isTimeSlotAvailable: true });
    }

    await User.findByIdAndDelete(userId);

    req.session.destroy(() => res.redirect("/login?deleted=1"));
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { deleteConfirm, deleteAccount };
