# PRD: Sliding Tile Puzzle Game
**Version:** 1.0  
**Platform:** Web (React + Vite) — Standalone page + embeddable widget  
**Deployment:** GitHub Pages  
**Author:** Vidhu  

---

## 1. Overview

A fun, polished sliding tile puzzle game built for Vidhu's portfolio. Players rearrange numbered tiles into correct order using the single empty slot. Two grid modes are available: 3×3 (8-puzzle) and 4×4 (15-puzzle). The game features custom hand-crafted PNG assets, satisfying spring animations, confetti win celebration, and a playful visual style.

---

## 2. Goals

- Demonstrate interactive UI/UX design and frontend engineering skill in a portfolio context.
- Deliver a delightful, snappy play experience with custom assets.
- Be embeddable in the portfolio homepage AND accessible as a standalone page.

---

## 3. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | CSS Modules or Tailwind CSS (Claude Code decides) |
| Animation | Framer Motion (spring physics, tile transitions) |
| Confetti | `canvas-confetti` npm package |
| Sound | Howler.js (for sound effects) |
| State Management | React `useState` / `useReducer` (no external store needed) |
| Deployment | GitHub Pages via `gh-pages` npm package |
| Build | Vite with `base` config set to repo subdirectory |

---

## 4. Game Modes

| Mode | Grid | Tiles | Empty Slots |
|---|---|---|---|
| 3×3 | 3 rows × 3 cols | Numbered 1–8 | 1 |
| 4×4 | 4 rows × 4 cols | Numbered 1–15 | 1 |

The **solved state** is tiles in ascending numerical order (left to right, top to bottom) with the empty slot in the bottom-right corner.

---

## 5. Assets

All assets are provided as PNG files at **2× (retina) resolution**. React should render them at 50% of their pixel dimensions for crisp display on standard screens and perfect quality on HiDPI/retina screens.

### 5.1 Asset Inventory

| Asset | File (suggested name) | Pixel Size | Rendered Size | Notes |
|---|---|---|---|---|
| Outer Frame / Artboard | `frame.png` | 2300×2300px | 1150×1150px | Decorative outer border, sits on top as overlay |
| Base / Board Background | `base.png` | 2040×2040px | 1020×1020px | Background of the puzzle area; visible through empty slot |
| 3×3 Tile (numbered) | `tile-3x3-[N].png` (N = 1–8) | 666×666px | 333×333px | One PNG per number |
| 4×4 Tile (numbered) | `tile-4x4-[N].png` (N = 1–15) | 500×500px | 250×250px | One PNG per number |

### 5.2 Asset Naming Convention

Place all assets in `/public/assets/`:

```
/public/assets/
  frame.png
  base.png
  tiles/
    3x3/
      tile-1.png
      tile-2.png
      ...
      tile-8.png
    4x4/
      tile-1.png
      tile-2.png
      ...
      tile-15.png
```

### 5.3 Layering Order (CSS z-index)

```
z-index 30 → Outer Frame (frame.png) — decorative overlay on top
z-index 20 → Tiles (slide around within the board area)
z-index 10 → Base (base.png) — always visible beneath tiles and empty slot
```

The empty slot is not a separate element — it is simply the absence of a tile, revealing the base layer beneath.

---

## 6. Layout & Composition

### 6.1 Page Layout

```
┌──────────────────────────────────┐
│        Game Title / Logo         │
├──────────────────────────────────┤
│     [3×3]  [4×4]  Mode Toggle    │
├──────────────────────────────────┤
│                                  │
│        ┌─────────────┐           │
│        │  FRAME      │           │
│        │  ┌───────┐  │           │
│        │  │ BASE  │  │           │
│        │  │TILES  │  │           │
│        │  └───────┘  │           │
│        └─────────────┘           │
│                                  │
├──────────────────────────────────┤
│  ⏱ Timer: 00:42   🔢 Moves: 17  │
├──────────────────────────────────┤
│     [Shuffle]    [Solve]         │
└──────────────────────────────────┘
```

- The puzzle board is **centered** on the page.
- The frame PNG overlays the board area with `pointer-events: none` so clicks pass through to tiles.
- Stats bar (timer + move counter) sits below the board.
- Action buttons (Shuffle, New Game) sit below stats.

### 6.2 Responsive

Desktop-first. Minimum supported width: **768px**. The board should scale using CSS `transform: scale()` if the viewport is smaller, preserving aspect ratio.

---

## 7. Core Game Logic

### 7.1 Board Representation

The board state is a flat array of length N² where:
- Values `1` to `N²-1` represent numbered tiles.
- Value `0` represents the empty slot.

Example solved 3×3 state: `[1, 2, 3, 4, 5, 6, 7, 8, 0]`

### 7.2 Valid Moves

A tile can move into the empty slot if and only if it is **directly adjacent** (up, down, left, right — no diagonals) to the empty slot.

### 7.3 Solvability

When shuffling, generate a random permutation and check if it is **solvable** before applying it. Use the standard inversion-count algorithm:
- For 3×3: puzzle is solvable if the number of inversions is even.
- For 4×4: puzzle is solvable if:
  - The blank is on an even row from the bottom AND inversions count is odd, OR
  - The blank is on an odd row from the bottom AND inversions count is even.

Re-shuffle until a solvable configuration is found.

### 7.4 Win Detection

After every move, compare the current board state to the solved state. If they match, trigger the win sequence.

---

## 8. Interactions

### 8.1 Click / Tap to Move
Clicking a tile checks if it is adjacent to the empty slot. If yes, it slides into the slot with a spring animation.

### 8.2 Drag and Drop
Tiles can be dragged toward the empty slot. On release:
- If dragged sufficiently toward the empty slot direction, the tile snaps into the slot with spring animation.
- If released elsewhere, the tile springs back to its original position.
- Use Framer Motion's `drag` with `dragConstraints` and `dragElastic`.

### 8.3 Arrow Key Keyboard Support
Arrow keys move the tile **adjacent to the empty slot in the arrow's direction**:
- `ArrowUp` → moves the tile below the empty slot upward.
- `ArrowDown` → moves the tile above the empty slot downward.
- `ArrowLeft` → moves the tile to the right of the empty slot leftward.
- `ArrowRight` → moves the tile to the left of the empty slot rightward.

The board element should be focusable (`tabIndex={0}`) and respond to `keydown` events.

---

## 9. Animations

### 9.1 Tile Slide (Spring Physics)
Use Framer Motion `animate` with a spring transition:
```js
transition: {
  type: "spring",
  stiffness: 400,
  damping: 30,
}
```
Each tile uses `layout` prop so Framer Motion automatically animates position changes.

### 9.2 Shuffle Animation
On "Shuffle" button press:
1. Play a quick sequence of ~10–15 random valid moves in rapid succession (e.g. 60ms apart).
2. Each move triggers the normal spring tile animation, creating a scrambling effect.
3. Timer and move counter reset to zero after shuffle completes.

### 9.3 Mode Switch Transition
When toggling between 3×3 and 4×4:
1. The board fades out + scales down slightly (`opacity: 0, scale: 0.95`).
2. The new board configuration fades in + scales up (`opacity: 1, scale: 1`).
3. Duration: ~300ms ease-in-out.
4. Timer and move counter reset.

### 9.4 Win Celebration
Triggered immediately when the board reaches the solved state:
1. **Confetti burst** — `canvas-confetti` fires from the top of the screen with a festive multi-color spread.
2. **Victory Modal** — slides up from the bottom or fades in, displaying:
   - "🎉 Puzzle Solved!" heading
   - Time taken
   - Number of moves
   - "Play Again" button (reshuffles the board)
   - "Switch Mode" button
3. **Sound effect** — a short celebratory chime/fanfare via Howler.js.

### 9.5 Tile Move Sound
A subtle soft "click" or "thud" sound plays on each valid tile move. Muted by default with a sound toggle button in the UI.

---

## 10. HUD & Controls

### 10.1 Timer
- Starts on the first move after a shuffle.
- Pauses when the victory modal is open.
- Resets on shuffle or mode switch.
- Format: `MM:SS` (e.g. `01:42`).

### 10.2 Move Counter
- Increments by 1 on each valid tile move.
- Resets on shuffle or mode switch.

### 10.3 Buttons
| Button | Action |
|---|---|
| `Shuffle` | Triggers shuffle animation, resets timer + moves |
| `New Game` | Equivalent to Shuffle |
| `3×3` / `4×4` toggle | Switches mode with transition animation |
| `🔊` / `🔇` | Toggles sound on/off (persisted in localStorage) |

---

## 11. Embeddable Widget

For portfolio embedding, export a `<PuzzleGame />` React component that:
- Accepts optional props: `defaultMode` (`"3x3"` | `"4x4"`), `showModeToggle` (boolean).
- Is self-contained with no external routing dependencies.
- Can be dropped into any React page with `<PuzzleGame />`.

The standalone page (`/`) simply renders `<PuzzleGame />` full-screen.

---

## 12. File Structure

```
/
├── public/
│   └── assets/
│       ├── frame.png
│       ├── base.png
│       └── tiles/
│           ├── 3x3/
│           │   ├── tile-1.png ... tile-8.png
│           └── 4x4/
│               ├── tile-1.png ... tile-15.png
├── src/
│   ├── components/
│   │   ├── Board.jsx         # Main puzzle board with frame + base layers
│   │   ├── Tile.jsx          # Individual tile with Framer Motion drag + spring
│   │   ├── HUD.jsx           # Timer + move counter
│   │   ├── Controls.jsx      # Shuffle, mode toggle, sound buttons
│   │   └── VictoryModal.jsx  # Win celebration modal
│   ├── hooks/
│   │   ├── usePuzzle.js      # Core game logic (state, moves, win detection)
│   │   ├── useTimer.js       # Timer logic
│   │   └── useShuffle.js     # Animated shuffle sequence
│   ├── utils/
│   │   ├── solvability.js    # Inversion-count solvability check
│   │   └── puzzleHelpers.js  # Board generation, adjacency checks
│   ├── sounds/               # Audio files (mp3/ogg)
│   │   ├── move.mp3
│   │   └── win.mp3
│   ├── PuzzleGame.jsx        # Root embeddable component
│   └── main.jsx              # Standalone entry point
├── index.html
├── vite.config.js            # base: '/repo-name/' for GitHub Pages
└── package.json
```

---

## 13. GitHub Pages Deployment

1. Set `base` in `vite.config.js` to the GitHub repo name: `base: '/sliding-puzzle/'` (adjust to actual repo name).
2. Add `"deploy": "gh-pages -d dist"` to `package.json` scripts.
3. Run `npm run build && npm run deploy` to publish.
4. Enable GitHub Pages from the `gh-pages` branch in repo settings.

---

## 14. Out of Scope (v1.0)

- Global leaderboard / backend.
- Mobile responsive layout (future v1.1).
- "Auto-solve" feature.
- Multiplayer.
- Custom image upload to tiles.

---

## 15. Open Questions for Claude Code

1. Confirm the exact repo name for the Vite `base` config.
2. Confirm sound file formats available (mp3 / ogg / wav).
3. If tile PNGs have transparent backgrounds, no additional masking is needed — confirm.
4. Should the frame PNG be a true overlay (CSS `position: absolute` on top) or a CSS `border-image`?
