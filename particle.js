class Particle {
    constructor() {
        this.minSpeed = 0.3 + Math.random() * 0.4;
        this.targetSpeed = 1.0 + Math.random() * 0.5;
        
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = 0;
        this.vy = 0;
        this.hue = Math.random() * 360;
        this.size = Math.max(1.2, Math.min(window.innerWidth, window.innerHeight) * 0.002);
    }

    update(forceX, forceY) {
        // Apply forces
        this.vx += forceX;
        this.vy += forceY;

        // Physics with individual parameters
        const currentSpeed = Math.hypot(this.vx, this.vy);
        const DECELERATION = 0.003;

        // Proportional deceleration
        if (currentSpeed > this.targetSpeed) {
            const speedExcess = currentSpeed - this.targetSpeed;
            const decelFactor = 1 - (DECELERATION * speedExcess);
            this.vx *= decelFactor;
            this.vy *= decelFactor;
        }

        // Maintain minimum speed
        if (currentSpeed < this.minSpeed) {
            if (currentSpeed === 0) {
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * this.minSpeed;
                this.vy = Math.sin(angle) * this.minSpeed;
            } else {
                const ratio = this.minSpeed / currentSpeed;
                this.vx *= ratio;
                this.vy *= ratio;
            }
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Handle wall collisions
        if (this.x < 0) { this.x = 0; this.vx *= -0.95; }
        if (this.x > canvas.width) { this.x = canvas.width; this.vx *= -0.95; }
        if (this.y < 0) { this.y = 0; this.vy *= -0.95; }
        if (this.y > canvas.height) { this.y = canvas.height; this.vy *= -0.95; }
    }

    getColor() {
        const currentSpeed = Math.hypot(this.vx, this.vy);
        
        switch(currentColorMode) {
            case CONFIG.COLOR_MODES.GRADIENT:
                const speedRatio = Math.min(1, currentSpeed / 3);
                const hue = 200 + (360 - 200) * speedRatio;
                return `hsla(${hue}, 85%, 65%, 0.9)`;
            
            case CONFIG.COLOR_MODES.RAINBOW:
                const rainbowHue = (this.hue + currentSpeed * 10) % 360;
                return `hsla(${rainbowHue}, 85%, 65%, 0.9)`;
            
            case CONFIG.COLOR_MODES.MONOCHROME:
                const lightness = 50 + ((currentSpeed / 3) * 30);
                return `hsla(200, 85%, ${lightness}%, 0.9)`;
            
            default:
                return `hsla(${this.hue}, 85%, 65%, 0.9)`;
        }
    }
}