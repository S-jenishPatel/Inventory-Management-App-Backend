const Category = require("../models/category.model");

const getAllCategories = async (req, res) => {
  const categories = await Category.find({
    user: req.user._id,
  });

  return res
    .status(200)
    .json({ message: "All categories fetched successfully", data: categories });
};

const getCategoryById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send("Category id is required");
  }

  const category = await Category.findById(id);
  if (!category) {
    res.status(404).send("Category id is incorrect");
  }

  return res
    .status(200)
    .json({ message: "Category fetched successfully", data: category });
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send("name is required");
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(409).send("Category already exists");
  }

  const newCategory = await Category.create({
    name,
    user: req.user._id,
  });
  if (!newCategory) {
    res.status(500).send("Failed to create the category in the database");
  }

  return res
    .status(200)
    .json({ message: "Category created successfull", data: newCategory });
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!id) {
    res.status(400).send("Category id is required");
  }

  if (!name) {
    res.status(400).send("All Fields are required");
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(409).send("Category already exists");
  }

  const category = await Category.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "Category updated successfully", data: category });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
};
