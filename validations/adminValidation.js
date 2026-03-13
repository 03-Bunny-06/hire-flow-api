const z = require("zod");

const adminSchema = z.object({
    name: z.string().minLength(5),
    password: z.string().min(8, 'Password is too short')
})

module.exports = adminSchema;