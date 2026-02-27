const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // У професійних проєктах цей URL зазвичай береться з .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB підключено: ${conn.connection.host} ✅`);
  } catch (error) {
    console.error(`Помилка підключення: ${error.message} ❌`);
    process.exit(1); // Зупиняємо сервер у разі критичної помилки
  }
};

module.exports = connectDB;
