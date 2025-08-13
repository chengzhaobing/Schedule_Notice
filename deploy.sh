#!/bin/bash

# 日程通知系统 Docker 部署脚本
# 适用于 Linux/macOS 系统

set -e

echo "🚀 开始部署日程通知系统..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查环境文件
if [ ! -f ".env" ]; then
    echo "📝 创建环境配置文件..."
    cp .env.docker .env
    echo "⚠️  请编辑 .env 文件，配置您的邮箱信息"
    echo "   特别是 EMAIL_USER 和 EMAIL_PASS 字段"
    read -p "配置完成后按回车继续..."
fi

# 停止现有容器（如果存在）
echo "🛑 停止现有容器..."
docker-compose down 2>/dev/null || true

# 构建并启动服务
echo "🔨 构建应用镜像..."
docker-compose build --no-cache

echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 检查应用健康状态
echo "🏥 检查应用健康状态..."
for i in {1..30}; do
    if curl -f http://localhost:3000/api/health &>/dev/null; then
        echo "✅ 应用启动成功！"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ 应用启动超时，请检查日志"
        docker-compose logs app
        exit 1
    fi
    echo "等待应用启动... ($i/30)"
    sleep 2
done

echo ""
echo "🎉 部署完成！"
echo "📱 访问地址: http://localhost:3000"
echo "🔧 API地址: http://localhost:3000/api"
echo "💊 健康检查: http://localhost:3000/api/health"
echo ""
echo "📋 常用命令:"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo "  查看状态: docker-compose ps"
echo ""
echo "⚠️  注意: 请确保已正确配置 .env 文件中的邮箱信息"