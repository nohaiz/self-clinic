// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const User = require("../../models/user");

// MODELS
const Patient = require("../../models/patient");

// VIEW ALL PATIENT

router.get("/patients", async (req, res) => {
  if (
    req.user.type.hasOwnProperty(2000) ||
    req.user.type.hasOwnProperty(5000)
  ) {
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

router.get("/patients/:id", async (req, res) => {
  if (
    req.params.id === req.user.type[3000] ||
    req.user.type.hasOwnProperty(5000) ||
    req.user.type.hasOwnProperty(2000)
  ) {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  } else {
    res.json({ message: "Invalid Patient User" });
  }
});

// UPDATE PATIENT
router.put("/patients/:id", async (req, res) => {
  if (
    req.params.id === req.user.type[3000] ||
    req.user.type.hasOwnProperty(5000) ||
    req.user.type.hasOwnProperty(2000)
  ) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.CPR) {
        await Patient.findById(id);
        await Patient.findOne({
          CPR: updateData.CPR,
          _id: { $ne: id },
        });
      }

      const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.status(200).json({
        message: "Patient updated successfully",
        patient: updatedPatient,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.json({ message: "Invalid Patient User" });
  }
});

// DELETE PATIENT

router.delete("/patients/:id", async (req, res) => {
  try {
    if (
      req.user.type[3000] === req.params.id ||
      req.user.type.hasOwnProperty(2000)
    ) {
      const patientId = req.params.id;

      const user = await User.findOne({ patientAct: patientId });

      if (!user) {
        return res
          .status(404)
          .json({ error: "User associated with this patient not found" });
      }

      const noProfiles = !user.docAct && !user.adminAct;

      if (noProfiles) {
        await User.findOneAndDelete({ patientAct: patientId });
      } else {
        await User.findOneAndUpdate(
          { patientAct: patientId },
          { patientAct: null },
          { new: true }
        );
      }

      const patient = await Patient.findByIdAndDelete(patientId);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.json({ message: "Patient Account Deleted" });
    } else {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
