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

    try{
        const splitToken = token.split();
        const rawToken = splitToken[1];
        const JWT_KEY = process.env.JWT_KEY;

        const decodedRawToken = jwt.verify(rawToken, JWT_KEY);
        const decodedRecruiterId = decodedRawToken.recruiterId;

        if(decodedRecruiterId){
            req.recruiterId = decodedRecruiterId;
            next();
        }
    }
    catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
}

module.exports = recruiterMiddleware;