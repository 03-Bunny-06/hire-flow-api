const z = require("zod");

const roles = ['applicant', 'recruiter']
const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password is too short!'),
    roles: z.enum(roles)
})

module.exports = userSchema;