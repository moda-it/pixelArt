const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route   POST /api/auth/register
// @desc   Реєстрація нового користувача
router.post("/register", async (req, res) => {
  try {
    // Логіка реєстрації користувача
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "Користувач вже існує" });
    }
    user = new User({ username, password });
    await user.save();
    res.status(201).json({ msg: "Користувач успішно зареєстрований" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Помилка сервера");
  }
});

// @route   POST /api/auth/login
// @desc    Аунтентифікація користувача
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Невірні данні" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Невірні дані" });
    const payload = {
      user: {
        id: user.id,
      },
    };
    // Створення токена
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Токен діятиме 1 годину (3600 секунд)
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Відправляємо токен клієнту
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Помилка сервера");
  }
});

// Підключаємо нашого охоронця
const auth = require("../middleware/auth");

// @route   GET api/auth/user
// @desc    Отримати дані користувача по токену
// @access  Private (Захищений)
router.get("/user", auth, async (req, res) => {
  try {
    // Знаходимо користувача за ID, який охоронець поклав у req.user
    // .select('-password') означає "дістати все, крім пароля"
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Помилка сервера");
  }
});

module.exports = router;
