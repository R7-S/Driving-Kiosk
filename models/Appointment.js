const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  date: {
    type: String,
    default: "",
  },
  time: {
    type: String,
    default: "",
  },
  isTimeSlotAvailable: {
    type: Boolean,
    default: true,
  },
  isReadyForTest: {
    type: Boolean,
    default: false, 
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled", 
  },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
