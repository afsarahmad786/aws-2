const User = require("../models/user");
const Forgot = require("../models/forgot");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const newId = uuidv4();
function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.JWT_SECT);
}

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  // try {
  //   bcrypt.hash(req.body.password, 10, async (err, hash) => {
  //     await User.create({
  //       name,
  //       email,
  //       password: hash,
  //     });

  //     res.json({
  //       message: "User Registered Successfully",
  //       success: true,
  //     });
  //   });
  // } catch (err) {
  //   res.status(500).json(err);
  // }
  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const insertResult = await User.create({
      name: name,
      password: hashedPwd,
      email: email,
    });
    res.json({
      message: "User Registered Successfully",
      success: true,
      data: insertResult,
    });
    // res.send(insertResult);
  } catch (error) {
    res.status(500).send("Internal Server error Occured");
  }
};

exports.login = async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = await User.findOne({ where: { email: email } })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      // res.json(err);

      res.json({
        message: "User Not Found",
        status: 404,
        success: false,
      });
      res.end();
    });
  try {
    if (user) {
      const cmp = await bcrypt.compare(password, user.password);
      if (cmp) {
        res.json({
          message: "User Logged in Successfully",
          success: true,
          status: 200,
          data: user,
          token: generateAccessToken(user.id, user.name),
        });
      } else {
        res.json({
          message: "Password is incorrect",
          message: "User Not Authorized",
          status: 401,
          success: false,
          // data: [],
        });
      }
    } else {
      res.json({
        message: "User Not Found",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured in Login");
  }
};
exports.restorepass = async (req, res, next) => {
  sgMail.setApiKey(process.env.SGRID_API);
  const msg = {
    to: req.body.email,
    from: {
      email: "mohammadafsar415@gmail.com",
      name: "Afsar Ahmad",
    },
    subject: "Hello from SendGrid",
    text: "Hello from SendGrid",
    html: "<h2>Hello from SendGrid</h2>",
  };
  const user = await User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  const forg = await Forgot.create({
    uuid: newId,
    isactive: true,
    userId: user.id,
  })
    .then((resss) => {
      return resss;
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(forg);
  sgMail
    .send(msg)
    .then(() => {
      res.json({
        message: "Email Sent",
        emailId: req.body.email,
        link: "127.0.0.1:3000/password/forgotpassword/" + forg.uuid,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.resetpass = async (req, res, next) => {
  const uuid = req.params.uuid;
  const checklink = await Forgot.findOne({ where: { uuid: uuid } })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
  if (checklink.isactive == true) {
    res.sendFile("reset.html", { root: path.join(__dirname, "../views") });
    // res.sendFile(
    //   path.join(path.dirname(process.mainModule.filename), "/views/reset.html")
    // );
    // res.sendFile("reset.html");
  } else {
    res.send("Not Allowed");
  }
};

exports.changepass = async (req, res, next) => {
  const checklink = await Forgot.findOne({ where: { uuid: req.params.uuid } })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
  const hashedPwd = await bcrypt.hash(req.body.password, 10);

  if (checklink.isactive == true) {
    Forgot.update({ isactive: false }, { where: { uuid: req.params.uuid } });
    User.update({ password: hashedPwd }, { where: { id: checklink.userId } })
      .then(() => {
        res.json({
          message: "Password Changed Successfully",
          status: 200,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
