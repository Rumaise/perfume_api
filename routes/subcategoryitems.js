const express = require("express");
const subcategoryitems = require("../models/subcategoryitems");
const router = express.Router();
const {
  SubCategoryItems,
  validateSubCategoryItems,
} = require("../models/subcategoryitems");

//POST : CREATE A NEW  SUB CATEGORY ITEM
router.post("/createsubcategoryitem", async (req, res) => {
  const error = await validateSubCategoryItems(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var subcategoryitems = new SubCategoryItems({
    sub_category_id: req.body.sub_category_id,
    item_name: req.body.item_name,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  subcategoryitems
    .save()
    .then((subcategoryitems) => {
      res.send({
        status: 1,
        data: subcategoryitems,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL SUB CATEGORIES ITEMS

router.get("/subcategoryitemslist", (req, res) => {
  SubCategoryItems.find()
    // .populate("sub_category_id")
    .then((subcategoryitems) =>
      res.send({
        status: 1,
        data: subcategoryitems,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/loadall", (req, res) => {
  const response = SubCategoryItems.aggregate([
    {
      $group: {
        _id: { sub_category_id: "$sub_category_id" },
        details_data: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        sub_category_id: "$_id.sub_category_id",
        details_data: 1,
        _id: 0,
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "sub_category_id",
        foreignField: "_id",
        as: "sub_category_details",
      },
    },
    {
      $unwind: {
        path: "$sub_category_details",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: { category_id: "$sub_category_details.category_id" },
        category_details_data: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        category_details_data: 1,
        category_id: "$_id.category_id",
        _id: 0,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category_details",
      },
    },
    {
      $unwind: {
        path: "$category_details",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
  response
    .exec()
    .then((result) => {
      console.log(result);
      res.send({
        status: 1,
        data: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET THE SUB CATEGORY ITEMS BY ID
router.get("/:id", async (req, res) => {
  const subcategoryitemdetails = await SubCategoryItems.findById(req.params.id);
  if (!subcategoryitemdetails)
    res.status(404).send({
      status: 0,
      data: "Sub Category Item  Details Not Found",
    });
  res.send({
    status: 1,
    data: subcategoryitemdetails,
  });
});

//UPDATE SUB CATEGORY ITEM BASED ON ID
router.put("/:id", async (req, res) => {
  const subcategoryitemupdate = await SubCategoryItems.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!subcategoryitemupdatee)
    res.status(404).send({
      status: 0,
      data: "Sub Category Details Not Found",
    });
  res.send({
    status: 1,
    data: subcategoryitemupdate,
  });
});

//DELETE A SUB CATEGORY ITEM
router.delete("/:id", async (req, res) => {
  const subcategoryitemdelete = await SubCategoryItems.findByIdAndRemove(
    req.params.id
  );
  if (!subcategoryitemdelete)
    res.status(404).send({
      status: 0,
      data: "Sub Category Item Details Not Found",
    });
  res.send({
    status: 1,
    data: subcategoryitemdelete,
  });
});

module.exports = router;
