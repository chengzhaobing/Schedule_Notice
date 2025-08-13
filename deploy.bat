@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 开始部署日程通知系统...
echo.

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    echo 下载地址: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM 检查 Docker Compose 是否可用
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose 不可用，请确保 Docker Desktop 正常运行
    pause
    exit /b 1
)

REM 检查环境文件
if not exist ".env" (
    echo 📝 创建环境配置文件...
    copy ".env.docker" ".env" >nul
    echo ⚠️  请编辑 .env 文件，配置您的邮箱信息
    echo    特别是 EMAIL_USER 和 EMAIL_PASS 字段
    echo.
    pause
)

REM 停止现有容器（如果存在）
echo 🛑 停止现有容器...
docker-compose down >nul 2>&1

REM 构建并启动服务
echo 🔨 构建应用镜像...
docker-compose build --no-cache
if errorlevel 1 (
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)

echo 🚀 启动服务...
docker-compose up -d
if errorlevel 1 (
    echo ❌ 启动失败，请检查错误信息
    pause
    exit /b 1
)

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo 🔍 检查服务状态...
docker-compose ps

REM 检查应用健康状态
echo 🏥 检查应用健康状态...
set /a count=0
:healthcheck
set /a count+=1
curl -f http://localhost:3000/api/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ 应用启动成功！
    goto success
)
if !count! geq 30 (
    echo ❌ 应用启动超时，请检查日志
    docker-compose logs app
    pause
    exit /b 1
)
echo 等待应用启动... (!count!/30)
timeout /t 2 /nobreak >nul
goto healthcheck

:success
echo.
echo 🎉 部署完成！
echo 📱 访问地址: http://localhost:3000
echo 🔧 API地址: http://localhost:3000/api
echo 💊 健康检查: http://localhost:3000/api/health
echo.
echo 📋 常用命令:
echo   查看日志: docker-compose logs -f
echo   停止服务: docker-compose down
echo   重启服务: docker-compose restart
echo   查看状态: docker-compose ps
echo.
echo ⚠️  注意: 请确保已正确配置 .env 文件中的邮箱信息
echo.
echo 按任意键打开浏览器...
pause >nul
start http://localhost:3000