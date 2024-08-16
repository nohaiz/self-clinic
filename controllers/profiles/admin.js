// IMPORTED MODULES
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../../models/user");
const Admin = require("../../models/admin");

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

module.exports = router;
