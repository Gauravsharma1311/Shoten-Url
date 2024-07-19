const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const config = require("./config");
const session = require("express-session");
const customersRouter = require("./routes/customersRouter");
const urlRouter = require("./routes/urlRouter");
const usersRouter = require("./routes/usersRouter");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/customers", customersRouter);
app.use("/api/urls", urlRouter);
app.use("/api/users", usersRouter);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
