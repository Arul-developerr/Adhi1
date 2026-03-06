"use client"

import { useEffect, useRef } from 'react'

export function BackgroundParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        class Particle {
            x: number
            y: number
            size: number
            speedY: number
            speedX: number
            opacity: number

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height + canvas!.height
                this.size = Math.random() * 4 + 1
                this.speedY = Math.random() * -1 - 0.5
                this.speedX = Math.random() * 1 - 0.5
                this.opacity = Math.random() * 0.5 + 0.1
            }

            update() {
                this.y += this.speedY
                this.x += this.speedX
                if (this.y < -10) {
                    this.y = canvas!.height + 10
                    this.x = Math.random() * canvas!.width
                }
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(185, 28, 28, ${this.opacity})` // base blood red
                ctx.fill()
            }
        }

        const init = () => {
            particles = []
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle())
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < particles.length; i++) {
                particles[i].update()
                particles[i].draw()
            }
            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener('resize', resize)
        resize()
        init()
        animate()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-1]"
        />
    )
}
