const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  CPR: {
    type: Number,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  availability: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
      startTime: {
        type: String,
        required: true,
        match: /^\d{2}:\d{2}$/,
      },
      endTime: {
        type: String,
        required: true,
        match: /^\d{2}:\d{2}$/,
      },
    },
  ],
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }

});
const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
