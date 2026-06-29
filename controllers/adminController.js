const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const env = require("dotenv");
env.config({path: '../.env'})

const {adminRegisterSchema, adminSignInSchema} = require("../validations/adminValidation");
const Admin = require("../models/adminModel");

//SignUp/Register (new admin)
const adminRegisterController = async (req, res) => {
    try{
        const name = req.headers.name;
        const email = req.headers.email;
        const password = req.headers.password;

        const saltRounds = 10; 

        const data = {name, email, password};

        console.log(data);

        const validatedCredentials = adminRegisterSchema.safeParse(data);

        console.log(validatedCredentials);
        
        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: "Validation Failed",
                error: validatedCredentials.error.message
            })
        }

        const adminAlreadyExists = await Admin.findOne({$or: [
                                                                {name: validatedCredentials.data.name}, 
                                                                {email: validatedCredentials.data.email}
                                                             ]
                                                        });
        if(adminAlreadyExists){
            return res.status(409).json({
                msg: "Admin already exists try signin instead."
            })
        }

        const hashedPassword = await bcrypt.hash(validatedCredentials.data.password, saltRounds);
        await Admin.create({name: validatedCredentials.data.name, email: validatedCredentials.data.email, password: hashedPassword});
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

        const data = {name, password}

        const validatedCredentials = adminSignInSchema.safeParse(data);

        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: "Validation Failed",
                error: validatedCredentials.error.message
            })
        }

        const adminExists = await Admin.findOne({name: validatedCredentials.data.name});

        if(!adminExists){
            return res.status(404).json({
                msg: 'Admin does not exist'
            })
        }

        const isValidPassword = await bcrypt.compare(validatedCredentials.data.password, adminExists.password);
        const token = jwt.sign({adminId: adminExists._id}, JWT_KEY);

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

const adminViewingDashboardStats = async(req, res) => {
    try{
        //getting info of admin the email
        const adminId = req.adminId;
        console.log(adminId);

        const adminInfo = await Admin.findOne({_id: adminId});

        console.log(adminInfo);

        const adminName = adminInfo.name;
        const adminEmail = adminInfo.email;

        console.log(adminName);
        console.log(adminEmail);

        
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

module.exports = {adminRegisterController, adminSignInController};