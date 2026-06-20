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
      bg.addColorStop(0,    'rgba(10,5,20,0.95)')
      bg.addColorStop(0.4,  'rgba(5,5,10,0.9)')
      bg.addColorStop(1,    'rgba(5,5,7,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Gravitational lensing glow
      const lens = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200 * intensity)
      lens.addColorStop(0,    'rgba(123, 47, 190, 0.4)')
      lens.addColorStop(0.3,  'rgba(80, 20, 140, 0.15)')
      lens.addColorStop(0.7,  'rgba(0, 212, 255, 0.05)')
      lens.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = lens
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw rings
      rings.forEach((ring, i) => {
        ring.angle += ring.speed
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(ring.angle + t * (i % 2 === 0 ? 0.1 : -0.07))
        ctx.beginPath()
        ctx.ellipse(0, 0, ring.radius, ring.radius * 0.3, 0, 0, Math.PI * 2)
        if (ring.dashed) ctx.setLineDash([4, 8])
        else             ctx.setLineDash([])
        ctx.strokeStyle = `rgba(123, 47, 190, ${ring.opacity * intensity})`
        ctx.lineWidth   = ring.width
        ctx.shadowColor = '#7B2FBE'
        ctx.shadowBlur  = 8
        ctx.stroke()
        ctx.restore()
      })

      // Second set — cyan rings
      rings.forEach((ring, i) => {
        if (i % 3 !== 0) return
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(-ring.angle * 0.7 + t * 0.05)
        ctx.beginPath()
        ctx.ellipse(0, 0, ring.radius * 1.4, ring.radius * 0.18, 0.4, 0, Math.PI * 2)
        ctx.setLineDash([2, 12])
        ctx.strokeStyle = `rgba(0, 212, 255, ${ring.opacity * 0.4 * intensity})`
        ctx.lineWidth   = 0.8
        ctx.shadowColor = '#00D4FF'
        ctx.shadowBlur  = 6
        ctx.stroke()
        ctx.restore()
      })

      // Particles
      particles.forEach(p => {
        p.angle += p.speed
        const px = cx + Math.cos(p.angle) * p.dist
        const py = cy + Math.sin(p.angle) * p.dist * 0.35

        // Fade particles near center
        const distFade = Math.max(0, (p.dist - 40) / 400)
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 180, 255, ${p.opacity * distFade * intensity})`
        ctx.shadowColor = '#A855F7'
        ctx.shadowBlur  = 4
        ctx.fill()
      })

      // Black hole singularity
      const hole = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50)
      hole.addColorStop(0,   'rgba(0,0,0,1)')
      hole.addColorStop(0.6, 'rgba(5,5,10,0.9)')
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
      ctx.strokeStyle = `rgba(167, 139, 250, ${0.9 * intensity})`
      ctx.lineWidth = 2
      ctx.shadowColor = '#A855F7'
      ctx.shadowBlur  = 20
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
