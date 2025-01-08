// Модуль калькулятора кредита и вклада
// Простой калькулятор для расчета кредита и вклада

class Calculator {
    constructor() {
        // По умолчанию открываем вкладку кредита
        this.currentTab = 'credit';
    }

    // Рендер калькулятора
    render() {
        return `
            <div class="calculator-container">
                <div class="calculator-card">
                    <h2 class="calculator-title">💰 Калькулятор</h2>
                    
                    <div class="calculator-tabs">
                        <button class="tab-button active" data-tab="credit">Кредит</button>
                        <button class="tab-button" data-tab="deposit">Вклад</button>
                    </div>

                    <div id="calculator-content">
                        ${this.renderCreditCalculator()}
                    </div>
                </div>
            </div>
        `;
    }

    // Рендер калькулятора кредита
    renderCreditCalculator() {
        return `
            <form id="credit-form">
                <div class="form-group">
                    <label class="form-label">Сумма кредита (₽)</label>
                    <input type="number" class="form-input" id="credit-amount" placeholder="1000000" min="1000" step="1000" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Процентная ставка (% годовых)</label>
                    <input type="number" class="form-input" id="credit-rate" placeholder="12" min="1" max="100" step="0.1" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Срок кредита (лет)</label>
                    <input type="number" class="form-input" id="credit-term" placeholder="5" min="1" max="30" step="1" required>
                </div>
                
                <button type="submit" class="calculate-button">Рассчитать</button>
            </form>
            
            <div id="credit-result" style="display: none;"></div>
        `;
    }

    // Рендер калькулятора вклада
    renderDepositCalculator() {
        return `
            <form id="deposit-form">
                <div class="form-group">
                    <label class="form-label">Сумма вклада (₽)</label>
                    <input type="number" class="form-input" id="deposit-amount" placeholder="1000000" min="1000" step="1000" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Процентная ставка (% годовых)</label>
                    <input type="number" class="form-input" id="deposit-rate" placeholder="8" min="1" max="100" step="0.1" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Срок вклада (лет)</label>
                    <input type="number" class="form-input" id="deposit-term" placeholder="3" min="1" max="30" step="1" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Капитализация</label>
                    <select class="form-input" id="deposit-capitalization">
                        <option value="monthly">Ежемесячная</option>
                        <option value="quarterly">Ежеквартальная</option>
                        <option value="yearly">Ежегодная</option>
                        <option value="none">Без капитализации</option>
                    </select>
                </div>
                
                <button type="submit" class="calculate-button">Рассчитать</button>
            </form>
            
            <div id="deposit-result" style="display: none;"></div>
        `;
    }

    // Инициализация - настраиваем обработчики событий
    init() {
        // Обработчик для переключения вкладок
        const tabButtons = document.querySelectorAll('.tab-button');
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        }

        // Обработчик для формы кредита
        const creditForm = document.getElementById('credit-form');
        if (creditForm) {
            creditForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateCredit();
            });
        }

        // Обработчик для формы вклада
        const depositForm = document.getElementById('deposit-form');
        if (depositForm) {
            depositForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateDeposit();
            });
        }
    }

    // Переключение вкладок (кредит/вклад)
    switchTab(tab) {
        this.currentTab = tab;
        const content = document.getElementById('calculator-content');
        const buttons = document.querySelectorAll('.tab-button');
        
        // Убираем активный класс у всех кнопок
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
            // Добавляем активный класс нужной кнопке
            if (buttons[i].getAttribute('data-tab') === tab) {
                buttons[i].classList.add('active');
            }
        }

        // Меняем содержимое в зависимости от выбранной вкладки
        if (tab === 'credit') {
            content.innerHTML = this.renderCreditCalculator();
            // После смены содержимого нужно заново настроить обработчики
            const creditForm = document.getElementById('credit-form');
            if (creditForm) {
                creditForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.calculateCredit();
                });
            }
        } else {
            content.innerHTML = this.renderDepositCalculator();
            // После смены содержимого нужно заново настроить обработчики
            const depositForm = document.getElementById('deposit-form');
            if (depositForm) {
                depositForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.calculateDeposit();
                });
            }
        }
    }

    // Расчет кредита
    calculateCredit() {
        const amount = parseFloat(document.getElementById('credit-amount').value);
        const rate = parseFloat(document.getElementById('credit-rate').value) / 100;
        const term = parseFloat(document.getElementById('credit-term').value);

        // Проверяем, что все поля заполнены
        if (!amount || !rate || !term) {
            Modal.show('Ошибка', 'Заполните все поля!', 'error');
            return;
        }

        // Аннуитетный платеж
        const monthlyRate = rate / 12;
        const months = term * 12;
        const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                              (Math.pow(1 + monthlyRate, months) - 1);

        const totalPayment = monthlyPayment * months;
        const overpayment = totalPayment - amount;

        const resultDiv = document.getElementById('credit-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="result-container">
                <h3 class="result-title">Результаты расчета:</h3>
                <div class="result-item">
                    <span>Ежемесячный платеж:</span>
                    <span>${monthlyPayment.toFixed(2)} ₽</span>
                </div>
                <div class="result-item">
                    <span>Общая сумма выплат:</span>
                    <span>${totalPayment.toFixed(2)} ₽</span>
                </div>
                <div class="result-item">
                    <span>Переплата:</span>
                    <span>${overpayment.toFixed(2)} ₽</span>
                </div>
            </div>
        `;
    }

    // Расчет вклада
    calculateDeposit() {
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        const rate = parseFloat(document.getElementById('deposit-rate').value) / 100;
        const term = parseFloat(document.getElementById('deposit-term').value);
        const capitalization = document.getElementById('deposit-capitalization').value;

        // Проверяем, что все поля заполнены
        if (!amount || !rate || !term) {
            Modal.show('Ошибка', 'Заполните все поля!', 'error');
            return;
        }

        let finalAmount;
        const periodsPerYear = {
            'monthly': 12,
            'quarterly': 4,
            'yearly': 1,
            'none': 0
        };

        if (capitalization === 'none') {
            // Простые проценты
            finalAmount = amount * (1 + rate * term);
        } else {
            // Сложные проценты
            const periods = periodsPerYear[capitalization];
            const n = term * periods;
            const r = rate / periods;
            finalAmount = amount * Math.pow(1 + r, n);
        }

        const profit = finalAmount - amount;

        const resultDiv = document.getElementById('deposit-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="result-container">
                <h3 class="result-title">Результаты расчета:</h3>
                <div class="result-item">
                    <span>Начальная сумма:</span>
                    <span>${amount.toFixed(2)} ₽</span>
                </div>
                <div class="result-item">
                    <span>Сумма через ${term} ${term === 1 ? 'год' : term < 5 ? 'года' : 'лет'}:</span>
                    <span>${finalAmount.toFixed(2)} ₽</span>
                </div>
                <div class="result-item">
                    <span>Доход:</span>
                    <span>${profit.toFixed(2)} ₽</span>
                </div>
            </div>
        `;
    }
}

// Создаем экземпляр калькулятора
const calculator = new Calculator();

