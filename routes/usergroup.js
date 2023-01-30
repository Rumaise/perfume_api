const express = require("express");
const router = express.Router();
const { UserGroup, validateUserGroup } = require("../models/usergroup");

// POST : CREATE A USER GROUP
router.post("/createusergroup", async (req, res) => {
  const error = await validateUserGroup(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var usergroup = new UserGroup({
    group_name: req.body.group_name,
    access_list: req.body.access_list,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  usergroup
    .save()
    .then((usergroup) => {
      res.send({
        status: 1,
        data: usergroup,
      });
    })
    .catch((error) => {
      res.send(500).send({
        status: 0,
        data: error,
      });
    });
});

router.get("/usergroupslist", (req, res) => {
  UserGroup.find()
    .then((usergroups) =>
      res.send({
        status: 1,
        data: usergroups,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/usergroupbyid/:id", async (req, res) => {
  const usergroupdetails = await UserGroup.findById(req.params.id);
  if (!usergroupdetails)
    res.status(404).send({
      status: 0,
      data: "User Group Details Not Found",
    });
  res.send({
    status: 1,
    data: usergroupdetails,
  });
});

module.exports = router;
