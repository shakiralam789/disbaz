// Global variables
let scene, camera, renderer, giftBox, particles = [];
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBackground3D();
    initGift3D();
    initParticles();
    initCountdown();
    initEmailForm();
    initAnimations();
    initMouseEffects();
    initLottieGift();
});

// Background 3D Scene
function initBackground3D() {
    const canvas = document.getElementById('bg-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create floating geometric shapes
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.ConeGeometry(0.5, 1, 32),
        new THREE.OctahedronGeometry(0.7)
    ];
    
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.1,
        wireframe: true
    });
    
    // Create multiple floating objects
    for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 100;
        mesh.position.y = (Math.random() - 0.5) * 100;
        mesh.position.z = (Math.random() - 0.5) * 100;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.02 + 0.01
        };
        
        scene.add(mesh);
    }
    
    camera.position.z = 50;
    
    // Start animation loop
    animateBackground();
}

// Animate background 3D scene
function animateBackground() {
    requestAnimationFrame(animateBackground);
    
    // Rotate and float objects
    scene.children.forEach(child => {
        if (child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;
            child.rotation.z += child.userData.rotationSpeed.z;
            
            child.position.y += Math.sin(Date.now() * child.userData.floatSpeed) * 0.01;
        }
    });
    
    // Mouse interaction
    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Initialize 3D Gift Box
function initGift3D() {
    const container = document.getElementById('gift-canvas');
    if (!container) return;
    
    const giftScene = new THREE.Scene();
    const giftCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const giftRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    giftRenderer.setSize(200, 200);
    giftRenderer.setClearColor(0x000000, 0);
    container.appendChild(giftRenderer.domElement);
    
    // Create gift box
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    giftBox = new THREE.Mesh(boxGeometry, boxMaterial);
    
    // Create ribbon
    const ribbonGeometry = new THREE.BoxGeometry(2.2, 0.2, 0.2);
    const ribbonMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const ribbon1 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    const ribbon2 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbon2.rotation.y = Math.PI / 2;
    
    // Create bow
    const bowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const bowMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const bow = new THREE.Mesh(bowGeometry, bowMaterial);
    bow.position.y = 1.2;
    bow.scale.set(1.5, 0.5, 1);
    
    // Group everything
    const giftGroup = new THREE.Group();
    giftGroup.add(giftBox);
    giftGroup.add(ribbon1);
    giftGroup.add(ribbon2);
    giftGroup.add(bow);
    giftScene.add(giftGroup);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    giftScene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    giftScene.add(pointLight);
    
    giftCamera.position.z = 5;
    
    // Animate gift box
    function animateGift() {
        requestAnimationFrame(animateGift);
        
        giftGroup.rotation.y += 0.01;
        giftGroup.position.y = Math.sin(Date.now() * 0.002) * 0.2;
        
        giftRenderer.render(giftScene, giftCamera);
    }
    
    animateGift();
}

// Initialize particle system
function initParticles() {
    const particleContainer = document.getElementById('particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Animation
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 10 + 's';
        
        particleContainer.appendChild(particle);
    }
    
    // Add CSS animation for particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize countdown timer
function initCountdown() {
    // Set launch date (30 days from now)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate.getTime() - now;
        
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Animate number changes
        animateNumber('days', days.toString().padStart(2, '0'));
        animateNumber('hours', hours.toString().padStart(2, '0'));
        animateNumber('minutes', minutes.toString().padStart(2, '0'));
        animateNumber('seconds', seconds.toString().padStart(2, '0'));
    }
    
    function animateNumber(id, newValue) {
        const element = document.getElementById(id);
        if (element.textContent !== newValue) {
            element.style.transform = 'scale(1.2)';
            element.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    // Update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize email form
function initEmailForm() {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('formMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        
        submitBtn.querySelector('.btn-text').textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showMessage('Thank you! We\'ll notify you when we launch.', 'success');
            emailInput.value = '';
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;
        
        setTimeout(() => {
            messageDiv.className = 'form-message';
        }, 5000);
    }
}

// Initialize GSAP animations
function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate cards on scroll (exclude footer)
    gsap.utils.toArray('.glass-card:not(.no-animation)').forEach(card => {
        gsap.fromTo(card, 
            {
                y: 50,
                opacity: 0,
                scale: 0.9
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Animate feature cards with stagger
    gsap.fromTo('.feature-card',
        {
            y: 100,
            opacity: 0,
            rotationX: -15
        },
        {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%'
            }
        }
    );
}

// Initialize mouse effects
function initMouseEffects() {
    document.addEventListener('mousemove', function(event) {
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
        
        // Parallax effect for glass cards
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            
            const deltaX = (event.clientX - cardCenterX) / rect.width;
            const deltaY = (event.clientY - cardCenterY) / rect.height;
            
            card.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) translateZ(0)`;
        });
    });
    
    // Reset card transforms when mouse leaves
    document.addEventListener('mouseleave', function() {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
        });
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    if (renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize Lottie Gift Animation
function initLottieGift() {
    const container = document.getElementById('lottie-gift');
    if (container && typeof lottie !== 'undefined') {
        const animation = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: './assets/lottie/wrapped-gift.json',
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid meet',
                clearCanvas: false,
                progressiveLoad: false,
                hideOnTransparent: true
            }
        });
        
        // Ensure transparent background
        animation.addEventListener('DOMLoaded', function() {
            const svgElement = container.querySelector('svg');
            if (svgElement) {
                svgElement.style.background = 'transparent';
                svgElement.style.backgroundColor = 'transparent';
            }
        });
        
        // Optional: Add hover effects
        container.addEventListener('mouseenter', function() {
            animation.setSpeed(1.5);
        });
        
        container.addEventListener('mouseleave', function() {
            animation.setSpeed(1);
        });
    }
}