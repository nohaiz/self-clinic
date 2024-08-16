// IMPORTED MODULES

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// DATABASE

require("./config/database.js");

// DEV TOOL
const morgan = require("morgan");

// PORT
const port = process.env.PORT ? process.env.PORT : "3000";

// CONTROLLERS
const usersRouter = require("./controllers/users.js");

// MIDDLEWARE

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ROUTES
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log("The express app is ready!");
});
