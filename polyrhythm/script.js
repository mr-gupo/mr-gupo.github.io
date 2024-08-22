const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const song = document.querySelector("audio");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const padding = 30;
const mainRadius = Math.min(centerX, centerY) - padding;
const ringCount = 35;
const ringGapPixels = 2;
const ringThickness = (mainRadius - ringGapPixels * (ringCount - 1)) / ringCount;
const innerHue = 30;
const outerHue = 270;
const innerAngVel = 360 * (Math.PI / 180);
const outerAngVel = 331.92 * (Math.PI / 180);
const glowRadius = mainRadius / 4;
const glowBrightness = 0.8;

const minimumRingBrightness = 0.05;
const minimumGlowAlpha = 0;
let ringBrightness = 0;
let glowAlpha = 0;
let lastTime = 0;
let elapsedTime = 0;

class Ring {
    constructor(index) {
        this.index = index;
        this.lineOuterRadius = mainRadius - (ringCount - this.index - 1) * (ringThickness + ringGapPixels);
        this.ringCenterRadius = this.lineOuterRadius - ringThickness / 2;
        this.angularVel = innerAngVel + (outerAngVel - innerAngVel) * (this.index / ringCount);
        this.angle = -Math.PI / 2;
        this.glowX;
        this.glowY;

        this.hue = innerHue + (outerHue - innerHue) * (this.index / ringCount);
    }

    drawRing() {
        const colorStyle = `hsl(${this.hue}, 100%, ${ringBrightness * 100}%)`;

        ctx.beginPath();
        if (this.index === 0) {
            ctx.fillStyle = colorStyle;
            ctx.arc(centerX, centerY, ringThickness, 0, 2 * Math.PI);
            ctx.fill();

        } else {
            ctx.strokeStyle = colorStyle;
            ctx.arc(centerX, centerY, this.ringCenterRadius, 0, 2 * Math.PI);
            ctx.lineWidth = ringThickness;
            ctx.stroke();
        }
    }

    drawTrail() {
        const endAngle = this.angle;
        const startAngle = endAngle - Math.PI / 2;

        const gradient = ctx.createConicGradient(startAngle, centerX, centerY);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.125, `hsl(${this.hue}, 100%, 50%)`);
        gradient.addColorStop(0.25, "white");
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(centerX, centerY, this.ringCenterRadius, startAngle, endAngle);
        ctx.lineWidth = ringThickness;
        ctx.strokeStyle = gradient;
        ctx.stroke();
    }

    drawRadialGlow() {
        const glow = ctx.createRadialGradient(
            this.glowX, this.glowY, 0,
            this.glowX, this.glowY, glowRadius
        );
        const glowColor = `hsla(${this.hue}, 100%, ${glowBrightness * 100}%, ${glowAlpha})`;
        glow.addColorStop(0, glowColor);
        glow.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(this.glowX, this.glowY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
    }

    drawLineGlow() {
        const x1 = centerX + this.lineOuterRadius * Math.cos(this.angle);
        const y1 = centerY + this.lineOuterRadius * Math.sin(this.angle);
        const x2 = centerX + (this.lineOuterRadius - ringThickness) * Math.cos(this.angle);
        const y2 = centerY + (this.lineOuterRadius - ringThickness) * Math.sin(this.angle);

        ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${glowAlpha * 10})`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    update(deltaTime) {
        this.angle += this.angularVel * deltaTime;
        this.angle %= Math.PI * 2;

        this.glowX = centerX + this.ringCenterRadius * Math.cos(this.angle);
        this.glowY = centerY + this.ringCenterRadius * Math.sin(this.angle);
    }
}

const rings = Array.from({length: ringCount}, (_, i) => new Ring(i));

function beat() {
    if (elapsedTime >= 15.9 && elapsedTime <= 80 || elapsedTime >= 111.9 && elapsedTime <= 416.1) {
        ringBrightness = 0.1;
        glowAlpha = 0.1;
    }
}

function undoBeat(deltaTime) {
    if (ringBrightness > minimumRingBrightness)
        ringBrightness -= deltaTime / 8;
    if (glowAlpha > minimumGlowAlpha)
        glowAlpha -= deltaTime / 5;

    ringBrightness = Math.max(ringBrightness, minimumRingBrightness);
    glowAlpha = Math.max(glowAlpha, minimumGlowAlpha);
}

function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    elapsedTime = currentTime / 1000;
    console.log(elapsedTime);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rings.forEach(ring => {ring.update(deltaTime)});

    ctx.lineWidth = ringThickness;
    rings.forEach(ring => {ring.drawRing()});

    ctx.filter = "blur(3px)";
    ctx.lineCap = "round";
    ctx.lineWidth = 6;
    rings.forEach(ring => {ring.drawLineGlow()});

    ctx.filter = "none";
    ctx.lineCap = "butt";
    ctx.lineWidth = ringThickness;
    rings.forEach(ring => {ring.drawTrail()});
    rings.forEach(ring => {ring.drawRadialGlow()});

    undoBeat(deltaTime);
    requestAnimationFrame(animate);
}

const accurateTimer = (fn, time = 1000) => {
    let nextAt, timeout;
    nextAt = new Date().getTime() + time;

    const wrapper = () => {
        nextAt += time;
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        fn();
    };

    const cancel = () => clearTimeout(timeout);
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());

    return { cancel };
};

function initializeAnimation() {
    lastTime = performance.now();
    requestAnimationFrame(animate);
    accurateTimer(beat, 500);
    song.play();
}

song.addEventListener("canplaythrough", () => {
    setTimeout(initializeAnimation, 100)
}, {once: true})
