require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const tournamentRoutes = require('./routes/tournamentRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/tournaments', tournamentRoutes);

sequelize.sync().then(() => {
  console.log('Database connected.');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}.`);
  });
});
