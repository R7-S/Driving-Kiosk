
const Appointment = require("../models/Appointment");
const AppointmentPage = (req, res) => {
    res.render("appointment");
};


const getAvaialableSlots =  async (req, res) => {
    try {
      const { date } = req.params;
  
      
      const availableSlots = await Appointment.find({
        date: date,
        isTimeSlotAvailable: true,
      });
  
      if (availableSlots.length > 0) {
        res.status(200).json({
          success: true,
          slots: availableSlots.map((slot) => ({
            id: slot._id,
            time: slot.time,
          })),
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No available slots found for the selected date.",
        });
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching slots.",
      });
    }
  }




 const Appointment_Slots = async (req, res) => {
    console.log("req.body",req.body);
    try {
        const { date, slots } = req.body;  
        
        if (!date || !slots || slots.length === 0) {
            return res.status(400).json({ message: 'Please provide a valid date and select at least one time slot.' });
        }

        
        const appointments = slots.map(slot => ({
            date: date,
            time: slot,
            isTimeSlotAvailable: true  
        }));

        
        await Appointment.insertMany(appointments);

        
        res.status(201).json({ message: 'Appointments created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating appointments.', error: error.message });
    }};


const getBookedSlots = async (req, res) => {
    const { date } = req.params;
  
    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }
  
    try {
    
      const appointments = await Appointment.find({ date });
  
      
      const bookedSlots = appointments.map((appointment) => appointment.time);
  
      res.status(200).json({ bookedSlots });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  }
module.exports ={AppointmentPage,Appointment_Slots,getBookedSlots, getAvaialableSlots};