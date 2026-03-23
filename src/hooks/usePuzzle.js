import { useReducer, useCallback } from 'react'
import {
  getSolvedBoard,
  canMove,
  applyMove,
  isSolved,
} from '../utils/puzzleHelpers.js'

function getSize(mode) {
  return mode === '3x3' ? 3 : 4
}

function makeInitialState(mode) {
  const size = getSize(mode)
  return {
    board: getSolvedBoard(size),
    mode,
    moves: 0,
    gameState: 'idle', // 'idle' | 'playing' | 'won'
  }
}

function reducer(state, action) {
  const size = getSize(state.mode)

  switch (action.type) {
    case 'MOVE_TILE': {
      if (state.gameState === 'won') return state
      if (!canMove(state.board, action.index, size)) return state
      const newBoard = applyMove(state.board, action.index)
      const won = isSolved(newBoard, size)
      return {
        ...state,
        board: newBoard,
        moves: state.moves + 1,
        gameState: won ? 'won' : 'playing',
      }
    }

    case 'APPLY_BOARD': {
      // Used by shuffle hook to set board directly (bypassing move count)
      return { ...state, board: action.board }
    }

    case 'RESET': {
      const newSize = getSize(state.mode)
      return {
        ...state,
        board: getSolvedBoard(newSize),
        moves: 0,
        gameState: 'idle',
      }
    }

    case 'RESET_MOVES': {
      return { ...state, moves: 0, gameState: 'idle' }
    }

    case 'SWITCH_MODE': {
      const newSize = getSize(action.mode)
      return {
        board: getSolvedBoard(newSize),
        mode: action.mode,
        moves: 0,
        gameState: 'idle',
      }
    }

    default:
      return state
  }
}

export function usePuzzle(defaultMode = '3x3') {
  const [state, dispatch] = useReducer(reducer, defaultMode, makeInitialState)

  const moveTile = useCallback((index) => {
    dispatch({ type: 'MOVE_TILE', index })
  }, [])

  const applyBoard = useCallback((board) => {
    dispatch({ type: 'APPLY_BOARD', board })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const resetMoves = useCallback(() => {
    dispatch({ type: 'RESET_MOVES' })
  }, [])

  const switchMode = useCallback((mode) => {
    dispatch({ type: 'SWITCH_MODE', mode })
  }, [])

  return {
    board: state.board,
    mode: state.mode,
    moves: state.moves,
    gameState: state.gameState,
    size: getSize(state.mode),
    moveTile,
    applyBoard,
    reset,
    resetMoves,
    switchMode,
  }
}
