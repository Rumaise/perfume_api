const express = require("express");
const router = express.Router();
const { ProjectMain, validateProjectMain } = require("../models/projectmain");
const { ProjectDetails } = require("../models/projectdetails");
const { Project, validateProject } = require("../models/project");
const { default: mongoose } = require("mongoose");

//POST : CREATE A NEW PROJECT DETAILS

router.post("/createprojectdetails", async (req, res) => {
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
    details: req.body.details,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });
  await projectmain
    .save()
    .then(async (projectmain) => {
      await ProjectDetails.insertMany(req.body.details)
        .then(async (projectdetails) => {
          await Project.findByIdAndUpdate(
            req.body.project_id,
            {
              $push: { categories_added: req.body.main_category_id },
            },
            { new: true }
          )
            .then((projectstatus) => {
              res.send({
                status: 1,
                data: "Uploaded Successfully",
                projectmain: projectmain,
                projectdetails: projectdetails,
                projectstatus: projectstatus,
              });
            })
            .catch((error) => {
              res.status(500).send({
                status: 0,
                data: error,
              });
            });
        })
        .catch((error) => {
          res.status(500).send({
            status: 0,
            data: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

router.get(
  "/geteditprojectdetailsbyprojectid/:projectid/:customerid/:maincategoryid",
  (req, res) => {
    ProjectDetails.aggregate([
      {
        $match: {
          $and: [
            {
              project_id: mongoose.Types.ObjectId(req.params.projectid),
            },
            {
              customer_id: mongoose.Types.ObjectId(req.params.customerid),
            },
            {
              main_category_id: mongoose.Types.ObjectId(
                req.params.maincategoryid
              ),
            },
          ],
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "sub_category_id",
          foreignField: "_id",
          as: "subcategorydetails",
        },
      },
      {
        $lookup: {
          from: "subcategoryitems",
          localField: "item_category_id",
          foreignField: "_id",
          as: "subcategoryitemdetails",
        },
      },
    ])
      .then((projectitemsdetails) =>
        res.send({
          status: 1,
          data: projectitemsdetails,
        })
      )
      .catch((error) => {
        res.status(500).send({
          status: 0,
          data: error.message,
        });
      });
  }
);

module.exports = router;
