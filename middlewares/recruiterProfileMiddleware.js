const env = require("dotenv");
env.config({path: '../.env'});
const jwt = require("jsonwebtoken");

const recruiterMiddleware = async(req, res, next) => {
    const token = req.headers.authorization;

    if(token === undefined || token.length === 0){
        return res.status(404).json({
            msg: 'Authorization header missing'
        })
    }
}