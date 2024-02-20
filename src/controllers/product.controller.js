const Product = require("../models/product.model");
const Category = require("../models/category.model");
const {
  uploadOnCloudinary,
  destroyOnCloudinary,
} = require("../config/cloudinary");

const getProductById = async (req, res) => {
  const id = req.params.id; //id as string
  if (!id) {
    return res.status(400).send("Product id is required");
  }

  const products = await Product.aggregate([
    {
      $match: { user: { $eq: req.user._id } },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $addFields: {
        categoryName: {
          $getField: {
            input: { $arrayElemAt: ["$categoryDetails", 0] },
            field: "name",
          },
        },
      },
    },
    {
      $project: { categoryDetails: 0, user: 0 },
    },
  ]); //aggregate returns an array

  const product = products.find((product) => {
    return product._id == id;
  });

  return res
    .status(200)
    .json({ message: "Product fetched successfully", data: product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.aggregate([
    {
      $match: { user: { $eq: req.user._id } },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $addFields: {
        categoryName: {
          $getField: {
            input: { $arrayElemAt: ["$categoryDetails", 0] },
            field: "name",
          },
        },
      },
    },
    {
      $project: { categoryDetails: 0, user: 0 },
    },
  ]);

  return res
    .status(200)
    .json({ message: "All Products fetched successfully", data: products });
};

const addProduct = async (req, res) => {
  const { name, price, quantity, category, description } = req.body;

  if (!name) {
    return res.status(400).send("Name is required");
  }

  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    return res.status(409).send("Product already exists");
  }

  var existingCategory = await Category.findOne({
    name: { $eq: category },
  });
  if (!existingCategory) {
    existingCategory = await Category.create({
      name: category,
      user: req.user._id,
    });
  }

  const productImage = req.file?.path;

  const imageObject = await uploadOnCloudinary(productImage);

  const newProduct = await Product.create({
    name,
    price,
    quantity,
    category: existingCategory._id,
    user: req.user._id,
    description,
    image: imageObject ? imageObject.url : "",
  });

  if (!newProduct) {
    return res.status(500).send("Failed to add the product in the database");
  }

  return res
    .status(200)
    .json({ message: "Product added Successfully", data: newProduct });
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price, quantity, category, description } = req.body;

  if (!id) {
    return res.status(400).send("Product id is required");
  }

  if (!name || !price || !quantity || !category || !description) {
    return res.status(400).send("All fields are required");
  }

  if (category) {
    var existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({
        name: category,
        user: req.user._id,
      });
    }
  } // this if conditon is optional

  const product = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        price,
        quantity,
        category: existingCategory._id,
        description,
      },
    },
    { new: true }
  );
  if (!product) {
    return res.status(404).send("Product id is incorrect");
  }

  return res
    .status(200)
    .json({ message: "Product updated successfully", data: product });
};

const updateProductImage = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Product id is required");
  }

  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).send("Image is required");
  }

  const imageObject = await uploadOnCloudinary(imagePath);

  if (!imageObject.url) {
    return res.status(400).send("Failed to upload on Cloudinary");
  }

  //   Delete old image
  const existingProduct = await Product.findById(id);

  const getPublicId = (imageURL) => imageURL.split("/").pop().split(".")[0];
  const public_id = getPublicId(existingProduct.image);

  await destroyOnCloudinary(public_id);
  //   Delete old image

  const product = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        image: imageObject.url,
      },
    },
    { new: true }
  );
  if (!product) {
    return res.status(404).send("Product id is incorrect");
  }

  return res
    .status(200)
    .json({ message: "Image updated successfully", data: product });
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Product id is required");
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res.status(404).send("Product id is incorrect");
  }

  return res
    .status(200)
    .json({ message: "Product Deleted successfully", data: product });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  updateProductImage,
  deleteProduct,
};
