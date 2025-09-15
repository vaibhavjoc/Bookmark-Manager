const jwt = require("jsonwebtoken");
const process = require('process');
const dotenv = require("dotenv");
dotenv.config();

function auth(req, res, next) {
    const token = req.headers.token;

    if(!token) {
        return res.json({
            message: "No token Provided"
        })
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if(decodedData) {
        req.userId = decodedData.id;
        next()
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
}

module.exports = {
    auth
}