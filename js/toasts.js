// ============================================
/// TOAST NOTIFICATION SYSTEM
// ============================================

const ToastManager = {
    container: null,
    idCounter: 0,

    init() {
        this.container = document.getElementById('toastContainer');
    },

    show(options) {
        const {
            title = 'Notification',
            message = '',
            type = 'info',
            duration = 4000
        } = options;

        const id = ++this.idCounter;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.dataset.id = id;

        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${iconMap[type] || iconMap.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" data-id="${id}">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);

        const timeout = setTimeout(() => {
            this.remove(id);
        }, duration);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timeout);
            this.remove(id);
        });

        return id;
    },

    remove(id) {
        const toast = this.container.querySelector(`[data-id="${id}"]`);
        if (toast) {
            toast.classList.add('removing');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    },

    success(title, message, duration) {
        return this.show({ title, message, type: 'success', duration });
    },

    error(title, message, duration) {
        return this.show({ title, message, type: 'error', duration });
    },

    warning(title, message, duration) {
        return this.show({ title, message, type: 'warning', duration });
    },

    info(title, message, duration) {
        return this.show({ title, message, type: 'info', duration });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ToastManager.init();
});
