const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    const user = jwt.verify(token, "987546585454566985abavchafjagjaaj");

    User.findByPk(user.userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};
