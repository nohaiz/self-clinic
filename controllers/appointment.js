// IMPORTED MODULES
const express = require("express");
const router = express.Router();

// MODELS
const AppointmentModel = require("../models/appointment");


// FETCH ALL APPOINTMENT
router.get("/", async (req, res) => {
    try {

        const appointments = await AppointmentModel.find({});
        return res.status(200).json({appointments})

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// FETCH A APPOINTMENT WITH ID
router.get("/:id", async (req, res) => {
    try {

        const appointment = await AppointmentModel.findById(req.params.id).populate(['service','doctor']);

        if (!appointment) {
           return res.status(404).json({ message: "Appointment not found" })
        }

        return res.status(200).json(appointment)

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// CREATE A APPOINTMENT WITH ID
router.post("/", async (req, res) => {
    try {

        const { date, startTime, endTime, service, doctor, status, notes } = req.body;
        const appointment = await AppointmentModel.create({ date, startTime, endTime, service, doctor, status, notes });

        return res.status(201).json({ message: "Appointment created successfully.", appointment });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// UPDATE A APPOINTMENT WITH ID
router.put("/:id", async (req, res) => {
    try {

        const appointment = await AppointmentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.status(202).json({ message: "Appointment updated successfully.", appointment });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// DELETE A APPOINTMENT WITH ID
router.delete("/:id", async (req, res) => {
    try {

        const appointment = await AppointmentModel.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found for deletion" });
        }

        await AppointmentModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Appointment deleted successfully." });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router;