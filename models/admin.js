const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z]+$/,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z]+$/,
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
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{8}$/,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
