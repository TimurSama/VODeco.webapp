// Дополнительные анимации для VODeco

class VODecoAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupWaterDropAnimation();
        this.setupGlobeAnimation();
        this.setupRippleAnimation();
        this.setupParticleSystem();
        this.setupScrollAnimations();
    }

    setupWaterDropAnimation() {
        const waterDrop = document.querySelector('.water-drop');
        if (!waterDrop) return;

        // Анимация капли
        const dropShape = waterDrop.querySelector('.drop-shape');
        if (dropShape) {
            setInterval(() => {
                dropShape.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    dropShape.style.transform = 'scale(1)';
                }, 200);
            }, 3000);
        }

        // Анимация ряби
        const ripples = waterDrop.querySelectorAll('.ripple');
        ripples.forEach((ripple, index) => {
            ripple.style.animationDelay = `${index * 0.5}s`;
        });
    }

    setupGlobeAnimation() {
        const globe = document.querySelector('.globe');
        if (!globe) return;

        // Добавляем интерактивность к глобусу
        globe.addEventListener('mouseenter', () => {
            globe.style.animationPlayState = 'paused';
            globe.style.transform = 'scale(1.1)';
        });

        globe.addEventListener('mouseleave', () => {
            globe.style.animationPlayState = 'running';
            globe.style.transform = 'scale(1)';
        });

        // Анимация точек на глобусе
        const globePoints = document.querySelectorAll('.globe-point');
        globePoints.forEach((point, index) => {
            point.style.animationDelay = `${index * 0.2}s`;
        });
    }

    setupRippleAnimation() {
        // Создаем дополнительные ряби при клике
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.position = 'fixed';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.border = '2px solid rgba(0, 180, 216, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999';
        ripple.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(ripple);

        // Анимация расширения
        let size = 0;
        const maxSize = 100;
        const speed = 2;

        const animate = () => {
            size += speed;
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.opacity = 1 - (size / maxSize);

            if (size < maxSize) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(ripple);
            }
        };

        requestAnimationFrame(animate);
    }

    setupParticleSystem() {
        // Создаем систему частиц для фона
        this.createParticles();
    }

    createParticles() {
        const particleContainer = document.querySelector('.spider-web-background');
        if (!particleContainer) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = '#00b4d8';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';

            particleContainer.appendChild(particle);
        }
    }

    setupScrollAnimations() {
        // Анимации при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдение за элементами
        const animatedElements = document.querySelectorAll('.problem-item, .feature-card, .dashboard-card, .proposal-item, .token-card, .quality-item');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        // Анимация появления элемента
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });

        // Анимация счетчиков
        const counters = element.querySelectorAll('.metric-value, .stat-number');
        counters.forEach(counter => {
            this.animateCounter(counter);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        
        if (isNaN(number)) return;

        let current = 0;
        const increment = number / 60; // 60 кадров анимации
        const duration = 2000; // 2 секунды
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            // Сохраняем форматирование
            const formatted = text.replace(/\d+/, Math.floor(current).toLocaleString());
            element.textContent = formatted;
        }, stepTime);
    }

    // Анимация диаграмм
    animateCharts() {
        const charts = document.querySelectorAll('canvas');
        charts.forEach(chart => {
            this.createChart(chart);
        });
    }

    createChart(canvas) {
        const ctx = canvas.getContext('2d');
        const data = [65, 45, 80, 35, 90, 55]; // Пример данных
        const colors = ['#00b4d8', '#0077b6', '#90e0ef', '#00b4d8', '#0077b6', '#90e0ef'];
        
        const width = canvas.width;
        const height = canvas.height;
        const barWidth = width / data.length;
        const maxValue = Math.max(...data);

        // Анимация появления столбцов
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * height * 0.8;
            const x = index * barWidth;
            const y = height - barHeight;

            // Анимация от 0 до финальной высоты
            let currentHeight = 0;
            const targetHeight = barHeight;
            const animationDuration = 1000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                currentHeight = targetHeight * progress;
                
                // Очищаем и рисуем
                ctx.clearRect(x, y, barWidth - 2, height);
                ctx.fillStyle = colors[index];
                ctx.fillRect(x, y + (targetHeight - currentHeight), barWidth - 2, currentHeight);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            setTimeout(() => {
                requestAnimationFrame(animate);
            }, index * 100);
        });
    }

    // Анимация загрузки
    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Загрузка...</p>
            </div>
        `;
        
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 10, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(loading);
        
        return loading;
    }

    hideLoading(loadingElement) {
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
    }

    // Анимация уведомлений
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : '#00b4d8'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Инициализация анимаций
document.addEventListener('DOMContentLoaded', () => {
    window.vodecoAnimations = new VODecoAnimations();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VODecoAnimations;
}

