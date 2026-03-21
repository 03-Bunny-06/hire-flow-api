const z = require("zod");

const roles = ['applicant', 'recruiter']
const userRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password is too short!'),
    roles: z.enum(roles)
})

const userSignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password is too short!')
})

module.exports = {userRegisterSchema, userSignInSchema};