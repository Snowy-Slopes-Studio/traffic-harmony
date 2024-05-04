/**
 * Converts a column number to a letter representation.
 * (e.g. 1 -> A, 2 -> B, 27 -> AA, 28 -> AB, etc.)
 * @param {number} column 
 * @returns {string}
 */
function columnToLetters(column) {
	var temp, letter = '';
	while (column > 0) {
		temp = (column - 1) % 26;
		letter = String.fromCharCode(temp + 65) + letter;
		column = (column - temp - 1) / 26;
	}
	return letter;
}

/**
 * 
 * @param {object} coords `{x: number, y: number}`
 * @param {number} scale e.g. 20: 1 cell = 20px
 * @returns
 */
function coordsToPixels(coords, scale) {
    return {
		x: (coords.x + 1) * scale,
		y: (coords.y + 1) * scale
    };
}

/**
 * 
 * @param {object} pixels `{x: number, y: number}`
 * @param {number} scale e.g. 20: 1 cell = 20px
 * @returns 
 */
function pixelsToCoords(pixels, scale) {
	return {
		x: Math.floor(pixels.x / scale)+1,
		y: Math.floor(pixels.y / scale)+1
	};
}

/**
 * 
 * @param {object} cell1 `{x: number, y: number}`
 * @param {object} cell2 `{x: number, y: number}`
 * @returns 
 */
function areAdjacent(cell1, cell2) {
	return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y) === 1;
}

/**
 * 
 * @param {object[]} cells `Array(...{x: number, y: number})`
 * @returns 
 */
function areSuccessivelyAdjacent(cells) {
	for (let i = 1; i < cells.length; i++) {
		if (!areAdjacent(cells[i-1], cells[i])) {
			return false;
		}
	}
	return true;
}

export { columnToLetters, coordsToPixels, pixelsToCoords, areAdjacent, areSuccessivelyAdjacent};