const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const User = require("./models/user");
const userRoutes = require("./routes2/user");
const expenseRoutes = require("./routes2/expense");
const paymentRoutes = require("./routes2/payment");
const Expense = require("./models/expense");
const Report = require("./models/report");
const Order = require("./models/order");
const Forgot = require("./models/forgot");
const fs = require("fs");
const https = require("https");
var cors = require("cors");

const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const dotenv = require("dotenv");

dotenv.config();

const accessLogStram = fs.createWriteStream(
  path.join(__dirname, "access.log"),

  { flags: "a" }
);

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const privateKey = fs.readFileSync("server.key");
const certificateKey = fs.readFileSync("server.cert");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "js")));
// app.use(express.static(path.join(__dirname, "views")));
app.use(userRoutes);
app.use(expenseRoutes);
app.use(paymentRoutes);
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStram }));

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgot);
Forgot.belongsTo(User);

User.hasMany(Report);
Report.belongsTo(User);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    console.log(result);
    // https
    //   .createServer({ key: privateKey, cert: certificateKey }, app)
    //   .listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
  })

  // console.log(user);
  .catch((err) => {
    console.log(err);
  });
