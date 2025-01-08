// Модуль To-Do списка с LocalStorage
// Простой список задач с сохранением в браузере

class TodoList {
    constructor() {
        // Загружаем задачи из LocalStorage при создании
        this.todos = this.loadFromStorage();
    }

    // Загружаем задачи из LocalStorage
    loadFromStorage() {
        const stored = localStorage.getItem('todos');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    // Сохраняем задачи в LocalStorage
    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // Отображаем весь To-Do список
    render() {
        return `
            <div class="todo-container">
                <div class="todo-card">
                    <h2 class="todo-title">To-Do Список</h2>
                    
                    <div class="todo-input-container">
                        <input 
                            type="text" 
                            class="todo-input" 
                            id="todo-input" 
                            placeholder="Добавить новую задачу..."
                            maxlength="100"
                        >
                        <button class="add-button" id="add-todo-btn">Добавить</button>
                    </div>
                    
                    <ul class="todo-list" id="todo-list">
                        ${this.renderTodos()}
                    </ul>
                </div>
            </div>
        `;
    }

    // Отображаем список задач
    renderTodos() {
        // Если задач нет, показываем сообщение
        if (this.todos.length === 0) {
            return '<li class="todo-empty">Нет задач. Добавьте новую задачу!</li>';
        }

        // Создаем HTML для каждой задачи
        let html = '';
        for (let i = 0; i < this.todos.length; i++) {
            const todo = this.todos[i];
            const completedClass = todo.completed ? 'completed' : '';
            html += `
                <li class="todo-item ${completedClass}" data-index="${i}">
                    <input 
                        type="checkbox" 
                        class="todo-checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        data-index="${i}"
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="todo-delete" data-index="${i}">Удалить</button>
                </li>
            `;
        }
        return html;
    }

    // Защита от XSS - экранируем HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Инициализация - настраиваем обработчики событий
    init() {
        // Кнопка добавления задачи
        const addButton = document.getElementById('add-todo-btn');
        if (addButton) {
            addButton.addEventListener('click', () => {
                this.addTodo();
            });
        }

        // Поле ввода - добавление по Enter
        const input = document.getElementById('todo-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTodo();
                }
            });
        }

        // Настраиваем обработчики для существующих задач
        this.setupEventHandlers();
    }

    // Настраиваем обработчики для задач
    setupEventHandlers() {
        const list = document.getElementById('todo-list');
        if (!list) return;

        // Обработчик для чекбоксов
        const checkboxes = list.querySelectorAll('.todo-checkbox');
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].addEventListener('change', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.toggleTodo(index);
            });
        }

        // Обработчик для кнопок удаления
        const deleteButtons = list.querySelectorAll('.todo-delete');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.deleteTodo(index);
            });
        }
    }

    // Добавляем новую задачу
    addTodo() {
        const input = document.getElementById('todo-input');
        if (!input) return;

        const text = input.value.trim();

        // Проверяем, что текст не пустой
        if (text === '') {
            Modal.show('Ошибка', 'Введите текст задачи!', 'error');
            return;
        }

        // Добавляем задачу в массив
        this.todos.push({
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        });

        // Сохраняем в LocalStorage
        this.saveToStorage();
        
        // Обновляем отображение
        this.updateRender();
        
        // Очищаем поле ввода
        input.value = '';
        input.focus();
    }

    // Переключаем статус задачи (выполнена/не выполнена)
    toggleTodo(index) {
        if (this.todos[index]) {
            this.todos[index].completed = !this.todos[index].completed;
            this.saveToStorage();
            this.updateRender();
        }
    }

    // Удаляем задачу
    deleteTodo(index) {
        // Показываем модальное окно для подтверждения
        Modal.confirm(
            'Удаление задачи',
            'Вы уверены, что хотите удалить эту задачу?',
            () => {
                // Если подтвердили - удаляем
                this.todos.splice(index, 1);
                this.saveToStorage();
                this.updateRender();
            },
            () => {
                // Если отменили - ничего не делаем
            }
        );
    }

    // Обновляем отображение списка задач
    updateRender() {
        const list = document.getElementById('todo-list');
        if (list) {
            list.innerHTML = this.renderTodos();
            // После обновления нужно заново настроить обработчики
            this.setupEventHandlers();
        }
    }
}

// Создаем экземпляр To-Do списка
const todoList = new TodoList();

