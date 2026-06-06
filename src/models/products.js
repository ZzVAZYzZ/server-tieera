const { DataTypes } = require('sequelize');
const { sequelize } = require('../databases/mysql/mysqlConnect');
const Category = require('./categories');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  material: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stone_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stone_shape: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.DECIMAL(10,0),
    allowNull: false,
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Category,
      key: 'category_id',
    },
    onDelete: 'CASCADE',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discount_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active', // or 'inactive'
  },
  created_at: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {
  tableName: 'products',
  timestamps: false,
});

Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product;
