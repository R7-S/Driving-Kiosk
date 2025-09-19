const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Eligible for G if experienced OR has G2 license OR has booked a G2 appointment
function isEligibleForGTest(user) {
  const experienced = String(user?.experience || "").toLowerCase() === "yes";
  const hasG2License = !!user?.licenseNumber;
  const hasG2Appointment =
    user?.TestType === "G2" && !!user?.appointment?.appointmentId;
  return experienced || hasG2License || hasG2Appointment;
}

// GET /g_test  (current logged-in user)
const g_testPage = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    // If the user has booked a G test, show G summary on the G page
    if (user?.TestType === "G" && user?.appointment?.appointmentId) {
      return res.render("g_test_summary", { user });
    }

    // Not booked G yet → must be eligible
    if (!isEligibleForGTest(user)) {
      return res.render("missing_g2");
    }

    return res.render("g_test_details", { user });
  } catch (err) {
    console.error("🔥 Error in g_testPage:", err);
    return res.status(500).send("Server error");
  }
};

// GET /g_test/:username (or session)
const g_testGetUser = async (req, res) => {
  try {
    const username = req.session.username || req.params.username;
    if (!username) return res.status(400).send("Username is missing from session or params.");

    const user = await User.findOne({ username });
    if (!user) return res.status(404).send("User not found");

    // If the user has booked a G test, show G summary on the G page
    if (user?.TestType === "G" && user?.appointment?.appointmentId) {
      return res.render("g_test_summary", { user });
    }

    // Not booked G yet → must be eligible
    if (!isEligibleForGTest(user)) {
      return res.render("missing_g2");
    }

    return res.render("g_test_details", { user });
  } catch (error) {
    console.error("🔥 Error in g_testGetUser:", error);
    return res.status(500).send("Server error");
  }
};

const g_testUpdate = async (req, res) => {
  try {
    console.log("🚗 G Test Update Request:", req.body);

    const { id, carDetails, appointment, TestType } = req.body;

    const updateFields = {
      carDetails,
      TestType: TestType || "G",
    };

    if (appointment && appointment.appointmentId) {
      updateFields.appointment = {
        appointmentId: appointment.appointmentId,
        date: appointment.date,
        time: appointment.time,
      };

      await Appointment.findByIdAndUpdate(appointment.appointmentId, {
        isTimeSlotAvailable: false,
      });
    }

    await User.findByIdAndUpdate(id, { $set: updateFields });

    return res.status(200).json({ message: "G Test booked successfully." });
  } catch (error) {
    console.error("🔥 Error in g_testUpdate:", error);
    return res.status(500).json({ error: "Server error while booking G Test." });
  }
};

module.exports = { g_testPage, g_testGetUser, g_testUpdate };
