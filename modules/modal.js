// Модуль для модальных окон
// Простая система модальных окон на чистом JavaScript

class Modal {
    // Показываем модальное окно
    static show(title, message, type = 'info') {
        // Создаем overlay (подложка)
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'modal-overlay';
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        // Иконка в зависимости от типа
        let icon = 'i';
        if (type === 'error') icon = '❌';
        if (type === 'success') icon = '✅';
        if (type === 'warning') icon = '⚠️';
        
        modal.innerHTML = `
            <div class="modal-header">
                <span class="modal-icon">${icon}</span>
                <h3 class="modal-title">${title}</h3>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="modal-button modal-button-ok">ОК</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Закрытие при клике на кнопку
        const okButton = modal.querySelector('.modal-button-ok');
        okButton.addEventListener('click', () => {
            this.close();
        });
        
        // Закрытие при клике на overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });
        
        // Закрытие по Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // Показываем модальное окно с подтверждением
    static confirm(title, message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-header">
                <span class="modal-icon">❓</span>
                <h3 class="modal-title">${title}</h3>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="modal-button modal-button-cancel">Отмена</button>
                <button class="modal-button modal-button-confirm">Подтвердить</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Обработчики кнопок
        const confirmButton = modal.querySelector('.modal-button-confirm');
        const cancelButton = modal.querySelector('.modal-button-cancel');
        
        confirmButton.addEventListener('click', () => {
            this.close();
            if (onConfirm) onConfirm();
        });
        
        cancelButton.addEventListener('click', () => {
            this.close();
            if (onCancel) onCancel();
        });
        
        // Закрытие при клике на overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
                if (onCancel) onCancel();
            }
        });
        
        // Закрытие по Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                if (onCancel) onCancel();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // Закрываем модальное окно
    static close() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

