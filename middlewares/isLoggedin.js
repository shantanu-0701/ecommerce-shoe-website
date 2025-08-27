const jwt = require('jsonwebtoken');
const userModel = require('../models/usermodel');

module.exports = async (req, res, next) => {
  if (!req.cookies.token) {
    req.flash("error", "You must log in first.");
    return res.redirect('/');
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel.findOne({ email: decoded.email }).select('-password');

    if (!user) {
      req.flash("error", "Invalid user.");
      return res.redirect('/');
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "Session expired or token invalid.");
    res.redirect('/');
  }
};
