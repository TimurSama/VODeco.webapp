// Система попапов с визуализацией данных для VODeco

class PopupSystem {
    constructor() {
        this.overlay = null;
        this.content = null;
        this.init();
    }

    init() {
        this.createOverlay();
        this.setupEventListeners();
    }

    createOverlay() {
        this.overlay = document.getElementById('popupOverlay');
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'popupOverlay';
            this.overlay.className = 'popup-overlay';
            this.overlay.innerHTML = `
                <div class="popup-content">
                    <button class="popup-close">&times;</button>
                    <div class="popup-header">
                        <h3 id="popupTitle"></h3>
                    </div>
                    <div class="popup-body" id="popupBody"></div>
                </div>
            `;
            document.body.appendChild(this.overlay);
        }
    }

    setupEventListeners() {
        const closeBtn = this.overlay.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => this.close());

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });

        // Обработчики для элементов с data-popup
        this.attachPopupTriggers();
    }

    attachPopupTriggers() {
        // Используем делегирование событий для динамически добавляемых элементов
        document.body.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-popup]');
            if (trigger) {
                e.preventDefault();
                const dataKey = trigger.getAttribute('data-popup');
                this.open(dataKey);
            }
        });
    }

    open(dataKey, dataSource = VODecoData) {
        const data = this.getNestedData(dataSource, dataKey);
        if (!data) {
            console.error('Данные не найдены:', dataKey);
            return;
        }

        const title = document.getElementById('popupTitle');
        const body = document.getElementById('popupBody');

        title.textContent = data.title || data.mainTitle || 'Информация';
        body.innerHTML = this.generateContent(data);

        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Анимация появления с задержкой для таблиц
        setTimeout(() => {
            this.animateElements();
        }, 100);
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    getNestedData(obj, path) {
        const keys = path.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current[key] === undefined) {
                return null;
            }
            current = current[key];
        }
        
        return current;
    }

    generateContent(data) {
        let html = '';

        // Основное описание
        if (data.details) {
            const details = data.details;
            
            if (details.mainTitle) {
                html += `<div class="popup-highlight">
                    <h4>${details.mainTitle}</h4>
                    ${details.description ? `<p>${details.description}</p>` : ''}
                </div>`;
            }

            // Таблица с данными
            if (details.table) {
                html += this.createDataTable(details.table);
            }

            // Метрики
            if (details.metrics) {
                html += this.createMetricsGrid(details.metrics);
            }

            // Секторы с ROI
            if (details.sectors) {
                html += this.createSectorsTable(details.sectors);
            }

            // Регионы
            if (details.regions) {
                html += this.createRegionsChart(details.regions);
            }

            // Типы загрязнения
            if (details.pollutionTypes) {
                html += this.createPollutionChart(details.pollutionTypes);
            }

            // Типы потерь
            if (details.lossTypes) {
                html += this.createLossChart(details.lossTypes);
            }

            // Распределение
            if (details.distribution) {
                html += this.createDistributionChart(details.distribution);
            }

            // Разбивка инвестиций
            if (details.breakdown) {
                html += this.createBreakdownTable(details.breakdown);
            }

            // Источники финансирования
            if (details.sources) {
                html += this.createPieChart(details.sources);
            }

            // Секторы производства
            if (details.sectors && !details.roi) {
                html += this.createProductionChart(details.sectors);
            }

            // Качество
            if (details.quality) {
                html += this.createQualityBars(details.quality);
            }

            // Типы участников
            if (details.types && Array.isArray(details.types) && details.types[0].type) {
                html += this.createParticipantsChart(details.types);
            }

            // География
            if (details.geography) {
                html += this.createGeographyChart(details.geography);
            }

            // Последствия/Проблемы (списки)
            if (details.consequences) {
                html += this.createList('Последствия:', details.consequences, 'warning');
            }

            if (details.categories) {
                html += this.createList('Типы загрязнения:', details.categories);
            }

            if (details.infrastructureProblems) {
                html += this.createList('Проблемы инфраструктуры:', details.infrastructureProblems, 'danger');
            }

            if (details.types && Array.isArray(details.types) && typeof details.types[0] === 'string') {
                html += this.createList('Типы объектов:', details.types);
            }

            // Возможности/Преимущества
            if (details.features && Array.isArray(details.features) && typeof details.features[0] === 'object') {
                html += this.createFeaturesGrid(details.features);
            }

            if (details.algorithms) {
                html += this.createList('AI алгоритмы:', details.algorithms, 'success');
            }
        }

        // Для токеномики
        if (data.rounds) {
            html += this.createPresaleTable(data.rounds);
        }

        // Для проектов
        if (data.projects) {
            html += this.createProjectsTable(data.projects);
        }

        // Для предложений DAO
        if (data.voting) {
            html += this.createVotingProgress(data);
        }

        return html;
    }

    createDataTable(data) {
        let html = '<div class="popup-table-container animate-item">';
        html += '<table class="popup-table">';
        html += '<thead><tr>';
        
        // Определяем заголовки из первого объекта
        const headers = Object.keys(data[0]);
        headers.forEach(header => {
            html += `<th>${this.formatHeader(header)}</th>`;
        });
        html += '</tr></thead><tbody>';

        // Данные
        data.forEach((row, index) => {
            html += `<tr style="animation-delay: ${index * 0.05}s">`;
            headers.forEach(header => {
                html += `<td>${row[header]}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        return html;
    }

    createMetricsGrid(metrics) {
        let html = '<div class="popup-metrics-grid animate-item">';
        metrics.forEach((metric, index) => {
            html += `
                <div class="popup-metric-card" style="animation-delay: ${index * 0.1}s">
                    <div class="metric-icon"><i class="fas fa-chart-line"></i></div>
                    <h5>${metric.label}</h5>
                    <p class="metric-value">${metric.value}</p>
                </div>`;
        });
        html += '</div>';
        return html;
    }

    createSectorsTable(sectors) {
        let html = '<div class="popup-sectors animate-item"><h4>Секторы:</h4>';
        html += '<div class="sectors-grid">';
        sectors.forEach((sector, index) => {
            html += `
                <div class="sector-card" style="animation-delay: ${index * 0.1}s">
                    <h5>${sector.name}</h5>
                    <div class="sector-info">
                        <span class="sector-roi">${sector.roi} ROI</span>
                        ${sector.period ? `<span class="sector-period">${sector.period}</span>` : ''}
                    </div>
                </div>`;
        });
        html += '</div></div>';
        return html;
    }

    createRegionsChart(regions) {
        let html = '<div class="popup-chart animate-item"><h4>Распределение по регионам:</h4>';
        html += '<div class="chart-bars">';
        
        const maxValue = Math.max(...regions.map(r => parseInt(r.affected.replace(/[^\d]/g, ''))));
        
        regions.forEach((region, index) => {
            const value = parseInt(region.affected.replace(/[^\d]/g, ''));
            const percentage = (value / maxValue) * 100;
            
            html += `
                <div class="chart-bar-item" style="animation-delay: ${index * 0.1}s">
                    <div class="chart-bar-label">${region.name}</div>
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar" style="width: ${percentage}%">
                            <span class="chart-bar-value">${region.affected}</span>
                        </div>
                    </div>
                    <div class="chart-bar-percentage">${region.percentage}</div>
                </div>`;
        });
        
        html += '</div></div>';
        return html;
    }

    createPollutionChart(types) {
        let html = '<div class="popup-chart animate-item"><h4>Типы загрязнения:</h4>';
        html += '<div class="pollution-grid">';
        
        types.forEach((item, index) => {
            html += `
                <div class="pollution-card" style="animation-delay: ${index * 0.1}s">
                    <h5>${item.type}</h5>
                    <div class="pollution-value">${item.percentage || item.amount}</div>
                    <p class="pollution-note">${item.note}</p>
                </div>`;
        });
        
        html += '</div></div>';
        return html;
    }

    createLossChart(types) {
        let html = '<div class="popup-chart animate-item"><h4>Структура потерь:</h4>';
        html += '<div class="loss-grid">';
        
        types.forEach((item, index) => {
            const percentage = parseInt(item.loss.replace('%', '').split('-')[1] || item.loss.replace('%', ''));
            
            html += `
                <div class="loss-card" style="animation-delay: ${index * 0.1}s">
                    <div class="loss-circle" style="--percentage: ${percentage}">
                        <svg viewBox="0 0 36 36">
                            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="circle" stroke-dasharray="${percentage}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <text x="18" y="20.35" class="percentage">${item.loss}</text>
                        </svg>
                    </div>
                    <h5>${item.type}</h5>
                </div>`;
        });
        
        html += '</div></div>';
        return html;
    }

    createDistributionChart(distribution) {
        return this.createRegionsChart(distribution.map(d => ({
            name: d.region,
            affected: d.count + ' объектов',
            percentage: d.percentage
        })));
    }

    createBreakdownTable(breakdown) {
        let html = '<div class="popup-table-container animate-item">';
        html += '<table class="popup-table breakdown-table">';
        html += '<tbody>';
        
        breakdown.forEach((item, index) => {
            html += `<tr style="animation-delay: ${index * 0.05}s">`;
            html += `<td class="breakdown-label">${item.type}</td>`;
            html += `<td class="breakdown-value">${item.amount || item.value}</td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        return html;
    }

    createPieChart(sources) {
        let html = '<div class="popup-chart animate-item"><h4>Источники финансирования:</h4>';
        html += '<div class="pie-chart-container">';
        
        let startAngle = 0;
        const colors = ['#00b4d8', '#0077b6', '#90e0ef', '#48cae4', '#00b4d8'];
        
        sources.forEach((source, index) => {
            const percentage = parseInt(source.percentage.replace('%', ''));
            const angle = (percentage / 100) * 360;
            
            html += `
                <div class="pie-segment-info" style="animation-delay: ${index * 0.1}s">
                    <div class="pie-segment-color" style="background: ${colors[index % colors.length]}"></div>
                    <span class="pie-segment-name">${source.name}</span>
                    <span class="pie-segment-percentage">${source.percentage}</span>
                </div>`;
            
            startAngle += angle;
        });
        
        html += '</div></div>';
        return html;
    }

    createProductionChart(sectors) {
        let html = '<div class="popup-chart animate-item"><h4>Распределение по секторам:</h4>';
        html += '<div class="production-grid">';
        
        sectors.forEach((sector, index) => {
            html += `
                <div class="production-card" style="animation-delay: ${index * 0.1}s">
                    <h5>${sector.name}</h5>
                    <div class="production-bar">
                        <div class="production-fill" style="width: ${sector.percentage}"></div>
                    </div>
                    <div class="production-stats">
                        <span class="production-volume">${sector.volume}</span>
                        <span class="production-percentage">${sector.percentage}</span>
                    </div>
                </div>`;
        });
        
        html += '</div></div>';
        return html;
    }

    createQualityBars(quality) {
        let html = '<div class="popup-chart animate-item"><h4>Показатели качества:</h4>';
        html += '<div class="quality-bars">';
        
        quality.forEach((item, index) => {
            const value = parseFloat(item.value);
            const isNegative = value < 0;
            const absValue = Math.abs(value);
            
            html += `
                <div class="quality-bar-item" style="animation-delay: ${index * 0.1}s">
                    <div class="quality-label">${item.metric}</div>
                    <div class="quality-bar-wrapper">
                        <div class="quality-bar ${isNegative ? 'negative' : 'positive'}" 
                             style="width: ${absValue}%">
                            <span class="quality-value">${item.value}</span>
                        </div>
                    </div>
                </div>`;
        });
        
        html += '</div></div>';
        return html;
    }

    createParticipantsChart(types) {
        let html = '<div class="popup-chart animate-item"><h4>Типы участников:</h4>';
        html += '<div class="participants-grid">';
        
        const total = types.reduce((sum, t) => sum + parseInt(t.count.replace(/[^\d]/g, '')), 0);
        
        types.forEach((type, index) => {
            const count = parseInt(type.count.replace(/[^\d]/g, ''));
            const percentage = ((count / total) * 100).toFixed(1);
            
            html += `
                <div class="participant-card" style="animation-delay: ${index * 0.1}s">
                    <div class="participant-icon"><i class="fas fa-users"></i></div>
                    <h5>${type.type}</h5>
                    <div class="participant-count">${type.count}</div>
                    <div class="participant-percentage">${percentage}%</div>
                </div>`;
        });
        
        html += '</div></div>';
        return html;
    }

    createGeographyChart(geography) {
        return this.createRegionsChart(geography.map(g => ({
            name: g.region,
            affected: g.count + ' участников',
            percentage: g.percentage
        })));
    }

    createList(title, items, type = 'default') {
        let html = `<div class="popup-list animate-item ${type}"><h4>${title}</h4><ul>`;
        items.forEach((item, index) => {
            html += `<li style="animation-delay: ${index * 0.05}s">${item}</li>`;
        });
        html += '</ul></div>';
        return html;
    }

    createFeaturesGrid(features) {
        let html = '<div class="popup-features-grid animate-item">';
        features.forEach((feature, index) => {
            html += `
                <div class="feature-card-popup" style="animation-delay: ${index * 0.1}s">
                    <h5>${feature.name}</h5>
                    <p>${feature.desc}</p>
                </div>`;
        });
        html += '</div>';
        return html;
    }

    createPresaleTable(rounds) {
        let html = '<div class="popup-table-container animate-item">';
        html += '<table class="popup-table presale-table">';
        html += '<thead><tr><th>Раунд</th><th>Объем</th><th>Цена</th><th>Разморозка</th></tr></thead>';
        html += '<tbody>';
        
        rounds.forEach((round, index) => {
            html += `<tr style="animation-delay: ${index * 0.05}s">`;
            html += `<td>${round.name}</td>`;
            html += `<td>${round.amount}</td>`;
            html += `<td class="price-cell">${round.price}</td>`;
            html += `<td class="unlock-cell">${round.unlock}</td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        return html;
    }

    createProjectsTable(projects) {
        let html = '<div class="popup-table-container animate-item">';
        html += '<table class="popup-table projects-table">';
        html += '<thead><tr><th>Проект</th><th>Локация</th><th>Финансирование</th><th>Доступно DAO</th><th>IRR</th><th>Статус</th></tr></thead>';
        html += '<tbody>';
        
        projects.forEach((project, index) => {
            html += `<tr style="animation-delay: ${index * 0.05}s">`;
            html += `<td><strong>${project.name}</strong></td>`;
            html += `<td>${project.location}</td>`;
            html += `<td>${project.funding}</td>`;
            html += `<td class="dao-available">${project.daoAvailable}</td>`;
            html += `<td class="irr-cell">${project.irr}</td>`;
            html += `<td><span class="status-badge ${project.status === 'Активный' ? 'active' : 'pending'}">${project.status}</span></td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        return html;
    }

    createVotingProgress(proposal) {
        const percentage = (proposal.voting.current / proposal.voting.required * 100).toFixed(1);
        
        let html = '<div class="popup-voting animate-item">';
        html += '<h4>Прогресс голосования:</h4>';
        html += '<div class="voting-progress-bar">';
        html += `<div class="voting-progress-fill" style="width: ${percentage}%"></div>`;
        html += `<span class="voting-progress-text">${proposal.voting.current} / ${proposal.voting.required} голосов (${percentage}%)</span>`;
        html += '</div>';
        html += `<p class="voting-deadline">Осталось: ${proposal.voting.deadline}</p>`;
        
        if (proposal.details && proposal.details.goals) {
            html += '<h4>Цели проекта:</h4><ul class="goals-list">';
            proposal.details.goals.forEach((goal, index) => {
                html += `<li style="animation-delay: ${index * 0.05}s">${goal}</li>`;
            });
            html += '</ul>';
        }
        
        html += '</div>';
        return html;
    }

    formatHeader(header) {
        const map = {
            'region': 'Регион',
            'percentage': '%',
            'amount': 'Объем',
            'name': 'Название',
            'roi': 'ROI',
            'period': 'Период',
            'count': 'Количество',
            'type': 'Тип'
        };
        return map[header] || header.charAt(0).toUpperCase() + header.slice(1);
    }

    animateElements() {
        const elements = this.overlay.querySelectorAll('.animate-item');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 100);
        });
    }
}

// Инициализация системы попапов
document.addEventListener('DOMContentLoaded', () => {
    window.popupSystem = new PopupSystem();
    
    // Глобальная функция для открытия попапов
    window.openPopup = function(dataKey) {
        window.popupSystem.open(dataKey);
    };
    
    // Функция закрытия для обратной совместимости
    window.closePopup = function() {
        window.popupSystem.close();
    };
});

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PopupSystem;
}

