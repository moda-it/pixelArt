const express = require("express"); // Імпорт бібліотеки Express
const path = require("path"); // Імпорт бібліотеки для роботи з шляхами
const cors = require("cors"); // Імпорт бібліотеки для обробки CORS

const connectDB = require("./config/db");
connectDB();

const app = express(); // Створення екземпляру Express

const PORT = 3000; // Вказуємо порт, на якому буде працювати сервер

app.use(cors()); // Додаємо middleware для обробки CORS

app.use(express.json()); // Додаємо middleware для парсингу JSON-тіла запитів
app.use(express.urlencoded({ extended: true })); // Додаємо middleware для парсингу URL-кодованих даних
app.use(express.static(path.join(__dirname, "..", "Frontend")));
app.use("/api/auth", require("./routes/auth")); // Підключаємо маршрути для аутентифікації

// Запуск серверу
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
