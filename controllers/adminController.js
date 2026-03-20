const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const env = require("dotenv");
env.config({path: '../.env'})

const adminSchema = require("../validations/adminValidation");
const Admin = require("../models/adminModel");

//SignUp/Register (new admin)
const adminRegisterController = async (req, res) => {
    try{
        const name = req.headers.name;
        const password = req.headers.password;

        const saltRounds = 10; 

        const data = {name, password};

        console.log(data);

        const validatedCredentials = adminSchema.safeParse(data);

        console.log(validatedCredentials);
        
        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: "Validation Failed",
                error: validatedCredentials.error.message
            })
        }

        const adminAlreadyExists = await Admin.findOne({name: validatedCredentials.data.name});
        if(adminAlreadyExists){
            return res.status(409).json({
                msg: "Admin already exists try signin instead."
            })
        }

        const hashedPassword = await bcrypt.hash(validatedCredentials.data.password, saltRounds);
        await Admin.create({name: validatedCredentials.data.name, password: hashedPassword});
        return res.status(201).json({
            msg: "Admin created successfully!"
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

//SignIn
const adminSignInController = async(req, res) => {
    try{
        const name = req.headers.name;
        const password = req.headers.password;
        const JWT_KEY = process.env.JWT_KEY;

        const adminExists = await Admin.findOne({name: name});

        if(!adminExists){
            return res.status(404).json({
                msg: 'Admin does not exist'
            })
        }

        const isValidPassword = await bcrypt.compare(password, adminExists.password);
        const token = jwt.sign({name: name}, JWT_KEY);

        if(isValidPassword){
            return res.status(200).json({
                msg: 'Admin signed in successfully!',
                token: token
            })
        }

        return res.status(403).json({
            msg: 'Incorrect password'
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

module.exports = {adminRegisterController, adminSignInController};