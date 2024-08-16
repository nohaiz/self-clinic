// IMPORTED MODULES
const express = require("express");
const router = express.Router();

// MODELS
const Patient = require("../../models/patient");

// VIEW PATIENT
router.get("/:userId/patients/:id", async (req, res) => {
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
// UPDATE PATIENT
router.put("/:userId/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Patient Updated" }, patient);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE PATIENT
router.delete("/:userId/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient Deleted" }, patient);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
