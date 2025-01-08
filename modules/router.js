// Простой роутер на чистом JavaScript
// Роутер для навигации между страницами в SPA приложении

class Router {
    constructor() {
        // Объект для хранения маршрутов
        this.routes = {};
        // Текущий маршрут
        this.currentRoute = '';
        // Флаг инициализации
        this.initialized = false;
    }

    // Инициализация роутера
    init() {
        // Если уже инициализирован, выходим
        if (this.initialized) return;
        this.initialized = true;

        // Обработка кликов по навигационным ссылкам
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigate(route);
            }
        });

        // Обработка изменения hash в URL (например, при нажатии назад/вперед)
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });

        // Обработка начальной загрузки страницы
        this.handleRoute();
    }

    // Регистрация маршрута
    route(path, handler) {
        this.routes[path] = handler;
    }

    // Навигация на новый маршрут
    navigate(path) {
        window.location.hash = path;
        this.handleRoute();
    }

    // Обработка маршрута
    handleRoute() {
        // Получаем hash из URL (например, #/calculator -> /calculator)
        const hash = window.location.hash.slice(1) || '/';
        this.currentRoute = hash;

        // Обновляем активную ссылку в навигации
        const navLinks = document.querySelectorAll('.nav-link');
        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove('active');
            if (navLinks[i].getAttribute('data-route') === hash) {
                navLinks[i].classList.add('active');
            }
        }

        // Вызываем обработчик для текущего маршрута
        const handler = this.routes[hash] || this.routes['/'];
        if (handler) {
            handler();
        }
    }

    // Получить текущий маршрут
    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Создаем экземпляр роутера
const router = new Router();

