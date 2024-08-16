// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// MODELS
const User = require("../../models/user");
const Admin = require("../../models/admin");

// VIEW ALL ADMIN

router.get("/:userId/admins", async (req, res) => {
  if (req.user.type[2000]) {
    try {
      const admins = await Admin.find({});

      res.json(admins);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Oops, something went wrong" });
  }
});

// CREATE ADMIN

router.post("/:userId/admins", async (req, res) => {
  if (req.user.type[2000]) {
    const { firstName, lastName, contactNumber } = req.body;
    try {
      const newAdmin = new Admin({ firstName, lastName, contactNumber });
      await newAdmin.save();
      let payLoad = {
        email: req.body.email,
        hashedPassword: bcrypt.hashSync(
          req.body.password,
          parseInt(process.env.SALT_ROUNDS)
        ),
        adminAct: newAdmin._id,
      };
      const newUser = new User(payLoad);
      await newUser.save();

      res.json({ message: "Admin created", admin: newAdmin });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Oops, something went wrong" });
  }
});

// VIEW DOCTOR

router.get("/:userId/admins/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    res.json(admin);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// UPDATE DOCTOR

router.put("/:userId/admins/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Admin Updated" }, admin);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE DOCTOR

router.delete("/:userId/admins/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin Deleted" }, admin);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
