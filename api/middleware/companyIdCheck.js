const userModel = require('../userCrud/userModel');
const createError = require('http-errors');

const companyIdCheck = async (req, res, next) => {
  try {
    console.log(req.params);
    const company = userModel.getCompany(req.params.company_id);
    if (company) {
      next();
    }
  } catch (err) {
    next(createError(401, err.message));
  }
};

module.exports = companyIdCheck;
