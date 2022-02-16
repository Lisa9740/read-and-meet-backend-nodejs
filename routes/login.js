const express = require("express");
const User = require("../schema/User");
const bcryptjs = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const db = require('../config/database.js');

router.post("/", (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  //* Login simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Enter all fields" });
  }

  db.query("SELECT * FROM `users` WHERE `email` =" + " '" + email +  "';", { type: db.QueryTypes.SELECT }).then((user => {

    user = user[0]
    console.log("test" + user);
    if (!user) return res.status(400).json({ msg: `User does not exists` });

    //* Validate the password
    bcryptjs.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        { id: user.id },
        process.env.SECRET,
        { expiresIn: 10255600 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token : token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  }));
});

// Load a user
router.get("/user", auth, (req, res) => {
  User.findById(req.signalUser.id)
    .select("-password")
    .then((user) => res.status(200).json(user));
});

module.exports = router;
