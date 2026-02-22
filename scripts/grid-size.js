import { state } from "./state.js";
import { htmlState } from "./html-state.js";

export function validateGridWidth(value) {
  state.gridWidth = +value;
  if (state.gridWidth < 1) {
    state.gridWidth = 1;
    htmlState.gridWidthInput.value = 1;
  }
  htmlState.canvas.width = state.gridWidth * state.cellSize;
  drawGridLine();
}

export function validateGridHeight(value) {
  state.gridHeight = +value;
  if (state.gridHeight < 1) {
    state.gridHeight = 1;
    htmlState.gridHeightInput.value = 1;
  }
  htmlState.canvas.height = state.gridHeight * state.cellSize;
  drawGridLine();
}

export function validateCellSize(value) {
  state.cellSize = +value;
  if (state.cellSize < 2) {
    state.cellSize = 2;
    htmlState.cellSizeInput.value = 2;
  }
  drawGridLine();
}

export function drawGridLine() {
  for (let x = 0; x < htmlState.canvas.width; x += state.cellSize) {
    for (let y = 0; y < htmlState.canvas.height; y += state.cellSize) {
      let row = x / state.cellSize;
      let col = y / state.cellSize;

      if ((row + col) % 2 === 0) {
        htmlState.ctx.fillStyle = "#cecece";
      } else {
        htmlState.ctx.fillStyle = "white";
      }

      htmlState.ctx.fillRect(x, y, state.cellSize, state.cellSize);
    }
  }
}
