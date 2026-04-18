@echo off
title ATC Income Management System - Installer
color 0b

echo.
echo  =========================================================
echo          ATC INCOME MANAGEMENT SYSTEM INSTALLER
echo  =========================================================
echo          Ausetrick Tech. Cafe - Professional Software
echo  =========================================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo  [ADMIN] Running with Administrator privileges - Full installation available
    set ADMIN_MODE=1
) else (
    echo  [USER]  Running in user mode - Standard installation
    set ADMIN_MODE=0
)

echo.
echo  Installing ATC Income Management System...
echo.

REM Create installation directory
set INSTALL_DIR=%USERPROFILE%\ATC_Income_Management_System
echo  Creating directory: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Copy all files
echo  Copying application files...
copy "index.html" "%INSTALL_DIR%\" >nul
copy "styles.css" "%INSTALL_DIR%\" >nul
copy "script.js" "%INSTALL_DIR%\" >nul
copy "manifest.json" "%INSTALL_DIR%\" >nul
copy "sw.js" "%INSTALL_DIR%\" >nul
copy "README.md" "%INSTALL_DIR%\" >nul
copy "QUICK_START.txt" "%INSTALL_DIR%\" >nul
copy "Launch_ATC.bat" "%INSTALL_DIR%\" >nul

echo  Creating desktop shortcut...
REM Create desktop shortcut using PowerShell
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\ATC Income Management.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\Launch_ATC.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = 'C:\Windows\System32\shell32.dll,138'; $Shortcut.Description = 'Ausetrick Tech. Cafe Income Management System'; $Shortcut.Save()"

if %ADMIN_MODE%==1 (
    echo  Creating Start Menu entry...
    REM Create Start Menu shortcut if admin
    powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%PROGRAMDATA%\Microsoft\Windows\Start Menu\Programs\ATC Income Management.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\Launch_ATC.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = 'C:\Windows\System32\shell32.dll,138'; $Shortcut.Description = 'Ausetrick Tech. Cafe Income Management System'; $Shortcut.Save()"
) else (
    echo  Creating user Start Menu entry...
    powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%APPDATA%\Microsoft\Windows\Start Menu\Programs\ATC Income Management.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\Launch_ATC.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = 'C:\Windows\System32\shell32.dll,138'; $Shortcut.Description = 'Ausetrick Tech. Cafe Income Management System'; $Shortcut.Save()"
)

echo.
echo  =========================================================
echo                    INSTALLATION COMPLETE!
echo  =========================================================
echo.
echo  ATC Income Management System has been installed to:
echo  %INSTALL_DIR%
echo.
echo  How to launch:
echo  - Desktop shortcut: "ATC Income Management"
echo  - Start Menu: Search "ATC"
echo  - Direct: Double-click Launch_ATC.bat
echo.
echo  Login Credentials:
echo  Username: admin      Password: atc2024
echo  Username: manager    Password: manager123
echo  Username: user       Password: user123
echo.
echo  Features:
echo  ✓ Secure income tracking
echo  ✓ Automatic calculations
echo  ✓ Professional reports
echo  ✓ Data export/backup
echo  ✓ Works offline
echo.
echo  Support: Check README.md for full documentation
echo.
echo  Would you like to launch the system now? (Y/N)
set /p launch_choice=
if /i "%launch_choice%"=="Y" (
    echo  Launching ATC Income Management System...
    start "" "%INSTALL_DIR%\Launch_ATC.bat"
)

echo.
echo  Installation completed successfully!
echo  Press any key to exit installer...
pause >nul
