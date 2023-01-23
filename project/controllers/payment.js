const Order = require("../models/order");
const User = require("../models/user");
const Razorpay = require("razorpay");

exports.updateTransaction = async (req, res, next) => {
  const { orderId, paymentId } = req.body;

  Order.findOne({ include: User }, { where: { orderId: orderId } })
    .then((order) => {
      order
        .update({ paymentId: paymentId, status: "SUCCESSFULL" })
        .then(() => {
          req.user
            .update({ ispremium: true })
            .then(() => {
              return res
                .status(202)
                .json({ success: true, message: "Transaction Successfull" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.buypremimusss = async (req, res, next) => {
  var rzp = new Razorpay({
    key_id: process.env.API_KEY,
    key_secret: process.env.API_SECRET,
  });
  const amount = 100;
  rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
    if (err) {
      throw new Error(JSON.stringify(err));
      // console.log(err);
    }
    req.user
      .createOrder({ orderId: order.id, status: "PENDING" })
      .then(() => {
        console.log(order);
        return res.status(202).json({ order, key_id: rzp.key_id });
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err));
      });
  });
  // } catch (err) {
  //   return res
  //     .status(401)
  //     .json({ message: "Something went wrong", error: err });
  // }
};
