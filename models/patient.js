const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
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
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
    validate: [
      {
        validator: function (value) {
          return value <= Date.now();
        },
        message: "Invalid date of birth entry.",
      },
    ],
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{8}$/,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
