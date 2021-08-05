const jwt = require("jsonwebtoken");

require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(jwt.decode(token, process.env.SCRET_JWT_ACCESS_TOKEN));
    jwt.verify(token, process.env.SCRET_JWT_ACCESS_TOKEN);
    next();

  } catch (error) {
    var dateNow = new Date();
    if (error.expiredAt < dateNow.getTime()) {
      return res.status(401).json({
        code: 401,
        Authorization: "Unauthorized",
        success: false,
        messaage: 'token expired'
      });
    } else {
      return res.status(401).json({
        meta: {
          code: 401,
          Authorization: "Unauthorized",
          success: false,
          messaage: 'Anda tidak memilika akses'
        },
      });
    }
  }
};
