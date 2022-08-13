const express = require("express");
const router = express.Router();

const {
  UserPermission,
  validateUserPermission,
} = require("../models/userpermission");

// POST : CREATE A USER PERMISSION
router.post("/createuserpermissionscreen", async (req, res) => {
  const error = await validateUserPermission(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var userpermission = new UserPermission({
    screen: req.body.screen,
    created_by: req.body.created_by,
  });

  userpermission
    .save()
    .then((permission) => {
      res.send({
        status: 1,
        data: permission,
      });
    })
    .catch((error) => {
      res.send(500).send({
        status: 0,
        data: error,
      });
    });
});

router.get("/permissionchecklist", async (req, res) => {
  await UserPermission.find()
    .then(async (permissions) => {
      var resultarray = [];
      await permissions.forEach((element) => {
        const data = {
          screen: element.screen,
          selected: false,
          created_by: element.created_by,
        };
        console.log(data);
        resultarray.push(data);
      });
      res.send({
        status: 1,
        data: resultarray,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

module.exports = router;
