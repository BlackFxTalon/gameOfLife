const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const nextGenBtn = document.getElementById('nextGenBtn');
const resizeBtn = document.getElementById('resizeBtn');
const gridCellBtn = document.getElementById('gridCellBtn');
let resolution = 10; // size of the grid cell
let cols = 60; // Initial number of columns
let rows = 40; // Initial number of rows



// to control speed of the game adjust the frames per second here
let fps = 30; 

function buildGrid() {
  return new Array(cols).fill(null)
    .map(() => new Array(rows).fill(0));
}

function fillRandomCells(grid) {
  return grid.map(col => col.map(() => Math.floor(Math.random() * 2)));
}

let grid = buildGrid();
grid = fillRandomCells(grid);

function update() {
  const next = buildGrid();

  // Logic for updating next generation based on current grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const state = grid[i][j];
      let neighbors = 0;

      // Count live neighbors
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          const col = (i + x + cols) % cols;
          const row = (j + y + rows) % rows;
          neighbors += grid[col][row];
        }
      }
      neighbors -= state;

      // Apply rules of the Game of Life
      if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else if (state === 0 && neighbors === 3) {
        next[i][j] = 1;
      } else {
        next[i][j] = state;
      }
    }
  }
  grid = next;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * resolution;
      const y = j * resolution;

      if (grid[i][j] === 1) {
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, resolution, resolution);
      }
      ctx.strokeRect(x, y, resolution, resolution);
    }
  }
}

function resizeGrid() {
    cols = parseInt(document.getElementById('colsInput').value);
    rows = parseInt(document.getElementById('rowsInput').value);

  canvas.width = cols * resolution;
  canvas.height = rows * resolution;
  
    grid = buildGrid();
    grid = fillRandomCells(grid);
}

resizeBtn.addEventListener('click', resizeGrid);

function resizeGridCell() {
    resolution = parseInt(document.getElementById('gridCell').value);

    grid = buildGrid();
    grid = fillRandomCells(grid);
  }

  gridCellBtn.addEventListener('click', resizeGridCell);


function updateAndDraw() {
  setTimeout(() => {
    const start = performance.now();
    update();
    draw();
    requestAnimationFrame(updateAndDraw);
    const end = performance.now();
   const generationTime = (end - start).toFixed(2);
  document.getElementById('generationTime').innerText =`время генерации нового поколения: ${generationTime} мс`;
  }, 1000 / fps);
}

updateAndDraw();

nextGenBtn.addEventListener('click', updateAndDraw());


