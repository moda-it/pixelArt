import { modes } from "./constants.js";
export const state = {
  cellSize: 12,
  gridWidth: 32,
  gridHeight: 32,
  mode: modes.draw,
  selectedColor: "#000000",
};

export const loopState = {
  i: 0,
  maxItems: 14,
};
