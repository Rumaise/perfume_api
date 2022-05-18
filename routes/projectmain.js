const express = require("express");
const projectmain = require("../models/projectmain");
const router = express.Router();
const { ProjectMain, validateProjectMain } = require("../models/projectmain");

//POST : CREATE A NEW PROJECT MAIN

router.post("/createprojectmain", async (req, res) => {
  const error = await validateProjectMain(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var projectmain = new ProjectMain({
    project_id: req.body.project_id,
    customer_id: req.body.customer_id,
    main_category_id: req.body.main_category_id,
    detailname: req.body.detailname,
    itemcode: req.body.itemcode,
    volume: req.body.volume,
    remarks: req.body.remarks,
    photolink: req.body.photolink,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  projectmain
    .save()
    .then((projectmain) => {
      res.send({
        status: 1,
        data: projectmain,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL PROJECTS MAIN

router.get("/projectmainlist", (req, res) => {
  ProjectMain.find()
    .then((projectmain) =>
      res.send({
        status: 1,
        data: projectmain,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET THE PROJECT MAIN BY ID
router.get("/projectmain/:id", async (req, res) => {
  const projectmaindetails = await ProjectMain.findById(req.params.id);
  if (!projectmaindetails)
    res.status(404).send({
      status: 0,
      data: "Project Main Details Not Found",
    });
  res.send({
    status: 1,
    data: projectmaindetails,
  });
});

//UPDATE PROJECT MAIN BASED ON ID
router.put("/updateprojectmain/:id", async (req, res) => {
  const projectmainupdate = await ProjectMain.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!projectmainupdate)
    res.status(404).send({
      status: 0,
      data: "Project Main Details Not Found",
    });
  res.send({
    status: 1,
    data: projectmainupdate,
  });
});

//DELETE A PROJECT MAIN
router.delete("/deleteprojectmain/:id", async (req, res) => {
  const projectmaindelete = await ProjectMain.findByIdAndRemove(req.params.id);
  if (!projectmaindelete)
    res.status(404).send({
      status: 0,
      data: "Project Main Details Not Found",
    });
  res.send({
    status: 1,
    data: projectmaindelete,
  });
});

module.exports = router;
