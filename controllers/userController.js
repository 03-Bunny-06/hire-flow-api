const env = require("dotenv");
env.config({path: '../.env'});

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = require("../validations/userValidation");
const User = require("../models/userModel");

const userRegisterController = async(req, res) => {
    try{
        const email = req.headers.email;
        const password = req.headers.password;
        const roles = req.headers.roles; //applicant (or) recruiter

        const saltedRounds = 10;

        const data = {email, password, roles};

        const validatedCredentials = userSchema.safeParse(data);

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

module.exports = userRegisterController;