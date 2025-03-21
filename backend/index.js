const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const tournamentRoutes = require('./routes/tournamentRoutes');
dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URL1, () => {
    console.log('connected to mongoDB');
})
// app.use((req, res, next) => {
//     console.log(req);
//     next();
//   });
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use('/v1/tournaments', tournamentRoutes);
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);

app.listen(8000, () => {
    console.log('Server is running');
});

//AUTHENTICATION
//AUTHORIZATION