const User = require("../models/User");
const Appointment = require("../models/Appointment");

const g2_testPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).send("User not found");

    // If the user has booked a G2 test, show G2 summary on the G2 page
    if (user?.TestType === "G2" && user?.appointment?.appointmentId) {
      return res.render("g2_test_summary", { user });
    }

    // Otherwise render the normal G2 page (your EJS handles the 'experienced' view)
    return res.render("g2_test", { user });
  } catch (error) {
    console.error("Error in g2_testPage:", error);
    return res.status(500).send("Internal server error");
  }
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
      carDetails: { make, model, year, plateno },
    };

    // Only book a G2 appointment if NOT experienced
    if ((experience || "").toLowerCase() !== "yes" && appointmentId) {
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
    return res.redirect("/g_test"); // proceed to G eligibility/booking
  } catch (error) {
    console.error("Error updating G2 test user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { g2_testPage, g2_testUpdate };
