// ============================================
/// MAIN APPLICATION - UPDATED FOR REAL-TIME
// ============================================

const App = {
    init() {
        console.log('🚀 Initializing NewsFlow with real-time support...');
        
        // Initialize managers in order
        ToastManager.init();
        ModalManager.init();
        
        // Initialize WebSocket first
        WebSocketManager.init();
        
        // Initialize RealTime manager
        RealTimeManager.init();
        
        // Initialize NewsManager
        NewsManager.init();
        
        // Initialize Search
        SearchManager.init();

        this.bindEvents();
        this.bindSidebar();
        this.registerShortcuts();
        this.startStatusMonitor();

        console.log('📰 NewsFlow Dashboard loaded successfully!');
        console.log(`🔗 WebSocket Status: ${WebSocketManager.isConnected ? '🟢 Connected' : '🔴 Disconnected'}`);
        console.log(`📊 Stats: ${JSON.stringify(RealTimeManager.getStats())}`);
    },

    bindEvents() {
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            ModalManager.open({
                title: 'Logout',
                content: '<p>Are you sure you want to logout?</p>',
                confirmText: 'Logout',
                danger: true,
                onConfirm: () => {
                    ToastManager.success('Logged Out', 'See you next time!');
                }
            });
        });

        document.getElementById('userAvatar').addEventListener('click', () => {
            ToastManager.info('Profile', 'Viewing user profile');
        });

        document.querySelectorAll('.sidebar-nav a, .breadcrumb a, .sidebar-footer a').forEach(link => {
            link.addEventListener('click', (e) => {
                const page = link.dataset.page;
                if (page) {
                    e.preventDefault();
                    this.navigateTo(page);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const panel = document.getElementById('notificationPanel');
                if (panel.classList.contains('open')) {
                    panel.classList.remove('open');
                    document.getElementById('panelOverlay').classList.remove('active');
                }
            }
        });
    },

    bindSidebar() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobileOverlay');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    },

    navigateTo(page) {
        document.querySelectorAll('.sidebar-nav a').forEach(a => {
            a.classList.toggle('active', a.dataset.page === page);
        });

        const titles = {
            dashboard: 'Dashboard',
            search: 'Search News',
            notifications: 'Alerts',
            technology: 'Technology News',
            business: 'Business News',
            sports: 'Sports News',
            entertainment: 'Entertainment News',
            health: 'Health News',
            preferences: 'Preferences',
            sources: 'News Sources',
            help: 'Help & Support'
        };

        document.getElementById('pageTitle').textContent = titles[page] || page;
        document.getElementById('breadcrumbCurrent').textContent = titles[page] || page;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    registerShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const pages = ['dashboard', 'search', 'notifications', 'preferences'];
                const page = pages[parseInt(e.key) - 1];
                if (page) this.navigateTo(page);
            }
            
            // Ctrl+Shift+R for manual refresh
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                document.getElementById('refreshBtn')?.click();
            }
        });
    },

    startStatusMonitor() {
        // Monitor WebSocket connection status
        setInterval(() => {
            const status = WebSocketManager.isConnected ? '🟢' : '🔴';
            const articleCount = NewsManager.articles.length;
            
            // Update footer or status indicator if needed
            console.log(`📡 ${status} | Articles: ${articleCount} | Stats:`, RealTimeManager.getStats());
        }, 15000);

        // Auto-refresh if WebSocket disconnects
        setInterval(() => {
            if (!WebSocketManager.isConnected && NewsManager.articles.length === 0) {
                console.log('🔄 Auto-refreshing due to no connection and no data...');
                document.getElementById('refreshBtn')?.click();
            }
        }, 30000);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
