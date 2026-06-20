/**
 * useSound — Web Audio API synthesizer
 * No external files. All sounds are programmatically generated.
 */
import { useRef, useCallback } from 'react'

function getCtx() {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || window.webkitAudioContext)()
}

export function useDomainSound() {
  const ctxRef = useRef(null)

  const ctx = () => {
    if (!ctxRef.current) ctxRef.current = getCtx()
    return ctxRef.current
  }

  /**
   * playBoot — terminal startup blips
   * Played when the Intro screen mounts
   */
  const playBoot = useCallback(() => {
    const c = ctx()
    if (!c) return
    const t = c.currentTime

    const blips = [0, 0.08, 0.16, 0.28, 0.5]
    blips.forEach((delay, i) => {
      const osc  = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain)
      gain.connect(c.destination)

      osc.type = 'square'
      osc.frequency.setValueAtTime(220 + i * 180, t + delay)
      gain.gain.setValueAtTime(0.05, t + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.06)
      osc.start(t + delay)
      osc.stop(t + delay + 0.08)
    })
  }, [])

  /**
   * playCharge — rising drone as domain charges
   * Called once when the charge bar starts filling
   */
  const playCharge = useCallback(() => {
    const c = ctx()
    if (!c) return
    const t = c.currentTime

    // Bass drone
    const drone  = c.createOscillator()
    const dGain  = c.createGain()
    drone.connect(dGain)
    dGain.connect(c.destination)
    drone.type = 'sawtooth'
    drone.frequency.setValueAtTime(40, t)
    drone.frequency.linearRampToValueAtTime(80, t + 3)
    dGain.gain.setValueAtTime(0.0, t)
    dGain.gain.linearRampToValueAtTime(0.12, t + 0.3)
    dGain.gain.linearRampToValueAtTime(0.08, t + 2.8)
    dGain.gain.linearRampToValueAtTime(0.0, t + 3)
    drone.start(t)
    drone.stop(t + 3.1)

    // Mid rising sine
    const mid  = c.createOscillator()
    const mGain = c.createGain()
    mid.connect(mGain)
    mGain.connect(c.destination)
    mid.type = 'sine'
    mid.frequency.setValueAtTime(110, t)
    mid.frequency.exponentialRampToValueAtTime(880, t + 3)
    mGain.gain.setValueAtTime(0.0, t)
    mGain.gain.linearRampToValueAtTime(0.06, t + 0.5)
    mGain.gain.linearRampToValueAtTime(0.0, t + 3)
    mid.start(t)
    mid.stop(t + 3.1)

    // Static / noise layer
    const bufferSize = c.sampleRate * 3
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
    const data   = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.03

    const noise  = c.createBufferSource()
    const nGain  = c.createGain()
    const filter = c.createBiquadFilter()
    noise.buffer = buffer
    filter.type  = 'bandpass'
    filter.frequency.setValueAtTime(200, t)
    filter.frequency.linearRampToValueAtTime(2000, t + 3)
    filter.Q.value = 0.8
    noise.connect(filter)
    filter.connect(nGain)
    nGain.connect(c.destination)
    nGain.gain.setValueAtTime(0.0, t)
    nGain.gain.linearRampToValueAtTime(0.15, t + 0.5)
    nGain.gain.linearRampToValueAtTime(0.0, t + 3)
    noise.start(t)
    noise.stop(t + 3.1)
  }, [])

  /**
   * playExpand — explosive domain open sound
   * Played when expand transition fires
   */
  const playExpand = useCallback(() => {
    const c = ctx()
    if (!c) return
    const t = c.currentTime

    // Impact thud
    const thud  = c.createOscillator()
    const tGain = c.createGain()
    thud.connect(tGain)
    tGain.connect(c.destination)
    thud.type = 'sine'
    thud.frequency.setValueAtTime(80, t)
    thud.frequency.exponentialRampToValueAtTime(25, t + 0.4)
    tGain.gain.setValueAtTime(0.5, t)
    tGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    thud.start(t)
    thud.stop(t + 0.5)

    // Crack burst of noise
    const bufSize  = c.sampleRate * 0.3
    const buf      = c.createBuffer(1, bufSize, c.sampleRate)
    const bd       = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) bd[i] = (Math.random() * 2 - 1)
    const crack    = c.createBufferSource()
    const cGain    = c.createGain()
    const hpf      = c.createBiquadFilter()
    crack.buffer   = buf
    hpf.type       = 'highpass'
    hpf.frequency.value = 1000
    crack.connect(hpf)
    hpf.connect(cGain)
    cGain.connect(c.destination)
    cGain.gain.setValueAtTime(0.4, t)
    cGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    crack.start(t)
    crack.stop(t + 0.35)

    // Reverb tail — low sine fade
    const tail  = c.createOscillator()
    const taGain = c.createGain()
    tail.connect(taGain)
    taGain.connect(c.destination)
    tail.type = 'sine'
    tail.frequency.setValueAtTime(60, t + 0.1)
    tail.frequency.linearRampToValueAtTime(20, t + 1.2)
    taGain.gain.setValueAtTime(0.2, t + 0.1)
    taGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
    tail.start(t + 0.1)
    tail.stop(t + 1.3)

    // High ping - "seal" confirm
    const ping  = c.createOscillator()
    const pGain = c.createGain()
    ping.connect(pGain)
    pGain.connect(c.destination)
    ping.type = 'sine'
    ping.frequency.setValueAtTime(1400, t + 0.05)
    ping.frequency.exponentialRampToValueAtTime(700, t + 0.5)
    pGain.gain.setValueAtTime(0.12, t + 0.05)
    pGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
    ping.start(t + 0.05)
    ping.stop(t + 0.6)
  }, [])

  /**
   * playTick — single UI tick blip (used on hover/key interactions)
   */
  const playTick = useCallback(() => {
    const c = ctx()
    if (!c) return
    const osc  = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = 'square'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.04, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04)
    osc.start()
    osc.stop(c.currentTime + 0.05)
  }, [])

  return { playBoot, playCharge, playExpand, playTick }
}
