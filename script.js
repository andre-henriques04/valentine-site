// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections except the opening (which auto-animates)
document.querySelectorAll('.section:not(.opening)').forEach(section => {
    observer.observe(section);
});

// ========================================
// YES BUTTON INTERACTION
// ========================================

const yesButton = document.getElementById('yesButton');
const responseSection = document.getElementById('response');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

yesButton.addEventListener('click', () => {
    // Hide question section and show response
    yesButton.closest('.section').style.display = 'none';
    responseSection.classList.add('show');

    // Scroll to response
    responseSection.scrollIntoView({ behavior: 'smooth' });

    // Launch confetti
    createConfetti();
});

// ========================================
// CONFETTI ANIMATION
// ========================================

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    getRandomColor() {
        const colors = [
            '#ff6b9d',  // Pink
            '#ffd6d6',  // Light pink
            '#ffb3ba',  // Rose
            '#cc8b86',  // Muted red
            '#ff4757',  // Red
            '#ffffff'   // White
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // Add some wave motion
        this.x += Math.sin(this.y / 30) * 0.5;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        // Draw heart shape
        if (Math.random() > 0.5) {
            ctx.fillStyle = this.color;
            ctx.font = `${this.size * 2}px Arial`;
            ctx.fillText('❤️', -this.size, this.size);
        } else {
            // Draw confetti piece
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
    }
}

let confettiPieces = [];
let animationId;

function createConfetti() {
    // Create initial burst
    for (let i = 0; i < 150; i++) {
        confettiPieces.push(new ConfettiPiece());
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((piece, index) => {
        piece.update();
        piece.draw();

        // Remove pieces that are off screen
        if (piece.y > canvas.height + 20) {
            confettiPieces.splice(index, 1);
        }
    });

    // Continue animation if there are pieces left
    if (confettiPieces.length > 0) {
        animationId = requestAnimationFrame(animateConfetti);
    }
}

// ========================================
// SMOOTH SCROLL BEHAVIOR
// ========================================

// Ensure smooth scrolling on all browsers
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================================
// PERFORMANCE: Lazy load images
// ========================================

if ('loading' in HTMLImageElement.prototype) {
    // Browser supports lazy loading natively
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// PREVENT SCROLL DURING LOAD
// ========================================

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
