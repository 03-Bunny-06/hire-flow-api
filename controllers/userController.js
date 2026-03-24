const env = require("dotenv");
env.config({path: '../.env'});

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {userRegisterSchema, userSignInSchema} = require("../validations/userValidation");
const User = require("../models/userModel");

const userRegisterController = async(req, res) => {
    try{
        const email = req.headers.email;
        const password = req.headers.password;
        const roles = req.headers.roles; //applicant (or) recruiter

        const saltedRounds = 10;

        const data = {email, password, roles};

        const validatedCredentials = userRegisterSchema.safeParse(data);

        console.log(validatedCredentials);

        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: 'Validation Failed',
                error: validatedCredentials.error.message
            })
        }

        const userAlreadyExists = await User.findOne({email: validatedCredentials.data.email})

        if(userAlreadyExists){
            return res.status(409).json({
                msg: 'User already exists try sigin instead'
            })
        }

        const hashedPassword = await bcrypt.hash(validatedCredentials.data.password, saltedRounds);
        await User.create({email: validatedCredentials.data.email, password: hashedPassword, roles: validatedCredentials.data.roles})

        return res.status(201).json({
            msg: 'User SignedUp successfully!'
        })
    }
    catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
}

const userSignInController = async(req, res) => {
    try{
        const email = req.headers.email;
        const password = req.headers.password;
        const JWT_KEY = process.env.JWT_KEY;

        const data = {email, password};

        console.log(data);

        const validatedCredentials = userSignInSchema.safeParse(data);

        console.log(validatedCredentials);

        if(!validatedCredentials.success){
            return res.status(400),json({
                msg: 'Validation Failed',
                error: validatedCredentials.error.message
            })
        }

        const userExists = await User.findOne({email: validatedCredentials.data.email});

        console.log(userExists);

        if(!userExists){
            return res.status(404).json({
                msg: 'User does not exist'
            })
        }

        const isValidPassword = await bcrypt.compare(validatedCredentials.data.password, userExists.password);
        const token = jwt.sign({userId: userExists._id, roles: userExists.roles}, JWT_KEY);

        if(isValidPassword){
            return res.status(200).json({
                msg: 'User signed in successfully!',
                token: token
            })
        }

        return res.status(403).json({
            msg: 'Invalid Password'
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

module.exports = {userRegisterController, userSignInController};