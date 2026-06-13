const env = require("dotenv");
env.config({path:'../.env'});
const jwt = require("jsonwebtoken");

const adminMiddleware = async(req, res, next) => {
    const token = req.headers.authorization;
    
    if(token === undefined || token.length === 0){
        return res.status(401).json({
            msg: 'Authorization header missing'
        })
    }

    const splitToken = token.split(" ");
    console.log(splitToken);
    const rawToken = splitToken[1];

    try{
        const JWT_KEY = process.env.JWT_KEY;
        const verifiedJsonWebToken = jwt.verify(rawToken, JWT_KEY);

        //admin Id
        const decodedAdminId = verifiedJsonWebToken.adminId; //undefined

        if(decodedAdminId){
            req.adminId = decodedAdminId;
            next();
        }

        else{
            return res.status(404).json({
                msg: 'AdminId not found in the token'
            })
        }
    }
    catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
}