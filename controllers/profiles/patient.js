// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const User = require("../../models/user");

// MODELS
const Patient = require("../../models/patient");

// VIEW ALL PATIENT

router.get("/:userId/patients", async (req, res) => {
  req.user.type[2000]
    ? req.user.type[2000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.user.type[2000]) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
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
  req.user.type[3000]
    ? req.user.type[3000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (
    req.params.id === req.user.type[3000] ||
    req.params.id === req.user.type[5000]
  ) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

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
router.put("/:userId/patients/:id", async (req, res) => {
  req.user.type[3000]
    ? req.user.type[3000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.params.id === req.user.type[3000]) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

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

      res.json({ message: "Patient Updated", patient: updatedPatient });
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: error.message });
    }
  } else {
    res.json({ message: "Invalid Patient User" });
  }
});

// DELETE PATIENT

router.delete("/:userId/patients/:id", async (req, res) => {
  req.user.type[5000]
    ? req.user.type[5000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.user.type[5000]) {
    res.json({ message: "Invalid User" });
  }
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Patient and User Deleted", patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
