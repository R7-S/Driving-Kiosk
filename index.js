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
  updateTestResult, // 👈 added
} = require("./controllers/examinerDashboardController.js");

const { deleteConfirm, deleteAccount } = require("./controllers/accountController");

const redirectIfLoggedInMiddleware = require("./middlewares/redirectIfLoggedInMiddleware.js");
const redirectIfNotLoggedInMiddleware = require("./middlewares/redirectIfNotLoggedInMiddleware.js");
const redirectIfNotDriverMiddleware = require("./middlewares/redirectIfNotDriverMiddleware.js");
const redirectIfNotAdmin = require("./middlewares/redirectIfNotAdmin.js");
const redirectIfNotExaminerMiddleware = require("./middlewares/redirectIfNotExaminerMiddleware.js");
const redirectIfGTestBookedMiddleware = require("./middlewares/redirectIfGTestBookedMiddleware.js");

const showDeleteLinkMiddleware = require("./middlewares/showDeleteLinkMiddleware.js");
const dashboardLinkMiddleware = require("./middlewares/dashboardLinkMiddleware.js");
const navBookingFlags = require("./middlewares/navBookingFlags.js");



// Models
const Appointment = require("./models/Appointment.js");
const User = require("./models/User");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
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

app.use(showDeleteLinkMiddleware);
app.use(dashboardLinkMiddleware);
app.use(navBookingFlags); 

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Listening to port 4000");
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
  redirectIfGTestBookedMiddleware, 
  g2_testPage
);

app.post(
  "/g2_test/update",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotDriverMiddleware,
  redirectIfGTestBookedMiddleware, 
  g2_testUpdate
);

app.get("/missing-g2", (req, res) => {
  res.render("missing_g2");
});

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

// ✅ Examiner sets Pass/Fail + Comment
app.post(
  "/examiner/result/:driverId",
  redirectIfNotLoggedInMiddleware,
  redirectIfNotExaminerMiddleware,
  updateTestResult
);

// Account delete
app.get("/account/delete", redirectIfNotLoggedInMiddleware, deleteConfirm);
app.post("/account/delete", redirectIfNotLoggedInMiddleware, deleteAccount);

module.exports = app;
