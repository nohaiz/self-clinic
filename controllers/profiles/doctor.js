// IMPORTED MODULES
const express = require("express");
const router = express.Router();

//MODELS
const Doctor = require("../../models/doctor");

// VIEW ALL DOCTORS

router.get("/:userId/doctors", async (req, res) => {
  if (req.user.type[2000]) {
    try {
      const doctors = await Doctor.find({});

      res.json(doctors);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Oops, something went wrong" });
  }
});

// VIEW DOCTOR
router.get("/:userId/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    res.json(doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// UPDATE DOCTOR
router.put("/:userId/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Doctor Updated" }, doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE DOCTOR
router.delete("/:userId/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor Deleted" }, doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
