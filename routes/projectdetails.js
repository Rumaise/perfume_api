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

//UPDATE MULTIPLE PROJECT DETAILS BASED ON  PROJECT ID
router.put(
  "/updateprojectsdetailsbyprojectid/:projectid/:customerid/:maincategoryid",
  async (req, res) => {
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
    ])
      .then(async (projectitemsdetails) => {
        var currentprojectdetails = projectitemsdetails;
        var updatedlistprojectdetails = req.body.subcategoryitemdetails;
        var alllist = req.body.subcategoryitemdetails;
        console.log(currentprojectdetails);
        console.log(updatedlistprojectdetails);
        for (let i = 0; i < currentprojectdetails.length; i++) {
          var checksubcategoryid = checkItemExist(
            updatedlistprojectdetails,
            currentprojectdetails[i]["sub_category_id"]
          );
          console.log("The status of sub category existing");
          console.log(checksubcategoryid.length);
          console.log("All list is");
          console.log(alllist);
          if (checksubcategoryid.length != 0) {
            for (let k = 0; k < updatedlistprojectdetails.length; k++) {
              console.log("inside update item");
              console.log(updatedlistprojectdetails[k]);
              if (
                currentprojectdetails[i]["project_id"] ==
                  updatedlistprojectdetails[k]["project_id"] &&
                currentprojectdetails[i]["customer_id"] ==
                  updatedlistprojectdetails[k]["customer_id"] &&
                currentprojectdetails[i]["main_category_id"] ==
                  updatedlistprojectdetails[k]["main_category_id"] &&
                currentprojectdetails[i]["sub_category_id"] ==
                  updatedlistprojectdetails[k]["sub_category_id"]
              ) {
                console.log("This is the equal one");
                console.log(currentprojectdetails[i]);
                const projectdetailsupdate =
                  await ProjectDetails.findByIdAndUpdate(
                    currentprojectdetails[i]["_id"],
                    {
                      item_category_id:
                        updatedlistprojectdetails[k]["item_category_id"],
                      modified_by: req.body.modified_by,
                    },
                    { new: true }
                  );
                if (!projectdetailsupdate) {
                  res.status(404).send({
                    status: 0,
                    data: "Project Details Not Found",
                  });
                } else {
                  console.log("rumaise");
                  console.log(alllist);
                  alllist.splice(
                    updatedlistprojectdetails.indexOf(
                      updatedlistprojectdetails[k]
                    ),
                    1
                  );
                  console.log("The updated rumaise ");
                  console.log(alllist);
                }
              }
            }
          } else {
            const projectdetailsdelete = await ProjectDetails.findByIdAndRemove(
              currentprojectdetails[i]["_id"]
            );
            if (!projectdetailsdelete)
              res.status(404).send({
                status: 0,
                data: "Project detail deletion failed",
              });
          }
        }
        if (alllist.length != 0) {
          const projectdetailsinsertnewfiles = await ProjectDetails.insertMany(
            alllist
          );
          if (!projectdetailsinsertnewfiles)
            res.status(404).send({
              status: 0,
              data: "Project detail insertion failed",
            });
        }
        console.log("The all lsit");
        console.log(alllist);
        res.send({
          status: 1,
          data: "Successfully updated",
        });
      })
      .catch((error) => {
        res.status(500).send({
          status: 0,
          data: error.message,
        });
      });
  }
);

function checkItemExist(listdata, subcategorydata) {
  console.log("inside check");
  console.log(listdata);
  console.log(subcategorydata);
  var result = [];
  for (let j = 0; j < listdata.length; j++) {
    if (
      mongoose.Types.ObjectId(listdata[j]["sub_category_id"]).equals(
        subcategorydata
      )
    ) {
      console.log("The sub category ids are same");
      console.log(listdata[j]["sub_category_id"]);
      result.push(j);
    }
  }
  console.log(result);
  return result;
}

module.exports = router;
