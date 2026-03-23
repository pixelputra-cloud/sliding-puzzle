import { useState, useRef, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'sliding-puzzle-sound'

// A minor pentatonic across two octaves — calm, puzzle-friendly
const NOTES = [110, 130.81, 164.81, 196, 220, 261.63, 329.63, 392, 440]
//             A2    C3     E3     G3   A3   C4     E4    G4   A4

// Slow melodic pattern (indices into NOTES)
const PATTERN = [0, 2, 4, 3, 5, 4, 6, 5, 7, 4, 3, 5, 2, 4, 6, 3, 5, 7, 4, 2]

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored === null ? true : stored === 'true'
    } catch {
      return true
    }
  })

  const audioCtxRef = useRef(null)
  const musicRef = useRef({ playing: false, timeout: null, masterGain: null, step: 0 })

  function getCtx() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  // --- Background music ---

  const startMusic = useCallback((ctx) => {
    if (musicRef.current.playing) return

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5)
    master.connect(ctx.destination)
    musicRef.current.masterGain = master
    musicRef.current.playing = true

    function tick() {
      if (!musicRef.current.playing) return

      const step = musicRef.current.step
      musicRef.current.step = (step + 1) % PATTERN.length
      const freq = NOTES[PATTERN[step]]

      try {
        const osc = ctx.createOscillator()
        const env = ctx.createGain()
        osc.connect(env)
        env.connect(master)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        // Soft attack, hold, gentle release
        env.gain.setValueAtTime(0, ctx.currentTime)
        env.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.5)
        env.gain.setValueAtTime(0.55, ctx.currentTime + 1.4)
        env.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.2)

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 2.2)

        // Occasionally add a soft lower harmonic a fifth below for warmth
        if (step % 4 === 0 && freq > 150) {
          const osc2 = ctx.createOscillator()
          const env2 = ctx.createGain()
          osc2.connect(env2)
          env2.connect(master)
          osc2.type = 'sine'
          osc2.frequency.setValueAtTime(freq * 0.667, ctx.currentTime)
          env2.gain.setValueAtTime(0, ctx.currentTime)
          env2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.6)
          env2.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0)
          osc2.start(ctx.currentTime)
          osc2.stop(ctx.currentTime + 2.0)
        }
      } catch {}

      musicRef.current.timeout = setTimeout(tick, 1600)
    }

    tick()
  }, [])

  const stopMusic = useCallback(() => {
    musicRef.current.playing = false
    clearTimeout(musicRef.current.timeout)
    musicRef.current.timeout = null

    const master = musicRef.current.masterGain
    if (master && audioCtxRef.current) {
      try {
        master.gain.setValueAtTime(master.gain.value, audioCtxRef.current.currentTime)
        master.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.6)
      } catch {}
    }
    musicRef.current.masterGain = null
    musicRef.current.step = 0
  }, [])

  // React to soundEnabled changes after ctx exists
  useEffect(() => {
    if (!audioCtxRef.current) return
    if (soundEnabled) {
      startMusic(audioCtxRef.current)
    } else {
      stopMusic()
    }
  }, [soundEnabled, startMusic, stopMusic])

  // --- SFX ---

  const playMove = useCallback(() => {
    if (!soundEnabled) return
    try {
      const ctx = getCtx()
      // Start music on first interaction if not already playing
      if (!musicRef.current.playing) startMusic(ctx)

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.08)
    } catch {}
  }, [soundEnabled, startMusic])

  const playWin = useCallback(() => {
    if (!soundEnabled) return
    try {
      const ctx = getCtx()
      const notes = [523.25, 659.25, 783.99, 1046.5]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'triangle'
        const start = ctx.currentTime + i * 0.15
        osc.frequency.setValueAtTime(freq, start)
        gain.gain.setValueAtTime(0.2, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25)
        osc.start(start)
        osc.stop(start + 0.25)
      })
    } catch {}
  }, [soundEnabled])

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev
      try { localStorage.setItem(STORAGE_KEY, String(next)) } catch {}

      // If turning on and ctx already exists, start music immediately
      if (next && audioCtxRef.current && !musicRef.current.playing) {
        startMusic(audioCtxRef.current)
      }
      return next
    })
  }, [startMusic])

  return { soundEnabled, playMove, playWin, toggleSound }
}
