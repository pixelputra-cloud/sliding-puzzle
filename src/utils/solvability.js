/**
 * Count the number of inversions in the board array.
 * An inversion is a pair (i, j) where i < j but board[i] > board[j],
 * ignoring the empty tile (0).
 */
export function countInversions(board) {
  const tiles = board.filter(v => v !== 0)
  let inversions = 0
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inversions++
    }
  }
  return inversions
}

/**
 * Check if a given board configuration is solvable.
 * @param {number[]} board - flat array
 * @param {number} size - grid dimension (3 or 4)
 */
export function isSolvable(board, size) {
  const inversions = countInversions(board)

  if (size % 2 === 1) {
    // Odd grid (3×3): solvable if inversions count is even
    return inversions % 2 === 0
  } else {
    // Even grid (4×4):
    // Find the row of the blank tile from the bottom (1-indexed)
    const emptyIndex = board.indexOf(0)
    const emptyRow = Math.floor(emptyIndex / size)
    const rowFromBottom = size - emptyRow // 1-indexed from bottom

    if (rowFromBottom % 2 === 0) {
      // Blank on even row from bottom → solvable if inversions is odd
      return inversions % 2 === 1
    } else {
      // Blank on odd row from bottom → solvable if inversions is even
      return inversions % 2 === 0
    }
  }
}
