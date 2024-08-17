// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// MODELS
const User = require("../../models/user");
const Admin = require("../../models/admin");

// VIEW ALL ADMIN

router.get("/:userId/admins", async (req, res) => {
  req.user.type[2000]
    ? req.user.type[2000]
    : res.status(404).json({ error: "Oops, something went wrong" });

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
    const { firstName, lastName, contactNumber, CPR, email, password } =
      req.body;
    try {
      const userInDatabase = await User.findOne({ email: req.body.email });
      if (userInDatabase) {
        return res.status(400).json({ error: "Username already taken" });
      }
      const newAdmin = new Admin({ firstName, lastName, contactNumber, CPR });
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

      res.json({ message: "Admin created", admin: newAdmin, user: newUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Oops, something went wrong" });
  }
});

// VIEW ADIM

router.get("/:userId/admins/:id", async (req, res) => {
  req.user.type[2000]
    ? req.user.type[2000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.params.id === req.user.type[2000]) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const admin = await Admin.findById(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: "admin not found" });
      }
      res.json(admin);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  } else {
    res.json({ message: "Invalid admin User" });
  }
});

// UPDATE ADMIN

router.put("/:userId/admins/:id", async (req, res) => {
  req.user.type[2000]
    ? req.user.type[2000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.params.id === req.user.type[2000]) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.CPR) {
        await Admin.findById(id);
        await Admin.findOne({
          CPR: updateData.CPR,
          _id: { $ne: id },
        });
      }
      const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedAdmin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      res.json({ message: "Admin Updated", admin: updatedAdmin });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.json({ message: "Invalid Admin User" });
  }
});

// DELETE ADMIN

router.delete("/:userId/admins/:id", async (req, res) => {
  req.user.type[5000]
    ? req.user.type[5000]
    : res.status(404).json({ error: "Oops, something went wrong" });

  if (req.user.type[5000]) {
    try {
      const admin = await Admin.findByIdAndDelete(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: "admin not found" });
      }

      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "admin and User Deleted", admin });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
