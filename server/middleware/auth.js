const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Отримуємо токен із заголовків запиту
  const token = req.header("x-auth-token");

  // 2. Перевіряємо, чи токен взагалі є
  if (!token) {
    return res.status(401).json({ msg: "Токен відсутній, доступ заборонено" });
  }

  // 3. Якщо токен є, пробуємо його розшифрувати...
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Додаємо інформацію про користувача до об'єкта запиту
    next(); // Переходимо до наступного middleware або маршруту
  } catch (err) {
    // 4. Якщо токен недійсний або розшифрування не вдалося, повертаємо помилку
    res.status(401).json({ msg: "Токен недійсний, доступ заборонено" });
  }
};
