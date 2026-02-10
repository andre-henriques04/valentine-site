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

    // Launch confetti
    createConfetti();
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
        // Completely disappear
        noButton.style.display = 'none';
    } else {
        // Apply shrinking effect
        noButton.style.transform = `scale(${noButtonScale})`;
        noButton.style.opacity = noButtonScale;
    }
});

// ========================================
// OPTIMIZED CONFETTI ANIMATION
// ========================================

const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d', { alpha: true });

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 6 + 3;
        this.speedY = Math.random() * 4 + 3;
        this.speedX = Math.random() * 2 - 1;
        this.color = this.randomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 8 - 4;
        this.isHeart = Math.random() > 0.6;
    }

    randomColor() {
        const colors = ['#ff6b6b', '#ff9999', '#ffb3ba', '#ff8787', '#ffffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // Gentle wave motion
        this.x += Math.sin(this.y / 40) * 0.4;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        if (this.isHeart) {
            ctx.font = `${this.size * 2.5}px Arial`;
            ctx.fillText('❤️', -this.size, this.size);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
        }

        ctx.restore();
    }
}

let confettiPieces = [];
let animationFrame;

function createConfetti() {
    // Create burst
    for (let i = 0; i < 120; i++) {
        confettiPieces.push(new Confetti());
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw all pieces
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
        confettiPieces[i].update();
        confettiPieces[i].draw();

        // Remove off-screen pieces
        if (confettiPieces[i].y > canvas.height + 50) {
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
    img.addEventListener('click', () => {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

// Close modal when clicking on it
imageModal.addEventListener('click', () => {
    imageModal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
});

// ========================================
// SMOOTH SCROLL TO TOP ON LOAD
// ========================================

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
