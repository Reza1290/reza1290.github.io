import { useEffect, useRef } from 'react'

export default function ParticleField({ count = 80, className = '' }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

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

    const particles = Array.from({ length: count }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      vx:      (Math.random() - 0.5) * 0.3,
      vy:      -0.1 - Math.random() * 0.3,
      size:    0.5 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.5,
      hue:     Math.random() > 0.7 ? 190 : 270, // cyan or violet
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x  += p.vx
        p.y  += p.vy
        p.opacity -= 0.001

        // Respawn
        if (p.y < -10 || p.opacity <= 0) {
          p.x       = Math.random() * canvas.width
          p.y       = canvas.height + 10
          p.opacity = 0.1 + Math.random() * 0.5
          p.vx      = (Math.random() - 0.5) * 0.3
          p.vy      = -0.1 - Math.random() * 0.3
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity})`
        ctx.shadowColor = `hsl(${p.hue}, 80%, 75%)`
        ctx.shadowBlur  = 4
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
