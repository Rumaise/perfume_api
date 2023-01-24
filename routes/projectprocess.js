const express = require("express");
const router = express.Router();
const mongoosePaginate = require("mongoose-paginate-v2");
const { default: mongoose } = require("mongoose");

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
    if (element.selected) {
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

//GET ALL PROJECT PROCESSES

router.get("/projectprocesscount", (req, res) => {
  ProjectProcess.estimatedDocumentCount()
    .then((projectprocesscount) =>
      res.send({
        status: 1,
        data: projectprocesscount,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/listprojectprocessbyprojectid/:id", (req, res) => {
  ProjectProcess.aggregate([
    {
      $match: { project_id: { $eq: mongoose.Types.ObjectId(req.params.id) } },
    },
    {
      $lookup: {
        from: "projects",
        as: "projectdetails",
        let: { project_id: "$project_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$project_id"] } },
          },
          {
            $project: {
              customer_id: 1,
              referrence: 1,
              brandname: 1,
              productname: 1,
              completed: 1,
              quantity: 1,
              project_datetime: 1,
              start_datetime: 1,
              handover_datetime: 1,
              approved_datetime: 1,
            },
          },
          {
            $lookup: {
              from: "customers",
              localField: "customer_id",
              foreignField: "_id",
              as: "customer_name",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    phone: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "processes",
        as: "processdetails",
        let: { id: "$process_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$id"] },
            },
          },
          {
            $project: {
              process_name: 1,
              approvers: 1,
              notify: 1,
              mailstat: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        project_id: 1,
        process_id: 1,
        projectdetails: 1,
        processdetails: 1,
        completed: 1,
        day: {
          $trunc: {
            $divide: [
              { $subtract: ["$process_end_date", new Date()] },
              86400000,
            ],
          },
        },
        testday: {
          $dateSubtract: {
            startDate: "$process_end_date",
            unit: "month",
            amount: 1,
          },
        },
        process_start_date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$process_started_date",
          },
        },
        process_end_date: {
          $dateToString: { format: "%Y-%m-%d", date: "$process_end_date" },
        },
      },
    },
    { $sort: { process_end_date: 1 } },
  ])
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

router.get("/listprojectprocessbypaginate/:page/:count", (req, res) => {
  ProjectProcess.aggregatePaginate(
    ProjectProcess.aggregate([
      {
        $lookup: {
          from: "projects",
          as: "projectdetails",
          let: { project_id: "$project_id" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$_id", "$$project_id"] } },
            },
            {
              $project: {
                customer_id: 1,
                referrence: 1,
                brandname: 1,
                productname: 1,
                started: 1,
                completed: 1,
                quantity: 1,
                project_datetime: 1,
                start_datetime: 1,
                handover_datetime: 1,
                approved_datetime: 1,
              },
            },
            {
              $lookup: {
                from: "customers",
                localField: "customer_id",
                foreignField: "_id",
                as: "customer_name",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      firstname: 1,
                      lastname: 1,
                      email: 1,
                      phone: 1,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "processes",
          as: "processdetails",
          let: { id: "$process_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
            {
              $project: {
                process_name: 1,
                approvers: 1,
                notify: 1,
                mailstat: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          project_id: 1,
          process_id: 1,
          projectdetails: 1,
          processdetails: 1,
          day: {
            $trunc: {
              $divide: [
                { $subtract: ["$process_end_date", new Date()] },
                86400000,
              ],
            },
          },
          testday: {
            $dateSubtract: {
              startDate: "$process_end_date",
              unit: "month",
              amount: 1,
            },
          },
          process_start_date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$process_started_date",
            },
          },
          process_end_date: {
            $dateToString: { format: "%Y-%m-%d", date: "$process_end_date" },
          },
          started: 1,
          completed: 1,
        },
      },
      { $sort: { process_end_date: 1 } },
    ]),
    { page: req.params.page, limit: req.params.count }
  )
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

router.put("/updateprojectprocessenddate/:id", async (req, res) => {
  const projectprocessupdate = await ProjectProcess.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
      process_end_date: req.body.process_end_date,
    },
    { new: true }
  );
  if (!projectprocessupdate)
    res.status(404).send({
      status: 0,
      data: " Project Process Details Not Found",
    });
  res.send({
    status: 1,
    data: projectprocessupdate,
  });
});

router.put("/completeprojectprocess/:id", async (req, res) => {
  const projectprocessupdate = await ProjectProcess.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
      completed: true,
    },
    { new: true }
  );
  if (!projectprocessupdate)
    res.status(404).send({
      status: 0,
      data: " Project Process Details Not Found",
    });
  res.send({
    status: 1,
    data: projectprocessupdate,
  });
});

router.put("/startprojectprocess/:id", async (req, res) => {
  const projectprocessupdate = await ProjectProcess.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
      started: true,
    },
    {
      $set: {
        process_started_date: req.body.process_started_date,
      },
    },
    { new: true }
  );
  if (!projectprocessupdate)
    res.status(404).send({
      status: 0,
      data: " Project Process Details Not Found",
    });
  res.send({
    status: 1,
    data: projectprocessupdate,
  });
});

//api to get the collection count
router.get("/projectprocesslistcountbyfromandtodate/:from/:to", (req, res) => {
  console.log(req.params.from);
  console.log(req.params.to);
  ProjectProcess.aggregate([
    {
      $match: {
        process_end_date: { $exists: true },
      },
    },
    {
      $project: {
        _id: 1,
        formattedDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$process_end_date",
          },
        },
      },
    },
    {
      $addFields: {
        convert: {
          $dateFromString: {
            dateString: "$formattedDate",
            format: "%Y-%m-%d",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        formattedDate: 1,
        convert: 1,
      },
    },
    {
      $match: {
        convert: {
          $gte: new Date(req.params.from),
          $lte: new Date(req.params.to),
        },
      },
    },
    {
      $count: "totalprocesslistcount",
    },
  ])
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

//api to get the collection count
router.get("/projectprocesslistbyfromandtodate/:from/:to", (req, res) => {
  console.log(req.params.from);
  console.log(req.params.to);
  ProjectProcess.aggregate([
    {
      $match: {
        process_end_date: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "projects",
        as: "projectdetails",
        let: { project_id: "$project_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$project_id"] } },
          },
          {
            $project: {
              customer_id: 1,
              referrence: 1,
              brandname: 1,
              productname: 1,
              completed: 1,
              quantity: 1,
              project_datetime: 1,
              start_datetime: 1,
              handover_datetime: 1,
              approved_datetime: 1,
            },
          },
          {
            $lookup: {
              from: "customers",
              localField: "customer_id",
              foreignField: "_id",
              as: "customer_name",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    phone: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "processes",
        as: "processdetails",
        let: { id: "$process_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$id"] },
            },
          },
          {
            $project: {
              process_name: 1,
              approvers: 1,
              notify: 1,
              mailstat: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        project_id: 1,
        process_id: 1,
        projectdetails: 1,
        processdetails: 1,
        day: {
          $trunc: {
            $divide: [
              { $subtract: ["$process_end_date", new Date()] },
              86400000,
            ],
          },
        },
        testday: {
          $dateSubtract: {
            startDate: "$process_end_date",
            unit: "month",
            amount: 1,
          },
        },
        process_start_date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$process_started_date",
          },
        },
        process_end_date: {
          $dateToString: { format: "%Y-%m-%d", date: "$process_end_date" },
        },
      },
    },
    {
      $addFields: {
        convert: {
          $dateFromString: {
            dateString: "$process_end_date",
            format: "%Y-%m-%d",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        process_start_date: 1,
        process_end_date: 1,
        day: 1,
        projectdetails: {
          referrence: 1,
          brandname: 1,
          handover_datetime: 1,
          customer_name: {
            firstname: 1,
          },
        },
        processdetails: {
          process_name: 1,
        },
        convert: 1,
      },
    },
    {
      $match: {
        convert: {
          $gte: new Date(req.params.from),
          $lte: new Date(req.params.to),
        },
      },
    },
  ])
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

router.get("/processlistingbyenddate", (req, res) => {
  ProjectProcess.aggregate([
    {
      $lookup: {
        from: "projects",
        as: "projectdetails",
        let: { project_id: "$project_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$project_id"] } },
          },
          {
            $project: {
              customer_id: 1,
              referrence: 1,
              brandname: 1,
              productname: 1,
              completed: 1,
              quantity: 1,
              project_datetime: 1,
              start_datetime: 1,
              handover_datetime: 1,
              approved_datetime: 1,
            },
          },
          {
            $lookup: {
              from: "customers",
              localField: "customer_id",
              foreignField: "_id",
              as: "customer_name",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    phone: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "processes",
        as: "processdetails",
        let: { id: "$process_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$id"] },
            },
          },
          {
            $project: {
              process_name: 1,
              approvers: 1,
              notify: 1,
              mailstat: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        project_id: 1,
        process_id: 1,
        projectdetails: 1,
        processdetails: 1,
        day: {
          $trunc: {
            $divide: [
              { $subtract: ["$process_end_date", new Date()] },
              86400000,
            ],
          },
        },
        testday: {
          $dateSubtract: {
            startDate: "$process_end_date",
            unit: "month",
            amount: 1,
          },
          // $divide: [
          //   {
          //     $subtract: [
          //       {
          //         process_start_date: {
          //           $dateToString: {
          //             format: "%Y-%m-%d",
          //             date: "$process_started_date",
          //           },
          //         },
          //       },
          //       {
          //         process_start_date: {
          //           $dateToString: {
          //             format: "%Y-%m-%d",
          //             date: new Date(),
          //           },
          //         },
          //       },
          //     ],
          //   },
          //   86400000,
          // ],
        },
        process_start_date: {
          $dateToString: { format: "%Y-%m-%d", date: "$process_started_date" },
        },
        process_end_date: {
          $dateToString: { format: "%Y-%m-%d", date: "$process_end_date" },
        },
        // duration: {
        //   $subtract: [
        //     new Date({
        //       $dateToString: { format: "%Y-%m-%d", date: "$process_end_date" },
        //     }),
        //     new Date("2022-05-30"),
        //   ],
        // },
        // dayMonthYear: {
        //   $dateToString: { format: "%Y-%m-%d", date: "$process_end_date" },
        // },
      },
    },
    { $sort: { process_end_date: 1 } },

    // { $limit: 2 },
    // {
    //   $lookup: {
    //     from: "projectprocess",
    //     as: "process",
    //     let: { process_end_date: "$process_end_date" },
    //     pipeline: [
    //       {
    //         $addFields: {
    //           datelenght: { $subtract: ["$$process_end_date", Date.now] },
    //         },
    //       },
    //     ],
    //   },
    // },
  ])

    // find()
    //   .sort()
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
