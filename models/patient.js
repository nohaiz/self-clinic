const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z]+( [A-Za-z]+)*$/,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z]+( [A-Za-z]+)*$/,
  },

  CPR: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
    match: /^\d{8}$/,
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
