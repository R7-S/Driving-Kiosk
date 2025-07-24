const Appointment = require("../models/Appointment");
const User = require("../models/User");

const examinerDashboard = async (req, res) => {
  const { testType } = req.query || {}; // ✅ Safe outside the try block

  try {
    // ✅ Build dynamic filter
    const filter = { appointmentId: { $ne: null } };
    if (testType) {
      filter.TestType = testType;
    }

    // ✅ Fetch filtered users
    const usersWithAppointments = await User.find(filter)
      .populate({
        path: 'appointmentId',
        select: 'date time status',
      })
      .select('firstName lastName licenseNumber carDetails TestType appointmentId');

    // ✅ Format data for the view
    const appointments = usersWithAppointments.map(user => ({
      userId: user._id, // we’ll need this later
      driverName: `${user.firstName || 'Unknown'} ${user.lastName || ''}`,
      licenseNumber: user.licenseNumber || 'N/A',
      carMake: user.carDetails?.make || 'N/A',
      date: user.appointmentId?.date || 'N/A',
      time: user.appointmentId?.time || 'N/A',
      testType: user.TestType || 'N/A',
    }));

    console.log("Filtered Appointments:", appointments);

    // ✅ Render dashboard with selected testType retained
    res.render("examiner-dashboard", {
      appointments,
      testType: testType || '', // helps keep dropdown selected
    });

  } catch (error) {
    console.error("Error fetching users with appointments:", error);
    res.status(500).send("Error fetching users with appointments.");
  }
};

module.exports = { examinerDashboard };
