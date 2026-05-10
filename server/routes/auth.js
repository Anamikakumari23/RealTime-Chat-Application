const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        error: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "User registered successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        error: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.json({
        error: "Wrong password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      "secret"
    );

    res.json({
      token,
      username,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;