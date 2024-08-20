const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z]+$/,
    maxLength: 35,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z]+$/,
    maxLength: 35,
  },
  CPR: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^\d{9}$/.test(value.toString());
      },
      message: "Invalid CPR",
    },
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
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{8}$/,
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
        validate: {
          validator: function (v) {
            const [hours, minutes] = v.split(":").map(Number);
            return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
          },
          message: "Invalid time format.",
        },
      },
      endTime: {
        type: String,
        required: true,
        match: /^\d{2}:\d{2}$/,
        validate: {
          validator: function (v) {
            const [hours, minutes] = v.split(":").map(Number);
            return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
          },
          message: "Invalid time format.",
        },
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
