// Canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mouse tracking
let mouse = { 
    x: -1000, 
    y: -1000,
    leftDown: false,
    rightDown: false,
    middleDown: false
};

// Global configurations
const CONFIG = {
    PARTICLE_COUNT: Math.floor((window.innerWidth * window.innerHeight) * 0.0025),
    FORCE_RADIUS: 150,
    REPULSION_FORCE: 0.69,
    MIN_SPEED: 0.5,
    MIDDLE_CLICK_COOLDOWN: 500,
    COLOR_MODES: {
        GRADIENT: 'gradient',
        RAINBOW: 'rainbow',
        MONOCHROME: 'monochrome'
    }
};

// Initialize color mode
let currentColorMode = CONFIG.COLOR_MODES.GRADIENT;