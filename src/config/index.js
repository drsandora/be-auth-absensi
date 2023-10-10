require('dotenv').config();
module.exports = {
  APP_SECRET: process.env.APP_SECRET,
  TEMP_SECRET: process.env.TEMP_SECRET,
  CONNECTION: process.env.CONNECTION,
};