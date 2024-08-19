// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// MODELS
const User = require("../../models/user");
const Admin = require("../../models/admin");

// VIEW ALL ADMIN

router.get("/admins", async (req, res) => {
  if (req.user.type.hasOwnProperty(2000)) {
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

router.post("/admins", async (req, res) => {
  if (req.user.type.hasOwnProperty(2000)) {
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
        email: email,
        hashedPassword: bcrypt.hashSync(
          password,
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

router.get("/admins/:id", async (req, res) => {
  if (req.params.id === req.user.type[2000]) {
    try {
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

router.put("/admins/:id", async (req, res) => {
  if (req.user.type.hasOwnProperty(2000)) {
    try {
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
      res.status(200).json({
        message: "Admin updated successfully",
        admin: updatedAdmin,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.json({ message: "Invalid Admin User" });
  }
});

// DELETE ADMIN

router.delete("/admins/:id", async (req, res) => {
  try {
    if (
      req.user.type.hasOwnProperty(2000) ||
      req.user.type[2000] === req.params.id
    ) {
      const adminId = req.params.id;

      const user = await User.findOne({ adminAct: adminId });

      if (!user) {
        return res
          .status(404)
          .json({ error: "User associated with this admin not found" });
      }

      const noProfiles = !user.docAct && !user.patientAct;

      if (noProfiles) {
        await User.findOneAndDelete({ adminAct: adminId });
      } else {
        await User.findOneAndUpdate(
          { adminAct: adminId },
          { adminAct: null },
          { new: true }
        );
      }

      const admin = await Admin.findByIdAndDelete(adminId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.json({
        message: "Admin Account Deleted",
        admin,
      });
    } else {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
