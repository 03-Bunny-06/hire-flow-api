const env = require("dotenv");
env.config({path: '../.env'})
const jwt = require("jsonwebtoken");

const userMiddleware = async(req, res, next) => {
    const token = req.headers.authorization;

    if(token === undefined || token.length === 0){
        return res.status(401).json({
            msg: 'Authorization header missing'
        })
    }

    //Bearer 341434-185-38-482-342034$135132$!#45135
    const splitToken = token.split(" ");
    console.log(splitToken);
    const rawToken = splitToken[1];

    try{
        const JWT_KEY = process.env.JWT_KEY;
        const verifiedJsonWebToken = jwt.verify(rawToken, JWT_KEY);

        const decodedUserId = verifiedJsonWebToken.userId; //undefined
        const decodedRoles = verifiedJsonWebToken.roles;

        if(decodedUserId){
            req.userId = decodedUserId
            req.roles = decodedRoles;
            next();
        }

        else{
            return res.status(404).json({
                msg: 'UserId not found in the token'
            })
        }
    }
    catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
}

module.exports = userMiddleware;