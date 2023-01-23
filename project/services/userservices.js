const getExpenses = (req, where) => {
  return req.user.getExpense(where);
};

module.exports = {
  getExpenses,
};
