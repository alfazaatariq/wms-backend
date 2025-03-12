const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const deleteUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingUser = await user.findByPk(id);
  if (!existingUser) {
    return next(new AppError("User not found", 404));
  }

  await existingUser.destroy();

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

const updateUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  const existingUser = await user.findByPk(id);
  if (!existingUser) {
    return next(new AppError("User not found", 404));
  }

  await existingUser.update(updatedData);

  return res.status(200).json({
    status: "success",
    data: existingUser,
  });
});

const getAllUser = catchAsync(async (req, res, next) => {
  const users = await user.findAll();

  return res.status(200).json({
    status: "success",
    data: users,
  });
});

module.exports = { getAllUser, updateUserById, deleteUserById };
