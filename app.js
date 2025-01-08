// Главный файл приложения
const app = document.getElementById('app');

// Главная страница
function renderHome() {
    app.innerHTML = `
        <div class="home-container">
            <h1 class="home-title">Добро пожаловать!</h1>
            <p class="home-description">
                Многофункциональное SPA приложение на чистом JavaScript
            </p>
            
            <div class="features-grid">
                <div class="feature-card" data-route="/calculator">
                    <div class="feature-icon"></div>
                    <h3 class="feature-title">Калькулятор</h3>
                    <p class="feature-description">
                        Рассчитайте кредит или вклад с учетом процентных ставок и сроков
                    </p>
                </div>
                
                <div class="feature-card" data-route="/todo">
                    <div class="feature-icon"></div>
                    <h3 class="feature-title">To-Do Список</h3>
                    <p class="feature-description">
                        Управляйте задачами с сохранением в LocalStorage
                    </p>
                </div>
                
                <div class="feature-card" data-route="/memory">
                    <div class="feature-icon"></div>
                    <h3 class="feature-title">Игра Память</h3>
                    <p class="feature-description">
                        Тренируйте память, находя пары карт
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем обработчики кликов на карточки
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const route = card.getAttribute('data-route');
            if (route) {
                router.navigate(route);
            }
        });
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Регистрация маршрутов
    router.route('/', () => {
        renderHome();
    });

    router.route('/calculator', () => {
        app.innerHTML = calculator.render();
        calculator.init();
    });

    router.route('/todo', () => {
        app.innerHTML = todoList.render();
        todoList.init();
    });

    router.route('/memory', () => {
        app.innerHTML = memoryGame.render();
        memoryGame.init();
    });

    // Инициализация роутера после регистрации маршрутов
    router.init();

    // Если нет hash, показываем главную
    if (!window.location.hash) {
        window.location.hash = '/';
    } else {
        // Если есть hash, обрабатываем его
        router.handleRoute();
    }
});

