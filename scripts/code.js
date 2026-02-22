import { state } from "./state.js";
import { htmlState } from "./html-state.js";
import { modes } from "./constants.js";
import * as func from "./grid-size.js";

htmlState.cellSizeInput.value = state.cellSize;
htmlState.gridWidthInput.value = state.gridWidth;
htmlState.gridHeightInput.value = state.gridHeight;
htmlState.canvas.width = state.gridWidth * state.cellSize;
htmlState.canvas.height = state.gridHeight * state.cellSize;
htmlState.canvas.style.border = "1px solid black";

htmlState.applyGrid.addEventListener("click", () => {
  func.validateCellSize(htmlState.cellSizeInput.value);
  func.validateGridWidth(htmlState.gridWidthInput.value);
  func.validateGridHeight(htmlState.gridHeightInput.value);
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
