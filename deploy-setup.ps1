# ATC Income Management System - Deployment Setup Script
# Run this script to prepare for deployment

Write-Host "🚀 ATC Income Management System - Deployment Setup" -ForegroundColor Blue
Write-Host "=============================================" -ForegroundColor Blue
Write-Host ""

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "⚠️  This script requires Administrator privileges for some features." -ForegroundColor Yellow
    Write-Host "   Run PowerShell as Administrator for full functionality." -ForegroundColor Yellow
    Write-Host ""
}

# Display current directory and files
Write-Host "📁 Current Directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""
Write-Host "📄 Files in your ATC system:" -ForegroundColor Green
Get-ChildItem -Name | ForEach-Object { Write-Host "   ✅ $_" -ForegroundColor Gray }
Write-Host ""

# Check if all required files exist
$requiredFiles = @("index.html", "styles.css", "script.js", "manifest.json", "sw.js", "README.md")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "✅ All required files are present!" -ForegroundColor Green
} else {
    Write-Host "❌ Missing files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host ""
}

# Display deployment options
Write-Host ""
Write-Host "🌐 DEPLOYMENT OPTIONS:" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. 🎯 NETLIFY (Recommended - Instant)" -ForegroundColor Yellow
Write-Host "   • Go to: https://netlify.com" -ForegroundColor Gray
Write-Host "   • Drag & drop this entire folder" -ForegroundColor Gray
Write-Host "   • Get instant live URL!" -ForegroundColor Gray
Write-Host ""

Write-Host "2. 🐙 GITHUB PAGES (Popular)" -ForegroundColor Yellow
Write-Host "   • Create account: https://github.com" -ForegroundColor Gray
Write-Host "   • Create new repository" -ForegroundColor Gray
Write-Host "   • Upload all files" -ForegroundColor Gray
Write-Host "   • Enable Pages in Settings" -ForegroundColor Gray
Write-Host ""

Write-Host "3. 🔥 GOOGLE FIREBASE (Professional)" -ForegroundColor Yellow
Write-Host "   • Install Node.js first" -ForegroundColor Gray
Write-Host "   • Run: npm install -g firebase-tools" -ForegroundColor Gray
Write-Host "   • Run: firebase login" -ForegroundColor Gray
Write-Host "   • Run: firebase init hosting" -ForegroundColor Gray
Write-Host "   • Run: firebase deploy" -ForegroundColor Gray
Write-Host ""

# Test the application
Write-Host "🧪 TESTING YOUR APPLICATION:" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

$testApp = Read-Host "Would you like to test the application now? (y/n)"
if ($testApp -eq "y" -or $testApp -eq "Y" -or $testApp -eq "yes") {
    Write-Host "🚀 Opening ATC Income Management System..." -ForegroundColor Green
    try {
        Start-Process "index.html"
        Write-Host "✅ Application opened in your default browser!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔑 TEST LOGIN CREDENTIALS:" -ForegroundColor Yellow
        Write-Host "   Username: admin" -ForegroundColor Gray
        Write-Host "   Password: atc2024" -ForegroundColor Gray
        Write-Host ""
    } catch {
        Write-Host "❌ Could not open browser automatically." -ForegroundColor Red
        Write-Host "   Please manually open 'index.html' in your browser." -ForegroundColor Gray
    }
}

# Check for Git installation (for GitHub deployment)
Write-Host "🔧 DEPLOYMENT TOOLS CHECK:" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Git not found (needed for GitHub deployment)" -ForegroundColor Yellow
    Write-Host "   Download: https://git-scm.com/downloads" -ForegroundColor Gray
}

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Node.js not found (needed for Firebase deployment)" -ForegroundColor Yellow
    Write-Host "   Download: https://nodejs.org" -ForegroundColor Gray
}

Write-Host ""

# Create a ZIP file for easy sharing
Write-Host "📦 CREATING DEPLOYMENT PACKAGE:" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

try {
    $zipPath = "ATC_Income_System_$(Get-Date -Format 'yyyy-MM-dd').zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    Compress-Archive -Path * -DestinationPath $zipPath -Force
    Write-Host "✅ Created deployment package: $zipPath" -ForegroundColor Green
    Write-Host "   You can upload this ZIP file to any hosting service!" -ForegroundColor Gray
} catch {
    Write-Host "❌ Could not create ZIP package" -ForegroundColor Yellow
    Write-Host "   You can manually select all files for upload" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 SETUP COMPLETE!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Choose a deployment option above" -ForegroundColor Gray
Write-Host "2. Follow the instructions in DEPLOY.md" -ForegroundColor Gray
Write-Host "3. Test your live website" -ForegroundColor Gray
Write-Host "4. Share your URL with users!" -ForegroundColor Gray
Write-Host ""
Write-Host "📞 Need help? Check README.md for detailed documentation." -ForegroundColor Gray
Write-Host ""

# Keep window open
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
