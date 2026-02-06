/**
 * particles.js — Canvas Starfield / Particle System
 * Creates an animated starfield with connecting lines and mouse interaction.
 * Registers as App.Particles on the global namespace.
 */
(function() {
  'use strict';

  window.App = window.App || {};

  var canvas, ctx;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var animationId;
  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Configuration
  var CONFIG = {
    particleColor: 'rgba(255, 255, 255,',
    lineColor: 'rgba(168, 85, 247,',
    maxParticles: 120,
    mobileParticles: 50,
    connectionDistance: 150,
    mouseRepelDistance: 120,
    mouseRepelForce: 0.03,
    speedRange: 0.3,
    sizeRange: [0.5, 2.5],
    opacityRange: [0.3, 0.8]
  };

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * CONFIG.speedRange * 2;
    this.vy = (Math.random() - 0.5) * CONFIG.speedRange * 2;
    this.radius = Math.random() * (CONFIG.sizeRange[1] - CONFIG.sizeRange[0]) + CONFIG.sizeRange[0];
    this.opacity = Math.random() * (CONFIG.opacityRange[1] - CONFIG.opacityRange[0]) + CONFIG.opacityRange[0];
    // Some particles have accent tint
    this.tint = Math.random() > 0.85;
  };

  function getParticleCount() {
    var area = window.innerWidth * window.innerHeight;
    var count = Math.floor(area / 12000);
    var max = window.innerWidth < 640 ? CONFIG.mobileParticles : CONFIG.maxParticles;
    return Math.min(count, max);
  }

  function initCanvas(canvasId) {
    canvas = document.getElementById(canvasId);
    if (!canvas) return false;

    ctx = canvas.getContext('2d');
    resizeCanvas();
    return true;
  }

  function resizeCanvas() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    var count = getParticleCount();
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function updateParticle(p) {
    // Mouse repulsion
    var dx = p.x - mouse.x;
    var dy = p.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CONFIG.mouseRepelDistance && dist > 0) {
      var force = (CONFIG.mouseRepelDistance - dist) / CONFIG.mouseRepelDistance * CONFIG.mouseRepelForce;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    // Damping
    p.vx *= 0.999;
    p.vy *= 0.999;

    // Update position
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (p.x < -10) p.x = w + 10;
    else if (p.x > w + 10) p.x = -10;
    if (p.y < -10) p.y = h + 10;
    else if (p.y > h + 10) p.y = -10;
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    if (p.tint) {
      ctx.fillStyle = 'rgba(168, 85, 247, ' + p.opacity + ')';
    } else {
      ctx.fillStyle = CONFIG.particleColor + p.opacity + ')';
    }
    ctx.fill();
  }

  function drawConnections() {
    var len = particles.length;
    for (var i = 0; i < len; i++) {
      for (var j = i + 1; j < len; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = dx * dx + dy * dy;
        var maxDist = CONFIG.connectionDistance * CONFIG.connectionDistance;

        if (dist < maxDist) {
          var opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = CONFIG.lineColor + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (document.visibilityState === 'hidden') {
      animationId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      updateParticle(particles[i]);
      drawParticle(particles[i]);
    }

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  function drawStatic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      drawParticle(particles[i]);
    }
    drawConnections();
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function onMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function onResize() {
    resizeCanvas();
    createParticles();
    if (isReducedMotion) {
      drawStatic();
    }
  }

  window.App.Particles = {
    init: function(canvasId) {
      if (!initCanvas(canvasId)) return;

      createParticles();

      if (isReducedMotion) {
        drawStatic();
        return;
      }

      document.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mouseleave', onMouseLeave);
      window.addEventListener('resize', onResize);

      animate();
    },

    destroy: function() {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    }
  };
})();
