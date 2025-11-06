// Анимация паутины для VODeco

class SpiderWebAnimation {
    constructor() {
        this.canvas = document.getElementById('spiderWebCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.connections = [];
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.isMouseOver = false;
        
        this.init();
    }

    init() {
        if (!this.canvas) return;
        
        this.setupCanvas();
        this.createPoints();
        this.setupEventListeners();
        this.startAnimation();
    }

    setupCanvas() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createPoints() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Создаем точки по периметру и в центре
        this.points = [];
        
        // Центральная точка
        this.points.push({
            x: width / 2,
            y: height / 2,
            vx: 0,
            vy: 0,
            radius: 3,
            isCenter: true
        });
        
        // Точки по периметру
        const perimeterPoints = 12;
        for (let i = 0; i < perimeterPoints; i++) {
            const angle = (i / perimeterPoints) * Math.PI * 2;
            const radius = Math.min(width, height) * 0.4;
            const x = width / 2 + Math.cos(angle) * radius;
            const y = height / 2 + Math.sin(angle) * radius;
            
            this.points.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 2,
                isCenter: false
            });
        }
        
        // Дополнительные точки для создания сетки
        const gridPoints = 8;
        for (let i = 0; i < gridPoints; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            
            this.points.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: 1.5,
                isCenter: false
            });
        }
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.isMouseOver = true;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseOver = false;
        });
    }

    startAnimation() {
        this.animate();
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    update() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.points.forEach(point => {
            if (point.isCenter) return;
            
            // Обновляем позицию
            point.x += point.vx;
            point.y += point.vy;
            
            // Отскок от границ
            if (point.x < 0 || point.x > width) {
                point.vx *= -1;
                point.x = Math.max(0, Math.min(width, point.x));
            }
            if (point.y < 0 || point.y > height) {
                point.vy *= -1;
                point.y = Math.max(0, Math.min(height, point.y));
            }
            
            // Притяжение к мыши
            if (this.isMouseOver) {
                const dx = this.mouse.x - point.x;
                const dy = this.mouse.y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    point.vx += dx * force * 0.001;
                    point.vy += dy * force * 0.001;
                }
            }
            
            // Ограничение скорости
            const maxSpeed = 1;
            const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
            if (speed > maxSpeed) {
                point.vx = (point.vx / speed) * maxSpeed;
                point.vy = (point.vy / speed) * maxSpeed;
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем соединения
        this.drawConnections();
        
        // Рисуем точки
        this.drawPoints();
    }

    drawConnections() {
        const centerPoint = this.points[0];
        const time = Date.now() * 0.001;
        
        this.points.forEach((point, index) => {
            if (index === 0) return; // Пропускаем центральную точку
            
            // Создаем волновые соединения с центром
            this.drawWaveConnection(centerPoint, point, time, 0.4);
            
            // Соединения с ближайшими точками с волновым эффектом
            this.points.forEach((otherPoint, otherIndex) => {
                if (otherIndex <= index) return;
                
                const distance = this.getDistance(point, otherPoint);
                if (distance < 200) {
                    const opacity = Math.max(0, 1 - distance / 200);
                    this.drawWaveConnection(point, otherPoint, time, opacity * 0.3);
                }
            });
        });
        
        // Дополнительные волновые соединения
        this.drawWavePatterns(time);
    }

    drawConnection(point1, point2, opacity) {
        this.ctx.beginPath();
        this.ctx.moveTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.strokeStyle = `rgba(0, 180, 216, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    drawPoints() {
        this.points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            
            if (point.isCenter) {
                this.ctx.fillStyle = '#90e0ef';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#90e0ef';
            } else {
                this.ctx.fillStyle = '#00b4d8';
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = '#00b4d8';
            }
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    drawWaveConnection(point1, point2, time, opacity) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const segments = Math.max(10, Math.floor(distance / 20));
        
        this.ctx.beginPath();
        this.ctx.moveTo(point1.x, point1.y);
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const x = point1.x + dx * t;
            const y = point1.y + dy * t;
            
            // Создаем волновой эффект
            const waveOffset = Math.sin(time * 2 + t * Math.PI * 4) * 15 * (1 - t);
            const perpendicularX = -dy / distance;
            const perpendicularY = dx / distance;
            
            const waveX = x + perpendicularX * waveOffset;
            const waveY = y + perpendicularY * waveOffset;
            
            if (i === 1) {
                this.ctx.moveTo(waveX, waveY);
            } else {
                this.ctx.lineTo(waveX, waveY);
            }
        }
        
        this.ctx.strokeStyle = `rgba(0, 180, 216, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    drawWavePatterns(time) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Создаем дополнительные волновые паттерны
        for (let i = 0; i < 5; i++) {
            const x = (width / 5) * i + width / 10;
            const y = height / 2;
            const radius = 100 + Math.sin(time + i) * 30;
            const angle = time * 0.5 + i * Math.PI / 2.5;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, angle, angle + Math.PI * 1.5);
            this.ctx.strokeStyle = `rgba(0, 180, 216, ${0.1 + Math.sin(time + i) * 0.1})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    getDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Инициализация анимации паутины
document.addEventListener('DOMContentLoaded', () => {
    window.spiderWebAnimation = new SpiderWebAnimation();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpiderWebAnimation;
}

