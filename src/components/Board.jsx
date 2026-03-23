import { useCallback } from 'react'
import Tile from './Tile.jsx'
import styles from './Board.module.css'

// Rendered sizes (2× assets at 50%)
const BASE_SIZE = 1020
const FRAME_SIZE = 1150
const TILE_SIZE_3X3 = 333
const TILE_SIZE_4X4 = 250
const FRAME_OFFSET = (FRAME_SIZE - BASE_SIZE) / 2  // 65px

export default function Board({ board, mode, size, moveTile, gameState }) {
  const tileSize = size === 3 ? TILE_SIZE_3X3 : TILE_SIZE_4X4
  const boardPx = size * tileSize
  const boardOffset = (BASE_SIZE - boardPx) / 2

  const emptyIndex = board.indexOf(0)
  const emptyRow = Math.floor(emptyIndex / size)
  const emptyCol = emptyIndex % size

  const handleKeyDown = useCallback((e) => {
    if (gameState === 'won') return
    const keyMap = {
      ArrowUp: emptyIndex + size,
      ArrowDown: emptyIndex - size,
      ArrowLeft: emptyIndex + 1,
      ArrowRight: emptyIndex - 1,
    }
    const targetIndex = keyMap[e.key]
    if (targetIndex === undefined) return
    if (targetIndex < 0 || targetIndex >= board.length) return
    e.preventDefault()
    moveTile(targetIndex)
  }, [board, emptyIndex, size, moveTile, gameState])

  const artboardSrc = `${import.meta.env.BASE_URL}assets/frame.png`
  const baseSrc = `${import.meta.env.BASE_URL}assets/base.png`

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.board}
        style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Sliding puzzle board"
      >
        {/* Artboard — the full board background with decorative border ring.
            Sits at the bottom (z-index 5) so tiles render on top of it. */}
        <img
          src={artboardSrc}
          alt=""
          className={styles.artboard}
          style={{ width: FRAME_SIZE, height: FRAME_SIZE, top: 0, left: 0 }}
        />

        {/* Base — inner board surface visible through empty slot (z-index 10) */}
        <img
          src={baseSrc}
          alt=""
          className={styles.base}
          style={{ width: BASE_SIZE, height: BASE_SIZE, top: FRAME_OFFSET, left: FRAME_OFFSET }}
        />

        {/* Tiles (z-index 20) */}
        <div
          className={styles.tilesContainer}
          style={{
            width: BASE_SIZE,
            height: BASE_SIZE,
            top: FRAME_OFFSET,
            left: FRAME_OFFSET,
          }}
        >
          {board.map((value, index) => {
            if (value === 0) return null
            const row = Math.floor(index / size)
            const col = index % size
            return (
              <Tile
                key={value}
                value={value}
                index={index}
                col={col}
                row={row}
                tileSize={tileSize}
                boardOffset={boardOffset}
                mode={mode}
                emptyCol={emptyCol}
                emptyRow={emptyRow}
                onMove={moveTile}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
