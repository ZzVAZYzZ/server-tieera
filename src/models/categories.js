const { DataTypes } = require('sequelize');
const {sequelize} = require('../databases/mysql/mysqlConnect'); // adjust path

const Categories = sequelize.define('Category', {
  category_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'categories',
  timestamps: false,
});

module.exports = Categories;
