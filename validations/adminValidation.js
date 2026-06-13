const z = require("zod");

const adminRegisterSchema = z.object({
    name: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8, 'Password is too short')
})

const adminSignInSchema = z.object({
    name: z.string().min(5),
    password: z.string().min(8, 'Password is too short')
})

module.exports = {adminRegisterSchema, adminSignInSchema};