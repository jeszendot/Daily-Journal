// ============================================
// CLIENT-SIDE EXPORT UTILITY (CSV & JSON)
// ============================================

const ExportManager = {
    /**
     * Show feedback toast message if available
     */
    notify(title, message, type = 'success') {
        if (window.ToastManager && typeof window.ToastManager[type] === 'function') {
            window.ToastManager[type](title, message);
        } else if (typeof window.showToast === 'function') {
            window.showToast(`${title}: ${message}`, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${title} - ${message}`);
        }
    },

    /**
     * Safely format CSV field values with escaping
     */
    formatCSVCell(val) {
        if (val === null || val === undefined) return '""';
        let str = String(val);
        // Replace quotes with double quotes for CSV standard
        str = str.replace(/"/g, '""');
        return `"${str}"`;
    },

    /**
     * Export array of objects to CSV format
     * @param {Array<Object>} data - Array of records
     * @param {String} filename - Output filename without extension
     * @param {Array<{label: string, key: string|Function}>} [columns] - Optional column mapping
     */
    exportToCSV(data, filename = 'news_export', columns = null) {
        if (!data || !data.length) {
            this.notify('Export Failed', 'No data available to export', 'error');
            return false;
        }

        try {
            let headers = [];
            let rows = [];

            if (columns && Array.isArray(columns) && columns.length > 0) {
                headers = columns.map(col => col.label);
                rows = data.map(item => {
                    return columns.map(col => {
                        let val;
                        if (typeof col.key === 'function') {
                            val = col.key(item);
                        } else {
                            val = item[col.key];
                        }
                        return this.formatCSVCell(val);
                    }).join(',');
                });
            } else {
                // Infer columns from first object
                const sample = data[0];
                const keys = Object.keys(sample);
                headers = keys.map(k => k.charAt(0).toUpperCase() + k.slice(1));
                rows = data.map(item => {
                    return keys.map(k => this.formatCSVCell(item[k])).join(',');
                });
            }

            // UTF-8 BOM prefix for Excel compatibility
            const csvContent = '\uFEFF' + [headers.map(h => this.formatCSVCell(h)).join(','), ...rows].join('\r\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            this.triggerDownload(blob, `${filename}_${this.getTimestamp()}.csv`);
            this.notify('Export Successful', `Exported ${data.length} records to CSV`, 'success');
            return true;
        } catch (error) {
            console.error('CSV Export Error:', error);
            this.notify('Export Error', 'Failed to generate CSV file', 'error');
            return false;
        }
    },

    /**
     * Export array of objects to formatted JSON format
     * @param {Array<Object>} data - Array of records
     * @param {String} filename - Output filename without extension
     */
    exportToJSON(data, filename = 'news_export') {
        if (!data || !data.length) {
            this.notify('Export Failed', 'No data available to export', 'error');
            return false;
        }

        try {
            const jsonContent = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
            
            this.triggerDownload(blob, `${filename}_${this.getTimestamp()}.json`);
            this.notify('Export Successful', `Exported ${data.length} records to JSON`, 'success');
            return true;
        } catch (error) {
            console.error('JSON Export Error:', error);
            this.notify('Export Error', 'Failed to generate JSON file', 'error');
            return false;
        }
    },

    /**
     * Helper to trigger file download in browser
     */
    triggerDownload(blob, fullFilename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fullFilename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 500);
    },

    /**
     * Helper to get date string YYYY-MM-DD
     */
    getTimestamp() {
        return new Date().toISOString().split('T')[0];
    }
};

window.ExportManager = ExportManager;
