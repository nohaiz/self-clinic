// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const User = require("../../models/user");

// MODELS
const Patient = require("../../models/patient");

// VIEW ALL PATIENT

router.get("/:userId/patients", async (req, res) => {
  if (req.user.type[2000]) {
    try {
      const patients = await Patient.find({});

      res.json(patients);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Oops, something went wrong" });
  }
});

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
    const user = await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "Patient Deleted" }, patient);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
