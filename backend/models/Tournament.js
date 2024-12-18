const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tournament = sequelize.define('Tournament', {
  name: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  status: { 
    type: DataTypes.ENUM('Active', 'Inactive', 'Completed'), 
    defaultValue: 'Inactive' 
  },
}, {
  timestamps: true,
});

module.exports = Tournament;
