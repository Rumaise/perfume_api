const express = require("express");
const router = express.Router();

const {
  ProjectProcess,
  validateProjectProcess,
} = require("../models/projectprocess");

// POST : CREATE A NEW PROJECT PROCESS
router.post("/createprojectprocess", async (req, res) => {
  const error = await validateProjectProcess(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var projectprocess = new ProjectProcess({
    project_id: req.body.project_id,
    process_id: req.body.process_id,
    process_start_date: req.body.process_start_date,
    process_end_date: req.body.process_end_date,
    remarks: req.body.remarks,
    notified: req.body.notified,
    created_by: req.body.created_by,
  });

  projectprocess
    .save()
    .then((projectprocess) => {
      res.send({
        status: 1,
        data: projectprocess,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//INSERT MULTIPLE PROJECT PROCESS
router.post("/addprojectprocess", async (req, res) => {
  const projectprocess = req.body.projectprocess;
  var projectprocesslist = [];
  await projectprocess.forEach(async (element) => {
    var data = {
      project_id: element.project_id,
      process_id: element.process_id,
      selected: element.selected,
      created_by: element.created_by,
    };
    const error = await validateProjectProcess(data);
    if (error.message) {
      res.status(400).send({
        status: 0,
        data: error.message,
      });
    } else {
      projectprocesslist.push(data);
    }
  });
  await ProjectProcess.insertMany(projectprocesslist)
    .then((projectprocess) => {
      res.send({
        status: 1,
        data: projectprocess,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL PROJECT PROCESSES

router.get("/listprojectprocess", (req, res) => {
  ProjectProcess.find()
    .then((projectprocess) =>
      res.send({
        status: 1,
        data: projectprocess,
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
