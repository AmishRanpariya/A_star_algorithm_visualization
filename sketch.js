class Spot {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.x = this.i * w + w / 2;
		this.y = this.j * h + h / 2;
		this.neighbors = [];
		this.prev = undefined;
		this.wall = false;
		if (random(1) < ObstacleRate) {
			this.wall = true;
		}
	}
	show(col) {
		noStroke();

		fill(col);
		this.wall && fill(0);
		ellipse(this.x, this.y, w / 2, h / 2);
	}
	addNeighbors(grid) {
		let i = this.i;
		let j = this.j;
		i < cols - 1 && this.neighbors.push(grid[i + 1][j]);
		i > 0 && this.neighbors.push(grid[i - 1][j]);
		j < rows - 1 && this.neighbors.push(grid[i][j + 1]);
		j > 0 && this.neighbors.push(grid[i][j - 1]);
		i > 0 && j > 0 && this.neighbors.push(grid[i - 1][j - 1]);
		i < cols - 1 && j > 0 && this.neighbors.push(grid[i + 1][j - 1]);
		i > 0 && j < rows - 1 && this.neighbors.push(grid[i - 1][j + 1]);
		i < cols - 1 && j < rows - 1 && this.neighbors.push(grid[i + 1][j + 1]);
	}
}

function heuristic(a, b) {
	return dist(a.i, a.j, b.i, b.j);
}

const ObstacleRate = 0.5;
let cols = 55,
	rows = cols;
let grid = new Array(cols);
let openSet = [];
let closedSet = [];
let start, end, current;
let path = [];
let w, h;
let solution = true;

function setup() {
	noSmooth();
	pixelDensity(1);
	createCanvas(min(600, windowWidth), min(600, windowWidth));
	w = width / cols;
	h = height / rows;
	for (let i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Spot(i, j);
		}
	}
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].addNeighbors(grid);
		}
	}
	start = grid[floor(cols / 2)][0];
	end = grid[floor(cols / 2)][rows - 1];
	start.wall = false;
	end.wall = false;

	openSet.push(start);
	strokeCap(ROUND);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].wall && grid[i][j].show(color(0));
		}
	}
}

function draw() {
	// background(0);
	// clear();
	// for (let i = 0; i < cols; i++) {
	// for (let j = 0; j < rows; j++) {
	// grid[i][j].wall && grid[i][j].show(color(0));
	// }
	// }
	if (openSet.length > 0) {
		let winner = 0;
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[winner].f) {
				winner = i;
			}
		}
		current = openSet[winner];
		if (openSet[winner] === end) {
			console.log("DONE!!!!");
			noLoop();
		}
		closedSet.push(current);
		openSet.splice(winner, 1);

		let neighbors = current.neighbors;
		for (let i = 0; i < neighbors.length; i++) {
			let neighbor = neighbors[i];
			if (!closedSet.includes(neighbor) & !neighbor.wall) {
				let tempg = current.g + 1;
				let newPath = false;
				if (openSet.includes(neighbor)) {
					if (tempg < neighbor.g) {
						neighbor.g = tempg;
						newPath = true;
					}
				} else {
					neighbor.g = tempg;
					openSet.push(neighbor);
					newPath = true;
				}
				if (newPath) {
					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.prev = current;
				}
			}
		}
	} else {
		console.log("NO SOLUTION");
		solution = false;
		noLoop();
		//no solution
	}
	// for (let i = 0; i < cols; i++) {
	// 	for (let j = 0; j < rows; j++) {
	// 		grid[i][j].wall && grid[i][j].show(color(0));
	// 	}
	// }
	// for (let i = 0; i < openSet.length; i++) {
	// 	openSet[i].show(color(0, 255, 0));
	// }
	// for (let i = 0; i < closedSet.length; i++) {
	// 	closedSet[i].show(color(255, 0, 0));
	// }
	if (solution) {
		path = [];
		let temp = current;
		path.push(current);
		let i = 0;
		while (temp.prev && i < 1) {
			// while (temp.prev) {
			path.push(temp.prev);
			temp = temp.prev;
			i++;
		}
	}
	// for (let i = 0; i < path.length; i++) {
	// path[i].show(color(0, 0, 255));
	// }
	noFill();
	stroke(255, 0, 255);
	strokeWeight(w / 3);
	beginShape();
	for (let i = 0; i < min(path.length, 2); i++) {
		vertex(path[i].x, path[i].y);
	}
	endShape();
}
