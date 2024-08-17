const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, match: /^[^\s]+$/ },
  lastName: { type: String, required: true, trim: true, match: /^[^\s]+$/ },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{8}$/,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
