// IMPORTED MODULES

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const verifyToken = require("./middlewares/verify-token");

// DATABASE

require("./config/database.js");

// DEV TOOL
const morgan = require("morgan");

// PORT
const port = process.env.PORT ? process.env.PORT : "3000";

// CONTROLLERS
const usersRouter = require("./controllers/users.js");
const profileRouter = require("./controllers/profile.js");

// MIDDLEWARE

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(verifyToken);

// ROUTES
app.use("/users", usersRouter);
app.use("/users", profileRouter);

app.listen(port, () => {
  console.log("The express app is ready!");
});

// Testing
