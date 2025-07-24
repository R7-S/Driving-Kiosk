const express = require("express");
const app = express();
require('dotenv').config();

const path = require("path");
const expressSession = require("express-session");
const mongoose = require("mongoose");

// Controllers
const indexController = require("./controllers/indexController");
const {
  g2_testPage,
  g2_testUpdate,
} = require("./controllers/g2_testController");
const {
  g_testGetUser,
  g_testPage,
  g_testUpdate,
} = require("./controllers/g_testController");
const {
  register_create,
  registerPage,
} = require("./controllers/registerController");
const {
  loginPage,
  loginCreate,
  logOut,
} = require("./controllers/loginController");
const {
  AppointmentPage,
  Appointment_Slots,
  getBookedSlots,
  getAvaialableSlots,
} = require("./controllers/appointmentController");
const {
  examinerDashboard,
} = require("./controllers/examinerDashboardController.js");

const redirectIfLoggedInMiddleware = require("./middlewares/redirectIfLoggedInMiddleware.js");
const redirectIfNotLoggedInMiddleware = require("./middlewares/redirectIfNotLoggedInMiddleware.js");
const redirectIfNotDriverMiddleware = require("./middlewares/redirectIfNotDriverMiddleware.js");
const redirectIfNotAdmin = require("./middlewares/redirectIfNotAdmin.js");
const redirectIfNotExaminerMiddleware = require("./middlewares/redirectIfNotExaminerMiddleware.js");

// Models
const Appointment = require("./models/Appointment.js");
const User = require("./models/User");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Sessions
app.use(
  expressSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// GLOBAL middleware to make session data available in all views
app.use((req, res, next) => {
  res.locals.UserId = req.session.userId;
  res.locals.UserType = req.session.userType;
  res.locals.Username = req.session.username;
  next();
});

app.listen(4000, () => {
  console.log("App listening on port 4000");
});

// ROUTES
app.get("/", indexController);

app.get("/login", redirectIfLoggedInMiddleware, loginPage);
app.post("/login/authorization", redirectIfLoggedInMiddleware, loginCreate);
app.get("/register", redirectIfLoggedInMiddleware, registerPage);
app.post("/register/create", redirectIfLoggedInMiddleware, register_create);
app.get("/logout", logOut);

// G2 Test Routes
app.get(
  "/g2_test",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotDriverMiddleware,
  g2_testPage
);



app.post(
  "/g2_test/update",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotDriverMiddleware,
  g2_testUpdate
);

// G Test Routes
app.get(
  "/g_test",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotDriverMiddleware,
  g_testPage
);
app.get(
  "/g_test/:id",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotDriverMiddleware,
  g_testGetUser
);
app.post(
  "/g_test/update",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotDriverMiddleware,
  g_testUpdate
);

// Appointment Routes
app.get(
  "/appointment",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotAdmin,
  AppointmentPage
);
app.post("/create-slots", Appointment_Slots);
app.get("/get-created-slots/:date", getBookedSlots);
app.get("/get-available-slots/:date", getAvaialableSlots);

// Examiner Dashboard
app.get(
  "/examiner-dashboard",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotExaminerMiddleware,
  examinerDashboard
);

// TEST RESULT ROUTES
app.post("/update-test-result/:driverId", async (req, res) => {
  const { driverId } = req.params;
  const { comment, passFail } = req.body;

  try {
    await User.findByIdAndUpdate(driverId, {
      $set: {
        "TestResult.comment": comment,
        "TestResult.pass": passFail === "true",
      },
    });
    res.redirect("/examiner-dashboard");
  } catch (error) {
    console.error("Failed to update test result: ", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/admin/test-results", async (req, res) => {
  try {
    const results = await User.find({
      "TestResult.pass": { $exists: true },
    }).select("firstName lastName TestResult");
    res.render("admin-test-results", { results });
  } catch (error) {
    console.error("Error fetching test results: ", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/driver/test-result", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const user = await User.findById(req.session.userId).select("TestResult");
    res.render("driver-test-result", { result: user.TestResult });
  } catch (error) {
    console.error("Error fetching user's test result: ", error);
    res.status(500).send("Internal Server Error");
  }
});
