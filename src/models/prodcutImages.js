const { DataTypes } = require('sequelize');
const {sequelize} = require('../databases/mysql/mysqlConnect');
const Product = require('./products');

const ProductImage = sequelize.define('ProductImage', {
  image_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
      key: 'product_id',
    },
    onDelete: 'CASCADE',
  },
  is_main: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'product_images',
  timestamps: false,
});

ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(ProductImage, { foreignKey: 'product_id' });

module.exports = ProductImage;
