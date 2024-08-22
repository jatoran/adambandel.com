
// Particle System
const particleContainer = document.getElementById('particleContainer');
for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.setProperty('--tx', `${Math.random() * 200 - 100}px`);
    particle.style.setProperty('--ty', `${Math.random() * 200 - 100}px`);
    particle.style.animationDelay = `${Math.random() * 2}s`;
    particleContainer.appendChild(particle);
}

// 3D Carousel
const carousel = document.getElementById('carousel');
for (let i = 0; i < 6; i++) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.textContent = i + 1;
    item.style.transform = `rotateY(${i * 60}deg) translateZ(100px)`;
    carousel.appendChild(item);
}

// Ripple Effect
const rippleContainer = document.getElementById('rippleContainer');
setInterval(() => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    rippleContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 2000);
}, 1000);

// 3D Text Wave
const textWave = document.getElementById('textWave');
const text = 'WAVE';
for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.textContent = text[i];
    span.style.animationDelay = `${i * 0.1}s`;
    textWave.appendChild(span);
}

// Floating Bubbles
const bubblesContainer = document.getElementById('bubblesContainer');
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 30 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${Math.random() * 3 + 2}s`;
    bubblesContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 5000);
}
setInterval(createBubble, 300);

// 3D Folding Card
const foldingCard = document.getElementById('foldingCard');
foldingCard.addEventListener('click', () => {
    foldingCard.classList.toggle('folded');
});


// 3D Möbius Strip
const mobiusContainer = document.getElementById('mobiusContainer');
const mobiusStrip = document.createElement('div');
mobiusStrip.className = 'mobius-strip';

for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.backgroundColor = `hsl(${i * 7.2}, 100%, 50%)`;
    const angle = (i / 50) * Math.PI * 2;
    const x = Math.cos(angle) * 50;
    const y = Math.sin(angle * 2) * 25;
    const z = Math.sin(angle) * 50;
    particle.style.transform = `translate3d(${x + 100}px, ${y + 100}px, ${z}px)`;
    mobiusStrip.appendChild(particle);
}

mobiusContainer.appendChild(mobiusStrip);

// 2D Hand-Drawn Scribble Animation
const svg = document.getElementById('scribbleSvg');
const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
svg.appendChild(path);

let pathData = 'M100,100 ';
const totalPoints = 20;
let currentPoint = 0;

function addPoint() {
    if (currentPoint < totalPoints) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 50 + 25;
        const x = 100 + Math.cos(angle) * radius;
        const y = 100 + Math.sin(angle) * radius;
        pathData += `L${x},${y} `;
        path.setAttribute('d', pathData);
        currentPoint++;
        setTimeout(addPoint, 200);
    } else {
        setTimeout(() => {
            pathData = 'M100,100 ';
            currentPoint = 0;
            addPoint();
        }, 2000);
    }
}

addPoint();

// 3D Rainbow Ripple
const rainbowRippleContainer = document.getElementById('rainbowRippleContainer');

function createRainbowRipple() {
    const ripple = document.createElement('div');
    ripple.className = 'rainbow-ripple';
    rainbowRippleContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 3000);
}

setInterval(createRainbowRipple, 1000);


// 3D Voxel City
const voxelCity = document.querySelector('.voxel-city');

for (let i = 0; i < 30; i++) {
    const voxel = document.createElement('div');
    voxel.className = 'voxel';
    voxel.style.transform = `translate3d(${Math.random() * 180}px, ${Math.random() * 180}px, ${Math.random() * 100}px)`;
    voxelCity.appendChild(voxel);
}
// 3D Escher-Like Structure
const escherStructure = document.querySelector('.escher-structure');

for (let i = 0; i < 6; i++) {
    const shape = document.createElement('div');
    shape.className = 'escher-shape';
    shape.style.transform = `rotateX(${i * 60}deg) rotateY(${i * 60}deg) translateZ(50px)`;
    escherStructure.appendChild(shape);
}
// 3D Kaleidoscope
const kaleidoscope = document.querySelector('.kaleidoscope');

for (let i = 0; i < 6; i++) {
    const segment = document.createElement('div');
    segment.className = 'kaleidoscope-segment';
    segment.style.transform = `rotateZ(${i * 60}deg)`;
    kaleidoscope.appendChild(segment);
}

// Fractal Tree Growth
const fractalTreeCanvas = document.getElementById('fractalTreeCanvas');
const ftCtx = fractalTreeCanvas.getContext('2d');

function resizeFractalTreeCanvas() {
    fractalTreeCanvas.width = fractalTreeCanvas.offsetWidth;
    fractalTreeCanvas.height = fractalTreeCanvas.offsetHeight;
}

resizeFractalTreeCanvas();
window.addEventListener('resize', resizeFractalTreeCanvas);

function drawTree(x, y, len, angle, branchWidth, color1, color2) {
    ftCtx.beginPath();
    ftCtx.save();
    ftCtx.strokeStyle = color1;
    ftCtx.fillStyle = color2;
    ftCtx.lineWidth = branchWidth;
    ftCtx.translate(x, y);
    ftCtx.rotate(angle * Math.PI / 180);
    ftCtx.moveTo(0, 0);
    ftCtx.lineTo(0, -len);
    ftCtx.stroke();

    if (len < 10) {
        ftCtx.beginPath();
        ftCtx.arc(0, -len, 10, 0, Math.PI / 2);
        ftCtx.fill();
        ftCtx.restore();
        return;
    }

    drawTree(0, -len, len * 0.8, angle - 15, branchWidth * 0.8, color1, color2);
    drawTree(0, -len, len * 0.8, angle + 15, branchWidth * 0.8, color1, color2);

    ftCtx.restore();
}

function animateFractalTree() {
    let len = 80;
    let angle = 0;

    function animate() {
        ftCtx.clearRect(0, 0, fractalTreeCanvas.width, fractalTreeCanvas.height);
        len = 80 + Math.sin(Date.now() * 0.001) * 20;
        angle = Math.sin(Date.now() * 0.002) * 5;
        drawTree(fractalTreeCanvas.width / 2, fractalTreeCanvas.height, len, angle, 10, 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.3)');
        requestAnimationFrame(animate);
    }

    animate();
}

animateFractalTree();



// Particle Galaxy
const particleGalaxyCanvas = document.getElementById('particleGalaxyCanvas');
const pgCtx = particleGalaxyCanvas.getContext('2d');

function resizeParticleGalaxyCanvas() {
    particleGalaxyCanvas.width = particleGalaxyCanvas.offsetWidth;
    particleGalaxyCanvas.height = particleGalaxyCanvas.offsetHeight;
}

resizeParticleGalaxyCanvas();
window.addEventListener('resize', resizeParticleGalaxyCanvas);

const galaxyParticles = [];

class Particle {
    constructor() {
        this.x = particleGalaxyCanvas.width / 2;
        this.y = particleGalaxyCanvas.height / 2;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.1) this.size -= 0.01;
    }

    draw() {
        pgCtx.fillStyle = this.color;
        pgCtx.beginPath();
        pgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pgCtx.fill();
    }
}

function createGalaxyParticles() {
    for (let i = 0; i < 100; i++) {
        galaxyParticles.push(new Particle());
    }
}

function animateGalaxyParticles() {
    pgCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    pgCtx.fillRect(0, 0, particleGalaxyCanvas.width, particleGalaxyCanvas.height);

    for (let i = 0; i < galaxyParticles.length; i++) {
        galaxyParticles[i].update();
        galaxyParticles[i].draw();

        if (galaxyParticles[i].size <= 0.1) {
            galaxyParticles.splice(i, 1);
            i--;
        }
    }

    if (galaxyParticles.length < 100) {
        createGalaxyParticles();
    }

    requestAnimationFrame(animateGalaxyParticles);
}

createGalaxyParticles();
animateGalaxyParticles();



// Interactive 3D Terrain Generator
const terrainCanvas = document.getElementById('terrainCanvas');
const terrainCtx = terrainCanvas.getContext('2d');
const roughnessSlider = document.getElementById('terrainRoughness');

let terrainWidth, terrainHeight, terrain;

function resizeTerrainCanvas() {
    terrainCanvas.width = terrainCanvas.offsetWidth;
    terrainCanvas.height = terrainCanvas.offsetHeight;
    terrainWidth = terrainCanvas.width;
    terrainHeight = terrainCanvas.height;
    generateTerrain();
}

resizeTerrainCanvas();
window.addEventListener('resize', resizeTerrainCanvas);

function generateTerrain() {
    terrain = new Array(terrainWidth).fill(null).map(() => new Array(terrainHeight).fill(0));
    const roughness = parseFloat(roughnessSlider.value);
    
    terrain[0][0] = Math.random();
    terrain[0][terrainHeight-1] = Math.random();
    terrain[terrainWidth-1][0] = Math.random();
    terrain[terrainWidth-1][terrainHeight-1] = Math.random();

    divide(0, 0, terrainWidth-1, terrainHeight-1, roughness);
    drawTerrain();
}

function divide(x1, y1, x2, y2, roughness) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    if (dx <= 1 && dy <= 1) return;

    const midX = Math.floor((x1 + x2) / 2);
    const midY = Math.floor((y1 + y2) / 2);

    terrain[midX][y1] = (terrain[x1][y1] + terrain[x2][y1]) / 2 + (Math.random() - 0.5) * roughness * dx;
    terrain[midX][y2] = (terrain[x1][y2] + terrain[x2][y2]) / 2 + (Math.random() - 0.5) * roughness * dx;
    terrain[x1][midY] = (terrain[x1][y1] + terrain[x1][y2]) / 2 + (Math.random() - 0.5) * roughness * dy;
    terrain[x2][midY] = (terrain[x2][y1] + terrain[x2][y2]) / 2 + (Math.random() - 0.5) * roughness * dy;

    terrain[midX][midY] = (terrain[x1][y1] + terrain[x2][y1] + terrain[x1][y2] + terrain[x2][y2]) / 4 + (Math.random() - 0.5) * roughness * Math.sqrt(dx*dx + dy*dy);

    divide(x1, y1, midX, midY, roughness);
    divide(midX, y1, x2, midY, roughness);
    divide(x1, midY, midX, y2, roughness);
    divide(midX, midY, x2, y2, roughness);
}

function drawTerrain() {
    const imageData = terrainCtx.createImageData(terrainWidth, terrainHeight);
    
    for (let x = 0; x < terrainWidth; x++) {
        for (let y = 0; y < terrainHeight; y++) {
            const height = terrain[x][y];
            const index = (y * terrainWidth + x) * 4;
            const color = heightToColor(height);
            imageData.data[index] = color.r;
            imageData.data[index + 1] = color.g;
            imageData.data[index + 2] = color.b;
            imageData.data[index + 3] = 255;
        }
    }

    terrainCtx.putImageData(imageData, 0, 0);
}

function heightToColor(height) {
    if (height < 0.3) return {r: 0, g: 0, b: 255}; // Water
    if (height < 0.5) return {r: 0, g: 255, b: 0}; // Grass
    if (height < 0.7) return {r: 139, g: 69, b: 19}; // Mountains
    return {r: 255, g: 255, b: 255}; // Snow
}

roughnessSlider.addEventListener('input', generateTerrain);
generateTerrain();

// Quantum Particle Entanglement Simulator
const quantumCanvas = document.getElementById('quantumCanvas');
const quantumCtx = quantumCanvas.getContext('2d');
const entangleButton = document.getElementById('entangleButton');

let particles = [];
let entangled = false;

function resizeQuantumCanvas() {
    quantumCanvas.width = quantumCanvas.offsetWidth;
    quantumCanvas.height = quantumCanvas.offsetHeight;
}

resizeQuantumCanvas();
window.addEventListener('resize', resizeQuantumCanvas);

class QuantumParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.spin = Math.random() < 0.5 ? 'up' : 'down';
        this.color = this.spin === 'up' ? '#ff0000' : '#0000ff';
        this.entangled = null;
    }

    draw() {
        quantumCtx.beginPath();
        quantumCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        quantumCtx.fillStyle = this.color;
        quantumCtx.fill();

        if (this.entangled) {
            quantumCtx.beginPath();
            quantumCtx.moveTo(this.x, this.y);
            quantumCtx.lineTo(this.entangled.x, this.entangled.y);
            quantumCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            quantumCtx.stroke();
        }
    }

    measure() {
        if (Math.random() < 0.5) {
            this.flip();
            if (this.entangled) this.entangled.flip();
        }
    }

    flip() {
        this.spin = this.spin === 'up' ? 'down' : 'up';
        this.color = this.spin === 'up' ? '#ff0000' : '#0000ff';
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 10; i++) {
        particles.push(new QuantumParticle(Math.random() * quantumCanvas.width, Math.random() * quantumCanvas.height));
    }
}

function entangleParticles() {
    entangled = true;
    for (let i = 0; i < particles.length; i += 2) {
        particles[i].entangled = particles[i + 1];
        particles[i + 1].entangled = particles[i];
    }
}

function animateQuantumParticles() {
    quantumCtx.clearRect(0, 0, quantumCanvas.width, quantumCanvas.height);
    
    particles.forEach(particle => {
        particle.draw();
        if (entangled && Math.random() < 0.01) {
            particle.measure();
        }
    });

    requestAnimationFrame(animateQuantumParticles);
}

entangleButton.addEventListener('click', () => {
    if (!entangled) {
        entangleParticles();
        entangleButton.textContent = 'Reset';
    } else {
        entangled = false;
        createParticles();
        entangleButton.textContent = 'Entangle Particles';
    }
});

createParticles();
animateQuantumParticles();

// Adaptive Flocking Boids System
const boidsCanvas = document.getElementById('boidsCanvas');
const boidsCtx = boidsCanvas.getContext('2d');
const cohesionSlider = document.getElementById('cohesionForce');
const separationSlider = document.getElementById('separationForce');

let boids = [];

function resizeBoidsCanvas() {
    boidsCanvas.width = boidsCanvas.offsetWidth;
    boidsCanvas.height = boidsCanvas.offsetHeight;
}

resizeBoidsCanvas();
window.addEventListener('resize', resizeBoidsCanvas);

class Boid {
    constructor() {
        this.position = new Vector(Math.random() * boidsCanvas.width, Math.random() * boidsCanvas.height);
        this.velocity = new Vector(Math.random() * 4 - 2, Math.random() * 4 - 2);
        this.acceleration = new Vector(0, 0);
        this.maxForce = 0.2;
        this.maxSpeed = 4;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);

        this.position.x = (this.position.x + boidsCanvas.width) % boidsCanvas.width;
        this.position.y = (this.position.y + boidsCanvas.height) % boidsCanvas.height;
    }

    flock(boids) {
        let separation = this.separate(boids);
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);

        separation.mult(parseFloat(separationSlider.value));
        alignment.mult(0.01);
        cohesion.mult(parseFloat(cohesionSlider.value));

        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    separate(boids) {
        let desiredSeparation = 25;
        let sum = new Vector(0, 0);
        let count = 0;

        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (d > 0 && d < desiredSeparation) {
                let diff = Vector.sub(this.position, other.position);
                diff.normalize();
                diff.div(d);
                sum.add(diff);
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            sum.sub(this.velocity);
            sum.limit(this.maxForce);
        }

        return sum;
    }

    align(boids) {
        let neighborDist = 50;
        let sum = new Vector(0, 0);
        let count = 0;

        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (d > 0 && d < neighborDist) {
                sum.add(other.velocity);
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            let steer = Vector.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }

        return new Vector(0, 0);
    }

    cohesion(boids) {
        let neighborDist = 50;
        let sum = new Vector(0, 0);
        let count = 0;

        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (d > 0 && d < neighborDist) {
                sum.add(other.position);
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);
            return this.seek(sum);
        }

        return new Vector(0, 0);
    }

    seek(target) {
        let desired = Vector.sub(target, this.position);
        desired.normalize();
        desired.mult(this.maxSpeed);
        let steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    draw() {
        boidsCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        boidsCtx.beginPath();
        boidsCtx.moveTo(this.position.x, this.position.y);
        let angle = this.velocity.heading() + Math.PI / 2;
        boidsCtx.lineTo(
            this.position.x - Math.cos(angle) * 8,
            this.position.y - Math.sin(angle) * 8
        );
        boidsCtx.lineTo(
            this.position.x + Math.cos(angle) * 8,
            this.position.y + Math.sin(angle) * 8
        );
        boidsCtx.closePath();
        boidsCtx.fill();
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
    }

    div(n) {
        this.x /= n;
        this.y /= n;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let m = this.mag();
        if (m !== 0) {
            this.div(m);
        }
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    dist(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

function createBoids() {
    boids = [];
    for (let i = 0; i < 150; i++) {
        boids.push(new Boid());
    }
}

function animateBoids() {
    boidsCtx.fillStyle = 'rgba(26, 26, 26, 0.1)';
    boidsCtx.fillRect(0, 0, boidsCanvas.width, boidsCanvas.height);

    for (let boid of boids) {
        boid.flock(boids);
        boid.update();
        boid.draw();
    }

    requestAnimationFrame(animateBoids);
}

createBoids();
animateBoids();

createBoids();
animateBoids();

// Event listeners for sliders
cohesionSlider.addEventListener('input', () => {
    // The effect is applied in real-time in the flock method
});

separationSlider.addEventListener('input', () => {
    // The effect is applied in real-time in the flock method
});

// 4D Hypercube Quantum Projection
const hypercubeCanvas = document.getElementById('hypercubeQuantumCanvas');
const hctx = hypercubeCanvas.getContext('2d');
const rotationSpeedSlider = document.getElementById('rotationSpeed');
const quantumNoiseSlider = document.getElementById('quantumNoise');

let rotationSpeed = parseFloat(rotationSpeedSlider.value);
let quantumNoise = parseFloat(quantumNoiseSlider.value);

function resizeHypercubeCanvas() {
    hypercubeCanvas.width = hypercubeCanvas.offsetWidth;
    hypercubeCanvas.height = hypercubeCanvas.offsetHeight;
}

resizeHypercubeCanvas();
window.addEventListener('resize', resizeHypercubeCanvas);

class Vector4D {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    rotateXY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
    }

    rotateXZ(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.z * sin;
        const z = this.x * sin + this.z * cos;
        this.x = x;
        this.z = z;
    }

    rotateXW(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.w * sin;
        const w = this.x * sin + this.w * cos;
        this.x = x;
        this.w = w;
    }

    project3D(distance) {
        const scale = distance / (distance + this.w);
        return new Vector4D(this.x * scale, this.y * scale, this.z * scale, this.w);
    }
}

class Hypercube {
    constructor() {
        this.vertices = [
            new Vector4D(-1, -1, -1, -1), new Vector4D(1, -1, -1, -1),
            new Vector4D(-1, 1, -1, -1), new Vector4D(1, 1, -1, -1),
            new Vector4D(-1, -1, 1, -1), new Vector4D(1, -1, 1, -1),
            new Vector4D(-1, 1, 1, -1), new Vector4D(1, 1, 1, -1),
            new Vector4D(-1, -1, -1, 1), new Vector4D(1, -1, -1, 1),
            new Vector4D(-1, 1, -1, 1), new Vector4D(1, 1, -1, 1),
            new Vector4D(-1, -1, 1, 1), new Vector4D(1, -1, 1, 1),
            new Vector4D(-1, 1, 1, 1), new Vector4D(1, 1, 1, 1)
        ];

        this.edges = [
            [0, 1], [0, 2], [0, 4], [0, 8],
            [1, 3], [1, 5], [1, 9],
            [2, 3], [2, 6], [2, 10],
            [3, 7], [3, 11],
            [4, 5], [4, 6], [4, 12],
            [5, 7], [5, 13],
            [6, 7], [6, 14],
            [7, 15],
            [8, 9], [8, 10], [8, 12],
            [9, 11], [9, 13],
            [10, 11], [10, 14],
            [11, 15],
            [12, 13], [12, 14],
            [13, 15],
            [14, 15]
        ];
    }

    rotate(angleXY, angleXZ, angleXW) {
        for (let vertex of this.vertices) {
            vertex.rotateXY(angleXY);
            vertex.rotateXZ(angleXZ);
            vertex.rotateXW(angleXW);
        }
    }

    draw(ctx, width, height) {
        const projectedVertices = this.vertices.map(v => v.project3D(5));
        
        for (let edge of this.edges) {
            const v1 = projectedVertices[edge[0]];
            const v2 = projectedVertices[edge[1]];
            
            const x1 = v1.x * width / 4 + width / 2;
            const y1 = v1.y * height / 4 + height / 2;
            const x2 = v2.x * width / 4 + width / 2;
            const y2 = v2.y * height / 4 + height / 2;

            const hue = (v1.w + v2.w + 2) * 90;
            ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
}

const hypercube = new Hypercube();

function quantumFluctuation(amplitude) {
    return (Math.random() - 0.5) * amplitude;
}

function animateHypercube() {
    hctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    hctx.fillRect(0, 0, hypercubeCanvas.width, hypercubeCanvas.height);

    const angleXY = performance.now() * 0.001 * rotationSpeed + quantumFluctuation(quantumNoise);
    const angleXZ = performance.now() * 0.00063 * rotationSpeed + quantumFluctuation(quantumNoise);
    const angleXW = performance.now() * 0.00037 * rotationSpeed + quantumFluctuation(quantumNoise);

    hypercube.rotate(angleXY, angleXZ, angleXW);
    hypercube.draw(hctx, hypercubeCanvas.width, hypercubeCanvas.height);

    requestAnimationFrame(animateHypercube);
}

animateHypercube();

rotationSpeedSlider.addEventListener('input', () => {
    rotationSpeed = parseFloat(rotationSpeedSlider.value);
});

quantumNoiseSlider.addEventListener('input', () => {
    quantumNoise = parseFloat(quantumNoiseSlider.value);
});














// Optimized 5D Fractal Multiverse Explorer
const multiverseCanvas = document.getElementById('multiverseCanvas');
const mctx = multiverseCanvas.getContext('2d');
const dimensionSlider = document.getElementById('dimensionSlider');
const entanglementStrength = document.getElementById('entanglementStrength');
const jumpButton = document.getElementById('jumpUniverse');

let currentDimension = 3;
let entanglement = 0.5;
let universeSignature = Math.random();
let isRendering = false;

function resizeMultiverseCanvas() {
    multiverseCanvas.width = multiverseCanvas.offsetWidth;
    multiverseCanvas.height = multiverseCanvas.offsetHeight;
    if (!isRendering) {
        requestAnimationFrame(renderMultiverse);
    }
}

resizeMultiverseCanvas();
window.addEventListener('resize', resizeMultiverseCanvas);

// Create a web worker for off-main thread computation
const worker = new Worker(URL.createObjectURL(new Blob([`
    function mandelbrot5D(x, y, z, w, v, maxIterations) {
        let zr = x, zi = y, zj = z, zk = w, zl = v;
        for (let i = 0; i < maxIterations; i++) {
            const r2 = zr*zr + zi*zi + zj*zj + zk*zk + zl*zl;
            if (r2 > 4) return i;
            const newZr = zr*zr - zi*zi - zj*zj - zk*zk - zl*zl + x;
            zi = 2*zr*zi + y;
            zj = 2*zr*zj + z;
            zk = 2*zr*zk + w;
            zl = 2*zr*zl + v;
            zr = newZr;
        }
        return maxIterations;
    }

    self.onmessage = function(e) {
        const { width, height, dimension, entanglement, universeSignature } = e.data;
        const imageData = new Uint8ClampedArray(width * height * 4);

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const nx = (x / width) * 4 - 2;
                const ny = (y / height) * 4 - 2;
                
                const nz = Math.sin(nx * ny * universeSignature) * (dimension - 3);
                const nw = Math.cos(nx + ny * universeSignature) * (dimension - 3);
                const nv = Math.tan(nx * universeSignature - ny) * (dimension - 3);

                const value = mandelbrot5D(nx, ny, nz, nw, nv, 50) / 50;

                const index = (y * width + x) * 4;
                const brightness = Math.floor(value * 255);
                imageData[index] = brightness;
                imageData[index + 1] = brightness;
                imageData[index + 2] = brightness;
                imageData[index + 3] = 255;
            }
        }

        self.postMessage({ imageData }, [imageData.buffer]);
    };
`], {type: 'application/javascript'})));

worker.onmessage = function(e) {
    const imageData = new ImageData(new Uint8ClampedArray(e.data.imageData), multiverseCanvas.width, multiverseCanvas.height);
    mctx.putImageData(imageData, 0, 0);
    isRendering = false;
};

function renderMultiverse() {
    if (isRendering) return;
    isRendering = true;

    const width = Math.min(multiverseCanvas.width, 300);  // Limit resolution for performance
    const height = Math.min(multiverseCanvas.height, 300);

    worker.postMessage({
        width,
        height,
        dimension: currentDimension,
        entanglement,
        universeSignature
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedRender = debounce(renderMultiverse, 250);

dimensionSlider.addEventListener('input', () => {
    currentDimension = parseFloat(dimensionSlider.value);
    debouncedRender();
});

entanglementStrength.addEventListener('input', () => {
    entanglement = parseFloat(entanglementStrength.value);
    debouncedRender();
});

jumpButton.addEventListener('click', () => {
    universeSignature = Math.random();
    renderMultiverse();
});

renderMultiverse();



// Synesthetic Reality Weaver: A Multisensory Quantum Consciousness Simulator
const synesCanvas = document.getElementById('synestheticCanvas');
const synesCtx = synesCanvas.getContext('2d');
const synesAudioViz = document.getElementById('audioVisualizer');
const synesThoughtStream = document.getElementById('thoughtStream');
const synesConsciousnessSlider = document.getElementById('consciousnessLevel');
const synesQuantumSlider = document.getElementById('quantumInfluence');
const synesEvolveButton = document.getElementById('evolveConsciousness');

let synesConsciousnessLevel = 0.5;
let synesQuantumInfluence = 0.3;
let synesNeuralWeb = [];
let synesThoughtLog = [];
let synesAudioCtx, synesAnalyser, synesAudioData;

function synesInitAudio() {
    synesAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    synesAnalyser = synesAudioCtx.createAnalyser();
    const synesOscillator = synesAudioCtx.createOscillator();
    synesOscillator.connect(synesAnalyser);
    synesAnalyser.connect(synesAudioCtx.destination);
    synesOscillator.start();
    synesAudioData = new Uint8Array(synesAnalyser.frequencyBinCount);
}

function synesResizeCanvas() {
    synesCanvas.width = synesCanvas.offsetWidth;
    synesCanvas.height = synesCanvas.offsetHeight;
}

synesResizeCanvas();
window.addEventListener('resize', synesResizeCanvas);
synesInitAudio();

class SynesNeuralNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.synapses = [];
        this.excitationLevel = Math.random();
        this.threshold = Math.random() * 2 - 1;
        this.perceptualHue = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    stimulate(input) {
        this.excitationLevel = 1 / (1 + Math.exp(-(input + this.threshold)));
        return this.excitationLevel;
    }
}

function synesCreateNeuralWeb() {
    const nodeCount = Math.floor(50 + synesConsciousnessLevel * 50);
    synesNeuralWeb = [];
    for (let i = 0; i < nodeCount; i++) {
        synesNeuralWeb.push(new SynesNeuralNode(Math.random() * synesCanvas.width, Math.random() * synesCanvas.height));
    }
    // Create synapses
    for (let i = 0; i < nodeCount; i++) {
        const synapseCount = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < synapseCount; j++) {
            const target = Math.floor(Math.random() * nodeCount);
            if (target !== i) {
                synesNeuralWeb[i].synapses.push(target);
            }
        }
    }
}

function synesQuantumFlux() {
    return (Math.random() - 0.5) * 2 * synesQuantumInfluence;
}

function synesStimulateWeb() {
    synesAnalyser.getByteFrequencyData(synesAudioData);
    const audioStimulus = synesAudioData.reduce((a, b) => a + b) / synesAudioData.length / 255;

    for (let i = 0; i < synesNeuralWeb.length; i++) {
        let totalStimulus = audioStimulus + synesQuantumFlux();
        for (let j = 0; j < synesNeuralWeb[i].synapses.length; j++) {
            totalStimulus += synesNeuralWeb[synesNeuralWeb[i].synapses[j]].excitationLevel;
        }
        synesNeuralWeb[i].stimulate(totalStimulus);
    }
}

function synesRenderWeb() {
    synesCtx.clearRect(0, 0, synesCanvas.width, synesCanvas.height);
    
    // Render synapses
    for (let i = 0; i < synesNeuralWeb.length; i++) {
        for (let j = 0; j < synesNeuralWeb[i].synapses.length; j++) {
            const target = synesNeuralWeb[synesNeuralWeb[i].synapses[j]];
            synesCtx.beginPath();
            synesCtx.moveTo(synesNeuralWeb[i].x, synesNeuralWeb[i].y);
            synesCtx.lineTo(target.x, target.y);
            synesCtx.strokeStyle = `rgba(255, 255, 255, ${synesNeuralWeb[i].excitationLevel})`;
            synesCtx.stroke();
        }
    }

    // Render nodes
    for (let i = 0; i < synesNeuralWeb.length; i++) {
        synesCtx.beginPath();
        synesCtx.arc(synesNeuralWeb[i].x, synesNeuralWeb[i].y, 5, 0, Math.PI * 2);
        synesCtx.fillStyle = synesNeuralWeb[i].perceptualHue;
        synesCtx.globalAlpha = synesNeuralWeb[i].excitationLevel;
        synesCtx.fill();
        synesCtx.globalAlpha = 1;
    }
}

function synesUpdateAudioViz() {
    const vizWidth = synesAudioViz.offsetWidth;
    const vizHeight = synesAudioViz.offsetHeight;
    const barWidth = vizWidth / synesAudioData.length;

    const vizCanvas = document.createElement('canvas');
    vizCanvas.width = vizWidth;
    vizCanvas.height = vizHeight;
    const vizCtx = vizCanvas.getContext('2d');

    for (let i = 0; i < synesAudioData.length; i++) {
        const barHeight = (synesAudioData[i] / 255) * vizHeight;
        vizCtx.fillStyle = `hsl(${i / synesAudioData.length * 360}, 100%, 50%)`;
        vizCtx.fillRect(i * barWidth, vizHeight - barHeight, barWidth, barHeight);
    }

    synesAudioViz.style.backgroundImage = `url(${vizCanvas.toDataURL()})`;
}

function synesGenerateThought() {
    const concepts = ['perception', 'qualia', 'emergence', 'entanglement', 'cognition', 'wavelength', 'resonance', 'entropy', 'qubit', 'superposition'];
    const actions = ['interweaves', 'oscillates with', 'collapses into', 'expands through', 'integrates', 'decoheres from', 'entangles with', 'transmutes into', 'converges with', 'diverges from'];
    
    const subject = concepts[Math.floor(Math.random() * concepts.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const object = concepts[Math.floor(Math.random() * concepts.length)];

    return `${subject} ${action} ${object}`;
}

function synesUpdateThoughtStream() {
    const newThought = synesGenerateThought();
    synesThoughtLog.unshift(newThought);
    if (synesThoughtLog.length > 5) synesThoughtLog.pop();

    synesThoughtStream.innerHTML = synesThoughtLog.join('<br>');
}

function synesAnimate() {
    synesStimulateWeb();
    synesRenderWeb();
    synesUpdateAudioViz();
    if (Math.random() < synesConsciousnessLevel * 0.1) synesUpdateThoughtStream();
    requestAnimationFrame(synesAnimate);
}

synesCreateNeuralWeb();
synesAnimate();

synesConsciousnessSlider.addEventListener('input', () => {
    synesConsciousnessLevel = parseFloat(synesConsciousnessSlider.value);
    synesCreateNeuralWeb();
});

synesQuantumSlider.addEventListener('input', () => {
    synesQuantumInfluence = parseFloat(synesQuantumSlider.value);
});

synesEvolveButton.addEventListener('click', () => {
    synesConsciousnessLevel = Math.min(synesConsciousnessLevel + 0.1, 1);
    synesConsciousnessSlider.value = synesConsciousnessLevel;
    synesCreateNeuralWeb();
});





// Quantum Fractal Harmonizer - Hyperdimensional Qubit Oscillation Variant X9Z7Y2
const qfhx9z7y2Canvas = document.getElementById('quantumFractalCanvas');
const qfhx9z7y2Ctx = qfhx9z7y2Canvas.getContext('2d');
const qfhx9z7y2InfluenceSlider = document.getElementById('quantumInfluence');
const qfhx9z7y2ComplexitySlider = document.getElementById('fractalComplexity');
const qfhx9z7y2HarmonizeButton = document.getElementById('harmonizeButton');

let qfhx9z7y2QuantumInfluence = 0.5;
let qfhx9z7y2FractalComplexity = 5;
let qfhx9z7y2Harmonized = false;

function qfhx9z7y2ResizeCanvas() {
    qfhx9z7y2Canvas.width = qfhx9z7y2Canvas.offsetWidth;
    qfhx9z7y2Canvas.height = qfhx9z7y2Canvas.offsetHeight;
}

qfhx9z7y2ResizeCanvas();
window.addEventListener('resize', qfhx9z7y2ResizeCanvas);

class Qfhx9z7y2QuantumParticle {
    constructor() {
        this.x = Math.random() * qfhx9z7y2Canvas.width;
        this.y = Math.random() * qfhx9z7y2Canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.entangled = null;
    }

    qfhx9z7y2Update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > qfhx9z7y2Canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > qfhx9z7y2Canvas.height) this.vy *= -1;

        if (this.entangled) {
            const dx = this.entangled.x - this.x;
            const dy = this.entangled.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.vx += dx / distance * qfhx9z7y2QuantumInfluence;
            this.vy += dy / distance * qfhx9z7y2QuantumInfluence;
        }

        this.vx += (Math.random() - 0.5) * qfhx9z7y2QuantumInfluence;
        this.vy += (Math.random() - 0.5) * qfhx9z7y2QuantumInfluence;
    }

    qfhx9z7y2Draw() {
        qfhx9z7y2Ctx.beginPath();
        qfhx9z7y2Ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        qfhx9z7y2Ctx.fillStyle = this.color;
        qfhx9z7y2Ctx.fill();

        if (this.entangled) {
            qfhx9z7y2Ctx.beginPath();
            qfhx9z7y2Ctx.moveTo(this.x, this.y);
            qfhx9z7y2Ctx.lineTo(this.entangled.x, this.entangled.y);
            qfhx9z7y2Ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            qfhx9z7y2Ctx.stroke();
        }
    }
}

class Qfhx9z7y2FractalSystem {
    constructor() {
        this.points = [];
        this.qfhx9z7y2Generate();
    }

    qfhx9z7y2Generate() {
        this.points = [];
        this.qfhx9z7y2RecursiveFractal(qfhx9z7y2Canvas.width / 2, qfhx9z7y2Canvas.height / 2, 0, 0, qfhx9z7y2FractalComplexity);
    }

    qfhx9z7y2RecursiveFractal(x, y, angle, depth, maxDepth) {
        if (depth >= maxDepth) return;

        const length = qfhx9z7y2Canvas.width / (depth + 5);
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;

        this.points.push({ x, y, endX, endY });

        const newDepth = depth + 1;
        const angleChange = Math.PI / 4 + (Math.random() - 0.5) * qfhx9z7y2QuantumInfluence;

        this.qfhx9z7y2RecursiveFractal(endX, endY, angle - angleChange, newDepth, maxDepth);
        this.qfhx9z7y2RecursiveFractal(endX, endY, angle + angleChange, newDepth, maxDepth);
    }

    qfhx9z7y2Draw() {
        qfhx9z7y2Ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        qfhx9z7y2Ctx.lineWidth = 1;

        this.points.forEach(point => {
            qfhx9z7y2Ctx.beginPath();
            qfhx9z7y2Ctx.moveTo(point.x, point.y);
            qfhx9z7y2Ctx.lineTo(point.endX, point.endY);
            qfhx9z7y2Ctx.stroke();
        });
    }
}

const qfhx9z7y2Particles = [];
let qfhx9z7y2FractalSystem;

function qfhx9z7y2InitHarmonizer() {
    qfhx9z7y2Particles.length = 0;
    for (let i = 0; i < 100; i++) {
        qfhx9z7y2Particles.push(new Qfhx9z7y2QuantumParticle());
    }

    // Entangle pairs of particles
    for (let i = 0; i < qfhx9z7y2Particles.length; i += 2) {
        qfhx9z7y2Particles[i].entangled = qfhx9z7y2Particles[i + 1];
        qfhx9z7y2Particles[i + 1].entangled = qfhx9z7y2Particles[i];
    }

    qfhx9z7y2FractalSystem = new Qfhx9z7y2FractalSystem();
}

function qfhx9z7y2AnimateHarmonizer() {
    qfhx9z7y2Ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    qfhx9z7y2Ctx.fillRect(0, 0, qfhx9z7y2Canvas.width, qfhx9z7y2Canvas.height);

    qfhx9z7y2FractalSystem.qfhx9z7y2Draw();

    qfhx9z7y2Particles.forEach(particle => {
        particle.qfhx9z7y2Update();
        particle.qfhx9z7y2Draw();
    });

    if (qfhx9z7y2Harmonized) {
        qfhx9z7y2DrawHarmonizedWave();
    }

    requestAnimationFrame(qfhx9z7y2AnimateHarmonizer);
}

function qfhx9z7y2DrawHarmonizedWave() {
    qfhx9z7y2Ctx.beginPath();
    qfhx9z7y2Ctx.moveTo(0, qfhx9z7y2Canvas.height / 2);

    for (let x = 0; x < qfhx9z7y2Canvas.width; x++) {
        const y = qfhx9z7y2Canvas.height / 2 +
            Math.sin(x * 0.02 + performance.now() * 0.002) * 50 +
            Math.sin(x * 0.01 - performance.now() * 0.001) * 30;
        qfhx9z7y2Ctx.lineTo(x, y);
    }

    qfhx9z7y2Ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    qfhx9z7y2Ctx.lineWidth = 2;
    qfhx9z7y2Ctx.stroke();
}

qfhx9z7y2InfluenceSlider.addEventListener('input', () => {
    qfhx9z7y2QuantumInfluence = parseFloat(qfhx9z7y2InfluenceSlider.value);
});

qfhx9z7y2ComplexitySlider.addEventListener('input', () => {
    qfhx9z7y2FractalComplexity = parseInt(qfhx9z7y2ComplexitySlider.value);
    qfhx9z7y2FractalSystem.qfhx9z7y2Generate();
});

qfhx9z7y2HarmonizeButton.addEventListener('click', () => {
    qfhx9z7y2Harmonized = !qfhx9z7y2Harmonized;
    qfhx9z7y2HarmonizeButton.textContent = qfhx9z7y2Harmonized ? 'Deharmonize' : 'Harmonize';
});

qfhx9z7y2InitHarmonizer();
qfhx9z7y2AnimateHarmonizer();




// Hyperdimensional Mandelbrot Tesseract Visualizer

const hdmt = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    imageData: null,
    mandelbrotIterations: 100,
    tesseractRotationSpeed: 0.01,
    mandelbrotZoom: 1,
    colorShift: 0,
    tesseractVertices: [],
    tesseractEdges: [
        [0,1],[0,2],[0,4],[0,8],[1,3],[1,5],[1,9],[2,3],[2,6],[2,10],
        [3,7],[3,11],[4,5],[4,6],[4,12],[5,7],[5,13],[6,7],[6,14],
        [7,15],[8,9],[8,10],[8,12],[9,11],[9,13],[10,11],[10,14],
        [11,15],[12,13],[12,14],[13,15],[14,15]
    ]
};

function initHDMT() {
    hdmt.canvas = document.getElementById('mandelbrotTesseractCanvas');
    if (!hdmt.canvas) {
        console.error('Canvas element not found');
        return;
    }
    hdmt.ctx = hdmt.canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize tesseract vertices
    for (let i = 0; i < 16; i++) {
        const x = (i & 1) ? 1 : -1;
        const y = (i & 2) ? 1 : -1;
        const z = (i & 4) ? 1 : -1;
        const w = (i & 8) ? 1 : -1;
        hdmt.tesseractVertices.push([x, y, z, w]);
    }

    // Set up controls
    const mandelbrotIterationsSlider = document.getElementById('mandelbrotIterations');
    const tesseractRotationSpeedSlider = document.getElementById('tesseractRotationSpeed');
    const mandelbrotZoomSlider = document.getElementById('mandelbrotZoom');
    const colorShiftSlider = document.getElementById('colorShift');

    if (mandelbrotIterationsSlider) {
        mandelbrotIterationsSlider.addEventListener('input', (e) => {
            hdmt.mandelbrotIterations = parseInt(e.target.value);
        });
    }
    if (tesseractRotationSpeedSlider) {
        tesseractRotationSpeedSlider.addEventListener('input', (e) => {
            hdmt.tesseractRotationSpeed = parseFloat(e.target.value);
        });
    }
    if (mandelbrotZoomSlider) {
        mandelbrotZoomSlider.addEventListener('input', (e) => {
            hdmt.mandelbrotZoom = parseFloat(e.target.value);
        });
    }
    if (colorShiftSlider) {
        colorShiftSlider.addEventListener('input', (e) => {
            hdmt.colorShift = parseInt(e.target.value);
        });
    }

    animate();
}

function resizeCanvas() {
    hdmt.width = hdmt.canvas.width = hdmt.canvas.offsetWidth;
    hdmt.height = hdmt.canvas.height = hdmt.canvas.offsetHeight;
    hdmt.imageData = hdmt.ctx.createImageData(hdmt.width, hdmt.height);
}

function mandelbrot(cx, cy) {
    let x = 0, y = 0;
    for (let i = 0; i < hdmt.mandelbrotIterations; i++) {
        const x2 = x * x, y2 = y * y;
        if (x2 + y2 > 4) return i;
        y = 2 * x * y + cy;
        x = x2 - y2 + cx;
    }
    return hdmt.mandelbrotIterations;
}

function rotatePoint4D(point, angles) {
    const [x, y, z, w] = point;
    const [angleXY, angleXZ, angleXW, angleYZ, angleYW, angleZW] = angles;

    // Perform 4D rotation (simplified for brevity)
    const x1 = x * Math.cos(angleXY) - y * Math.sin(angleXY);
    const y1 = x * Math.sin(angleXY) + y * Math.cos(angleXY);
    const z1 = z * Math.cos(angleXZ) - x * Math.sin(angleXZ);
    const w1 = w * Math.cos(angleXW) - x * Math.sin(angleXW);

    return [x1, y1, z1, w1];
}

function project4Dto3D(point) {
    const [x, y, z, w] = point;
    const factor = 1 / (4 - w);
    return [x * factor, y * factor, z * factor];
}

function project3Dto2D(point) {
    const [x, y, z] = point;
    const factor = 1 / (4 - z);
    return [x * factor, y * factor];
}

function drawTesseract(time) {
    const angles = [
        time * 0.5, time * 0.3, time * 0.2,
        time * 0.4, time * 0.1, time * 0.3
    ];

    const rotatedVertices = hdmt.tesseractVertices.map(v => rotatePoint4D(v, angles));
    const projected3D = rotatedVertices.map(project4Dto3D);
    const projected2D = projected3D.map(project3Dto2D);

    hdmt.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    hdmt.ctx.lineWidth = 2;

    for (const [start, end] of hdmt.tesseractEdges) {
        const [x1, y1] = projected2D[start];
        const [x2, y2] = projected2D[end];
        hdmt.ctx.beginPath();
        hdmt.ctx.moveTo(x1 * hdmt.width / 4 + hdmt.width / 2, y1 * hdmt.height / 4 + hdmt.height / 2);
        hdmt.ctx.lineTo(x2 * hdmt.width / 4 + hdmt.width / 2, y2 * hdmt.height / 4 + hdmt.height / 2);
        hdmt.ctx.stroke();
    }
}

function renderMandelbrot() {
    const { width, height, imageData, mandelbrotZoom, colorShift } = hdmt;

    for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
            const x = (px - width / 2) / (width / 4) / mandelbrotZoom;
            const y = (py - height / 2) / (height / 4) / mandelbrotZoom;

            const iterations = mandelbrot(x, y);
            const hue = (iterations / hdmt.mandelbrotIterations * 360 + colorShift) % 360;
            const saturation = iterations < hdmt.mandelbrotIterations ? 100 : 0;
            const lightness = iterations < hdmt.mandelbrotIterations ? 50 : 0;

            const rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);

            const index = (py * width + px) * 4;
            imageData.data[index] = rgb[0];
            imageData.data[index + 1] = rgb[1];
            imageData.data[index + 2] = rgb[2];
            imageData.data[index + 3] = 255;
        }
    }

    hdmt.ctx.putImageData(imageData, 0, 0);
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function animate(time) {
    time *= hdmt.tesseractRotationSpeed;

    hdmt.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    hdmt.ctx.fillRect(0, 0, hdmt.width, hdmt.height);

    renderMandelbrot();
    drawTesseract(time);

    requestAnimationFrame(animate);
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', initHDMT);






// predator prey simulation
const predprey9x7Canvas = document.getElementById('predpreyCanvas');
const predprey9x7Ctx = predprey9x7Canvas.getContext('2d');
const predprey9x7PreySpeedSlider = document.getElementById('predpreyPreySpeed');
const predprey9x7PredatorSpeedSlider = document.getElementById('predpreyPredatorSpeed');
const predprey9x7PreyBirthRateSlider = document.getElementById('predpreyPreyBirthRate');
const predprey9x7PredatorBirthRateSlider = document.getElementById('predpreyPredatorBirthRate');
const predprey9x7PredatorEnergyGainSlider = document.getElementById('predpreyPredatorEnergyGain');
const predprey9x7ResetButton = document.getElementById('predpreyResetButton');

let predprey9x7PreySpeed = 0.6;
let predprey9x7PredatorSpeed = 0.7;
let predprey9x7PreyBirthRate = 0.005;
let predprey9x7PredatorBirthRate = 0.001;
let predprey9x7PredatorEnergyGain = 25;

let predprey9x7AutoRestartDelay = 2000; // Auto-restart delay in milliseconds

function predprey9x7ResizeCanvas() {
    predprey9x7Canvas.width = 250;
    predprey9x7Canvas.height = 250;
}

predprey9x7ResizeCanvas();

class Predprey9x7Agent {
    constructor(x, y, isPredator) {
        this.x = x;
        this.y = y;
        this.isPredator = isPredator;
        this.energy = isPredator ? 80 : 40;
        this.size = isPredator ? 5 : 3;
        this.visionRadius = isPredator ? 50 : 30; // Reduced vision radius for prey
        this.direction = Math.random() * 2 * Math.PI; // Random initial direction
    }

    predprey9x7Move(agents) {
        let speed = this.isPredator ? predprey9x7PredatorSpeed : predprey9x7PreySpeed;
        let target = null;
        let closestDistance = Infinity;

        if (this.isPredator) {
            // Predator logic: chase the nearest prey
            for (let agent of agents) {
                if (!agent.isPredator) {
                    let distance = Math.hypot(agent.x - this.x, agent.y - this.y);
                    if (distance < closestDistance && distance < this.visionRadius) {
                        closestDistance = distance;
                        target = agent;
                    }
                }
            }
        } else {
            // Prey logic: avoid the nearest predator
            for (let agent of agents) {
                if (agent.isPredator) {
                    let distance = Math.hypot(agent.x - this.x, agent.y - this.y);
                    if (distance < closestDistance && distance < this.visionRadius) {
                        closestDistance = distance;
                        target = agent;
                    }
                }
            }
        }

        if (target) {
            // Move towards or away from the target
            let dx = target.x - this.x;
            let dy = target.y - this.y;
            let distance = Math.hypot(dx, dy);

            if (this.isPredator) {
                // Move towards the prey
                this.x += (dx / distance) * speed;
                this.y += (dy / distance) * speed;
            } else {
                // Move away from the predator
                this.x -= (dx / distance) * speed;
                this.y -= (dy / distance) * speed;
            }
        } else {
            // Random wandering
            this.direction += (Math.random() - 0.5) * 0.1; // Random slight direction change
            this.x += Math.cos(this.direction) * speed;
            this.y += Math.sin(this.direction) * speed;
        }

        // Wall avoidance
        if (this.x <= this.size || this.x >= predprey9x7Canvas.width - this.size) {
            this.direction = Math.PI - this.direction;
        }
        if (this.y <= this.size || this.y >= predprey9x7Canvas.height - this.size) {
            this.direction = -this.direction;
        }

        // Keep within bounds
        this.x = Math.max(this.size, Math.min(this.x, predprey9x7Canvas.width - this.size));
        this.y = Math.max(this.size, Math.min(this.y, predprey9x7Canvas.height - this.size));
        this.energy -= 0.2;
    }

    predprey9x7Draw() {
        predprey9x7Ctx.beginPath();
        predprey9x7Ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        predprey9x7Ctx.fillStyle = this.isPredator ? 'red' : 'green';
        predprey9x7Ctx.fill();
    }
}

let predprey9x7Agents = [];
let predprey9x7AnimationFrame;

function predprey9x7InitSimulation() {
    predprey9x7Agents = [];
    for (let i = 0; i < 30; i++) {
        predprey9x7Agents.push(new Predprey9x7Agent(Math.random() * predprey9x7Canvas.width, Math.random() * predprey9x7Canvas.height, false));
    }
    for (let i = 0; i < 5; i++) {
        predprey9x7Agents.push(new Predprey9x7Agent(Math.random() * predprey9x7Canvas.width, Math.random() * predprey9x7Canvas.height, true));
    }
}

function predprey9x7UpdateSimulation() {
    predprey9x7Ctx.clearRect(0, 0, predprey9x7Canvas.width, predprey9x7Canvas.height);

    const newAgents = [];

    for (let agent of predprey9x7Agents) {
        agent.predprey9x7Move(predprey9x7Agents);
        agent.predprey9x7Draw();

        if (agent.energy <= 0) continue;

        const birthRate = agent.isPredator ? predprey9x7PredatorBirthRate : predprey9x7PreyBirthRate;
        if (Math.random() < birthRate) {
            newAgents.push(new Predprey9x7Agent(agent.x, agent.y, agent.isPredator));
        }

        if (agent.isPredator) {
            for (let prey of predprey9x7Agents) {
                if (!prey.isPredator && Math.hypot(agent.x - prey.x, agent.y - prey.y) < agent.size + prey.size) {
                    agent.energy += predprey9x7PredatorEnergyGain;
                    prey.energy = 0;
                    break;
                }
            }
        }
    }

    predprey9x7Agents = predprey9x7Agents.filter(agent => agent.energy > 0).concat(newAgents);

    const predators = predprey9x7Agents.filter(agent => agent.isPredator).length;
    const prey = predprey9x7Agents.filter(agent => !agent.isPredator).length;

    // Check if the simulation needs to be restarted
    if (predators === 0 || prey === 0) {
        cancelAnimationFrame(predprey9x7AnimationFrame);
        setTimeout(() => {
            predprey9x7InitSimulation();
            predprey9x7UpdateSimulation();
        }, predprey9x7AutoRestartDelay);
    } else {
        predprey9x7AnimationFrame = requestAnimationFrame(predprey9x7UpdateSimulation);
    }
}

predprey9x7PreySpeedSlider.addEventListener('input', (e) => {
    predprey9x7PreySpeed = parseFloat(e.target.value);
});

predprey9x7PredatorSpeedSlider.addEventListener('input', (e) => {
    predprey9x7PredatorSpeed = parseFloat(e.target.value);
});

predprey9x7PreyBirthRateSlider.addEventListener('input', (e) => {
    predprey9x7PreyBirthRate = parseFloat(e.target.value);
});

predprey9x7PredatorBirthRateSlider.addEventListener('input', (e) => {
    predprey9x7PredatorBirthRate = parseFloat(e.target.value);
});

predprey9x7PredatorEnergyGainSlider.addEventListener('input', (e) => {
    predprey9x7PredatorEnergyGain = parseFloat(e.target.value);
});

predprey9x7ResetButton.addEventListener('click', () => {
    cancelAnimationFrame(predprey9x7AnimationFrame);
    predprey9x7InitSimulation();
    predprey9x7UpdateSimulation();
});

predprey9x7InitSimulation();
predprey9x7UpdateSimulation();




















const lorenzAttractorCanvas = document.getElementById('lorenzAttractorCanvas');
const lorenzAttractorCtx = lorenzAttractorCanvas.getContext('2d');
const lorenzSigmaSlider = document.getElementById('lorenzSigma');
const lorenzRhoSlider = document.getElementById('lorenzRho');
const lorenzBetaSlider = document.getElementById('lorenzBeta');

let lorenzSigma = 10;
let lorenzRho = 28;
let lorenzBeta = 2.667;

function lorenzAttractorResizeCanvas() {
    lorenzAttractorCanvas.width = lorenzAttractorCanvas.offsetWidth;
    lorenzAttractorCanvas.height = lorenzAttractorCanvas.offsetHeight;
}

lorenzAttractorResizeCanvas();
window.addEventListener('resize', lorenzAttractorResizeCanvas);

class LorenzAttractorPoint {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    lorenzAttractorUpdate(dt) {
        const dx = lorenzSigma * (this.y - this.x) * dt;
        const dy = (this.x * (lorenzRho - this.z) - this.y) * dt;
        const dz = (this.x * this.y - lorenzBeta * this.z) * dt;

        this.x += dx;
        this.y += dy;
        this.z += dz;
    }

    lorenzAttractorDraw() {
        const scale = 5;
        const x = (this.x * scale) + lorenzAttractorCanvas.width / 2;
        const y = (this.y * scale) + lorenzAttractorCanvas.height / 2;

        lorenzAttractorCtx.fillStyle = `hsl(${(this.z + 30) * 5}, 100%, 50%)`;
        lorenzAttractorCtx.fillRect(x, y, 1, 1);
    }
}

const lorenzAttractorPoints = [];
for (let i = 0; i < 1000; i++) {
    lorenzAttractorPoints.push(new LorenzAttractorPoint(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1));
}

function lorenzAttractorAnimate() {
    lorenzAttractorCtx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    lorenzAttractorCtx.fillRect(0, 0, lorenzAttractorCanvas.width, lorenzAttractorCanvas.height);

    for (let point of lorenzAttractorPoints) {
        point.lorenzAttractorUpdate(0.005);
        point.lorenzAttractorDraw();
    }

    requestAnimationFrame(lorenzAttractorAnimate);
}

lorenzSigmaSlider.addEventListener('input', (e) => {
    lorenzSigma = parseFloat(e.target.value);
});

lorenzRhoSlider.addEventListener('input', (e) => {
    lorenzRho = parseFloat(e.target.value);
});

lorenzBetaSlider.addEventListener('input', (e) => {
    lorenzBeta = parseFloat(e.target.value);
});

lorenzAttractorAnimate();





const mandelbrotExplorerCanvas = document.getElementById('mandelbrotExplorerCanvas');
const mandelbrotExplorerCtx = mandelbrotExplorerCanvas.getContext('2d');
const mandelbrotIterationsSlider = document.getElementById('mandelbrotIterations');
const mandelbrotResetZoomButton = document.getElementById('mandelbrotResetZoom');

let mandelbrotIterations = 100;
let mandelbrotZoom = 1;
let mandelbrotOffsetX = -0.5;
let mandelbrotOffsetY = 0;

function mandelbrotExplorerResizeCanvas() {
    mandelbrotExplorerCanvas.width = mandelbrotExplorerCanvas.offsetWidth;
    mandelbrotExplorerCanvas.height = mandelbrotExplorerCanvas.offsetHeight;
    mandelbrotExplorerRender();
}

mandelbrotExplorerResizeCanvas();
window.addEventListener('resize', mandelbrotExplorerResizeCanvas);

function mandelbrotExplorerCalculate(cx, cy) {
    let x = 0, y = 0;
    for (let i = 0; i < mandelbrotIterations; i++) {
        const x2 = x * x, y2 = y * y;
        if (x2 + y2 > 4) return i;
        y = 2 * x * y + cy;
        x = x2 - y2 + cx;
    }
    return mandelbrotIterations;
}

function mandelbrotExplorerRender() {
    const { width, height } = mandelbrotExplorerCanvas;
    const imageData = mandelbrotExplorerCtx.createImageData(width, height);

    for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
            const x = (px - width / 2) / (0.5 * width * mandelbrotZoom) + mandelbrotOffsetX;
            const y = (py - height / 2) / (0.5 * height * mandelbrotZoom) + mandelbrotOffsetY;

            const iterations = mandelbrotExplorerCalculate(x, y);
            const index = (py * width + px) * 4;

            if (iterations === mandelbrotIterations) {
                imageData.data[index] = 0;
                imageData.data[index + 1] = 0;
                imageData.data[index + 2] = 0;
            } else {
                const hue = (iterations / mandelbrotIterations * 360 + 200) % 360;
                const [r, g, b] = mandelbrotExplorerHSLToRGB(hue / 360, 1, 0.5);
                imageData.data[index] = r;
                imageData.data[index + 1] = g;
                imageData.data[index + 2] = b;
            }
            imageData.data[index + 3] = 255;
        }
    }

    mandelbrotExplorerCtx.putImageData(imageData, 0, 0);
}

function mandelbrotExplorerHSLToRGB(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

mandelbrotExplorerCanvas.addEventListener('click', (e) => {
    const rect = mandelbrotExplorerCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mandelbrotOffsetX += (x - mandelbrotExplorerCanvas.width / 2) / (0.5 * mandelbrotExplorerCanvas.width * mandelbrotZoom);
    mandelbrotOffsetY += (y - mandelbrotExplorerCanvas.height / 2) / (0.5 * mandelbrotExplorerCanvas.height * mandelbrotZoom);
    mandelbrotZoom *= 2;
    
    mandelbrotExplorerRender();
});

mandelbrotIterationsSlider.addEventListener('input', (e) => {
    mandelbrotIterations = parseInt(e.target.value);
    mandelbrotExplorerRender();
});

mandelbrotResetZoomButton.addEventListener('click', () => {
    mandelbrotZoom = 1;
    mandelbrotOffsetX = -0.5;
    mandelbrotOffsetY = 0;
    mandelbrotExplorerRender();
});

mandelbrotExplorerRender();



const dpCanvas = document.getElementById('doublePendulumCanvas');
const dpCtx = dpCanvas.getContext('2d');
const dpGravitySlider = document.getElementById('doublePendulumGravity');
const dpResetButton = document.getElementById('doublePendulumReset');

let dpGravity = 1;
let dpTime = 0;
let dpTrail = [];

class DpPendulum {
    constructor(length, angle, mass) {
        this.length = length;
        this.angle = angle;
        this.mass = mass;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
    }
}

let dp1 = new DpPendulum(50, Math.PI / 2, 10);
let dp2 = new DpPendulum(50, Math.PI / 2, 10);

function dpResizeCanvas() {
    dpCanvas.width = dpCanvas.offsetWidth;
    dpCanvas.height = dpCanvas.offsetHeight;
}

dpResizeCanvas();
window.addEventListener('resize', dpResizeCanvas);

function dpCalculateAccelerations() {
    const g = dpGravity;
    const m1 = dp1.mass;
    const m2 = dp2.mass;
    const l1 = dp1.length;
    const l2 = dp2.length;
    const a1 = dp1.angle;
    const a2 = dp2.angle;
    const a1_v = dp1.angularVelocity;
    const a2_v = dp2.angularVelocity;

    const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    const num3 = -2 * Math.sin(a1 - a2) * m2;
    const num4 = a2_v * a2_v * l2 + a1_v * a1_v * l1 * Math.cos(a1 - a2);
    const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    dp1.angularAcceleration = (num1 + num2 + num3 * num4) / den;

    const num5 = 2 * Math.sin(a1 - a2);
    const num6 = a1_v * a1_v * l1 * (m1 + m2);
    const num7 = g * (m1 + m2) * Math.cos(a1);
    const num8 = a2_v * a2_v * l2 * m2 * Math.cos(a1 - a2);
    const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    dp2.angularAcceleration = (num5 * (num6 + num7 + num8)) / den2;
}

function dpUpdatePendulums(dt) {
    dpCalculateAccelerations();
    dp1.angularVelocity += dp1.angularAcceleration * dt;
    dp2.angularVelocity += dp2.angularAcceleration * dt;
    dp1.angle += dp1.angularVelocity * dt;
    dp2.angle += dp2.angularVelocity * dt;
}

function dpDrawPendulums() {
    const centerX = dpCanvas.width / 2;
    const centerY = dpCanvas.height / 2;

    const x1 = centerX + dp1.length * Math.sin(dp1.angle);
    const y1 = centerY + dp1.length * Math.cos(dp1.angle);
    const x2 = x1 + dp2.length * Math.sin(dp2.angle);
    const y2 = y1 + dp2.length * Math.cos(dp2.angle);

    dpCtx.strokeStyle = 'white';
    dpCtx.lineWidth = 2;
    dpCtx.beginPath();
    dpCtx.moveTo(centerX, centerY);
    dpCtx.lineTo(x1, y1);
    dpCtx.lineTo(x2, y2);
    dpCtx.stroke();

    dpCtx.fillStyle = 'white';
    dpCtx.beginPath();
    dpCtx.arc(x1, y1, 5, 0, Math.PI * 2);
    dpCtx.arc(x2, y2, 5, 0, Math.PI * 2);
    dpCtx.fill();

    dpTrail.push({x: x2, y: y2});
    if (dpTrail.length > 200) dpTrail.shift();

    dpCtx.beginPath();
    dpCtx.moveTo(dpTrail[0].x, dpTrail[0].y);
    for (let i = 1; i < dpTrail.length; i++) {
        dpCtx.lineTo(dpTrail[i].x, dpTrail[i].y);
    }
    dpCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    dpCtx.stroke();
}

function dpAnimate() {
    dpCtx.fillStyle = 'rgba(26, 26, 26, 0.1)';
    dpCtx.fillRect(0, 0, dpCanvas.width, dpCanvas.height);

    dpUpdatePendulums(0.1);
    dpDrawPendulums();

    dpTime += 0.1;
    requestAnimationFrame(dpAnimate);
}

dpGravitySlider.addEventListener('input', (e) => {
    dpGravity = parseFloat(e.target.value);
});

dpResetButton.addEventListener('click', () => {
    dp1 = new DpPendulum(50, Math.PI / 2, 10);
    dp2 = new DpPendulum(50, Math.PI / 2, 10);
    dpTrail = [];
});

dpAnimate();




const rdCanvas = document.getElementById('reactionDiffusionCanvas');
const rdCtx = rdCanvas.getContext('2d');
const rdFeedRateSlider = document.getElementById('rdFeedRate');
const rdKillRateSlider = document.getElementById('rdKillRate');
const rdResetButton = document.getElementById('rdReset');

let rdWidth, rdHeight;
let rdGrid, rdNextGrid;
let rdFeedRate = 0.055;
let rdKillRate = 0.062;

const rdDu = 0.2;
const rdDv = 0.1;

function rdResizeCanvas() {
    rdWidth = rdCanvas.width = rdCanvas.offsetWidth;
    rdHeight = rdCanvas.height = rdCanvas.offsetHeight;
    rdInitializeGrid();
}

rdResizeCanvas();
window.addEventListener('resize', rdResizeCanvas);

function rdInitializeGrid() {
    rdGrid = [];
    rdNextGrid = [];
    for (let y = 0; y < rdHeight; y++) {
        rdGrid[y] = [];
        rdNextGrid[y] = [];
        for (let x = 0; x < rdWidth; x++) {
            rdGrid[y][x] = { u: 1, v: 0 };
            rdNextGrid[y][x] = { u: 1, v: 0 };
        }
    }

    // Create an initial seed
    const centerX = Math.floor(rdWidth / 2);
    const centerY = Math.floor(rdHeight / 2);
    for (let y = centerY - 5; y < centerY + 5; y++) {
        for (let x = centerX - 5; x < centerX + 5; x++) {
            rdGrid[y][x].u = 0.5;
            rdGrid[y][x].v = 0.25;
        }
    }
}

function rdUpdateGrid() {
    for (let y = 1; y < rdHeight - 1; y++) {
        for (let x = 1; x < rdWidth - 1; x++) {
            const cell = rdGrid[y][x];
            
            let laplaceU = 0;
            let laplaceV = 0;
            
            laplaceU += rdGrid[y][x-1].u * 0.2;
            laplaceU += rdGrid[y][x+1].u * 0.2;
            laplaceU += rdGrid[y-1][x].u * 0.2;
            laplaceU += rdGrid[y+1][x].u * 0.2;
            laplaceU += rdGrid[y-1][x-1].u * 0.05;
            laplaceU += rdGrid[y-1][x+1].u * 0.05;
            laplaceU += rdGrid[y+1][x-1].u * 0.05;
            laplaceU += rdGrid[y+1][x+1].u * 0.05;
            laplaceU -= cell.u;
            
            laplaceV += rdGrid[y][x-1].v * 0.2;
            laplaceV += rdGrid[y][x+1].v * 0.2;
            laplaceV += rdGrid[y-1][x].v * 0.2;
            laplaceV += rdGrid[y+1][x].v * 0.2;
            laplaceV += rdGrid[y-1][x-1].v * 0.05;
            laplaceV += rdGrid[y-1][x+1].v * 0.05;
            laplaceV += rdGrid[y+1][x-1].v * 0.05;
            laplaceV += rdGrid[y+1][x+1].v * 0.05;
            laplaceV -= cell.v;

            const reactionU = -cell.u * cell.v * cell.v + rdFeedRate * (1 - cell.u);
            const reactionV = cell.u * cell.v * cell.v - (rdFeedRate + rdKillRate) * cell.v;

            rdNextGrid[y][x].u = cell.u + (rdDu * laplaceU + reactionU);
            rdNextGrid[y][x].v = cell.v + (rdDv * laplaceV + reactionV);
        }
    }

    // Swap grids
    [rdGrid, rdNextGrid] = [rdNextGrid, rdGrid];
}

function rdRenderGrid() {
    const imageData = rdCtx.createImageData(rdWidth, rdHeight);
    for (let y = 0; y < rdHeight; y++) {
        for (let x = 0; x < rdWidth; x++) {
            const cell = rdGrid[y][x];
            const index = (y * rdWidth + x) * 4;
            const value = Math.floor((cell.u - cell.v) * 255);
            imageData.data[index] = value;
            imageData.data[index + 1] = value;
            imageData.data[index + 2] = value;
            imageData.data[index + 3] = 255;
        }
    }
    rdCtx.putImageData(imageData, 0, 0);
}

function rdAnimate() {
    rdUpdateGrid();
    rdRenderGrid();
    requestAnimationFrame(rdAnimate);
}

rdFeedRateSlider.addEventListener('input', (e) => {
    rdFeedRate = parseFloat(e.target.value);
});

rdKillRateSlider.addEventListener('input', (e) => {
    rdKillRate = parseFloat(e.target.value);
});

rdResetButton.addEventListener('click', rdInitializeGrid);

rdInitializeGrid();
rdAnimate();