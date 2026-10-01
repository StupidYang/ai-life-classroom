$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$classroomRoot = $PSScriptRoot
$classroomSource = Join-Path $classroomRoot 'dist'
$classroomZip = Join-Path $classroomRoot 'AI生活课堂.zip'
$classroomFiles = @('index.html', 'styles.css', 'demos.css', 'trust.css', 'data.js', 'demo-data.js', 'demo-ui.js', 'trust-data.js', 'trust-ui.js', 'app.js', 'about.js', '打开网站说明.txt')
foreach ($classroomName in $classroomFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $classroomSource $classroomName) -PathType Leaf)) { throw "Missing delivery file: $classroomName" }
}
$classroomStream = [System.IO.File]::Open($classroomZip, [System.IO.FileMode]::Create)
$classroomArchive = [System.IO.Compression.ZipArchive]::new($classroomStream, [System.IO.Compression.ZipArchiveMode]::Create, $false, [System.Text.Encoding]::UTF8)
try {
    foreach ($classroomName in $classroomFiles) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($classroomArchive, (Join-Path $classroomSource $classroomName), "AI生活课堂/$classroomName", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally { $classroomArchive.Dispose(); $classroomStream.Dispose() }
Get-Item -LiteralPath $classroomZip | Select-Object FullName, Length
