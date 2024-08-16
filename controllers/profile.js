const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");

//Patients
// View patient
router.get("/:userId/profiles/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
// Update patient
router.put("/:userId/profiles/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Patient Updated" }, patient);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete patient
router.delete("/:userId/profiles/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient Deleted" }, patient);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//Doctors

// View doctor
router.get("/:userId/profiles/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    res.json(doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update doctor
router.put("/:userId/profiles/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Doctor Updated" }, doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete doctor
router.delete("/:userId/profiles/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor Deleted" }, doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
