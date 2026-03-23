import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Board from './components/Board.jsx'
import HUD from './components/HUD.jsx'
import Controls from './components/Controls.jsx'
import VictoryModal from './components/VictoryModal.jsx'

import { usePuzzle } from './hooks/usePuzzle.js'
import { useTimer } from './hooks/useTimer.js'
import { useShuffle } from './hooks/useShuffle.js'
import { useSound } from './hooks/useSound.js'

import styles from './PuzzleGame.module.css'

/**
 * Root embeddable component.
 * Props:
 *   defaultMode: '3x3' | '4x4'
 *   showModeToggle: boolean
 */
export default function PuzzleGame({ defaultMode = '3x3', showModeToggle = true }) {
  const {
    board, mode, moves, gameState, size,
    moveTile, applyBoard, resetMoves, switchMode,
  } = usePuzzle(defaultMode)

  const timer = useTimer()
  const { soundEnabled, playMove, playWin, toggleSound } = useSound()

  // Track previous mode to trigger board transition animation
  const prevModeRef = useRef(mode)
  const boardKey = mode  // key change triggers AnimatePresence transition

  // Start timer on first move
  const prevMoves = useRef(moves)
  useEffect(() => {
    if (moves > 0 && prevMoves.current === 0) {
      timer.start()
    }
    if (moves > prevMoves.current && moves > 0) {
      playMove()
    }
    prevMoves.current = moves
  }, [moves])

  // Win detection
  useEffect(() => {
    if (gameState === 'won') {
      timer.stop()
      playWin()
    }
  }, [gameState])

  const { shuffle, isShuffling } = useShuffle({
    board,
    size,
    applyBoard,
    resetMoves,
    resetTimer: timer.reset,
  })

  function handleSwitchMode(newMode) {
    if (newMode === mode) return
    prevModeRef.current = mode
    switchMode(newMode)
    timer.reset()
  }

  function handlePlayAgain() {
    shuffle()
  }

  function handleSwitchModeFromModal() {
    const next = mode === '3x3' ? '4x4' : '3x3'
    handleSwitchMode(next)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Sliding Tile Puzzle</h1>

      <div className={styles.hudRow}>
        <HUD timerFormatted={timer.formatted} moves={moves} />
      </div>

      <Controls
        mode={mode}
        onShuffle={shuffle}
        onSwitchMode={handleSwitchMode}
        isShuffling={isShuffling}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        showModeToggle={showModeToggle}
      />

      <div className={styles.boardWrap}>
        <AnimatePresence mode="wait">
          <motion.div
            key={boardKey}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Board
              board={board}
              mode={mode}
              size={size}
              moveTile={moveTile}
              gameState={gameState}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <VictoryModal
        show={gameState === 'won'}
        timerFormatted={timer.formatted}
        moves={moves}
        onPlayAgain={handlePlayAgain}
        onSwitchMode={handleSwitchModeFromModal}
      />
    </div>
  )
}
