$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

try {
    Set-Location "c:\Users\lenovo\Desktop\第二大脑PC" -ErrorAction Stop
    node "scripts/pregenerate.js"
} catch {
    Write-Host "错误: $_" -ForegroundColor Red
    Write-Host "尝试使用替代方法..." -ForegroundColor Yellow
    
    # 尝试使用 chcp 切换编码
    cmd /c "chcp 65001 && cd /d c:\Users\lenovo\Desktop\第二大脑PC && node scripts/pregenerate.js"
}
