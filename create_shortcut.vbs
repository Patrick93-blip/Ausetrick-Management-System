Set WshShell = CreateObject("WScript.Shell")
Set oShellLink = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") & "\ATC Income Management.lnk")
oShellLink.TargetPath = WshShell.CurrentDirectory & "\index.html"
oShellLink.WindowStyle = 1
oShellLink.IconLocation = "C:\Windows\System32\shell32.dll,138"
oShellLink.Description = "Ausetrick Tech. Cafe Income Management System"
oShellLink.WorkingDirectory = WshShell.CurrentDirectory
oShellLink.Save
