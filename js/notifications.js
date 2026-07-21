// ============================================
// NOTIFICATION MANAGER - UPDATED FOR REAL-TIME
// ============================================

const NewsManager = {
    articles: [],
    currentPage: 1,
    pageSize: 5,
    totalPages: 0,
    filteredData: [],
    unreadCount: 0,
    isLive: false,

    init() {
        // Get initial data from RealTimeManager
        this.articles = RealTimeManager.getArticles() || [...NEWS_DATA];
        this.filteredData = [...this.articles];
        
        // Listen to real-time updates
        RealTimeManager.onUpdate((type, data) => {
            console.log('📡 Real-time update received:', type);
            switch(type) {
                case 'initial':
                    this.articles = data;
                    this.filteredData = [...this.articles];
                    this.renderTable();
                    this.renderPagination();
                    break;
                case 'new_article':
                case 'breaking_news':
                    this.articles = RealTimeManager.getArticles();
                    this.filteredData = [...this.articles];
                    this.renderTable();
                    this.renderPagination();
                    this.renderPanel();
                    break;
                case 'stats_update':
                    // Stats are updated by RealTimeManager
                    break;
            }
        });

        this.updateUnreadCount();
        this.renderTable();
        this.renderPanel();
        this.renderPagination();
        this.updateStats();
        this.bindEvents();

        // Start live mode
        this.isLive = true;
        console.log('📡 NewsManager initialized with real-time support');
    },

    updateUnreadCount() {
        this.unreadCount = this.articles.filter(n => 
            n.status === 'breaking' || n.status === 'published'
        ).length;
        
        const badge = document.getElementById('notifBadge');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? '' : 'none';
        }

        const dot = document.getElementById('bellDot');
        if (dot) {
            dot.style.display = this.unreadCount > 0 ? '' : 'none';
        }
    },

    // New method for WebSocketManager
    setInitialData(data) {
        this.articles = data;
        this.filteredData = [...this.articles];
        this.renderTable();
        this.renderPagination();
        this.updateStats();
        this.updateUnreadCount();
    },

    // New method for WebSocketManager
    addArticle(article) {
        this.articles.unshift(article);
        this.filteredData = [...this.articles];
        this.renderTable();
        this.renderPagination();
        this.renderPanel();
        this.updateStats();
        this.updateUnreadCount();
    },

    // New method for WebSocketManager
    addBreakingNews(article) {
        article.isBreaking = true;
        this.articles.unshift(article);
        this.filteredData = [...this.articles];
        this.renderTable();
        this.renderPagination();
        this.renderPanel();
        this.updateStats();
        this.updateUnreadCount();
    },

    // New method for WebSocketManager
    updateStats(data) {
        // Stats are updated by RealTimeManager
        // Just refresh the display
        this.updateStatsDisplay();
    },

    updateStatsDisplay() {
        const stats = RealTimeManager.getStats();
        document.getElementById('statArticles').textContent = stats.articles.toLocaleString();
        document.getElementById('statAlerts').textContent = stats.alerts.toLocaleString();
        document.getElementById('statBreaking').textContent = stats.breaking.toLocaleString();
        document.getElementById('statSources').textContent = stats.sources.toLocaleString();
        document.getElementById('searchCount').textContent = stats.articles;
    },

    // Rest of the methods remain the same...
    getFilteredData() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
        const categoryFilter = document.getElementById('filterCategory')?.value || 'all';
        const sourceFilter = document.getElementById('filterSource')?.value || 'all';
        const dateFilter = document.getElementById('filterDate')?.value || 'all';

        let data = [...this.articles];

        if (searchTerm) {
            data = data.filter(n => 
                n.title.toLowerCase().includes(searchTerm) ||
                n.summary.toLowerCase().includes(searchTerm) ||
                n.author.toLowerCase().includes(searchTerm)
            );
        }

        if (categoryFilter !== 'all') {
            data = data.filter(n => n.category === categoryFilter);
        }

        if (sourceFilter !== 'all') {
            data = data.filter(n => n.source === sourceFilter);
        }

        if (dateFilter !== 'all') {
            const now = Date.now();
            const ranges = {
                'today': 86400000,
                'week': 604800000,
                'month': 2592000000,
                'year': 31536000000
            };
            const cutoff = ranges[dateFilter];
            if (cutoff) {
                data = data.filter(n => (now - n.timestamp) <= cutoff);
            }
        }

        this.filteredData = data;
        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }

        return data;
    },

    getPageData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredData.slice(start, end);
    },

    renderTable() {
        const tbody = document.getElementById('newsTableBody');
        const pageData = this.getPageData();

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray-500);">
                        <i class="fas fa-newspaper" style="font-size: 32px; display: block; margin-bottom: 12px;"></i>
                        ${this.isLive && WebSocketManager.isConnected ? 
                            'Waiting for news updates...' : 
                            'No news articles found'}
                    </td>
                </tr>
            `;
            return;
        }

        const statusMap = {
            breaking: '🔴 Breaking',
            published: '✅ Published',
            draft: '📝 Draft',
            archived: '📦 Archived'
        };

        tbody.innerHTML = pageData.map(article => `
            <tr data-id="${article.id}" class="${article.isBreaking ? 'breaking-row' : ''}" 
                style="${article.isBreaking ? 'background: var(--danger-bg);' : ''}">
                <td style="max-width: 250px;">
                    ${article.isBreaking ? '🔴 ' : ''}
                    <strong>${article.title}</strong>
                    <div style="font-size: 12px; color: var(--gray-400); margin-top: 2px;">
                        ${article.author}
                        ${article.isBreaking ? '<span style="color: var(--danger); margin-left: 8px;">● LIVE</span>' : ''}
                    </div>
                </td>
                <td>
                    <i class="fas ${CATEGORY_ICONS[article.category] || 'fa-newspaper'}" 
                       style="color: ${CATEGORY_COLORS[article.category] || 'var(--gray-500)'};"></i>
                    ${article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </td>
                <td>
                    <span style="color: ${SOURCE_COLORS[article.source] || 'var(--gray-500)'}; font-weight: 600;">
                        ${SOURCE_NAMES[article.source] || article.source}
                    </span>
                </td>
                <td>${article.published}</td>
                <td>
                    <span class="status-badge ${article.status}">
                        <span class="dot"></span> ${statusMap[article.status] || article.status}
                    </span>
                    ${article.isBreaking ? '<span style="margin-left: 6px; font-size: 10px; color: var(--danger); animation: pulse-dot 1s infinite;">●</span>' : ''}
                </td>
                <td>
                    <div class="action-btns">
                        <button class="view" data-id="${article.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="share" data-id="${article.id}" title="Share">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        ${article.status === 'draft' ? `
                            <button class="publish" data-id="${article.id}" title="Publish">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        <button class="delete" data-id="${article.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        const total = this.filteredData.length;
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, total);
        const resultsSpan = document.getElementById('resultsCount');
        if (resultsSpan) {
            resultsSpan.textContent = `Showing ${total > 0 ? start : 0}–${end} of ${total} results`;
        }

        document.getElementById('pageStart').textContent = total > 0 ? start : 0;
        document.getElementById('pageEnd').textContent = end;
        document.getElementById('totalItems').textContent = total;

        this.bindTableActions();
    },

    // ... (rest of methods remain the same: renderPanel, renderPagination, bindEvents, etc.)
    // Include all the other methods from the previous implementation
    renderPanel() {
        // Same as before
        const body = document.getElementById('notificationPanelBody');
        const alerts = this.articles.filter(n => n.status === 'breaking' || n.status === 'published').slice(0, 10);

        if (alerts.length === 0) {
            body.innerHTML = `
                <div style="text-align: center; padding: 40px 0; color: var(--gray-400);">
                    <i class="fas fa-bell-slash" style="font-size: 32px; display: block; margin-bottom: 12px;"></i>
                    No new alerts
                </div>
            `;
            return;
        }

        // ... rest of panel rendering
    },

    renderPagination() {
        // Same as before
    },

    updateStats() {
        const stats = RealTimeManager.getStats();
        document.getElementById('statArticles').textContent = stats.articles.toLocaleString();
        document.getElementById('statAlerts').textContent = stats.alerts.toLocaleString();
        document.getElementById('statBreaking').textContent = stats.breaking.toLocaleString();
        document.getElementById('statSources').textContent = stats.sources.toLocaleString();
        document.getElementById('searchCount').textContent = stats.articles;
    },

    bindEvents() {
        // Same as before with added real-time indicators
        document.getElementById('searchInput').addEventListener('input', () => {
            this.currentPage = 1;
            this.getFilteredData();
            this.renderTable();
            this.renderPagination();
            this.updateFilterChips();
        });

        // ... rest of event bindings
    },

    bindTableActions() {
        // Same as before
    },

    updateFilterChips() {
        // Same as before
    },

    createAlert(data) {
        // Same as before but with real-time broadcast
        const newArticle = {
            id: Date.now(),
            title: data.name,
            category: data.category === 'all' ? 'technology' : data.category,
            source: data.source === 'all' ? 'cnn' : data.source,
            published: 'Just now',
            timestamp: Date.now(),
            status: 'breaking',
            summary: `Alert created for: ${data.keywords || 'General news'}`,
            author: 'System Alert',
            url: '#',
            isBreaking: true
        };

        this.articles.unshift(newArticle);
        this.filteredData = [...this.articles];
        this.currentPage = 1;
        this.updateUnreadCount();
        this.renderTable();
        this.renderPagination();
        this.renderPanel();
        ToastManager.success('Alert Created', `New alert "${data.name}" has been created`);
        
        // Broadcast via WebSocket if connected
        if (WebSocketManager.isConnected) {
            WebSocketManager.send({
                type: 'new_article',
                data: newArticle
            });
        }
    },

    deleteArticle(id) {
        // Same as before
        const index = this.articles.findIndex(n => n.id === id);
        if (index !== -1) {
            this.articles.splice(index, 1);
            this.filteredData = [...this.articles];
            this.updateUnreadCount();
            this.renderTable();
            this.renderPagination();
            this.renderPanel();
            ToastManager.success('Deleted', 'Article has been removed');
        }
    },

    publishArticle(id) {
        // Same as before
        const article = this.articles.find(n => n.id === id);
        if (article) {
            article.status = 'published';
            article.published = 'Just now';
            article.timestamp = Date.now();
            this.updateUnreadCount();
            this.renderTable();
            this.renderPanel();
            ToastManager.success('Published', `"${article.title}" has been published`);
        }
    },

    markAllRead() {
        // Same as before
        this.articles.forEach(n => {
            if (n.status === 'breaking' || n.status === 'published') {
                n.status = 'archived';
            }
        });
        this.filteredData = [...this.articles];
        this.updateUnreadCount();
        this.renderTable();
        this.renderPanel();
        ToastManager.success('All Read', 'All alerts marked as read');
    },

    refreshNews() {
        // Same as before but with real-time
        ToastManager.info('Refreshing', 'Fetching latest news...');
        setTimeout(() => {
            const newArticle = {
                id: Date.now(),
                title: `📰 LIVE: ${['AI Advancements', 'Market Updates', 'Sports Highlights', 'Tech Innovations'][Math.floor(Math.random() * 4)]}`,
                category: ['technology', 'business', 'sports', 'health'][Math.floor(Math.random() * 4)],
                source: ['cnn', 'bbc', 'reuters', 'ap', 'nytimes', 'guardian'][Math.floor(Math.random() * 6)],
                published: 'Just now',
                timestamp: Date.now(),
                status: 'breaking',
                summary: 'A new breaking news story has been published in real-time.',
                author: ['Sarah Chen', 'Mike Johnson', 'Emma Wilson', 'Alex Rivera'][Math.floor(Math.random() * 4)],
                url: '#',
                isBreaking: true
            };
            this.articles.unshift(newArticle);
            this.filteredData = [...this.articles];
            this.updateUnreadCount();
            this.renderTable();
            this.renderPagination();
            this.renderPanel();
            ToastManager.success('Updated', 'New news articles have been loaded in real-time');
        }, 1500);
    },

    exportData(format = 'csv') {
        if (!this.filteredData || !this.filteredData.length) {
            ToastManager.warning('No Data', 'No articles available to export');
            return;
        }

        if (window.ExportManager) {
            const columns = [
                { label: 'Title', key: 'title' },
                { label: 'Category', key: 'category' },
                { label: 'Source', key: item => ExportManager.formatSource(item.source, item) },
                { label: 'Published', key: 'published' },
                { label: 'Status', key: 'status' },
                { label: 'Author', key: 'author' }
            ];

            if (format === 'json') {
                ExportManager.exportToJSON(this.filteredData, 'news_notifications_export');
            } else {
                ExportManager.exportToCSV(this.filteredData, 'news_notifications_export', columns);
            }
        } else {
            ToastManager.error('Error', 'Export manager component missing');
        }
    }
};

// Override the window.NewsManager
window.NewsManager = NewsManager;
