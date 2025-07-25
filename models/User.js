const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const CarDetailsSchema = new Schema({
  make: String,
  model: String,
  year: Number,
  plateno: String,
});

const AppointmentSchema = new Schema({
  date: String,
  time: String,
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
});

const UserSchema = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  licenseNumber: {
    type: String,
    default: "",
  },
  age: {
    type: Number,
    default: 0,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["Admin", "driver", "Examiner"],
  },

  // 🔽 ADD THIS FIELD
  experience: {
    type: String,
    enum: ["yes", "no"],
    default: "no",
  },

  TestType: { 
    type: String, 
    enum: ["G2", "G"] 
  },

 appointment: AppointmentSchema,
 
  Comment: {
    type: String,
  },
  PassFail:{
    type: Boolean,
  },
  carDetails: CarDetailsSchema,
});


UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    user.password = hash;
  }

  next();
});

UserSchema.pre("updateOne", async function (next) {
  const user = this.getUpdate();

  if (user.licenseNumber) {
    const hash = await bcrypt.hash(user.licenseNumber, 10);
    user.licenseNumber = hash;
    console.log("Update", user.licenseNumber);
  }

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
