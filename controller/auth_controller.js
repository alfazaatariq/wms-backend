const user = require("../db/models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Clear cookie immediately
  });

  return res.json({ status: "success", message: "Logged out" });
});

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
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

  result.token = generateToken({
    id: result.id,
  });

  return res.status(201).json({
    status: "sucess",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Please provide username and password", 400));
  }

  const result = await user.findOne({ where: { username } });
  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Invalid username or password", 401));
  }

  const token = generateToken({
    id: result.id,
    username: result.username,
    role: result.role,
  });

  // Set the token in an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
    maxAge: 30 * 60 * 1000, // Expires in 30 minutes
  });

  return res.json({
    status: "success",
  });
});

const authentication = catchAsync(async (req, res, next) => {
  let idToken = req.cookies?.jwt; // Extract jwt from cookies

  if (!idToken) {
    return next(new AppError("Please login to get access"));
  }

  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  const freshUser = await user.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(new AppError("User no longer exists", 400));
  }

  req.user = freshUser;
  return next();
});

// const authentication = catchAsync(async (req, res, next) => {
//   let idToken = "";
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     idToken = req.headers.authorization.split(" ")[1];
//   }

//   if (!idToken) {
//     return next(new AppError("Please login to get access"));
//   }

//   const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

//   const freshUser = await user.findByPk(tokenDetail.id);

//   if (!freshUser) {
//     return next(new AppError("User no longer exists", 400));
//   }

//   req.user = freshUser;
//   return next();
// });

const getProfile = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  const tokenDetail = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Fetch the latest user data from the database
  const existingUser = await user.findByPk(tokenDetail.id);

  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  const data = {
    id: existingUser.id,
    username: existingUser.username, // Now using updated DB value
    role: existingUser.role,
  };

  return res.json({ status: "success", data });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { username, password } = req.body;

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

  await existingUser.update(updateData);

  return res.status(200).json({
    status: "success",
    data: existingUser,
  });
});

const restrictTo = (...role) => {
  const checkPermission = (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    return next();
  };

  return checkPermission;
};

module.exports = {
  signup,
  login,
  authentication,
  restrictTo,
  getProfile,
  logout,
  updateProfile,
};
