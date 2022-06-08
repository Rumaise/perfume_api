const express = require("express");
const router = express.Router();
const { UserSchema, validateUser } = require("../models/user");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

// POST : CREATE A USER
router.post("/createuser", async (req, res) => {
  const error = await validateUser(req.body);
  const salt = genSaltSync(10);
  req.body.password = hashSync(req.body.password, salt);
  console.log(req.body.password);
  if (error.message) {
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  } else {
    var user = new UserSchema({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      designation: req.body.designation,
      user_group: req.body.user_group,
      username: req.body.username,
      password: req.body.password,
      created_by: req.body.created_by,
    });
    user
      .save()
      .then((user) => {
        res.send({
          status: 1,
          data: user,
        });
      })
      .catch((error) => {
        res.status(500).send({
          status: 0,
          data: error,
        });
      });
  }
});

//SEARCH USER BY PHONE
router.get("/searchuser/:term?", (req, res) => {
  console.log(req.params.term);
  UserSchema.find({ firstname: { $regex: ".*" + req.params.term + ".*" } })
    .then((user) =>
      res.send({
        status: 1,
        data: user,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.post("/login", async (req, res) => {
  UserSchema.findOne({ username: req.body.username })
    .then((user) => {
      const result = compareSync(req.body.password, user.password);
      if (result) {
        res.send({
          status: 1,
          data: user,
          message: "login successfully",
        });
      } else {
        res.send({
          status: 0,
          message: "Please check your username and password and try again",
          data: user,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/userslist", (req, res) => {
  UserSchema.find()
    .then((users) =>
      res.send({
        status: 1,
        data: users,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

module.exports = router;
