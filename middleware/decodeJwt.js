const jwt = require("jsonwebtoken");

require('dotenv').config();

module.exports = (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SCRET_JWT_ACCESS_TOKEN);
        return jwt.decode(token, process.env.SCRET_JWT_ACCESS_TOKEN);

    } catch (error) {
        var dateNow = new Date();
        if (error.expiredAt < dateNow.getTime()) {
            return res.status(402).json({
                code: 402,
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
