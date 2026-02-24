export function rgbToHex(rgb) {
  // Витягуємо тільки числа за допомогою регулярного виразу
  const values = rgb.match(/\d+/g);

  if (!values || values.length < 3) return "#000000";

  const r = parseInt(values[0]);
  const g = parseInt(values[1]);
  const b = parseInt(values[2]);

  // Конвертуємо кожне число в HEX і додаємо "0", якщо число занадто мале
  const toHex = (c) => c.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
