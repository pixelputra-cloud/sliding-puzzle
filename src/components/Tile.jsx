import styles from './Tile.module.css'

export default function Tile({
  value,
  index,
  col,
  row,
  tileSize,
  boardOffset,
  mode,
  emptyCol,
  emptyRow,
  onMove,
}) {
  const x = col * tileSize + boardOffset
  const y = row * tileSize + boardOffset

  const imgSrc = `${import.meta.env.BASE_URL}assets/tiles/${mode}/tile-${value}.png`

  return (
    <div
      className={styles.tile}
      style={{
        width: tileSize,
        height: tileSize,
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1)',
      }}
      onClick={() => onMove(index)}
    >
      <img src={imgSrc} alt={`Tile ${value}`} draggable={false} />
    </div>
  )
}
