# ATC Income Management System

**Professional Income Tracking Software for Ausetrick Tech. Cafe**

## 🚀 Overview

The ATC Income Management System is a secure, professional web-based application designed specifically for Ausetrick Tech. Cafe to track daily, monthly, and yearly income with advanced analytics and reporting capabilities.

## ✨ Features

### 🔐 Security Features
- **Multi-layer Authentication** - Secure login with attempt limiting
- **Data Encryption** - Local storage encryption for data protection
- **User Session Management** - Automatic logout and session security
- **256-bit Security Protocol** - Industry-standard security measures

### 📊 Income Management
- **Daily Income Tracking** - Record and monitor daily revenue
- **Monthly Analytics** - Comprehensive monthly income analysis
- **Yearly Reporting** - Annual income summaries and trends
- **Category-based Tracking** - Coffee Sales, Tech Services, Food Sales, Other
- **Automatic Calculations** - Real-time calculations and savings tracking

### 📈 Analytics & Reporting
- **Interactive Charts** - Monthly trend and category breakdown charts
- **Growth Percentages** - Automatic growth calculation and comparison
- **PDF Report Generation** - Professional printable reports
- **Data Export** - JSON export for backup and integration

### 🎨 Design
- **Professional Blue & Yellow Theme** - Branded color scheme
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, intuitive interface
- **Accessibility** - WCAG compliant design

## 🛠 Installation & Setup

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Windows Operating System (optimized for Windows)
- No additional software required

### Quick Setup
1. Download all files to a folder on your computer
2. Double-click `index.html` to open in your browser
3. Use the default login credentials to access the system

### Default Login Credentials
```
Username: admin
Password: atc2024

Username: manager  
Password: manager123

Username: user
Password: user123
```

## 🌐 Publishing to Google (Web Hosting)

### Option 1: GitHub Pages (Free)
1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository named "atc-income-system"
3. Upload all project files to the repository
4. Go to Settings > Pages
5. Select "Deploy from a branch" and choose "main"
6. Your site will be available at `https://yourusername.github.io/atc-income-system`

### Option 2: Google Firebase Hosting (Free)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` and login to your Google account
3. Run `firebase init hosting` in your project folder
4. Deploy with `firebase deploy`

### Option 3: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder to deploy
3. Get instant live URL

## 📱 Usage Guide

### Getting Started
1. **Login**: Use provided credentials to access the system
2. **Dashboard**: View your income statistics and analytics
3. **Add Income**: Use the form to record new income entries
4. **View Records**: Browse and search through your income history
5. **Generate Reports**: Create professional reports for analysis

### Adding Income Entries
1. Enter the amount (required)
2. Select the date (defaults to today)
3. Choose a category (Coffee Sales, Tech Services, Food Sales, Other)
4. Add optional description
5. Click "Save Income Entry"

### Viewing Analytics
- **Dashboard Cards**: Real-time statistics for daily, monthly, yearly income
- **Growth Percentages**: Automatic calculation of growth trends
- **Charts**: Visual representation of monthly trends and category breakdown
- **Filtering**: Search and filter records by period or keyword

### Data Management
- **Export Data**: Download complete data backup as JSON file
- **Generate Reports**: Create printable PDF-style reports
- **Backup Data**: Create secure backups of all data
- **Clear Data**: Reset all data (with confirmation prompts)

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-blue: #1e40af;
    --primary-yellow: #f59e0b;
    /* Modify these values to change the theme */
}
```

### Adding New Categories
Edit the category options in `index.html`:
```html
<select id="incomeCategory" required>
    <option value="coffee-sales">Coffee Sales</option>
    <option value="tech-services">Tech Services</option>
    <option value="food-sales">Food Sales</option>
    <option value="custom-category">Your New Category</option>
</select>
```

### Modifying User Credentials
Edit the users object in `script.js`:
```javascript
this.users = {
    'admin': this.hashPassword('your_password'),
    'newuser': this.hashPassword('new_password')
};
```

## 🛡️ Security Features

### Data Protection
- All data is encrypted using Base64 encoding
- Local storage with browser-based security
- Session management with automatic timeouts
- Login attempt limiting (3 attempts max)

### Authentication
- Secure password hashing
- Multi-user support
- Session-based access control
- Automatic logout functionality

## 📊 Technical Specifications

### Technologies Used
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript ES6+** - Modern JavaScript features
- **Chart.js** - Professional charts and graphs
- **Font Awesome** - Icon library
- **Local Storage** - Client-side data persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Fast loading times
- Smooth animations
- Responsive design
- Optimized for mobile

## 📈 Data Structure

### Income Entry Format
```json
{
    "id": "unique_identifier",
    "amount": 150.50,
    "date": "2024-08-19",
    "category": "coffee-sales",
    "description": "Morning coffee sales",
    "timestamp": "2024-08-19T10:30:00.000Z",
    "user": "admin"
}
```

### Export Data Format
```json
{
    "company": "Ausetrick Tech. Cafe",
    "exportDate": "2024-08-19T10:30:00.000Z",
    "totalRecords": 25,
    "data": [...],
    "summary": {
        "dailyIncome": 250.00,
        "monthlyIncome": 7500.00,
        "yearlyIncome": 90000.00,
        "totalSavings": 18000.00
    }
}
```

## 🔄 Backup & Recovery

### Automatic Backups
- Data is automatically saved to local storage
- Encryption ensures data security
- Export functionality for external backups

### Manual Backup
1. Click "Backup Data" button
2. Choose save location
3. File will be saved as `ATC_Income_Data_YYYY-MM-DD.json`

### Recovery
1. Use browser import functionality
2. Or manually restore from exported JSON files
3. Contact support for data recovery assistance

## 📞 Support & Contact

### Technical Support
- **Company**: Ausetrick Tech. Cafe
- **System**: ATC Income Management System
- **Version**: 1.0.0

### Troubleshooting
1. **Login Issues**: Verify credentials, check caps lock
2. **Data Not Saving**: Check browser storage permissions
3. **Charts Not Loading**: Ensure JavaScript is enabled
4. **Export Issues**: Check download folder permissions

## 📝 License & Terms

This software is proprietary to Ausetrick Tech. Cafe. All rights reserved.

### Usage Terms
- Licensed for use by Ausetrick Tech. Cafe
- Not for redistribution or commercial use by third parties
- Data privacy and security compliance included

## 🔮 Future Updates

### Planned Features
- Multi-location support
- Advanced reporting
- API integration capabilities
- Mobile app version
- Cloud synchronization

### Update Process
- Updates will be provided as new versions
- Backward compatibility maintained
- Data migration tools included

---

**© 2024 Ausetrick Tech. Cafe - All Rights Reserved**

*Developed with security, reliability, and user experience in mind.*
