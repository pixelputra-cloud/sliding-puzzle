import styles from './Controls.module.css'

const SVG_PROPS = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style: { display: 'block' },
}

function ShuffleIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <polyline points="18 2 22 6 18 10" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.5 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.5-.6-3.3-1.7l-.5-.8" />
      <polyline points="18 14 22 18 18 22" />
    </svg>
  )
}

function SoundOnIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

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
        className={`${styles.btn} ${styles.primary} ${styles.iconBtn}`}
        onClick={onShuffle}
        disabled={isShuffling}
        title="Shuffle"
        aria-label="Shuffle"
      >
        <ShuffleIcon />
      </button>

      <button
        className={`${styles.soundBtn} ${styles.iconBtn}`}
        onClick={onToggleSound}
        title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
      >
        {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
      </button>
    </div>
  )
}
