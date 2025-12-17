// 3D Scene Initialization
let scene, camera, renderer, controls;
let cubes = [];
let particles = [];
const cubeCount = 20;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a1120, 1, 1000);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        canvas: document.getElementById('canvas-container')
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create cubes with Google Cloud colors
    const colors = [0x4285F4, 0x34A853, 0xEA4335, 0xFBBC05];
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    for (let i = 0; i < cubeCount; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            metalness: 0.5,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const cube = new THREE.Mesh(geometry, material);
        
        // Random position in a sphere
        const radius = 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        cube.position.x = radius * Math.sin(phi) * Math.cos(theta);
        cube.position.y = radius * Math.sin(phi) * Math.sin(theta);
        cube.position.z = radius * Math.cos(phi);
        
        cube.userData = {
            originalX: cube.position.x,
            originalY: cube.position.y,
            originalZ: cube.position.z,
            speed: Math.random() * 0.02 + 0.01
        };
        
        cubes.push(cube);
        scene.add(cube);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Add particle system
    createParticles();
    
    // Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 50;
    controls.minDistance = 10;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation
    animate();
}

function createParticles() {
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x4285F4,
        size: 0.2,
        transparent: true,
        opacity: 0.5
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particles.push(particleSystem);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Animate cubes
    cubes.forEach((cube, i) => {
        const time = Date.now() * cube.userData.speed;
        
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        
        // Gentle floating motion
        cube.position.x = cube.userData.originalX + Math.sin(time) * 2;
        cube.position.y = cube.userData.originalY + Math.cos(time) * 2;
        
        // Pulsing opacity
        cube.material.opacity = 0.6 + Math.sin(time) * 0.2;
    });
    
    // Rotate particles
    particles.forEach(particle => {
        particle.rotation.y += 0.001;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Typewriter effect
class TypeWriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            setTimeout(() => this.isDeleting = true, 1000);
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }
        
        setTimeout(() => this.type(), this.isDeleting ? this.speed / 2 : this.speed);
    }
}

// Cloud architecture node animation
function initCloudNodes() {
    const nodes = document.querySelectorAll('.cloud-node');
    
    nodes.forEach((node, index) => {
        const radius = 150;
        const angle = (index / nodes.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        node.style.left = `calc(50% + ${x}px)`;
        node.style.top = `calc(50% + ${y}px)`;
        
        // Add click effect
        node.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D scene
    if (document.getElementById('canvas-container')) {
        init();
    }
    
    // Initialize typewriter
    const typewriteElements = document.querySelectorAll('.typewrite');
    typewriteElements.forEach(element => {
        const texts = element.dataset.text.split('|');
        new TypeWriter(element, texts, 100);
    });
    
    // Initialize cloud nodes
    initCloudNodes();
    
    // Add tilt effect to cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2
        });
    }
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content, .solution-card');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    });
});
