# ATC Income Management System - Deployment Setup Script
param(
    [switch]$Test = $false
)

Write-Host "ATC Income Management System - Deployment Setup" -ForegroundColor Blue
Write-Host "================================================" -ForegroundColor Blue
Write-Host ""

# Display files in current directory
Write-Host "Files in your ATC system:" -ForegroundColor Green
Get-ChildItem -Name | ForEach-Object { 
    Write-Host "  $_" -ForegroundColor Gray 
}
Write-Host ""

# Check required files
$requiredFiles = @("index.html", "styles.css", "script.js", "manifest.json")
$allPresent = $true

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (missing)" -ForegroundColor Red
        $allPresent = $false
    }
}

if ($allPresent) {
    Write-Host ""
    Write-Host "All required files are present!" -ForegroundColor Green
    Write-Host ""
    
    # Test the application
    Write-Host "Testing the application..." -ForegroundColor Yellow
    try {
        Start-Process "index.html"
        Write-Host "Application opened in your browser!" -ForegroundColor Green
        Write-Host ""
        Write-Host "LOGIN CREDENTIALS:" -ForegroundColor Cyan
        Write-Host "Username: admin" -ForegroundColor White
        Write-Host "Password: atc2024" -ForegroundColor White
        Write-Host ""
    } catch {
        Write-Host "Could not open browser. Please open index.html manually." -ForegroundColor Yellow
    }
    
    # Create deployment ZIP
    try {
        $date = Get-Date -Format "yyyy-MM-dd"
        $zipName = "ATC_Income_System_$date.zip"
        
        if (Test-Path $zipName) {
            Remove-Item $zipName -Force
        }
        
        Compress-Archive -Path * -DestinationPath $zipName -Force
        Write-Host "Created deployment package: $zipName" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "Could not create ZIP file" -ForegroundColor Yellow
    }
    
    # Display deployment options
    Write-Host "DEPLOYMENT OPTIONS:" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. NETLIFY (Easiest - 2 minutes)" -ForegroundColor Yellow
    Write-Host "   - Go to https://netlify.com" -ForegroundColor Gray
    Write-Host "   - Sign up for free account" -ForegroundColor Gray
    Write-Host "   - Drag and drop your project folder" -ForegroundColor Gray
    Write-Host "   - Get instant live URL!" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. GITHUB PAGES (Popular - 10 minutes)" -ForegroundColor Yellow
    Write-Host "   - Create account at https://github.com" -ForegroundColor Gray
    Write-Host "   - Create new public repository" -ForegroundColor Gray
    Write-Host "   - Upload all files" -ForegroundColor Gray
    Write-Host "   - Enable GitHub Pages in Settings" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. FIREBASE (Professional - 15 minutes)" -ForegroundColor Yellow
    Write-Host "   - Install Node.js from https://nodejs.org" -ForegroundColor Gray
    Write-Host "   - Run: npm install -g firebase-tools" -ForegroundColor Gray
    Write-Host "   - Run: firebase login" -ForegroundColor Gray
    Write-Host "   - Run: firebase init hosting" -ForegroundColor Gray
    Write-Host "   - Run: firebase deploy" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "RECOMMENDATION: Start with Netlify for instant deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "For detailed instructions, see DEPLOY.md" -ForegroundColor Gray
    
} else {
    Write-Host "Some files are missing. Please ensure all files are present." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
