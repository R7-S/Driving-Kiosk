const User = require("../models/User");
const Appointment = require("../models/Appointment");

const g2_testPage = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("g2_test", { user });
};

const g2_testUpdate = async (req, res) => {
  try {
    const userId = req.session.userId;

    const {
      firstName,
      lastName,
      licenseNumber,
      age,
      make,
      model,
      year,
      plateno,
      experience,
      appointmentDate,
      appointmentTime,
      appointmentId,
    } = req.body;

    const updateFields = {
      firstName,
      lastName,
      licenseNumber,
      age,
      experience,
      carDetails: {
        make,
        model,
        year,
        plateno,
      },
    };

    // Only assign TestType and appointment if NOT experienced
    if (experience?.toLowerCase() !== "yes" && appointmentId) {
      updateFields.TestType = "G2";
      updateFields.appointment = {
        date: appointmentDate,
        time: appointmentTime,
        appointmentId,
      };

      await Appointment.findByIdAndUpdate(appointmentId, {
        isTimeSlotAvailable: false,
      });
    }

    await User.findByIdAndUpdate(userId, updateFields);
    return res.redirect("/g_test");
  } catch (error) {
    console.error("Error updating G2 test user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { g2_testPage, g2_testUpdate };
