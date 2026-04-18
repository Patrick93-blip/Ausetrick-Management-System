#!/bin/bash

# ATC Income Management System - Mac/Linux Installer
# Ausetrick Tech. Cafe

clear

echo "========================================================="
echo "        ATC INCOME MANAGEMENT SYSTEM INSTALLER"
echo "========================================================="
echo "        Ausetrick Tech. Cafe - Professional Software"
echo "========================================================="
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    DESKTOP_DIR="$HOME/Desktop"
    APPLICATIONS_DIR="$HOME/Applications"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    DESKTOP_DIR="$HOME/Desktop"
    APPLICATIONS_DIR="$HOME/.local/share/applications"
else
    OS="Unknown"
fi

echo "Detected Operating System: $OS"
echo ""

# Create installation directory
INSTALL_DIR="$HOME/ATC_Income_Management_System"
echo "Creating installation directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# Copy files
echo "Copying application files..."
cp index.html "$INSTALL_DIR/"
cp styles.css "$INSTALL_DIR/"
cp script.js "$INSTALL_DIR/"
cp manifest.json "$INSTALL_DIR/"
cp sw.js "$INSTALL_DIR/"
cp README.md "$INSTALL_DIR/"
cp QUICK_START.txt "$INSTALL_DIR/"

# Create launcher script
echo "Creating launcher script..."
cat > "$INSTALL_DIR/launch-atc.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
echo "=================================================="
echo "  Ausetrick Tech. Cafe - Income Management System"
echo "=================================================="
echo ""
echo "Starting your income management system..."
echo ""
echo "Login Credentials:"
echo "Username: admin      Password: atc2024"
echo "Username: manager    Password: manager123"
echo "Username: user       Password: user123"
echo ""
echo "Opening in your default browser..."

# Try different browsers
if command -v open >/dev/null 2>&1; then
    # macOS
    open index.html
elif command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open index.html
elif command -v gnome-open >/dev/null 2>&1; then
    # Linux (older)
    gnome-open index.html
else
    echo "Please open index.html in your web browser manually"
fi

echo "System launched successfully!"
echo "Press Enter to close this window..."
read
EOF

chmod +x "$INSTALL_DIR/launch-atc.sh"

# Create desktop shortcut
if [ -d "$DESKTOP_DIR" ]; then
    echo "Creating desktop shortcut..."
    
    if [[ "$OS" == "macOS" ]]; then
        # macOS Desktop Alias
        cat > "$DESKTOP_DIR/ATC Income Management.command" << EOF
#!/bin/bash
"$INSTALL_DIR/launch-atc.sh"
EOF
        chmod +x "$DESKTOP_DIR/ATC Income Management.command"
        
    elif [[ "$OS" == "Linux" ]]; then
        # Linux Desktop Entry
        cat > "$DESKTOP_DIR/ATC-Income-Management.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=ATC Income Management
Comment=Ausetrick Tech. Cafe Income Management System
Exec=$INSTALL_DIR/launch-atc.sh
Icon=folder
Terminal=true
Categories=Office;Finance;
EOF
        chmod +x "$DESKTOP_DIR/ATC-Income-Management.desktop"
    fi
fi

# Create application menu entry (Linux)
if [[ "$OS" == "Linux" ]] && [ -d "$HOME/.local/share/applications" ]; then
    echo "Creating application menu entry..."
    mkdir -p "$HOME/.local/share/applications"
    
    cat > "$HOME/.local/share/applications/atc-income.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=ATC Income Management
Comment=Ausetrick Tech. Cafe Income Management System
Exec=$INSTALL_DIR/launch-atc.sh
Icon=folder
Terminal=true
Categories=Office;Finance;
EOF
fi

echo ""
echo "========================================================="
echo "                  INSTALLATION COMPLETE!"
echo "========================================================="
echo ""
echo "ATC Income Management System has been installed to:"
echo "$INSTALL_DIR"
echo ""
echo "How to launch:"
if [[ "$OS" == "macOS" ]]; then
    echo "- Desktop: Double-click 'ATC Income Management.command'"
elif [[ "$OS" == "Linux" ]]; then
    echo "- Desktop: Double-click 'ATC-Income-Management.desktop'"
    echo "- Applications Menu: Look for 'ATC Income Management'"
fi
echo "- Terminal: $INSTALL_DIR/launch-atc.sh"
echo "- Browser: Open $INSTALL_DIR/index.html"
echo ""
echo "Login Credentials:"
echo "Username: admin      Password: atc2024"
echo "Username: manager    Password: manager123"
echo "Username: user       Password: user123"
echo ""
echo "Features:"
echo "✓ Secure income tracking"
echo "✓ Automatic calculations"  
echo "✓ Professional reports"
echo "✓ Data export/backup"
echo "✓ Works offline"
echo ""
echo "Support: Check README.md for full documentation"
echo ""

read -p "Would you like to launch the system now? (y/n): " launch_choice
if [[ $launch_choice == [Yy] ]]; then
    echo "Launching ATC Income Management System..."
    "$INSTALL_DIR/launch-atc.sh" &
fi

echo ""
echo "Installation completed successfully!"
echo "Press Enter to exit..."
read
