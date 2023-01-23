const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Forgot = sequelize.define("forgot", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  uuid: Sequelize.STRING,
  isactive: Sequelize.BOOLEAN,
});

module.exports = Forgot;
