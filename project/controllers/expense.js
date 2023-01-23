const Expense = require("../models/expense");
const Report = require("../models/report");
const User = require("../models/user");
const sequelize = require("sequelize");
const fs = require("fs");
const UserServices = require("../services/userservices");
const S3Services = require("../services/S3services");
// import { Op } from "sequelize";
exports.add = async (req, res, next) => {
  const { amount, description, category } = req.body;
  Expense.create({
    amount: amount,
    description: description,
    category: category,
    userId: req.user.id,
  })
    .then((result) => {
      res.json({
        message: "Expense Added Successfully",
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      res.json(err);
    });
};
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: res } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, res, totalPages, currentPage };
};

exports.list = async (req, res, next) => {
  let q = req.query;
  let p = q.page.split("?")[0];
  let l = q.page.split("=")[1];
  console.log("ppppppppppppppp", p, l);
  // const { page, size, title } = req.query;
  const page = p;
  const size = l;
  const { limit, offset } = getPagination(page, size);

  Expense.findAndCountAll({
    limit,
    offset,
    where: { userId: req.user.id },
    include: User,
  })

    .then((response) => {
      const data = getPagingData(response, page, limit);
      console.log(data);
      res.json({ data: data });
    })
    .catch((err) => console.log(err));
  // console.log(res.json({ data: req.body }));
};

exports.deleteitem = async (req, res, next) => {
  console.log(req.params.id);

  Expense.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((response) => {
      res.status(200).json({ message: "Deleted successfully" });

      // res.json({ data: response });
    })
    .catch((err) => console.log(err));

  // console.log(res.json({ data: req.body }));
};

exports.leaderboards = async (req, res, next) => {
  Expense.findAll({
    // include: User,

    include: [
      {
        attributes: ["name"],
        model: User,
      },
    ],
    // Will order by max(age)
    attributes: [
      "userId",
      [sequelize.fn("SUM", sequelize.col("amount")), "total_amount"],
    ],
    group: ["userId"],
    order: [
      ["total_amount", "DESC"],
      // ["userId", "DESC"],
    ],
  })
    .then((response) => {
      console.log(response);
      res.json({ data: response });
    })
    .catch((err) => console.log(err));
};

// exports.leaderboards

exports.reports = async (req, res, next) => {
  const total = await Expense.findAll(
    {
      attributes: [
        [sequelize.fn("SUM", sequelize.col("amount")), "total_amount"],
      ],
    },
    { where: { userId: req.user.id } }
  )
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));

  const dat = await Expense.findAll(
    {
      where: {
        [sequelize.Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("createdAt")),
            "01"
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("updatedAt")),
            "2023"
          ),
        ],
      },
    },
    { where: { userId: req.user.id } }
  )
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
  console.log("ddddddddd", dat);
  Expense.findAll({}, { where: { userId: req.user.id } })
    .then((response2) => {
      obj = {
        ...response2,
        ...{ total_amount: total[0].dataValues.total_amount },
      };
      // response2.push({ total_amount: total[0].dataValues.total_amount });
      res.json({ data: obj });
    })
    .catch((err) => console.log(err));

  // const exp = await Expense.findAll({ where: { userId: req.user.id } })
  //   .then((response2) => {
  //     return response2;
  //   })
  //   .catch((err) => console.log(err));

  // result.push(exp);
  // res.json({ message: "Expense Fetched Successfully", data: result });
};

exports.downloadExpense = async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();

    const stringi = JSON.stringify(expenses);
    const userId = req.user.id;

    const filenames = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await S3Services.uploadToS3(stringi, filenames);
    req.user
      .createReport({ link: fileUrl })
      .then(() => {
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });

    res.status(200).json({ fileUrl, success: true, status: 200 });
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

exports.SeeReports = async (req, res, next) => {
  try {
    const reports = await req.user.getReports();

    res.status(200).json({ reports, success: true, status: 200 });
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
