const express = require("express");
const project = require("../models/project");
const router = express.Router();
const { Project, validateProject } = require("../models/project");

//POST : CREATE A NEW PROJECT

router.post("/createproject", async (req, res) => {
  const error = await validateProject(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var project = new Project({
    customer_id: req.body.customer_id,
    referrence: req.body.referrence,
    brandname: req.body.brandname,
    productname: productname,
    producttype: req.body.producttype,
    variantname: req.body.variantname,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  project
    .save()
    .then((project) => {
      res.send({
        status: 1,
        data: project,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL PROJECTS

router.get("/projectslist", (req, res) => {
  Project.find()
    .then((project) =>
      res.send({
        status: 1,
        data: project,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET THE PROJECT BY ID
router.get("/project/:id", async (req, res) => {
  const projectdetails = await Project.findById(req.params.id);
  if (!projectdetails)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectdetails,
  });
});

//UPDATE PROJECT BASED ON ID
router.put("/updateproject/:id", async (req, res) => {
  const projectupdate = await Project.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!projectupdate)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectupdate,
  });
});

//DELETE A PROJECT
router.delete("/deleteproject/:id", async (req, res) => {
  const projectdelete = await Project.findByIdAndRemove(req.params.id);
  if (!projectdelete)
    res.status(404).send({
      status: 0,
      data: "Project Details Not Found",
    });
  res.send({
    status: 1,
    data: projectdelete,
  });
});

module.exports = router;
