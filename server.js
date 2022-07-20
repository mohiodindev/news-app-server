require("dotenv").config();
require("colors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { connectDB } = require("./config/db");

const UserRoutes = require("./routes/UserRoutes");

const port = process.env.PORT || 3000;

//configure node enviroment

process.env.HOST = `http://localhost:${port}`;
app.use(morgan("dev"));

// connect to mongodb
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", UserRoutes);

app.get("/", (req, res) => {
  res.send("<h2> Welcome to the News API </h2>");
});

// endpoint not found
app.use("*", (req, res) => {
  res.status(404).send("Endpoint not found");
});

app.listen(port, () => {
  console.log(`Server is running  on ${process.env.HOST}`.green.bold);
});
