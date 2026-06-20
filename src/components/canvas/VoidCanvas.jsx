import { useEffect, useRef } from 'react'

export default function VoidCanvas({ intensity = 1, className = '' }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const timeRef   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Ring data
    const rings = Array.from({ length: 8 }, (_, i) => ({
      radius:   60 + i * 55,
      speed:    0.003 + i * 0.001 * (i % 2 === 0 ? 1 : -1),
      angle:    Math.random() * Math.PI * 2,
      width:    1.5 - i * 0.1,
      opacity:  0.6 - i * 0.05,
      dashed:   i % 2 === 0,
    }))

    // Particles
    const particles = Array.from({ length: 120 }, () => ({
      angle:  Math.random() * Math.PI * 2,
      dist:   30 + Math.random() * 400,
      speed:  0.001 + Math.random() * 0.003,
      size:   0.5 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.7,
    }))

    const draw = (ts) => {
      timeRef.current = ts * 0.001
      const t = timeRef.current
      const cx = canvas.width  / 2
      const cy = canvas.height / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Deep space radial background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.7)
      bg.addColorStop(0,    'rgba(3, 4, 3, 0.98)')
      bg.addColorStop(0.4,  'rgba(1, 2, 1, 0.95)')
      bg.addColorStop(1,    'rgba(0, 0, 0, 0.9)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Gravitational lensing glow (phosphor terminal glow)
      const lens = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200 * intensity)
      lens.addColorStop(0,    'rgba(34, 197, 94, 0.22)')
      lens.addColorStop(0.3,  'rgba(34, 197, 94, 0.08)')
      lens.addColorStop(0.7,  'rgba(217, 119, 6, 0.03)')
      lens.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = lens
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw rings (phosphor green vector lines)
      rings.forEach((ring, i) => {
        ring.angle += ring.speed
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(ring.angle + t * (i % 2 === 0 ? 0.1 : -0.07))
        ctx.beginPath()
        ctx.ellipse(0, 0, ring.radius, ring.radius * 0.3, 0, 0, Math.PI * 2)
        if (ring.dashed) ctx.setLineDash([6, 10])
        else             ctx.setLineDash([])
        ctx.strokeStyle = `rgba(34, 197, 94, ${ring.opacity * 0.8 * intensity})`
        ctx.lineWidth   = ring.width
        ctx.shadowColor = '#22c55e'
        ctx.shadowBlur  = 6
        ctx.stroke()
        ctx.restore()
      })

      // Second set — amber rings (telemetry lines)
      rings.forEach((ring, i) => {
        if (i % 3 !== 0) return
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(-ring.angle * 0.7 + t * 0.05)
        ctx.beginPath()
        ctx.ellipse(0, 0, ring.radius * 1.4, ring.radius * 0.18, 0.4, 0, Math.PI * 2)
        ctx.setLineDash([2, 16])
        ctx.strokeStyle = `rgba(217, 119, 6, ${ring.opacity * 0.5 * intensity})`
        ctx.lineWidth   = 0.8
        ctx.shadowColor = '#d97706'
        ctx.shadowBlur  = 4
        ctx.stroke()
        ctx.restore()
      })

      // Particles (glowing terminal bits orbiting the gravity well)
      particles.forEach((p, idx) => {
        p.angle += p.speed
        const px = cx + Math.cos(p.angle) * p.dist
        const py = cy + Math.sin(p.angle) * p.dist * 0.35

        // Fade particles near center
        const distFade = Math.max(0, (p.dist - 40) / 400)
        ctx.beginPath()
        ctx.rect(px - p.size/2, py - p.size/2, p.size, p.size)
        const isAmber = idx % 5 === 0
        ctx.fillStyle = isAmber
          ? `rgba(217, 119, 6, ${p.opacity * distFade * intensity})`
          : `rgba(34, 197, 94, ${p.opacity * distFade * intensity})`
        ctx.shadowColor = isAmber ? '#d97706' : '#22c55e'
        ctx.shadowBlur  = 3
        ctx.fill()
      })

      // Black hole singularity
      const hole = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50)
      hole.addColorStop(0,   'rgba(0,0,0,1)')
      hole.addColorStop(0.6, 'rgba(2,4,2,0.95)')
      hole.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = hole
      ctx.beginPath()
      ctx.arc(cx, cy, 50, 0, Math.PI * 2)
      ctx.fill()

      // Inner energy ring on singularity
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.8)
      ctx.beginPath()
      ctx.ellipse(0, 0, 55, 18, 0, 0, Math.PI * 2)
      ctx.setLineDash([])
      ctx.strokeStyle = `rgba(34, 197, 94, ${0.95 * intensity})`
      ctx.lineWidth = 1.5
      ctx.shadowColor = '#22c55e'
      ctx.shadowBlur  = 15
      ctx.stroke()
      ctx.restore()

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`void-canvas ${className}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    />
  )
}
