const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisIS78dbjbcdnkhis";

function auth(req, res, next) {
    const token = req.headers.token;

    if(!token) {
        return res.json({
            message: "No token Provided"
        })
    }

    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData) {
        req.userId = decodedData.indexOf;
        next()
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
}

module.exports = {
    auth,
    JWT_SECRET
}