const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Auth = async  (req, res, next)=> {
  try {
    var authtoken = req.header('Authorization');
    // console.log("auth",authtoken)
    if (authtoken) {
      const user = await User.findOne({ token: authtoken });
      if (!user) return res.status(402).json({status:400 , message:'Invalid Token '});
      req.user = user;
      next();
    }
  } catch (err) {
    console.log(err);
    if (err) res.status(402).send('invalid Credentials');
  }
};

module.exports = Auth;