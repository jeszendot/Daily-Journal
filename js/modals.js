// ============================================
// MODAL SYSTEM
// ============================================

const ModalManager = {
    overlay: null,
    modal: null,
    title: null,
    body: null,
    footer: null,
    closeBtn: null,
    callbacks: {},

    init() {
        this.overlay = document.getElementById('modalOverlay');
        this.modal = document.getElementById('modal');
        this.title = document.getElementById('modalTitle');
        this.body = document.getElementById('modalBody');
        this.footer = document.getElementById('modalFooter');
        this.closeBtn = document.getElementById('modalClose');

        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    },

    open(options) {
        const {
            title = 'Modal',
            content = '',
            footer = '',
            onClose = null,
            onConfirm = null,
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            showConfirm = true,
            showCancel = true,
            danger = false,
            success = false
        } = options;

        this.title.textContent = title;
        this.body.innerHTML = content;

        let footerHTML = '';
        if (showCancel) {
            footerHTML += `<button class="btn-secondary" id="modalCancel">${cancelText}</button>`;
        }
        if (showConfirm) {
            let btnClass = 'btn-primary';
            if (danger) btnClass = 'btn-danger';
            if (success) btnClass = 'btn-success';
            footerHTML += `<button class="${btnClass}" id="modalConfirm">${confirmText}</button>`;
        }
        this.footer.innerHTML = footerHTML;

        this.callbacks.onClose = onClose;
        this.callbacks.onConfirm = onConfirm;

        const cancelBtn = document.getElementById('modalCancel');
        const confirmBtn = document.getElementById('modalConfirm');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (this.callbacks.onConfirm) {
                    this.callbacks.onConfirm();
                }
                this.close();
            });
        }

        this.overlay.classList.add('active');
    },

    close() {
        this.overlay.classList.remove('active');
        if (this.callbacks.onClose) {
            this.callbacks.onClose();
        }
    },

    showNewsDetail(article) {
        const statusMap = {
            breaking: '🔴 Breaking News',
            published: '✅ Published',
            draft: '📝 Draft',
            archived: '📦 Archived'
        };

        const content = `
            <div class="detail-row">
                <span class="label">Title</span>
                <span class="value"><strong>${article.title}</strong></span>
            </div>
            <div class="detail-row">
                <span class="label">Category</span>
                <span class="value">
                    <i class="fas ${CATEGORY_ICONS[article.category] || 'fa-newspaper'}" 
                       style="color: ${CATEGORY_COLORS[article.category] || 'var(--gray-500)'};"></i>
                    ${article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </span>
            </div>
            <div class="detail-row">
                <span class="label">Source</span>
                <span class="value">
                    <span style="color: ${SOURCE_COLORS[article.source] || 'var(--gray-500)'}; font-weight: 600;">
                        ${SOURCE_NAMES[article.source] || article.source}
                    </span>
                </span>
            </div>
            <div class="detail-row">
                <span class="label">Status</span>
                <span class="value">
                    <span class="status-badge ${article.status}">
                        <span class="dot"></span> ${statusMap[article.status] || article.status}
                    </span>
                </span>
            </div>
            <div class="detail-row">
                <span class="label">Published</span>
                <span class="value">${article.published}</span>
            </div>
            <div class="detail-row">
                <span class="label">Author</span>
                <span class="value">${article.author}</span>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                <strong>Summary:</strong>
                <p style="margin-top: 4px;">${article.summary}</p>
            </div>
        `;

        this.open({
            title: '📰 News Article Details',
            content,
            confirmText: 'Close',
            showCancel: false,
            onClose: () => {}
        });
    },

    showDeleteConfirmation(onConfirm) {
        this.open({
            title: '🗑️ Delete Article',
            content: `
                <p>Are you sure you want to delete this news article?</p>
                <p style="color: var(--gray-500); font-size: 14px; margin-top: 8px;">
                    This action cannot be undone.
                </p>
            `,
            confirmText: 'Delete',
            danger: true,
            onConfirm
        });
    },

    showCreateAlert(onConfirm) {
        const content = `
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 14px;">
                        <i class="fas fa-tag" style="color: var(--primary-600);"></i> Alert Name
                    </label>
                    <input type="text" id="modalAlertName" placeholder="e.g., Breaking Tech News" 
                           style="width: 100%; padding: 10px; border: 1px solid var(--gray-200); border-radius: var(--radius-sm);">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 14px;">
                        <i class="fas fa-filter" style="color: var(--primary-600);"></i> Category
                    </label>
                    <select id="modalAlertCategory" style="width: 100%; padding: 10px; border: 1px solid var(--gray-200); border-radius: var(--radius-sm);">
                        <option value="all">All Categories</option>
                        <option value="technology">Technology</option>
                        <option value="business">Business</option>
                        <option value="sports">Sports</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="health">Health</option>
                        <option value="politics">Politics</option>
                        <option value="science">Science</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 14px;">
                        <i class="fas fa-rss" style="color: var(--primary-600);"></i> Source
                    </label>
                    <select id="modalAlertSource" style="width: 100%; padding: 10px; border: 1px solid var(--gray-200); border-radius: var(--radius-sm);">
                        <option value="all">All Sources</option>
                        <option value="cnn">CNN</option>
                        <option value="bbc">BBC</option>
                        <option value="reuters">Reuters</option>
                        <option value="ap">Associated Press</option>
                        <option value="nytimes">NY Times</option>
                        <option value="guardian">The Guardian</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 14px;">
                        <i class="fas fa-keyword" style="color: var(--primary-600);"></i> Keywords (comma separated)
                    </label>
                    <input type="text" id="modalAlertKeywords" placeholder="e.g., AI, technology, breakthrough" 
                           style="width: 100%; padding: 10px; border: 1px solid var(--gray-200); border-radius: var(--radius-sm);">
                </div>
            </div>
        `;

        this.open({
            title: '🔔 Create News Alert',
            content,
            confirmText: 'Create Alert',
            success: true,
            showCancel: true,
            onConfirm: () => {
                const name = document.getElementById('modalAlertName').value.trim();
                const category = document.getElementById('modalAlertCategory').value;
                const source = document.getElementById('modalAlertSource').value;
                const keywords = document.getElementById('modalAlertKeywords').value.trim();

                if (!name) {
                    ToastManager.error('Error', 'Please enter an alert name');
                    return;
                }

                if (onConfirm) {
                    onConfirm({ name, category, source, keywords });
                }
            }
        });
    },

    showShareArticle(article) {
        const content = `
            <div style="text-align: center; padding: 8px 0;">
                <p style="margin-bottom: 16px; font-weight: 500;">Share this article</p>
                <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                    <button onclick="navigator.clipboard.writeText('${article.title} - ${article.url || window.location.href}')" 
                            style="padding: 12px 20px; background: var(--primary-100); border: none; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">
                        <i class="fas fa-copy" style="color: var(--primary-600); font-size: 20px;"></i>
                        <span style="display: block; font-size: 11px; color: var(--gray-600);">Copy Link</span>
                    </button>
                    <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}', '_blank')" 
                            style="padding: 12px 20px; background: #1DA1F2; border: none; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">
                        <i class="fab fa-twitter" style="color: white; font-size: 20px;"></i>
                        <span style="display: block; font-size: 11px; color: white;">Twitter</span>
                    </button>
                    <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url || window.location.href)}', '_blank')" 
                            style="padding: 12px 20px; background: #4267B2; border: none; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">
                        <i class="fab fa-facebook" style="color: white; font-size: 20px;"></i>
                        <span style="display: block; font-size: 11px; color: white;">Facebook</span>
                    </button>
                    <button onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url || window.location.href)}', '_blank')" 
                            style="padding: 12px 20px; background: #0077B5; border: none; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">
                        <i class="fab fa-linkedin" style="color: white; font-size: 20px;"></i>
                        <span style="display: block; font-size: 11px; color: white;">LinkedIn</span>
                    </button>
                </div>
            </div>
        `;

        this.open({
            title: '📤 Share Article',
            content,
            confirmText: 'Close',
            showCancel: false,
            onClose: () => {}
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ModalManager.init();
});
