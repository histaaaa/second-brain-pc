@echo off
chcp 65001 >nul
echo 正在检查路径...
cd /d "%~dp0"
echo 当前目录: %cd%
node scripts/pregenerate.js
echo.
echo 预生成完成！请刷新浏览器。
pause
