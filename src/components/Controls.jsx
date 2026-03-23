import styles from './Controls.module.css'

export default function Controls({
  mode,
  onShuffle,
  onSwitchMode,
  isShuffling,
  soundEnabled,
  onToggleSound,
  showModeToggle = true,
}) {
  return (
    <div className={styles.controls}>
      {showModeToggle && (
        <div className={styles.modeGroup}>
          <button
            className={`${styles.modeBtn} ${mode === '3x3' ? styles.active : ''}`}
            onClick={() => onSwitchMode('3x3')}
            disabled={isShuffling}
          >
            3 × 3
          </button>
          <button
            className={`${styles.modeBtn} ${mode === '4x4' ? styles.active : ''}`}
            onClick={() => onSwitchMode('4x4')}
            disabled={isShuffling}
          >
            4 × 4
          </button>
        </div>
      )}

      <button
        className={`${styles.btn} ${styles.primary}`}
        onClick={onShuffle}
        disabled={isShuffling}
      >
        {isShuffling ? 'Shuffling…' : 'Shuffle'}
      </button>

      <button
        className={styles.soundBtn}
        onClick={onToggleSound}
        title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  )
}
