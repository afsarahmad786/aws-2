const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.Sequelize_User,
  process.env.Sequelize_Password,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

module.exports = sequelize;
