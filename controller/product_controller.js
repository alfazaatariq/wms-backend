const catchAsync = require("../utils/catchAsync");
const product = require("../db/models/product");

const getAllProduct = catchAsync(async (req, res, next) => {
  const products = await product.findAll();

  return res.status(200).json({
    status: "success",
    data: products,
  });
});
const createProduct = catchAsync(async (req, res, next) => {
  const body = req.body;

  const newProduct = await product.create({
    name: body.name,
    stock: body.stock,
    price: body.price,
  });

  if (!newProduct) {
    return next(new AppError("Failed to create product", 400));
  }

  const result = newProduct.toJSON();

  delete result.deletedAt;

  return res.status(201).json({
    status: "sucess",
    data: result,
  });
});
const updateProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  const existingProduct = await product.findByPk(id);
  if (!existingProduct) {
    return next(new AppError("Product not found", 404));
  }

  await existingProduct.update(updatedData);

  return res.status(200).json({
    status: "success",
    data: existingProduct,
  });
});
const deleteProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingProduct = await product.findByPk(id);
  if (!existingProduct) {
    return next(new AppError("Product not found", 404));
  }

  await existingProduct.destroy();

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getAllProduct,
  createProduct,
  updateProductById,
  deleteProductById,
};
