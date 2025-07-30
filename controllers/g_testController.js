const User = require("../models/User");
const Appointment = require("../models/Appointment");

const g_testGetUser = async (req, res) => {
  try {
    const username = req.session.username || req.params.username;
    if (!username) {
      return res.status(400).send("Username is missing from session or params.");
    }

    const user = await User.findOne({ username });

    // ✅ Move this after null check to avoid crash
    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("👤 G Test Access Check for:", user);

    // ✅ Allow experienced users OR users with G2 license
    if (!user.licenseNumber && String(user.experience).toLowerCase() !== "yes") {
      console.log("❌ Blocking: No G2 license and not experienced");
      return res.render("missing_g2");

    }

    // ✅ Passed validation
    res.render("g_test", { user });

  } catch (error) {
    console.error("🔥 Error in g_testGetUser:", error);
    res.status(500).send("Server error");
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

    // If appointment info is provided, update the user's appointment and mark slot as unavailable
    if (appointment && appointment.appointmentId) {
      updateFields.appointment = {
        appointmentId: appointment.appointmentId,
        date: appointment.date,
        time: appointment.time,
      };

      // Mark that time slot unavailable
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


const g_testPage = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("g_test_details", { user }); // ✅ Render the detailed EJS
  } catch (err) {
    console.error("🔥 Error in g_testPage:", err);
    res.status(500).send("Server error");
  }
};


module.exports = { g_testPage, g_testGetUser, g_testUpdate };
