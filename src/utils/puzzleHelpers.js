import { isSolvable } from './solvability.js'

/** Returns the solved board state: [1, 2, ..., size²-1, 0] */
export function getSolvedBoard(size) {
  const board = []
  for (let i = 1; i < size * size; i++) board.push(i)
  board.push(0)
  return board
}

/** Returns the index of the empty tile (0) */
export function getEmptyIndex(board) {
  return board.indexOf(0)
}

/**
 * Returns an array of indices adjacent (up/down/left/right) to the given index.
 */
export function getAdjacentIndices(index, size) {
  const adjacent = []
  const row = Math.floor(index / size)
  const col = index % size

  if (row > 0) adjacent.push(index - size) // up
  if (row < size - 1) adjacent.push(index + size) // down
  if (col > 0) adjacent.push(index - 1) // left
  if (col < size - 1) adjacent.push(index + 1) // right

  return adjacent
}

/**
 * Returns indices of tiles that can validly move (i.e., adjacent to empty slot).
 */
export function getValidMoveIndices(board, size) {
  const emptyIdx = getEmptyIndex(board)
  return getAdjacentIndices(emptyIdx, size)
}

/**
 * Returns true if the tile at `tileIndex` can move into the empty slot.
 */
export function canMove(board, tileIndex, size) {
  const emptyIdx = getEmptyIndex(board)
  return getAdjacentIndices(emptyIdx, size).includes(tileIndex)
}

/**
 * Swaps the tile at tileIndex with the empty slot.
 * Returns a new board array.
 */
export function applyMove(board, tileIndex) {
  const emptyIdx = getEmptyIndex(board)
  const next = [...board]
  next[emptyIdx] = next[tileIndex]
  next[tileIndex] = 0
  return next
}

/**
 * Generates a random solvable board by shuffling until a solvable
 * configuration is found.
 */
export function generateSolvableBoard(size) {
  const solved = getSolvedBoard(size)
  let board
  do {
    board = shuffleArray([...solved])
  } while (!isSolvable(board, size) || arraysEqual(board, solved))
  return board
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function arraysEqual(a, b) {
  return a.every((v, i) => v === b[i])
}

/** Check if the board matches the solved state */
export function isSolved(board, size) {
  const solved = getSolvedBoard(size)
  return board.every((v, i) => v === solved[i])
}
