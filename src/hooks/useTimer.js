import { useState, useRef, useCallback } from 'react'

export function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)
  const runningRef = useRef(false)

  const start = useCallback(() => {
    if (runningRef.current) return
    runningRef.current = true
    intervalRef.current = setInterval(() => {
      setElapsed(s => s + 1)
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (!runningRef.current) return
    runningRef.current = false
    clearInterval(intervalRef.current)
  }, [])

  const reset = useCallback(() => {
    stop()
    setElapsed(0)
  }, [stop])

  const formatted = formatTime(elapsed)

  return { elapsed, formatted, start, stop, reset, isRunning: runningRef }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
