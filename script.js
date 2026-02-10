// ========================================
// INTERSECTION OBSERVER FOR SCROLL REVEALS
// ========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe text blocks and photos
document.querySelectorAll('.text-block, .photo-float').forEach(el => {
    observer.observe(el);
});

// ========================================
// YES BUTTON INTERACTION
// ========================================

const yesButton = document.getElementById('yesButton');
const responseSection = document.getElementById('response');

yesButton.addEventListener('click', () => {
    // Hide question section
    document.querySelector('.question-section').style.display = 'none';

    // Show response section
    responseSection.classList.add('show');

    // Scroll to response
    responseSection.scrollIntoView({ behavior: 'smooth' });

    // Launch confetti immediately
    setTimeout(() => {
        createEnhancedConfetti();
    }, 100);
});

// ========================================
// NO BUTTON SHRINKING INTERACTION
// ========================================

const noButton = document.getElementById('noButton');
let noButtonScale = 1;

noButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Shrink by 20% each click
    noButtonScale -= 0.2;

    if (noButtonScale <= 0) {
        // Completely disappear with animation
        noButton.style.display = 'none';
    } else {
        // Apply shrinking effect
        noButton.style.transform = `scale(${noButtonScale})`;
        noButton.style.opacity = noButtonScale;
    }
});

// ========================================
// ENHANCED VALENTINE'S CONFETTI ANIMATION
// ========================================

const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d', { alpha: true });

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class ValentineConfetti {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = -50;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.color = this.randomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 8;
        this.type = Math.random();
        this.opacity = 1;
        this.gravity = 0.05;
    }

    randomColor() {
        const colors = [
            '#ff6b9d',
            '#ff9999',
            '#ffb3ba',
            '#ff8787',
            '#ee5a6f',
            '#ffcccb',
            '#ffffff',
            '#ffe0e0'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.speedY += this.gravity;
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // Wave motion
        this.x += Math.sin(this.y / 50) * 0.5;

        // Fade out near bottom
        if (this.y > window.innerHeight - 100) {
            this.opacity = Math.max(0, 1 - (this.y - (window.innerHeight - 100)) / 100);
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        if (this.type < 0.4) {
            // Hearts
            ctx.font = `${this.size * 3}px Arial`;
            ctx.fillStyle = this.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤', 0, 0);
        } else if (this.type < 0.7) {
            // Circles
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Rectangles
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
        }

        ctx.restore();
    }
}

let confettiPieces = [];
let animationFrame;

function createEnhancedConfetti() {
    // Clear any existing pieces
    confettiPieces = [];

    // Create massive burst
    for (let i = 0; i < 150; i++) {
        confettiPieces.push(new ValentineConfetti());
    }

    // Start animation immediately
    if (!animationFrame) {
        animateConfetti();
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Update and draw all pieces
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
        confettiPieces[i].update();
        confettiPieces[i].draw();

        // Remove off-screen pieces
        if (confettiPieces[i].y > window.innerHeight + 50 || confettiPieces[i].opacity <= 0) {
            confettiPieces.splice(i, 1);
        }
    }

    // Continue if pieces remain
    if (confettiPieces.length > 0) {
        animationFrame = requestAnimationFrame(animateConfetti);
    }
}

// ========================================
// IMAGE CLICK TO ENLARGE
// ========================================

const imageModal = document.getElementById('imageModal');
const modalImage = imageModal.querySelector('img');
const photoImages = document.querySelectorAll('.photo-float img');

// Add click event to all photos
photoImages.forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal when clicking on it
imageModal.addEventListener('click', () => {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Prevent image click from closing modal
modalImage.addEventListener('click', (e) => {
    e.stopPropagation();
});

// ========================================
// SMOOTH SCROLL TO TOP ON LOAD
// ========================================

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// ========================================
// EASTER EGG: KONAMI CODE
// ========================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Secret hearts explosion!
        createEnhancedConfetti();
        setTimeout(createEnhancedConfetti, 500);
        setTimeout(createEnhancedConfetti, 1000);
    }
});
