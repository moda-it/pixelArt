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

htmlState.canvas.addEventListener("mousemove", (event) => {
  if (event.buttons !== 1) return;

  const x = Math.floor(event.offsetX / state.cellSize) * state.cellSize;
  const y = Math.floor(event.offsetY / state.cellSize) * state.cellSize;
  let row = x / state.cellSize;
  let col = y / state.cellSize;
  const eraseColor = (row + col) % 2 === 0 ? "#cecece" : "white";
  htmlState.ctx.fillStyle =
    state.mode === "erase" ? eraseColor : state.selectedColor;
  htmlState.ctx.fillRect(x, y, state.cellSize, state.cellSize);
});

htmlState.ctx.beginPath();

htmlState.ctx.strokeStyle = "#000000";
htmlState.ctx.stroke();

func.drawGridLine();
