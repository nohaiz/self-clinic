// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//MODELS
const User = require("../../models/user");
const Admin = require("../../models/admin");
const Doctor = require("../../models/doctor");
const Patient = require("../../models/patient");

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

  if (req.user.type.hasOwnProperty(2000)) {

    let { firstName, lastName, contactNumber, specialization, gender, availability, CPR, email, password, confirmPassword } = req.body;
    
    try {
      const userInDatabase = await User.findOne({ email: req.body.email });

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Confirm password and password need to match" });
      }
      let setAccount = false;

      if (userInDatabase) {
        if (userInDatabase.docAct) {
          return res.status(400).json({ error: "Username already taken" });
        } else {

          setAccount = true;
          let existingDoctor;

          if (userInDatabase.adminAct) {
            existingDoctor = await Admin.findById(userInDatabase.adminAct);
            console.log(existingDoctor)
            if (
              existingDoctor.firstName !== firstName ||
              existingDoctor.lastName !== lastName ||
              existingDoctor.CPR !== CPR
            ) {
              firstName = existingDoctor.firstName;
              lastName = existingDoctor.lastName;
              CPR = existingDoctor.CPR;
              
            } else if (userInDatabase.patientAct) {
                existingUser = await Patient.findById(userInDatabase.patientAct);
                if (
                  existingUser.firstName !== firstName ||
                  existingUser.lastName !== lastName ||
                  existingUser.CPR !== CPR ||
                  existingUser.gender !== gender
                ) {
                  firstName = existingUser.firstName;
                  lastName = existingUser.lastName;
                  CPR = existingUser.CPR;
                  gender = existingUser.gender
                  }
                }
              }
            }
          }

      const newDoctor = new Doctor({ firstName, lastName, contactNumber, specialization, gender, availability, CPR });
      await newDoctor.save();

      let payLoad = {
        email: email,
        hashedPassword: bcrypt.hashSync(
          password,
          parseInt(process.env.SALT_ROUNDS)
        ),
        docAct: newDoctor._id,
        patientAct: setAccount ? userInDatabase.patientAct : null,
        adminAct: setAccount ? userInDatabase.adminAct : null,
      };

      let user;

      if (payLoad.adminAct || payLoad.patientAct) {
        user = await User.findByIdAndUpdate(
          userInDatabase._id,
          { docAct: payLoad.docAct },
          { new: true }
        );
      } else {
        user = await User.create(payLoad);
        await user.save();
      }

      res.json({ message: "Doctor created", doctor: newDoctor, user: user });
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
  if (
    req.params.id === req.user.type[5000] ||
    req.user.type.hasOwnProperty(2000)
  ) {
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
  try {
    // Check if the user has the required permissions
    if (
      req.user.type.hasOwnProperty(2000) ||
      req.user.type[5000] === req.params.id
    ) {
      const doctorId = req.params.id;

      const user = await User.findOne({ docAct: doctorId });

      if (!user) {
        return res
          .status(404)
          .json({ error: "User associated with this doctor not found" });
      }

      const noProfiles = !user.adminAct && !user.patientAct;

      if (noProfiles) {
        await User.findOneAndDelete({ docAct: doctorId });
      } else {
        await User.findOneAndUpdate(
          { docAct: doctorId },
          { docAct: null },
          { new: true }
        );
      }

      const doctor = await Doctor.findByIdAndDelete(doctorId);
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      res.json({ message: "Doctor Account Deleted" });
    } else {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
