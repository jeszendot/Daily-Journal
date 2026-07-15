// ============================================
// WEBSOCKET MANAGER - REAL-TIME CONNECTION
// ============================================

const WebSocketManager = {
    ws: null,
    isConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 10,
    reconnectDelay: 2000,
    messageHandlers: [],
    eventListeners: {},
    serverUrl: 'ws://localhost:8080',

    init() {
        this.connect();
        this.bindEvents();
    },

    connect() {
        try {
            this.ws = new WebSocket(this.serverUrl);
            
            this.ws.onopen = () => {
                console.log('🔗 WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.dispatchEvent('connected', { connected: true });
                ToastManager.success('Connected', 'Real-time updates are now active');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.isConnected = false;
                this.dispatchEvent('disconnected', { connected: false });
                this.reconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.dispatchEvent('error', { error });
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.reconnect();
        }
    },

    reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('❌ Max reconnection attempts reached');
            ToastManager.error('Connection Failed', 'Unable to connect to real-time server');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
        
        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
        
        setTimeout(() => {
            this.connect();
        }, delay);
    },

    handleMessage(data) {
        this.dispatchEvent('message', data);
        
        switch(data.type) {
            case 'initial_data':
                this.handleInitialData(data.data);
                break;
            case 'new_article':
                this.handleNewArticle(data.data);
                break;
            case 'breaking_news':
                this.handleBreakingNews(data.data);
                break;
            case 'stats_update':
                this.handleStatsUpdate(data.data);
                break;
            case 'pong':
                // Heartbeat response
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    },

    handleInitialData(data) {
        // Update the global news data
        if (window.NewsManager) {
            window.NewsManager.setInitialData(data);
        }
        this.dispatchEvent('initial_data', data);
    },

    handleNewArticle(article) {
        // Add new article to the list
        if (window.NewsManager) {
            window.NewsManager.addArticle(article);
        }
        this.dispatchEvent('new_article', article);
        
        // Show toast notification
        ToastManager.info(
            '📰 New Article',
            `${article.title} - ${article.source}`
        );
    },

    handleBreakingNews(article) {
        // Add breaking news with priority
        if (window.NewsManager) {
            window.NewsManager.addBreakingNews(article);
        }
        this.dispatchEvent('breaking_news', article);
        
        // Show prominent notification
        ToastManager.warning(
            '🔴 BREAKING NEWS',
            article.title
        );
        
        // Update bell badge
        const badge = document.getElementById('notifBadge');
        if (badge) {
            const current = parseInt(badge.textContent) || 0;
            badge.textContent = current + 1;
            badge.style.display = '';
        }
    },

    handleStatsUpdate(data) {
        if (window.NewsManager) {
            window.NewsManager.updateStats(data);
        }
        this.dispatchEvent('stats_update', data);
    },

    // Event system
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    },

    dispatchEvent(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    },

    // Send message to server
    send(data) {
        if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
            return true;
        }
        return false;
    },

    // Subscribe to category
    subscribe(category) {
        return this.send({ type: 'subscribe', category });
    },

    // Request stats
    requestStats() {
        return this.send({ type: 'get_stats' });
    },

    // Send heartbeat
    ping() {
        return this.send({ type: 'ping' });
    },

    // Disconnect
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if the server is available
    WebSocketManager.init();
    
    // Send ping every 10 seconds
    setInterval(() => {
        if (WebSocketManager.isConnected) {
            WebSocketManager.ping();
        }
    }, 10000);
});

// Export for use in other files
window.WebSocketManager = WebSocketManager;