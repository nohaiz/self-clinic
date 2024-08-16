// IMPORTED MODULES

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// MODELS

const User = require("../models/user");
const Patient = require("../models/patient");

// HELPER
const createToken = require("../helper/createToken.js");

// ROUTES

router.post("/sign-up", async (req, res) => {
  try {
    // CHECK IF THE USER EXIST
    const userInDatabase = await User.findOne({ email: req.body.email });
    // CHECKS IF THE USER EXIST AND IS A PATIENT

    let setAccount = false;

    if (userInDatabase) {
      if (userInDatabase.patientAct) {
        return res.status(400).json({ error: "Username already taken" });
      } else {
        // CHECKS IF THE REQ BODY MATCHES THE EXISTING RESPECTIVE COLLECTION
        // let validUserEntry;

        // validUserEntry = await userInDatabase.populate();
        // const type =
        //   validUserEntry.docAct !== null && validUserEntry.docAct !== undefined
        //     ? validUserEntry.docAct
        //     : validUserEntry.adminAct;

        // console.log(type);

        setAccount = true;
      }
    }
    // USER PAYLOAD
    let payLoad = {
      email: req.body.email,
      hashedPassword: bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.SALT_ROUNDS)
      ),
      docAct: setAccount ? userInDatabase.docAct : null,
      patientAct: null,
      adminAct: setAccount ? userInDatabase.adminAct : null,
    };

    // CREATE A DEFAULT USER WITH HASHED PASSWORD
    const patientUser = await Patient.create(
      ({ firstName, lastName, gender, DOB, contactNumber, CPR } = req.body)
    );
    payLoad.patientAct = patientUser._id;
    // CONDITIONALLY CREATES OR UPDATES USERS DATA
    let user;
    if (payLoad.docAct) {
      try {
        user = await User.findByIdAndUpdate(
          userInDatabase._id,
          { patientAct: payLoad.patientAct },
          { new: true, runValidators: true }
        );
      } catch (error) {
        console.log(error);
      }
    } else if (payLoad.adminAct) {
      try {
        user = await User.findByIdAndUpdate(
          userInDatabase._id,
          { patientAct: payLoad.patientAct },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      user = await User.create(payLoad);
    }
    const token = createToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    // FINDS THE USER IN THE DATABASE
    const userInDatabase = await User.findOne({ email: req.body.email });

    // CHECKS IF THE USER VALID
    if (
      userInDatabase &&
      bcrypt.compareSync(req.body.password, userInDatabase.hashedPassword)
    ) {
      // CHECKS THE USER TYPE AND ASSIGNS THEM A VALUE
      let user = {};

      if (userInDatabase.docAct) {
        user[5000] = userInDatabase.docAct;
      }
      if (userInDatabase.patientAct) {
        user[3000] = userInDatabase.patientAct;
      }
      if (userInDatabase.adminAct) {
        user[2000] = userInDatabase.adminAct;
      }
      // CREATES A TOKEN
      const token = createToken(user);

      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
