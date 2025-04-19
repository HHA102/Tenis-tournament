const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const courtRoutes = require('./routes/courtRoutes');
const matchRoutes = require('./routes/matchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

const admin = require("firebase-admin");
const serviceAccount = require("./creds/tennis-tournament-5de3c-firebase-adminsdk-fbsvc-37d732b053.json");
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

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//ROUTES
app.use('/v1/tournaments', tournamentRoutes);
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);
app.use('/v1/courts', courtRoutes);
app.use('/v1/matches', matchRoutes);
app.use('/v1/notification', notificationRoutes);
app.use('/v1/incident', incidentRoutes);

app.listen(8000, () => {
    console.log('Server is running');
});
