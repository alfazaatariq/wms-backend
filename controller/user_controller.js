const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

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
  const { username, password, role } = req.body;

  const existingUser = await user.findByPk(id);
  if (!existingUser) {
    return next(new AppError("User not found", 404));
  }

  const updateData = {};
  if (username) updateData.username = username;
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    updateData.password = bcrypt.hashSync(password, salt);
  }
  if (role) updateData.role = role;

  await existingUser.update(updateData);

  return res.status(200).json({
    status: "success",
    data: existingUser,
  });
});

const getAllUser = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  const whereClause = search
    ? { username: { [Op.iLike]: `%${search}%` } } // Case-insensitive search for PostgreSQL (Sequelize)
    : {};

  const users = await user.findAll({ where: whereClause });

  return res.status(200).json({
    status: "success",
    data: users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const body = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(body.password, salt);

  const newUser = await user.create({
    username: body.username,
    password: hash,
    role: body.role,
  });

  if (!newUser) {
    return next(new AppError("Failed to create user", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  return res.status(201).json({
    status: "sucess",
    data: result,
  });
});

module.exports = { getAllUser, updateUserById, deleteUserById, createUser };
