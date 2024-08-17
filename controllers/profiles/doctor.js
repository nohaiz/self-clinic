// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcrypt");

//MODELS
const Doctor = require("../../models/doctor");

// VIEW ALL DOCTORS

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find({});

    res.json(doctors);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create Doctor

router.post("/doctors", async (req, res) => {
  req.user.type[2000]
    ? req.user.type[2000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.user.type[2000]) {
    const {
      firstName,
      lastName,
      contactNumber,
      specialization,
      gender,
      availability,
      CPR,
    } = req.body;
    try {
      const userInDatabase = await User.findOne({ email: req.body.email });
      if (userInDatabase) {
        return res.status(400).json({ error: "Username already taken" });
      }
      const newDoctor = new Doctor({
        firstName,
        lastName,
        contactNumber,
        specialization,
        gender,
        availability,
        CPR,
      });
      await newDoctor.save();
      let payLoad = {
        email: req.body.email,
        hashedPassword: bcrypt.hashSync(
          req.body.password,
          parseInt(process.env.SALT_ROUNDS)
        ),
        docAct: newDoctor._id,
      };
      const newUser = new User(payLoad);
      await newUser.save();

      res.json({ message: "Doctor created", doctor: newDoctor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Oops, something went wrong" });
  }
});

// VIEW DOCTOR

router.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    res.json(doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// UPDATE DOCTOR

router.put("/doctors/:id", async (req, res) => {
  req.user.type[5000]
    ? req.user.type[5000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.params.id === req.user.type[5000]) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.CPR) {
        await Doctor.findById(id);
        await Doctor.findOne({
          CPR: updateData.CPR,
          _id: { $ne: id },
        });
      }

      const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.status(200).json({
        message: "Doctor updated successfully",
        doctor: doctor,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
});

// DELETE DOCTOR

router.delete("/doctors/:id", async (req, res) => {
  req.user.type[2000] || req.user.type[5000]
    ? req.user.type
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.user.type[2000] || req.user.type[5000] === req.params.id) {
    try {
      const doctor = await Doctor.findByIdAndDelete(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      const user = await User.findOneAndDelete({ docAct: req.params.id });
      if (!user) {
        return res.json({ message: "User not found" });
      }

      res.json({ message: "Doctor and associated User Deleted", doctor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
