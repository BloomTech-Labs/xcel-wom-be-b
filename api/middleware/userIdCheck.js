const userModel = require('../userCrud/userModel');
const createError = require('http-errors');

const userIdCheck = async (req, res, next) => {
  try {
    const user = userModel.getCompanyUser(req.params.user_id);
    if (user) {
      next();
    }
  } catch (err) {
    next(createError(401, err.message));
  }
};

module.exports = userIdCheck;
