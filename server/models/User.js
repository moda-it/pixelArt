const mongoose = require("mongoose"); // Імпорт бібліотеки Mongoose для роботи з MongoDB
const bcrypt = require("bcryptjs"); // Імпорт бібліотеки bcrypt для хешування паролів

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Будь ласка, введіть ім'я користувача"],
    unique: true, // Забезпечує унікальність імені користувача
    trim: true, // Видаляє пробіли з початку та кінця рядка
  },
  password: {
    type: String,
    required: [true, "Будь ласка, введіть пароль"],
    minlenght: [6, "Пароль повинен бути не менше 6 символів"],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Встановлює поточну дату та час при створенні користувача
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return; // Якщо пароль не був змінений, переходимо до наступного middleware
  const salt = await bcrypt.genSalt(10); // Генеруємо сіль для хешування
  this.password = await bcrypt.hash(this.password, salt); // Хешуємо пароль і зберігаємо його в базі даних
});

module.exports = mongoose.model("User", UserSchema); // Експортуємо модель користувача для використання в інших частинах програми
