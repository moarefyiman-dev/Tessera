$ErrorActionPreference = "Stop"
$appPath = Join-Path $PSScriptRoot "index.html"

if (-not (Test-Path -LiteralPath $appPath)) {
    throw "Teressa's index.html was not found beside this installer."
}

$browserCandidates = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
)
$browser = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $browser) {
    throw "Install Microsoft Edge or Google Chrome, then run Install Teressa.bat again."
}

Add-Type -AssemblyName System.Drawing
$iconDirectory = Join-Path $env:LOCALAPPDATA "Teressa"
New-Item -ItemType Directory -Path $iconDirectory -Force | Out-Null
$iconPath = Join-Path $iconDirectory "teressa.ico"

$bitmap = New-Object System.Drawing.Bitmap 64, 64
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
$graphics.Clear([System.Drawing.Color]::FromArgb(25, 42, 52))
function Draw-Block([int]$x, [int]$y, [int]$width, [int]$height, [string]$color) {
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($color))
    $graphics.FillRectangle($brush, $x, $y, $width, $height)
    $brush.Dispose()
}

try {
    Draw-Block 7 39 50 18 "#805435"
    Draw-Block 7 36 50 5 "#A9C96B"
    Draw-Block 7 33 50 4 "#739449"
    Draw-Block 16 15 8 20 "#533C2A"
    Draw-Block 11 13 18 8 "#477447"
    Draw-Block 8 20 25 8 "#355B3E"
    Draw-Block 14 27 19 7 "#58844B"
    Draw-Block 39 24 6 12 "#E0B985"
    Draw-Block 38 21 9 5 "#4B3027"
    Draw-Block 38 35 8 5 "#704C36"
    Draw-Block 49 10 7 7 "#F4DDA2"

    $bitmapData = $bitmap.LockBits(
        [System.Drawing.Rectangle]::new(0, 0, 64, 64),
        [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
    )
    $xorBitmap = New-Object byte[] (64 * 64 * 4)
    [System.Runtime.InteropServices.Marshal]::Copy($bitmapData.Scan0, $xorBitmap, 0, $xorBitmap.Length)
    $bitmap.UnlockBits($bitmapData)

    $iconBytes = New-Object System.IO.MemoryStream
    $writer = New-Object System.IO.BinaryWriter $iconBytes
    $mask = New-Object byte[] (64 * 8)
    $imageSize = 40 + $xorBitmap.Length + $mask.Length
    $writer.Write([UInt16]0); $writer.Write([UInt16]1); $writer.Write([UInt16]1)
    $writer.Write([byte]64); $writer.Write([byte]64); $writer.Write([byte]0); $writer.Write([byte]0)
    $writer.Write([UInt16]1); $writer.Write([UInt16]32)
    $writer.Write([UInt32]$imageSize); $writer.Write([UInt32]22)
    $writer.Write([UInt32]40); $writer.Write([Int32]64); $writer.Write([Int32]128)
    $writer.Write([UInt16]1); $writer.Write([UInt16]32); $writer.Write([UInt32]0)
    $writer.Write([UInt32]$xorBitmap.Length); $writer.Write([Int32]0); $writer.Write([Int32]0)
    $writer.Write([UInt32]0); $writer.Write([UInt32]0)
    for ($y = 63; $y -ge 0; $y--) {
        $offset = $y * 64 * 4
        $writer.Write($xorBitmap, $offset, 64 * 4)
    }
    $writer.Write($mask)
    [System.IO.File]::WriteAllBytes($iconPath, $iconBytes.ToArray())
    $writer.Dispose()
    $iconBytes.Dispose()
}
finally {
    $graphics.Dispose()
    $bitmap.Dispose()
}

$appUri = ([System.Uri]::new($appPath)).AbsoluteUri
$shortcutDirectories = @(
    [Environment]::GetFolderPath("Desktop"),
    (Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs")
)
$shell = New-Object -ComObject WScript.Shell
foreach ($directory in $shortcutDirectories) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    $shortcutPath = Join-Path $directory "Teressa.lnk"
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $browser
    $shortcut.Arguments = "--app=`"$appUri`" --start-maximized"
    $shortcut.WorkingDirectory = $PSScriptRoot
    $shortcut.Description = "Play Teressa: Beneath the Bloom"
    $shortcut.IconLocation = "$iconPath,0"
    $shortcut.Save()
}

Write-Host "Teressa is ready. Double-click the Teressa icon on your Desktop whenever you want to play." -ForegroundColor Green
Write-Host "A copy is also available in your Windows Start menu."
$shell.Popup(
    "Teressa is ready! Double-click the Teressa icon on your Desktop whenever you want to play.",
    8,
    "Teressa installed",
    64
) | Out-Null
