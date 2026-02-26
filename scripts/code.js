import { state } from "./state.js";
import { htmlState } from "./html-state.js";
import { modes } from "./constants.js";
import * as func from "./grid-size.js";
import * as rgb from "./colorPick.js";

htmlState.cellSizeInput.value = state.cellSize;
htmlState.gridWidthInput.value = state.gridWidth;
htmlState.gridHeightInput.value = state.gridHeight;
htmlState.canvas.width = state.gridWidth * state.cellSize;
htmlState.canvas.height = state.gridHeight * state.cellSize;
htmlState.canvas.style.border = "1px solid black";

let i = 0;
const MAX_ITEMS = 14;

// 1. ЕТАП: Створюємо порожні об'єкти заздалегідь
for (let j = 0; j < MAX_ITEMS; j++) {
  let emptyBox = document.createElement("div");
  emptyBox.className = `chosedColor ${j}`;

  emptyBox.addEventListener("click", () => {
    // Якщо у квадратика є фоновий колір, копіюємо його в state
    if (emptyBox.style.backgroundColor) {
      state.selectedColor = emptyBox.style.backgroundColor;
      htmlState.colorPicker.value = rgb.rgbToHex(
        emptyBox.style.backgroundColor,
      );
    }
  });

  htmlState.prewContainer.appendChild(emptyBox);
}

// 2. ЕТАП: Оновлюємо колір існуючих об'єктів при кліку
htmlState.buttonSC.addEventListener("click", () => {
  // Отримуємо всі створені раніше елементи
  let existingItems = htmlState.prewContainer.children;

  // Змінюємо колір елемента під поточним індексом i
  if (existingItems[i]) {
    existingItems[i].style.backgroundColor = state.selectedColor;
  }

  // Збільшуємо i та скидаємо на 0, якщо дійшли до ліміту
  i++;
  if (i >= MAX_ITEMS) {
    i = 0;
  }
});

htmlState.applyGrid.addEventListener("click", () => {
  func.validateCellSize(htmlState.cellSizeInput.value);
  func.validateGrid(htmlState.gridWidthInput.value, true, false);
  func.validateGrid(htmlState.gridHeightInput.value, false, true);
});

htmlState.buttonOG.addEventListener("click", () => {
  htmlState.gridSettingsPanel.style.display =
    htmlState.gridSettingsPanel.style.display === "flex" ? "none" : "flex";
});

htmlState.colorPicker.addEventListener("input", (event) => {
  state.selectedColor = event.target.value;
});
function switchIcon() {
  htmlState.iconUse.setAttribute(
    "xlink:href",
    state.mode === modes.draw
      ? "./style/symbol-defs.svg#icon-pencil"
      : "./style/symbol-defs.svg#icon-paint-format",
  );
}
htmlState.modeButton.addEventListener("click", () => {
  state.mode = state.mode === modes.draw ? modes.erase : modes.draw;
  console.log(state.mode);
  switchIcon();
});

htmlState.clearButton.addEventListener("click", () => {
  func.drawGridLine();
});

// 2. Допоміжна функція малювання (теж поза обробником)
function paintCell(col, row) {
  // Малюємо 2x2 клітинки
  for (let dc = 0; dc < htmlState.penSIzeInput.value; dc++) {
    for (let dr = 0; dr < htmlState.penSIzeInput.value; dr++) {
      const currentCol = col + dc;
      const currentRow = row + dr;
      const x = currentCol * state.cellSize;
      const y = currentRow * state.cellSize;

      // Ваша логіка шахматки для гумки
      const eraseColor =
        (currentRow + currentCol) % 2 === 0 ? "#cecece" : "white";

      htmlState.ctx.fillStyle =
        state.mode === "erase" ? eraseColor : state.selectedColor;
      htmlState.ctx.fillRect(x, y, state.cellSize, state.cellSize);
    }
  }
}

// 3. Алгоритм Брезенгема
function drawLine(x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    paintCell(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

// 4. Оновлений обробник mousemove
htmlState.canvas.addEventListener("mousemove", (event) => {
  if (event.buttons !== 1) {
    state.lastCol = null;
    state.lastRow = null;
    return;
  }

  // Рахуємо колонку (X) та рядок (Y)
  const currentCol = Math.floor(event.offsetX / state.cellSize);
  const currentRow = Math.floor(event.offsetY / state.cellSize);

  if (state.lastCol === null || state.lastRow === null) {
    // Якщо це тільки початок натискання
    paintCell(currentCol, currentRow);
  } else {
    // Малюємо лінію від попередньої точки до поточної
    drawLine(state.lastCol, state.lastRow, currentCol, currentRow);
  }

  state.lastCol = currentCol;
  state.lastRow = currentRow;
});

// 5. Важливо: скидаємо позицію при відпусканні або виході миші з канвасу
htmlState.canvas.addEventListener("mousedown", (event) => {
  state.lastCol = Math.floor(event.offsetX / state.cellSize);
  state.lastRow = Math.floor(event.offsetY / state.cellSize);
  paintCell(state.lastCol, state.lastRow);
});

htmlState.canvas.addEventListener("mouseleave", () => {
  state.lastCol = null;
  state.lastRow = null;
});

htmlState.ctx.beginPath();

htmlState.ctx.strokeStyle = "#000000";
htmlState.ctx.stroke();

func.drawGridLine();
