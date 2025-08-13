# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖（仅生产依赖）
RUN npm ci --only=production && npm cache clean --force

# 复制应用源代码
COPY . .

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001 && chown -R appuser:nodejs /app
USER appuser

# 暴露端口
EXPOSE 3000

# 健康检查（使用 Node 脚本，避免依赖 curl）
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# 启动应用
CMD ["npm", "start"]