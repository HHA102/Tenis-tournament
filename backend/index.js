const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const cookieParser = require('cookie-parser'); 
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user'); 

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URL1,()=>{
    console.log('connected to mongoDB');
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use('/v1/auth',authRoute);
app.use('/v1/user',userRoute);


app.listen(8000, () => {
    console.log('Server is running');
});

//AUTHENTICATION
//AUTHORIZATION