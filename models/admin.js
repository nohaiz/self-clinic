const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{8}$/,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
