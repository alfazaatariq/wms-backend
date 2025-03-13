const express = require("express");
const cors = require("cors");
const productRouter = require("./route/product_route");
const authRouter = require("./route/auth_route");
const userRouter = require("./route/user_route");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/error_controller");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: `${process.cwd()}/.env` });

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", userRouter);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
