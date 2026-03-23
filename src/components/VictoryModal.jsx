import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import styles from './VictoryModal.module.css'

function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.3 },
    colors: ['#a78bfa', '#6c63ff', '#f472b6', '#34d399', '#fbbf24'],
  })
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.4 },
    })
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.4 },
    })
  }, 200)
}

export default function VictoryModal({ show, timerFormatted, moves, onPlayAgain, onSwitchMode }) {
  useEffect(() => {
    if (show) fireConfetti()
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            <div className={styles.heading}>Puzzle Solved!</div>
            <div className={styles.sub}>Congratulations</div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Time</span>
                <span className={styles.statValue}>{timerFormatted}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Moves</span>
                <span className={styles.statValue}>{moves}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.playAgain}`} onClick={onPlayAgain}>
                Play Again
              </button>
              <button className={`${styles.btn} ${styles.switchMode}`} onClick={onSwitchMode}>
                Switch Mode
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
