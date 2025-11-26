import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 1.5
        });
      }
    };

    // Mouse position con interpolación suave
    let targetMouse = { x: -1000, y: -1000 };
    let smoothMouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      targetMouse.x = -1000;
      targetMouse.y = -1000;
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Interpolación suave del mouse (efecto más lento)
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.08;

      const isDark = document.documentElement.classList.contains('dark');
      const particleColor = isDark ? 'rgba(156, 163, 175, 0.7)' : 'rgba(75, 85, 99, 0.6)';
      const lineColor = isDark ? 'rgba(156, 163, 175, 0.35)' : 'rgba(75, 85, 99, 0.25)';

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Draw connections between particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 2.5 * (1 - distance / 200);
            ctx.stroke();
          }
        }
      });

      // Draw mouse connections - solo con las 5 partículas más cercanas
      if (smoothMouse.x > 0 && smoothMouse.y > 0) {
        const particlesWithDistance = particles.map(p => ({
          particle: p,
          distance: Math.sqrt(
            Math.pow(smoothMouse.x - p.x, 2) + Math.pow(smoothMouse.y - p.y, 2)
          )
        }));

        // Ordenar por distancia y tomar solo las 5 más cercanas dentro del radio
        const nearestParticles = particlesWithDistance
          .filter(p => p.distance < 180)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        nearestParticles.forEach(({ particle, distance }) => {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(smoothMouse.x, smoothMouse.y);
          // Mismo color que las otras líneas
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 2.5 * (1 - distance / 180);
          ctx.stroke();

          // Efecto de atracción muy sutil
          const dx = smoothMouse.x - particle.x;
          const dy = smoothMouse.y - particle.y;
          particle.x += dx * 0.001;
          particle.y += dy * 0.001;
        });
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    createParticles();
    drawParticles();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ zIndex: 0, pointerEvents: 'auto' }}
    />
  );
}

export default ParticlesBackground;
