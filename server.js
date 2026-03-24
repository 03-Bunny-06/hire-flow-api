const env = require("dotenv");
env.config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");
const recruiterRouter = require("./routes/userRecruiterRoutes");

//Function Call to connect the Database URL
const connectDb = require("./config/db")
connectDb();

app.use(bodyParser.json());
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/user/recruiter', recruiterRouter);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server started at: ${PORT} 🚀`)
})