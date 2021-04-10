const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const testRouter = require("./routes/test");
const resultsRouter = require("./routes/results");
const { HttpCode, Status } = require("./helpers/constants");
const swaggerUi = require("swagger-ui-express");
const swaggerJSON = require("./swagger.json");
require("dotenv").config();

const path = require("path");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.static(process.env.PUBLIC_DIR));
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: Status.ERROR,
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Too many requests, please try again later.",
    });
  },
});

app.use("/", apiLimiter);
app.use("/auth", authRouter);
app.use("/test", testRouter);
app.use("/results", resultsRouter);
app.use("/user", userRouter);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerJSON));
app.use("/link", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/link.html"));
});

app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  res
    .status(err.status || HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
});

module.exports = app;
