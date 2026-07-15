/// ============================================
// SEARCH FUNCTIONALITY
// ============================================

const SearchManager = {
    init() {
        this.bindSearchEvents();
    },

    bindSearchEvents() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
            if (e.key === 'Escape') {
                const input = document.getElementById('searchInput');
                if (document.activeElement === input) {
                    input.blur();
                }
            }
        });

        let debounceTimer;
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = searchInput.value.trim();
                if (query.length > 0) {
                    searchInput.parentElement.style.borderColor = 'var(--primary-400)';
                } else {
                    searchInput.parentElement.style.borderColor = '';
                }
            }, 300);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('applyFiltersBtn').click();
            }
        });
    },

    advancedSearch(query, filters) {
        let results = [...NEWS_DATA];
        
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(n => 
                n.title.toLowerCase().includes(q) ||
                n.summary.toLowerCase().includes(q) ||
                n.author.toLowerCase().includes(q)
            );
        }

        if (filters) {
            if (filters.category && filters.category !== 'all') {
                results = results.filter(n => n.category === filters.category);
            }
            if (filters.source && filters.source !== 'all') {
                results = results.filter(n => n.source === filters.source);
            }
            if (filters.dateRange && filters.dateRange !== 'all') {
                const now = Date.now();
                const ranges = {
                    'today': 86400000,
                    'week': 604800000,
                    'month': 2592000000,
                    'year': 31536000000
                };
                const cutoff = ranges[filters.dateRange];
                if (cutoff) {
                    results = results.filter(n => (now - n.timestamp) <= cutoff);
                }
            }
            if (filters.status && filters.status !== 'all') {
                results = results.filter(n => n.status === filters.status);
            }
        }

        return results;
    },

    getCategoryStats() {
        const stats = {};
        NEWS_DATA.forEach(n => {
            stats[n.category] = (stats[n.category] || 0) + 1;
        });
        return stats;
    },

    getTopSources() {
        const stats = {};
        NEWS_DATA.forEach(n => {
            stats[n.source] = (stats[n.source] || 0) + 1;
        });
        return Object.entries(stats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([source, count]) => ({
                source: SOURCE_NAMES[source] || source,
                count
            }));
    }
};
