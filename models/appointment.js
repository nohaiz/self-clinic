const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
        },
        status: {
            type: String,
            enum: ["pending", "cancelled", "completed"],
            default: "pending",
        },
        notes: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
