import { useState, useRef, useCallback } from 'react'
import { getValidMoveIndices, applyMove } from '../utils/puzzleHelpers.js'

const SHUFFLE_STEPS = 12
const SHUFFLE_INTERVAL_MS = 60

export function useShuffle({ board, size, applyBoard, resetMoves, resetTimer }) {
  const [isShuffling, setIsShuffling] = useState(false)
  const intervalRef = useRef(null)

  const shuffle = useCallback(() => {
    if (isShuffling) return

    setIsShuffling(true)

    let currentBoard = [...board]
    let lastMoved = -1
    let steps = 0

    intervalRef.current = setInterval(() => {
      const validMoves = getValidMoveIndices(currentBoard, size)
      // Avoid immediately reversing the last move for better visual effect
      const filtered = validMoves.filter(idx => idx !== lastMoved)
      const candidates = filtered.length > 0 ? filtered : validMoves
      const pick = candidates[Math.floor(Math.random() * candidates.length)]
      lastMoved = currentBoard.indexOf(0) // track where empty was (the tile that moved there)
      currentBoard = applyMove(currentBoard, pick)
      applyBoard(currentBoard)
      steps++

      if (steps >= SHUFFLE_STEPS) {
        clearInterval(intervalRef.current)
        setIsShuffling(false)
        resetMoves()
        resetTimer()
      }
    }, SHUFFLE_INTERVAL_MS)
  }, [board, size, applyBoard, resetMoves, resetTimer, isShuffling])

  return { shuffle, isShuffling }
}
