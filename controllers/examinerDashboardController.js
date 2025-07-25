const User = require("../models/User");

const examinerDashboard = async (req, res) => {
  const { testType } = req.query || {};

  try {
    // ✅ Match users who have appointments with embedded data
    const filter = { "appointment.appointmentId": { $exists: true } };

    if (testType) {
      filter.TestType = testType;
    }

    const usersWithAppointments = await User.find(filter).select(
      "firstName lastName licenseNumber carDetails TestType appointment"
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
    }));

    console.log("Filtered Appointments:", appointments);

    res.render("examiner-dashboard", {
      appointments,
      testType: testType || "",
    });
  } catch (error) {
    console.error("Error fetching users with appointments:", error);
    res.status(500).send("Error fetching users with appointments.");
  }
};

module.exports = { examinerDashboard };
