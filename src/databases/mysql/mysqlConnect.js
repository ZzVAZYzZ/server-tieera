const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_NAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: "mysql",
    logging: false,
  }
);
//@param null
//@result mysql connected
const mysqlConnect = async () => {

    console.log("MYSQL_NAME:", process.env.MYSQL_NAME);
    console.log("MYSQL_USER:", process.env.MYSQL_USER);
    console.log("MYSQL_HOST:", process.env.MYSQL_HOST);
    console.log("MYSQL_PORT:", process.env.MYSQL_PORT);

    try {
      await sequelize.authenticate();
      console.log('mysql connected');
      await sequelize.sync({ alter: false, force: false  });

      

    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
};


module.exports = {sequelize, mysqlConnect}