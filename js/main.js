// Основной JavaScript для VODeco

class VODecoApp {
    constructor() {
        this.currentLanguage = 'ru';
        this.currentSection = 'home';
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupLanguageSwitcher();
        this.setupAnimations();
        this.loadContent();
    }

    setupEventListeners() {
        // Бургер меню
        const burgerBtn = document.getElementById('burgerBtn');
        const burgerContent = document.getElementById('burgerContent');
        
        if (burgerBtn && burgerContent) {
            burgerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });

            // Закрытие меню при клике вне его
            document.addEventListener('click', (e) => {
                if (!burgerBtn.contains(e.target) && !burgerContent.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }

        // Навигация
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
                this.closeMenu();
            });
        });

        // Переключение языка
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });

        // Кнопки действий
        const actionBtns = document.querySelectorAll('.btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleActionClick(e.target);
            });
        });

        // Форма предложения
        const proposalForm = document.querySelector('.proposal-form');
        if (proposalForm) {
            proposalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProposalSubmit(e.target);
            });
        }
    }

    setupNavigation() {
        // Плавная прокрутка
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupLanguageSwitcher() {
        // Сохранение выбранного языка
        const savedLang = localStorage.getItem('vodeco-language');
        if (savedLang) {
            this.switchLanguage(savedLang);
        }
    }

    setupAnimations() {
        // Анимация появления элементов при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Наблюдение за элементами
        const animatedElements = document.querySelectorAll('.problem-item, .feature-card, .dashboard-card, .proposal-item, .token-card, .quality-item');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    loadContent() {
        // Загрузка данных для дашборда
        this.loadDashboardData();
        
        // Загрузка данных для VOD Check
        this.loadVODCheckData();
        
        // Загрузка данных для DAO
        this.loadDAOData();
    }

    toggleMenu() {
        const burgerBtn = document.getElementById('burgerBtn');
        const burgerContent = document.getElementById('burgerContent');
        
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            burgerBtn.classList.add('active');
            burgerContent.classList.add('active');
        } else {
            burgerBtn.classList.remove('active');
            burgerContent.classList.remove('active');
        }
    }

    closeMenu() {
        const burgerBtn = document.getElementById('burgerBtn');
        const burgerContent = document.getElementById('burgerContent');
        
        this.isMenuOpen = false;
        burgerBtn.classList.remove('active');
        burgerContent.classList.remove('active');
    }

    navigateToSection(sectionId) {
        // Скрыть все секции
        const sections = document.querySelectorAll('.page-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Показать выбранную секцию
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }

        // Обновить активную ссылку в навигации
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Загрузить контент для секции
        this.loadSectionContent(sectionId);
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('vodeco-language', lang);

        // Обновить активную кнопку языка
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Обновить контент на выбранном языке
        this.updateContentLanguage(lang);
    }

    updateContentLanguage(lang) {
        // Здесь можно добавить логику для перевода контента
        // Пока что просто обновляем атрибут lang у html
        document.documentElement.lang = lang;
    }

    handleActionClick(button) {
        const buttonText = button.textContent.trim();
        
        switch (buttonText) {
            case 'Присоединиться к DAO':
                this.navigateToSection('dao');
                break;
            case 'Узнать о PreSale':
                this.navigateToSection('tokenhub');
                break;
            case 'Демо объектов':
                this.navigateToSection('vodcheck');
                break;
            case 'Проголосовать':
                this.handleVoting();
                break;
            default:
                console.log('Действие не определено:', buttonText);
        }
    }

    handleVoting() {
        // Логика голосования
        alert('Функция голосования будет реализована в полной версии');
    }

    handleProposalSubmit(form) {
        const formData = new FormData(form);
        const proposalData = {
            title: formData.get('title') || form.querySelector('input[type="text"]').value,
            description: formData.get('description') || form.querySelector('textarea').value,
            budget: formData.get('budget') || form.querySelector('input[type="number"]').value
        };

        console.log('Новое предложение:', proposalData);
        alert('Предложение создано! (Демо версия)');
        form.reset();
    }

    loadDashboardData() {
        // Загрузка данных для дашборда
        const metrics = document.querySelectorAll('.metric-value');
        if (metrics.length > 0) {
            // Анимация счетчиков
            metrics.forEach(metric => {
                const finalValue = metric.textContent;
                this.animateCounter(metric, 0, parseInt(finalValue.replace(/[^\d]/g, '')), 2000);
            });
        }
    }

    loadVODCheckData() {
        // Загрузка данных для VOD Check
        console.log('Загрузка данных VOD Check...');
    }

    loadDAOData() {
        // Загрузка данных для DAO
        console.log('Загрузка данных DAO...');
    }

    loadSectionContent(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'vodcheck':
                this.loadVODCheckData();
                break;
            case 'dao':
                this.loadDAOData();
                break;
            default:
                console.log('Секция не требует дополнительной загрузки:', sectionId);
        }
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const isNumber = !isNaN(end);

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (isNumber) {
                const current = Math.floor(start + (end - start) * progress);
                element.textContent = current.toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Методы для работы с Web3 (будут реализованы в полной версии)
    connectWallet() {
        console.log('Подключение кошелька...');
        // Здесь будет логика подключения к Web3 кошельку
    }

    getTokenBalance(tokenType) {
        console.log(`Получение баланса токена ${tokenType}...`);
        // Здесь будет логика получения баланса токенов
    }

    stakeTokens(amount, duration) {
        console.log(`Стейкинг ${amount} токенов на ${duration} дней...`);
        // Здесь будет логика стейкинга
    }

    voteOnProposal(proposalId, vote) {
        console.log(`Голосование по предложению ${proposalId}: ${vote}`);
        // Здесь будет логика голосования
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.vodecoApp = new VODecoApp();
});

// Обработка ошибок
window.addEventListener('error', (e) => {
    console.error('Ошибка в VODeco:', e.error);
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Перерисовка анимаций при изменении размера
    if (window.spiderWebAnimation) {
        window.spiderWebAnimation.resize();
    }
});

    // Экспорт для использования в других модулях
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = VODecoApp;
    }
}

// Функции для презентации
let currentSlideIndex = 0;
const totalSlides = 3;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function currentSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = slideNumber - 1;
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

// Автоматическая смена слайдов
setInterval(() => {
    if (document.getElementById('presentation').classList.contains('active')) {
        changeSlide(1);
    }
}, 5000);

