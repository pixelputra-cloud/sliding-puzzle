import { useState, useRef, useCallback } from 'react'

const STORAGE_KEY = 'sliding-puzzle-sound'

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

  function getCtx() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  const playMove = useCallback(() => {
    if (!soundEnabled) return
    try {
      const ctx = getCtx()
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
  }, [soundEnabled])

  const playWin = useCallback(() => {
    if (!soundEnabled) return
    try {
      const ctx = getCtx()
      // C major arpeggio: C5, E5, G5, C6
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
      return next
    })
  }, [])

  return { soundEnabled, playMove, playWin, toggleSound }
}
