const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            validate: [
                {
                  validator: function (value) {
                    return value <= Date.now();
                  },
                  message: "Invalid date entry.",
                },
              ],
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
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required : true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required : true,

        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required : true,
        },
        status: {
            type: String,
            enum: ["pending", "cancelled", "completed"],
            default: "pending",
            required : true,

        },
        notes: {
            type: String,
            maxLength: 255,
            trim: true
        }
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
