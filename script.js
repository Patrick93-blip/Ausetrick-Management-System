// ATC Income Management System - JavaScript
// Secure Income Management for Ausetrick Tech. Cafe
// Author: ATC Development Team
// Version: 1.0.0

class ATCIncomeManager {
    constructor() {
        this.currentUser = null;
        this.incomeData = [];
        this.loginAttempts = 0;
        this.maxLoginAttempts = 3;
        this.monthlyChart = null;
        this.categoryChart = null;
        
        // Default credentials (In production, this would be handled server-side)
        this.users = {
            'admin': this.hashPassword('atc2024'),
            'manager': this.hashPassword('manager123'),
            'user': this.hashPassword('user123')
        };
        
        this.init();
    }
    
    init() {
        this.loadStoredData();
        this.showLoadingScreen();
        this.setupEventListeners();
        this.setCurrentDate();
        
        // Hide loading screen after 3 seconds
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showLoginScreen();
        }, 3000);
    }
    
    // Security Functions
    hashPassword(password) {
        // Simple hash function (In production, use proper hashing like bcrypt)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
    
    encryptData(data) {
        // Simple encryption (In production, use proper encryption)
        const encrypted = btoa(JSON.stringify(data));
        return encrypted;
    }
    
    decryptData(encryptedData) {
        try {
            const decrypted = JSON.parse(atob(encryptedData));
            return decrypted;
        } catch (e) {
            console.error('Decryption failed:', e);
            return null;
        }
    }
    
    // Screen Management
    showLoadingScreen() {
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
    }
    
    hideLoadingScreen() {
        document.getElementById('loadingScreen').style.display = 'none';
    }
    
    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
    }
    
    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        this.updateDashboard();
        this.loadIncomeTable();
        this.initializeCharts();
    }
    
    // Authentication
    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Income form
        document.getElementById('incomeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addIncomeEntry();
        });
        
        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => {
            this.filterTable();
        });
        
        document.getElementById('filterPeriod').addEventListener('change', () => {
            this.filterTable();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.backupData();
            }
        });
    }
    
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginAttemptsDiv = document.getElementById('loginAttempts');
        
        if (!username || !password) {
            this.showMessage('Please enter both username and password', 'error');
            return;
        }
        
        const hashedPassword = this.hashPassword(password);
        
        if (this.users[username] && this.users[username] === hashedPassword) {
            this.currentUser = username;
            this.loginAttempts = 0;
            document.getElementById('currentUser').textContent = username;
            this.showMessage('Login successful!', 'success');
            setTimeout(() => {
                this.showDashboard();
            }, 1000);
        } else {
            this.loginAttempts++;
            const remainingAttempts = this.maxLoginAttempts - this.loginAttempts;
            
            if (remainingAttempts > 0) {
                loginAttemptsDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Invalid credentials. ${remainingAttempts} attempts remaining.`;
                this.showMessage('Invalid credentials', 'error');
            } else {
                loginAttemptsDiv.innerHTML = '<i class="fas fa-lock"></i> Account locked. Please contact administrator.';
                document.getElementById('loginForm').style.display = 'none';
                this.showMessage('Too many failed attempts. Account locked.', 'error');
            }
        }
        
        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
    
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.currentUser = null;
            this.loginAttempts = 0;
            document.getElementById('loginAttempts').innerHTML = '';
            document.getElementById('loginForm').style.display = 'block';
            this.showLoginScreen();
            this.showMessage('Logged out successfully', 'success');
        }
    }
    
    // Income Management
    addIncomeEntry() {
        const amount = parseFloat(document.getElementById('incomeAmount').value);
        const date = document.getElementById('incomeDate').value;
        const category = document.getElementById('incomeCategory').value;
        const description = document.getElementById('incomeDescription').value;
        
        if (!amount || amount <= 0) {
            this.showMessage('Please enter a valid amount', 'error');
            return;
        }
        
        if (!date) {
            this.showMessage('Please select a date', 'error');
            return;
        }
        
        if (!category) {
            this.showMessage('Please select a category', 'error');
            return;
        }
        
        const entry = {
            id: this.generateId(),
            amount: amount,
            date: date,
            category: category,
            description: description || 'No description',
            timestamp: new Date().toISOString(),
            user: this.currentUser
        };
        
        this.incomeData.push(entry);
        this.saveData();
        this.updateDashboard();
        this.loadIncomeTable();
        this.updateCharts();
        
        // Reset form
        document.getElementById('incomeForm').reset();
        this.setCurrentDate();
        
        this.showMessage('Income entry added successfully!', 'success');
    }
    
    editIncomeEntry(id) {
        const entry = this.incomeData.find(item => item.id === id);
        if (!entry) return;
        
        document.getElementById('incomeAmount').value = entry.amount;
        document.getElementById('incomeDate').value = entry.date;
        document.getElementById('incomeCategory').value = entry.category;
        document.getElementById('incomeDescription').value = entry.description;
        
        // Remove the old entry
        this.deleteIncomeEntry(id, false);
        
        this.showMessage('Entry loaded for editing. Update and save.', 'warning');
    }
    
    deleteIncomeEntry(id, showConfirm = true) {
        if (showConfirm && !confirm('Are you sure you want to delete this entry?')) {
            return;
        }
        
        const index = this.incomeData.findIndex(item => item.id === id);
        if (index > -1) {
            this.incomeData.splice(index, 1);
            this.saveData();
            this.updateDashboard();
            this.loadIncomeTable();
            this.updateCharts();
            this.showMessage('Entry deleted successfully', 'success');
        }
    }
    
    // Calculations
    calculateDailyIncome() {
        const today = new Date().toISOString().split('T')[0];
        return this.incomeData
            .filter(entry => entry.date === today)
            .reduce((sum, entry) => sum + entry.amount, 0);
    }
    
    calculateMonthlyIncome() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return this.incomeData
            .filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getMonth() === currentMonth && 
                       entryDate.getFullYear() === currentYear;
            })
            .reduce((sum, entry) => sum + entry.amount, 0);
    }
    
    calculateYearlyIncome() {
        const currentYear = new Date().getFullYear();
        
        return this.incomeData
            .filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getFullYear() === currentYear;
            })
            .reduce((sum, entry) => sum + entry.amount, 0);
    }
    
    calculateTotalSavings() {
        const totalIncome = this.incomeData.reduce((sum, entry) => sum + entry.amount, 0);
        // Assuming 20% savings rate (can be customized)
        return totalIncome * 0.2;
    }
    
    calculateGrowthPercentage(current, previous) {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }
    
    // Dashboard Updates
    updateDashboard() {
        // Calculate current values
        const dailyIncome = this.calculateDailyIncome();
        const monthlyIncome = this.calculateMonthlyIncome();
        const yearlyIncome = this.calculateYearlyIncome();
        const totalSavings = this.calculateTotalSavings();
        
        // Calculate previous values for growth percentage
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const previousDailyIncome = this.incomeData
            .filter(entry => entry.date === yesterday.toISOString().split('T')[0])
            .reduce((sum, entry) => sum + entry.amount, 0);
        
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const previousMonthlyIncome = this.incomeData
            .filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getMonth() === lastMonth.getMonth() && 
                       entryDate.getFullYear() === lastMonth.getFullYear();
            })
            .reduce((sum, entry) => sum + entry.amount, 0);
        
        const lastYear = new Date().getFullYear() - 1;
        const previousYearlyIncome = this.incomeData
            .filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getFullYear() === lastYear;
            })
            .reduce((sum, entry) => sum + entry.amount, 0);
        
        // Update display
        document.getElementById('dailyIncome').textContent = this.formatCurrency(dailyIncome);
        document.getElementById('monthlyIncome').textContent = this.formatCurrency(monthlyIncome);
        document.getElementById('yearlyIncome').textContent = this.formatCurrency(yearlyIncome);
        document.getElementById('totalSavings').textContent = this.formatCurrency(totalSavings);
        
        // Update growth percentages
        const dailyGrowth = this.calculateGrowthPercentage(dailyIncome, previousDailyIncome);
        const monthlyGrowth = this.calculateGrowthPercentage(monthlyIncome, previousMonthlyIncome);
        const yearlyGrowth = this.calculateGrowthPercentage(yearlyIncome, previousYearlyIncome);
        const savingsGrowth = this.calculateGrowthPercentage(totalSavings, previousYearlyIncome * 0.2);
        
        this.updateGrowthDisplay('dailyChange', dailyGrowth);
        this.updateGrowthDisplay('monthlyChange', monthlyGrowth);
        this.updateGrowthDisplay('yearlyChange', yearlyGrowth);
        this.updateGrowthDisplay('savingsGrowth', savingsGrowth);
    }
    
    updateGrowthDisplay(elementId, percentage) {
        const element = document.getElementById(elementId);
        const isPositive = percentage >= 0;
        
        element.textContent = `${isPositive ? '+' : ''}${percentage.toFixed(1)}%`;
        element.className = `stat-change ${isPositive ? 'positive' : 'negative'}`;
    }
    
    // Table Management
    loadIncomeTable() {
        const tableBody = document.getElementById('incomeTableBody');
        tableBody.innerHTML = '';
        
        // Sort by date (newest first)
        const sortedData = [...this.incomeData].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedData.forEach(entry => {
            const row = this.createTableRow(entry);
            tableBody.appendChild(row);
        });
        
        if (this.incomeData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No income records found. Add your first entry above.
                    </td>
                </tr>
            `;
        }
    }
    
    createTableRow(entry) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${this.formatDate(entry.date)}</td>
            <td>${this.formatCurrency(entry.amount)}</td>
            <td><span class="category-tag ${entry.category}">${this.formatCategory(entry.category)}</span></td>
            <td>${entry.description}</td>
            <td class="table-actions">
                <button onclick="atcManager.editIncomeEntry('${entry.id}')" class="edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="atcManager.deleteIncomeEntry('${entry.id}')" class="delete-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        return row;
    }
    
    filterTable() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filterPeriod = document.getElementById('filterPeriod').value;
        
        let filteredData = [...this.incomeData];
        
        // Apply search filter
        if (searchTerm) {
            filteredData = filteredData.filter(entry => 
                entry.description.toLowerCase().includes(searchTerm) ||
                entry.category.toLowerCase().includes(searchTerm) ||
                entry.amount.toString().includes(searchTerm)
            );
        }
        
        // Apply period filter
        if (filterPeriod !== 'all') {
            const now = new Date();
            filteredData = filteredData.filter(entry => {
                const entryDate = new Date(entry.date);
                
                switch (filterPeriod) {
                    case 'today':
                        return entryDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return entryDate >= weekAgo;
                    case 'month':
                        return entryDate.getMonth() === now.getMonth() && 
                               entryDate.getFullYear() === now.getFullYear();
                    case 'year':
                        return entryDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }
        
        // Update table with filtered data
        const tableBody = document.getElementById('incomeTableBody');
        tableBody.innerHTML = '';
        
        if (filteredData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No records match your search criteria.
                    </td>
                </tr>
            `;
        } else {
            const sortedData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
            sortedData.forEach(entry => {
                const row = this.createTableRow(entry);
                tableBody.appendChild(row);
            });
        }
    }
    
    // Charts
    initializeCharts() {
        this.createMonthlyChart();
        this.createCategoryChart();
    }
    
    createMonthlyChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        
        // Get monthly data for the current year
        const monthlyData = this.getMonthlyChartData();
        
        if (this.monthlyChart) {
            this.monthlyChart.destroy();
        }
        
        this.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Income',
                    data: monthlyData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Income Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    createCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        const categoryData = this.getCategoryChartData();
        
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }
        
        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.data,
                    backgroundColor: [
                        '#3b82f6', // Blue
                        '#f59e0b', // Yellow
                        '#10b981', // Green
                        '#ef4444', // Red
                        '#8b5cf6'  // Purple
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Income by Category'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    getMonthlyChartData() {
        const currentYear = new Date().getFullYear();
        const monthlyTotals = new Array(12).fill(0);
        
        this.incomeData.forEach(entry => {
            const entryDate = new Date(entry.date);
            if (entryDate.getFullYear() === currentYear) {
                const month = entryDate.getMonth();
                monthlyTotals[month] += entry.amount;
            }
        });
        
        return monthlyTotals;
    }
    
    getCategoryChartData() {
        const categoryTotals = {};
        
        this.incomeData.forEach(entry => {
            if (categoryTotals[entry.category]) {
                categoryTotals[entry.category] += entry.amount;
            } else {
                categoryTotals[entry.category] = entry.amount;
            }
        });
        
        const labels = Object.keys(categoryTotals).map(cat => this.formatCategory(cat));
        const data = Object.values(categoryTotals);
        
        return { labels, data };
    }
    
    updateCharts() {
        if (this.monthlyChart && this.categoryChart) {
            // Update monthly chart
            const monthlyData = this.getMonthlyChartData();
            this.monthlyChart.data.datasets[0].data = monthlyData;
            this.monthlyChart.update();
            
            // Update category chart
            const categoryData = this.getCategoryChartData();
            this.categoryChart.data.labels = categoryData.labels;
            this.categoryChart.data.datasets[0].data = categoryData.data;
            this.categoryChart.update();
        }
    }
    
    // Data Management
    saveData() {
        try {
            const dataToSave = {
                incomeData: this.incomeData,
                lastBackup: new Date().toISOString()
            };
            const encryptedData = this.encryptData(dataToSave);
            localStorage.setItem('atc_income_data', encryptedData);
        } catch (error) {
            console.error('Error saving data:', error);
            this.showMessage('Error saving data. Please try again.', 'error');
        }
    }
    
    loadStoredData() {
        try {
            const encryptedData = localStorage.getItem('atc_income_data');
            if (encryptedData) {
                const decryptedData = this.decryptData(encryptedData);
                if (decryptedData && decryptedData.incomeData) {
                    this.incomeData = decryptedData.incomeData;
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showMessage('Error loading saved data. Starting fresh.', 'warning');
        }
    }
    
    exportData() {
        try {
            const exportData = {
                company: 'Ausetrick Tech. Cafe',
                exportDate: new Date().toISOString(),
                totalRecords: this.incomeData.length,
                data: this.incomeData,
                summary: {
                    dailyIncome: this.calculateDailyIncome(),
                    monthlyIncome: this.calculateMonthlyIncome(),
                    yearlyIncome: this.calculateYearlyIncome(),
                    totalSavings: this.calculateTotalSavings()
                }
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ATC_Income_Data_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.showMessage('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showMessage('Error exporting data. Please try again.', 'error');
        }
    }
    
    generateReport() {
        const reportData = this.generateReportData();
        const reportHtml = this.generateReportHTML(reportData);
        
        const newWindow = window.open('', '_blank');
        newWindow.document.write(reportHtml);
        newWindow.document.close();
        
        this.showMessage('Report generated successfully!', 'success');
    }
    
    generateReportData() {
        const dailyIncome = this.calculateDailyIncome();
        const monthlyIncome = this.calculateMonthlyIncome();
        const yearlyIncome = this.calculateYearlyIncome();
        const totalSavings = this.calculateTotalSavings();
        
        // Category breakdown
        const categoryTotals = {};
        this.incomeData.forEach(entry => {
            if (categoryTotals[entry.category]) {
                categoryTotals[entry.category] += entry.amount;
            } else {
                categoryTotals[entry.category] = entry.amount;
            }
        });
        
        // Monthly breakdown
        const monthlyBreakdown = this.getMonthlyChartData();
        
        return {
            dailyIncome,
            monthlyIncome,
            yearlyIncome,
            totalSavings,
            categoryTotals,
            monthlyBreakdown,
            totalRecords: this.incomeData.length,
            generatedDate: new Date().toLocaleString()
        };
    }
    
    generateReportHTML(data) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>ATC Income Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { color: #1e40af; font-size: 2em; margin-bottom: 10px; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
                .stat-box { background: #f8fafc; padding: 20px; border-radius: 10px; text-align: center; border-left: 5px solid #1e40af; }
                .stat-value { font-size: 1.5em; font-weight: bold; color: #1e40af; }
                .category-list { margin: 20px 0; }
                .category-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #e2e8f0; }
                .print-btn { background: #1e40af; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 20px 0; }
                @media print { .print-btn { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">☕ Ausetrick Tech. Cafe</div>
                <h1>Income Management Report</h1>
                <p>Generated on: ${data.generatedDate}</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <h3>Daily Income</h3>
                    <div class="stat-value">${this.formatCurrency(data.dailyIncome)}</div>
                </div>
                <div class="stat-box">
                    <h3>Monthly Income</h3>
                    <div class="stat-value">${this.formatCurrency(data.monthlyIncome)}</div>
                </div>
                <div class="stat-box">
                    <h3>Yearly Income</h3>
                    <div class="stat-value">${this.formatCurrency(data.yearlyIncome)}</div>
                </div>
                <div class="stat-box">
                    <h3>Total Savings</h3>
                    <div class="stat-value">${this.formatCurrency(data.totalSavings)}</div>
                </div>
            </div>
            
            <h2>Category Breakdown</h2>
            <div class="category-list">
                ${Object.entries(data.categoryTotals).map(([category, amount]) => `
                    <div class="category-item">
                        <span>${this.formatCategory(category)}</span>
                        <strong>${this.formatCurrency(amount)}</strong>
                    </div>
                `).join('')}
            </div>
            
            <p><strong>Total Records:</strong> ${data.totalRecords}</p>
            
            <button class="print-btn" onclick="window.print()">Print Report</button>
        </body>
        </html>
        `;
    }
    
    backupData() {
        if (confirm('Create a backup of your data?')) {
            this.exportData();
            this.showMessage('Backup created successfully!', 'success');
        }
    }
    
    clearData() {
        if (confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
            if (confirm('This will permanently delete all income records. Are you absolutely sure?')) {
                this.incomeData = [];
                this.saveData();
                this.updateDashboard();
                this.loadIncomeTable();
                this.updateCharts();
                this.showMessage('All data has been cleared.', 'warning');
            }
        }
    }
    
    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('incomeDate').value = today;
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    formatCategory(category) {
        const categoryMap = {
            'coffee-sales': 'Coffee Sales',
            'tech-services': 'Tech Services',
            'food-sales': 'Food Sales',
            'other': 'Other'
        };
        return categoryMap[category] || category;
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        messageDiv.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        
        // Insert at the top of the main content or login form
        const container = document.getElementById('dashboard').style.display !== 'none' 
            ? document.querySelector('.main-content')
            : document.querySelector('.login-container');
            
        container.insertBefore(messageDiv, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Password toggle function
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Global functions for button actions
function exportData() {
    atcManager.exportData();
}

function generateReport() {
    atcManager.generateReport();
}

function backupData() {
    atcManager.backupData();
}

function clearData() {
    atcManager.clearData();
}

function logout() {
    atcManager.logout();
}

// Initialize the application
let atcManager;

document.addEventListener('DOMContentLoaded', function() {
    atcManager = new ATCIncomeManager();
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
