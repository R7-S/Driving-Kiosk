const User = require("../models/User");

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
      return res.status(400).send("You must complete your G2 Test first.");
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

    const updateFields = {
      carDetails: req.body.carDetails,
      TestType: "G"  // ✅ Confirm G level test
    };

    await User.findByIdAndUpdate(
      req.body.id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ message: "Car details updated. G Test confirmed." });
  } catch (error) {
    console.error("🔥 Error in g_testUpdate:", error);
    res.status(500).json({ error: "Update failed" });
  }
};


const g_testPage = (req, res) => {
  res.render("g_test", { id: "", user: null, error: null });
};

module.exports = { g_testPage, g_testGetUser, g_testUpdate };
