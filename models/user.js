const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
      minlength: 8,
    },
    docAct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
      required: true,
      validate: {
        validator: function (v) {
          return v == null || mongoose.Types.ObjectId.isValid(v);
        },
        message: "Invalid Doctor ObjectId",
      },
    },
    patientAct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
      required: true,
      validate: {
        validator: function (v) {
          return v === null || mongoose.Types.ObjectId.isValid(v);
        },
        message: "Invalid Patient ObjectId",
      },
    },
    adminAct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
      required: true,
      validate: {
        validator: function (v) {
          return v == null || mongoose.Types.ObjectId.isValid(v);
        },
        message: "Invalid Admin ObjectId",
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
