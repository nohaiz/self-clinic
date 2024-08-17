// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const User = require("../../models/user");

//MODELS
const Doctor = require("../../models/doctor");

// VIEW ALL DOCTORS

router.get("/:userId/doctors", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const doctors = await Doctor.find({});

    res.json(doctors);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create Doctor

router.post("/:userId/doctors", async (req, res) => {
  req.user.type[2000]
    ? req.user.type[2000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
  }

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

router.get("/:userId/doctors/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const doctor = await Doctor.findById(req.params.id);

    res.json(doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// UPDATE DOCTOR

router.put("/:userId/doctors/:id", async (req, res) => {
  req.user.type[5000]
    ? req.user.type[5000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.params.id === req.user.type[5000]) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

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
      res.json({ message: "Doctor Updated" }, doctor);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
});

// DELETE DOCTOR

router.delete("/:userId/doctors/:id", async (req, res) => {
  req.user.type[2000] || req.user.type[5000]
    ? req.user.type
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.user.type[2000] || req.user.type[5000]) {
    try {
      const doctor = await Doctor.findByIdAndDelete(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "Doctor and User Deleted", patient });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Oops, something went wrong" });
  }
});

module.exports = router;
