import styles from './HUD.module.css'

export default function HUD({ timerFormatted, moves }) {
  return (
    <div className={styles.hud}>
      <div className={styles.stat}>
        <span className={styles.label}>Time</span>
        <span className={styles.value}>{timerFormatted}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Moves</span>
        <span className={styles.value}>{moves}</span>
      </div>
    </div>
  )
}
