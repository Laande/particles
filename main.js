// Initialize particles
let particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => new Particle());

// Buffer for drawing
const particleBuffer = document.createElement('canvas');
particleBuffer.width = canvas.width;
particleBuffer.height = canvas.height;
const bufferCtx = particleBuffer.getContext('2d');
bufferCtx.globalCompositeOperation = 'source-over';

let lastTime = performance.now();
let fps = 0;
const fpsElement = document.getElementById('fpsCounter');
let lastMiddleClickTime = 0;

function animate() {
    // Calculate FPS
    const now = performance.now();
    const deltaTime = now - lastTime;
    lastTime = now;
    fps = Math.floor(1000 / deltaTime);
    fpsElement.textContent = `FPS: ${fps}`;

    // Clear buffer
    bufferCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    bufferCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(p => {
        // Apply mouse forces
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;

        let forceX = 0, forceY = 0;

        // Attract
        if (mouse.rightDown) {
            const dist = Math.sqrt(distSq);
            const force = 1.7 * (CONFIG.FORCE_RADIUS / (dist + 1));
            forceX += (dx / dist) * force;
            forceY += (dy / dist) * force;
        }

        // Repel
        if (mouse.leftDown) {
            const dist = Math.sqrt(distSq);
            const force = 1.7 * (CONFIG.FORCE_RADIUS / (dist + 1));
            forceX -= (dx / dist) * force;
            forceY -= (dy / dist) * force;
        }

        // Move particles in random directions
        if (mouse.middleDown && (now - lastMiddleClickTime) >= CONFIG.MIDDLE_CLICK_COOLDOWN) {
            particles.forEach(p => {
                p.vx += (Math.random() - 0.5) * 8;
                p.vy += (Math.random() - 0.5) * 8;
            });
            lastMiddleClickTime = now;

            // Visual feedback
            document.querySelector('.cursor').style.borderColor = 'cyan';
            setTimeout(() => {
                document.querySelector('.cursor').style.borderColor = 'rgba(255,255,255,0.9)';
            }, 300);
        }

        p.update(forceX, forceY);

        // Draw particle
        bufferCtx.fillStyle = p.getColor();
        bufferCtx.beginPath();
        bufferCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        bufferCtx.fill();
    });

    // Draw buffer to main canvas
    ctx.drawImage(particleBuffer, 0, 0);
    requestAnimationFrame(animate);
}

// Event handlers
function setupEventListeners() {
    // Cursor
    let cursorVisible = false;
    document.addEventListener('mousemove', e => {
        if (!cursorVisible) {
            document.querySelector('.cursor').style.opacity = '1';
            cursorVisible = true;
        }
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        document.querySelector('.cursor').style.transform =
            `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
    });

    // Mouse movement
    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        document.querySelector('.cursor').style.transform =
            `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
    });

    // Mouse buttons
    document.addEventListener('mousedown', e => {
        if (e.button === 0) mouse.leftDown = true;
        if (e.button === 2) mouse.rightDown = true;
        if (e.button === 1) mouse.middleDown = true;
    });

    document.addEventListener('mouseup', e => {
        if (e.button === 0) mouse.leftDown = false;
        if (e.button === 2) mouse.rightDown = false;
        if (e.button === 1) mouse.middleDown = false;
    });

    document.addEventListener('contextmenu', e => e.preventDefault());

    // Window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particleBuffer.width = canvas.width;
        particleBuffer.height = canvas.height;
        particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => new Particle());
    });

    // Spacebar reset
    document.addEventListener('keydown', e => {
        if (e.code === 'Space') {
            particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => new Particle());
            document.querySelector('.cursor').style.borderColor = 'red';
            setTimeout(() => {
                document.querySelector('.cursor').style.borderColor = 'rgba(255,255,255,0.9)';
            }, 300);
        }
    });
}

// Color mode selector
function setupColorSelector() {
    const selector = document.getElementById('colorSelector');
    
    for (let mode in CONFIG.COLOR_MODES) {
        const button = document.createElement('button');
        button.textContent = mode;
        
        button.addEventListener('mousedown', e => {
            e.stopPropagation();
            e.preventDefault();
        });
        
        button.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            currentColorMode = CONFIG.COLOR_MODES[mode];
        });
        
        selector.appendChild(button);
    }
}

function init() {
    setupEventListeners();
    setupColorSelector();
    animate();
}

init();