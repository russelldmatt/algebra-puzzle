const symbols = ["😂", "😍", "🤢"];
let symbol_values = [1, 2, 3];
const num_cols = 3;
const num_rows = 3;

let num_partitions = 8;
let step = 2;
let grid = [];
let inputs = [];

function drawBoard(top_left, bottom_right) {
  let [x1, y1] = top_left;
  let [x2, y2] = bottom_right;
  for (i = 0; i <= num_cols; i++) {
    x = x1 + ((x2 - x1) * i * step) / num_partitions;
    line(x, y1, x, y2);
  }
  for (i = 0; i <= num_rows; i++) {
    y = y1 + ((y2 - y1) * i * step) / num_partitions;
    line(x1, y, x2, y);
  }
}

function drawSymbol(canvas, symbol, size, i, j, top_left, bottom_right) {
  let [x1, y1] = top_left;
  let [x2, y2] = bottom_right;
  x = x1 + ((x2 - x1) * (i + 0.5) * step) / num_partitions;
  y = y1 + ((y2 - y1) * (j + 0.5) * step) / num_partitions;
  canvas.textAlign(CENTER, CENTER);
  canvas.textSize(size);
  canvas.text(symbol, x, y);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function computeRowSum(row, symbol_values) {
  let sum = 0;
  for (let i = 0; i < num_cols; i++) {
    sum += symbol_values[grid[i][row]];
  }
  return sum;
}

function computeColSum(col, symbol_values) {
  let sum = 0;
  for (let j = 0; j < num_rows; j++) {
    sum += symbol_values[grid[col][j]];
  }
  return sum;
}

function newGame(canvas, top_left, bottom_right) {
  drawBoard(top_left, bottom_right);
  for (let i = 0; i < num_cols; i++) {
    grid.push([]);
    for (let j = 0; j < num_rows; j++) {
      let symbol_idx = getRandomInt(symbols.length);
      grid[i].push(symbol_idx);
      drawSymbol(canvas, symbols[symbol_idx], 64, i, j, top_left, bottom_right);
    }
  }
  // draw sums
  for (let i = 0; i < num_cols; i++) {
    let sum = computeColSum(i, symbol_values);
    drawSymbol(
      canvas,
      `${sum}`,
      32,
      i,
      num_rows - 0.25,
      top_left,
      bottom_right,
    );
  }
  for (let j = 0; j < num_rows; j++) {
    let sum = computeRowSum(j, symbol_values);
    drawSymbol(
      canvas,
      `${sum}`,
      32,
      num_cols - 0.25,
      j,
      top_left,
      bottom_right,
    );
  }
  // draw guess area
  textAlign(CENTER, CENTER);
  let x = 500;
  let y = 100;
  let size = 32;
  textSize(size);
  for (let symbol of symbols) {
    text(`${symbol} = `, x, y);
    let input = createInput("");
    input.position(x + size + 10, y);
    input.size(50);
    inputs.push(input);
    y += 100;
  }
  return [x, y];
}

function getGuesses() {
  return inputs.map(i => {
    let v = i.value();
    return v ? int(v) : 0;
  });
}

function setup() {
  createCanvas(640, 480);
  let canvas = createGraphics(640, 400);
  var guessCanvas;
  // let guessCanvas = createGraphics(640, 400);

  let top_left = [10, 10];
  let bottom_right = [440, 440];
  let [x, y] = newGame(canvas, top_left, bottom_right);
  let button_background_color = "#990fd2";
  {
    let button = createButton("check answer");
    button.style("background-color", button_background_color);
    button.style("color", "white");
    button.position(x, y);
    button.style("cursor: pointer");
    button.style("border-radius", "5px");
    button.mousePressed(() => {
      if (guessCanvas) {
        guessCanvas.remove();
      }
      guessCanvas = createGraphics(640, 400);
      // guessCanvas.clear();
      // guessCanvas.background(0, 0, 0);
      // guessCanvas.clear();
      let guesses = getGuesses();
      console.log(guesses);
      let draw = (sum, i, j) => {
        drawSymbol(guessCanvas, `${sum}`, 32, i, j, top_left, bottom_right);
      };

      console.log("hi");
      // for (let i = 0; i < num_cols; i++) {
      //   let sum = computeColSum(i, symbol_values);
      //   let guessSum = computeColSum(i, guesses);
      //   guessCanvas.fill(sum === guessSum ? "green" : "red");
      //   draw(guessSum, i, num_rows + 0.25);
      // }
      for (let j = 0; j < num_rows; j++) {
        let sum = computeRowSum(j, symbol_values);
        let guessSum = computeRowSum(j, guesses);
        guessCanvas.fill(sum === guessSum ? "green" : "red");
        draw(guessSum, num_cols + 0.25, j);
      }
      image(guessCanvas, 0, 0);
    });
  }
  y += 30;
  {
    let button = createButton("new game");
    button.style("background-color", button_background_color);
    button.style("color", "white");
    button.position(x, y);
    button.style("cursor: pointer");
    button.style("border-radius", "5px");
    button.mousePressed(() => {
      clear();
      for (let input of inputs) {
        input.remove();
      }
      inputs = [];
      grid = [];
      [x, y] = newGame(canvas, top_left, bottom_right);
      image(canvas, 0, 0);
    });
  }
  image(canvas, 0, 0);
}

function draw() {}
