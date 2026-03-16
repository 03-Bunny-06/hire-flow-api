const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminSchema = require("../validations/adminValidation");
const Admin = require("../models/adminModel");

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
                error: validatedCredentials.error
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

module.exports = adminRegisterController;