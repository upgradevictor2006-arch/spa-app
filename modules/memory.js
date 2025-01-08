// Модуль игры "Память" (Memory Game)
// Классическая игра на память - нужно найти пары одинаковых карт

class MemoryGame {
    constructor() {
        // Массив всех карт на поле
        this.cards = [];
        // Индексы открытых карт (максимум 2)
        this.flippedCards = [];
        // Количество найденных пар
        this.matchedPairs = 0;
        // Количество ходов
        this.moves = 0;
        // Флаг начала игры
        this.gameStarted = false;
        // Эмодзи для карт (8 разных, по 2 штуки каждого)
        this.emojis = ['🎮', '🚀', '💻', '🎨', '🎵', '🌟', '🔥', '⭐'];
    }

    // Рендер игры
    render() {
        return `
            <div class="memory-container">
                <div class="memory-card">
                    <h2 class="memory-title">🧠 Игра "Память"</h2>
                    
                    <div class="memory-stats">
                        <div class="stat-item">
                            <div class="stat-label">Ходы</div>
                            <div class="stat-value" id="moves-count">0</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Найдено пар</div>
                            <div class="stat-value" id="pairs-count">0 / 8</div>
                        </div>
                    </div>
                    
                    <div class="memory-board" id="memory-board">
                        ${this.renderBoard()}
                    </div>
                    
                    <button class="memory-restart" id="restart-btn">Начать заново</button>
                </div>
            </div>
        `;
    }

    // Рендер игрового поля
    renderBoard() {
        // Если карты еще не созданы, инициализируем игру
        if (this.cards.length === 0) {
            this.initGame();
        }

        // Создаем HTML для каждой карты
        let html = '';
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            let classes = 'memory-cell';
            if (card.flipped) classes += ' flipped';
            if (card.matched) classes += ' matched';
            
            // Показываем эмодзи, если карта перевернута или совпала
            const emoji = (card.flipped || card.matched) ? card.emoji : '❓';
            
            html += `<div class="${classes}" data-index="${i}">${emoji}</div>`;
        }
        return html;
    }

    // Инициализация игры
    initGame() {
        // Создаем пары карт (каждый эмодзи по 2 раза)
        const pairs = [];
        for (let i = 0; i < this.emojis.length; i++) {
            pairs.push(this.emojis[i]);
            pairs.push(this.emojis[i]);
        }
        
        // Перемешиваем карты (алгоритм Фишера-Йетса)
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Меняем местами
            const temp = pairs[i];
            pairs[i] = pairs[j];
            pairs[j] = temp;
        }

        // Создаем массив карт с их состоянием
        this.cards = [];
        for (let i = 0; i < pairs.length; i++) {
            this.cards.push({
                emoji: pairs[i],
                flipped: false,
                matched: false
            });
        }

        // Сбрасываем состояние игры
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
    }

    // Инициализация событий - настраиваем обработчики
    init() {
        // Обработчик кликов по картам
        const board = document.getElementById('memory-board');
        if (board) {
            board.addEventListener('click', (e) => {
                const cell = e.target.closest('.memory-cell');
                if (cell && !cell.classList.contains('matched')) {
                    const index = parseInt(cell.getAttribute('data-index'));
                    this.flipCard(index);
                }
            });
        }

        // Кнопка перезапуска игры
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartGame();
            });
        }
    }

    // Переворот карты
    flipCard(index) {
        const card = this.cards[index];

        // Не переворачиваем уже открытые карты
        if (card.flipped || card.matched) {
            return;
        }

        // Если уже открыты 2 карты, ждем
        if (this.flippedCards.length === 2) {
            return;
        }

        // Переворачиваем карту
        card.flipped = true;
        this.flippedCards.push(index);
        this.updateRender();

        // Если открыты 2 карты, проверяем на совпадение
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }

    // Проверка совпадения открытых карт
    checkMatch() {
        const index1 = this.flippedCards[0];
        const index2 = this.flippedCards[1];
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];

        // Если эмодзи совпадают
        if (card1.emoji === card2.emoji) {
            // Карты совпали - отмечаем как найденные
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs++;
            this.updateStats();

            // Проверяем, все ли пары найдены
            if (this.matchedPairs === this.emojis.length) {
                setTimeout(() => {
                    Modal.show(
                        'Поздравляем! 🎉',
                        `Вы выиграли за ${this.moves} ходов!`,
                        'success'
                    );
                }, 500);
            }
        } else {
            // Карты не совпали - переворачиваем обратно
            card1.flipped = false;
            card2.flipped = false;
        }

        // Очищаем массив открытых карт
        this.flippedCards = [];
        // Обновляем отображение
        this.updateRender();
    }

    // Обновление статистики
    updateStats() {
        const movesEl = document.getElementById('moves-count');
        const pairsEl = document.getElementById('pairs-count');

        if (movesEl) {
            movesEl.textContent = this.moves;
        }

        if (pairsEl) {
            pairsEl.textContent = `${this.matchedPairs} / ${this.emojis.length}`;
        }
    }

    // Перезапуск игры
    restartGame() {
        this.initGame();
        this.updateRender();
        this.updateStats();
    }

    // Обновление рендера - перерисовываем игровое поле
    updateRender() {
        const board = document.getElementById('memory-board');
        if (board) {
            board.innerHTML = this.renderBoard();
            // После обновления нужно заново настроить обработчики
            // Но так как мы используем делегирование на board, это не требуется
        }
    }
}

// Создаем экземпляр игры
const memoryGame = new MemoryGame();

