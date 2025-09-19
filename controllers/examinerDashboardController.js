const User = require("../models/User");
const Appointment = require("../models/Appointment");

const examinerDashboard = async (req, res) => {
  const { testType } = req.query || {};

  try {
    const filter = { "appointment.appointmentId": { $exists: true } };
    if (testType) filter.TestType = testType;

    const usersWithAppointments = await User.find(filter).select(
      "firstName lastName licenseNumber carDetails TestType appointment Comment PassFail"
    );

    const appointments = usersWithAppointments.map((user) => ({
      userId: user._id,
      driverName: `${user.firstName || "Unknown"} ${user.lastName || ""}`,
      licenseNumber: user.licenseNumber || "N/A",
      carMake: user.carDetails?.make || "N/A",
      carModel: user.carDetails?.model || "N/A",
      carYear: user.carDetails?.year || "N/A",
      carPlate: user.carDetails?.plateno || "N/A",
      date: user.appointment?.date || "N/A",
      time: user.appointment?.time || "N/A",
      testType: user.TestType || "N/A",
      
      passFail: user.PassFail,
      comment: user.Comment || "",
      appointmentId: user.appointment?.appointmentId || null,
    }));

    res.render("examiner-dashboard", {
      appointments,
      testType: testType || "",
    });
  } catch (error) {
    console.error("Error fetching users with appointments:", error);
    res.status(500).send("Error fetching users with appointments.");
  }
};


const updateTestResult = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { passFail, comment, currentFilter } = req.body;

    // Update user fields
    const user = await User.findByIdAndUpdate(
      driverId,
      { $set: { PassFail: passFail === "true", Comment: comment || "" } },
      { new: true }
    ).select("appointment");

    // Mark the appointment as completed in the appointment collection
    if (user?.appointment?.appointmentId) {
      await Appointment.findByIdAndUpdate(user.appointment.appointmentId, {
        status: "Completed",
      });
    }

    
    const q = currentFilter ? `?testType=${encodeURIComponent(currentFilter)}` : "";
    return res.redirect(`/examiner-dashboard${q}`);
  } catch (err) {
    console.error("Failed to update test result:", err);
    return res.status(500).send("Failed to update test result");
  }
};

module.exports = { examinerDashboard, updateTestResult };
