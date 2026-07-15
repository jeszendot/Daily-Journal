// ============================================
// REAL-TIME DATA MANAGER
// ============================================

const RealTimeManager = {
    articles: [],
    stats: {
        articles: 0,
        alerts: 0,
        breaking: 0,
        sources: 0
    },
    isInitialized: false,
    updateCallbacks: [],

    init() {
        // Listen to WebSocket events
        WebSocketManager.on('initial_data', (data) => {
            this.setInitialData(data);
        });

        WebSocketManager.on('new_article', (article) => {
            this.addArticle(article);
        });

        WebSocketManager.on('breaking_news', (article) => {
            this.addBreakingNews(article);
        });

        WebSocketManager.on('stats_update', (data) => {
            this.updateStats(data);
        });

        WebSocketManager.on('connected', () => {
            console.log('🔄 Real-time manager connected');
            // Request initial stats
            WebSocketManager.requestStats();
        });

        this.isInitialized = true;
        console.log('✅ Real-time manager initialized');
    },

    setInitialData(data) {
        this.articles = data;
        this.notifyUpdate('initial', data);
    },

    addArticle(article) {
        // Add to beginning of array
        this.articles.unshift(article);
        
        // Update stats
        this.stats.articles++;
        this.stats.alerts++;
        
        // Limit array size
        if (this.articles.length > 100) {
            this.articles = this.articles.slice(0, 100);
        }
        
        this.notifyUpdate('new_article', article);
    },

    addBreakingNews(article) {
        // Add to beginning with special flag
        article.isBreaking = true;
        this.articles.unshift(article);
        
        // Update stats
        this.stats.articles++;
        this.stats.alerts++;
        this.stats.breaking++;
        
        if (this.articles.length > 100) {
            this.articles = this.articles.slice(0, 100);
        }
        
        // Show notification
        this.notifyUpdate('breaking_news', article);
    },

    updateStats(data) {
        // Merge with existing stats
        this.stats = { ...this.stats, ...data };
        
        // Update UI
        this.updateUIStats();
        
        this.notifyUpdate('stats_update', data);
    },

    updateUIStats() {
        // Update stats cards
        const statArticles = document.getElementById('statArticles');
        const statAlerts = document.getElementById('statAlerts');
        const statBreaking = document.getElementById('statBreaking');
        const statSources = document.getElementById('statSources');
        
        if (statArticles) {
            statArticles.textContent = this.stats.articles.toLocaleString();
        }
        if (statAlerts) {
            statAlerts.textContent = this.stats.alerts.toLocaleString();
        }
        if (statBreaking) {
            statBreaking.textContent = this.stats.breaking.toLocaleString();
        }
        if (statSources) {
            statSources.textContent = this.stats.sources.toLocaleString();
        }
        
        // Update search count
        const searchCount = document.getElementById('searchCount');
        if (searchCount) {
            searchCount.textContent = this.stats.articles;
        }
        
        // Update notification badge
        const notifBadge = document.getElementById('notifBadge');
        if (notifBadge) {
            notifBadge.textContent = this.stats.breaking + this.stats.alerts;
            notifBadge.style.display = (this.stats.breaking + this.stats.alerts) > 0 ? '' : 'none';
        }
    },

    // Register callback for updates
    onUpdate(callback) {
        this.updateCallbacks.push(callback);
    },

    notifyUpdate(type, data) {
        this.updateCallbacks.forEach(callback => {
            try {
                callback(type, data);
            } catch (error) {
                console.error('Error in update callback:', error);
            }
        });
    },

    // Get all articles
    getArticles() {
        return this.articles;
    },

    // Get breaking news
    getBreakingNews() {
        return this.articles.filter(a => a.isBreaking || a.status === 'breaking');
    },

    // Get stats
    getStats() {
        return this.stats;
    },

    // Simulate real-time update (for demo without WebSocket)
    simulateUpdate() {
        if (!WebSocketManager.isConnected) {
            const article = {
                id: Date.now(),
                title: `📰 Simulated Breaking News ${new Date().toLocaleTimeString()}`,
                category: ['technology', 'business', 'sports'][Math.floor(Math.random() * 3)],
                source: ['cnn', 'bbc', 'reuters'][Math.floor(Math.random() * 3)],
                published: 'Just now',
                timestamp: Date.now(),
                status: Math.random() > 0.7 ? 'breaking' : 'published',
                summary: 'This is a simulated real-time update for demonstration purposes.',
                author: ['Sarah Chen', 'Mike Johnson', 'Emma Wilson'][Math.floor(Math.random() * 3)],
                url: '#'
            };
            this.addArticle(article);
            
            ToastManager.info(
                '🔄 Simulated Update',
                'WebSocket not connected - showing simulated data'
            );
        }
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    RealTimeManager.init();
    
    // Fallback: Simulate updates every 5 seconds if WebSocket is not connected
    setInterval(() => {
        if (!WebSocketManager.isConnected) {
            RealTimeManager.simulateUpdate();
        }
    }, 5000);
});

window.RealTimeManager = RealTimeManager;