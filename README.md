# 📅 日程通知系统

> 一个基于邮件提醒的智能日程管理系统，专为健忘症患者设计 🧠💭

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-支持-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 项目背景

作为一个记性很差的人，我经常忘记重要的事情。传统的闹钟提醒在嘈杂环境中容易被忽略，而邮件通知则更加可靠和持久。因此，我开发了这个基于邮件提醒的日程管理系统，让重要事项不再被遗忘。

## 🆕 最新更新

### v1.2.0 (2025-08-13)
- 🧰 一键 Docker 部署：新增 deploy.bat / deploy.sh 脚本，自动构建、启动、健康检查
- 🩺 健康检查增强：新增 Node 版 healthcheck.js，移除对容器内 curl 依赖
- 🧱 Dockerfile 优化：非 root 运行、清理 npm 缓存、健康检查脚本接入
- 🧩 docker-compose 增强：完善健康检查、只读挂载初始化 SQL、传递 PORT 环境变量

### v1.1.0 (2024-01-20)
- 🔧 **修复登录功能** - 解决了用户登录后数据显示异常的问题
- 🔐 **优化认证流程** - 改进了密码登录和自动登录的数据处理逻辑
- 📱 **界面优化** - 修复了登录模态框显示问题，提升用户体验
- 🐛 **Bug修复** - 修复了前后端数据结构不匹配导致的用户信息获取失败问题

## ✨ 核心特性

### 🔐 安全认证
- **邮箱验证登录** - 无需密码，通过邮箱验证码安全登录
- **会话管理** - JWT Token 保持登录状态
- **自动过期** - 验证码自动过期，确保安全性

### 📋 日程管理
- **智能分类** - 三种优先级：紧急🔴、重要🟡、一般🟢
- **详细描述** - 支持标题和详细描述
- **时间管理** - 精确到分钟的时间设置
- **状态跟踪** - 完成状态标记和统计

### 📧 邮件提醒
- **定时发送** - 按计划时间自动发送邮件提醒
- **多次提醒** - 可配置最大提醒次数（1-5次）
- **智能重试** - 发送失败自动重试机制
- **状态记录** - 详细的发送日志和状态跟踪

### 🎨 用户界面
- **现代设计** - 采用毛玻璃效果和渐变背景
- **响应式布局** - 完美适配桌面和移动设备
- **直观操作** - 简洁明了的操作界面
- **实时统计** - 各类日程数量实时显示

### 🔍 高级功能
- **搜索过滤** - 按标题、优先级、状态筛选
- **批量操作** - 支持批量标记完成
- **数据统计** - 详细的日程统计信息
- **健康检查** - API健康状态监控

## 🏗️ 技术架构

### 后端技术栈
- **Node.js** - 服务器运行环境
- **Express.js** - Web应用框架
- **MySQL** - 关系型数据库
- **Nodemailer** - 邮件发送服务
- **node-cron** - 定时任务调度
- **JWT** - 身份认证

### 前端技术栈
- **原生JavaScript** - 无框架依赖
- **CSS3** - 现代样式设计
- **Font Awesome** - 图标库
- **响应式设计** - 移动端适配

### 数据库设计
```sql
-- 用户表
users (
    id, email, verification_code, 
    code_expires_at, is_verified, 
    created_at, updated_at
)

-- 日程表
schedules (
    id, user_id, title, description,
    schedule_time, priority, is_completed,
    max_reminders, created_at, updated_at
)

-- 提醒记录表
reminders (
    id, schedule_id, sent_at, reminder_count,
    status, error_message, created_at
)
```

## 🚀 快速开始

### 方式一：Docker 一键部署（推荐）

#### 前置要求
- Docker 20.0+
- Docker Compose 2.0+

#### 部署步骤

**Linux/macOS:**
```bash
# 克隆项目
git clone https://github.com/chengzhaobing/Schedule_Notice.git
cd Schedule_Notice

# 配置环境变量
cp .env.docker .env
nano .env  # 编辑邮箱配置（EMAIL_USER / EMAIL_PASS 必填）

# 一键部署
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
# 克隆项目
git clone https://github.com/chengzhaobing/Schedule_Notice.git
cd Schedule_Notice

# 配置环境变量
copy .env.docker .env
notepad .env  # 编辑邮箱配置（EMAIL_USER / EMAIL_PASS 必填）

# 一键部署
deploy.bat
```

#### 手动 Docker 部署
```bash
# 构建并启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

> 健康检查：容器将自动调用内置的 healthcheck.js 检查 http://localhost:3000/api/health，无需安装 curl。

### 方式二：传统部署

#### 前置要求
- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

#### 安装步骤
```bash
# 1. 克隆项目
git clone https://github.com/chengzhaobing/Schedule_Notice.git
cd Schedule_Notice

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库和邮箱信息

# 4. 初始化数据库（容器化部署会自动导入 scripts/init-db.sql）
node scripts/init-db.js

# 5. 启动服务
npm start
```

## ⚙️ 配置说明

### 环境变量配置

```bash
# 数据库配置
DB_HOST=localhost          # 数据库主机
DB_USER=root              # 数据库用户名
DB_PASSWORD=your_password # 数据库密码
DB_NAME=schedule_notice   # 数据库名称
DB_PORT=3306             # 数据库端口

# 服务器配置
PORT=3000                # 服务端口
NODE_ENV=production      # 运行环境

# JWT配置
JWT_SECRET=your-secret-key # JWT密钥（请更改）

# 邮件服务配置
EMAIL_HOST=smtp.qq.com    # SMTP服务器
EMAIL_PORT=587           # SMTP端口
EMAIL_SECURE=false       # 是否使用SSL
EMAIL_USER=your@qq.com   # 发送邮箱
EMAIL_PASS=your-app-pass # 邮箱应用密码
```

### 邮箱配置指南

#### QQ邮箱配置
1. 登录QQ邮箱，进入设置
2. 开启SMTP服务
3. 获取应用密码（非QQ密码）
4. 配置信息：
   ```
   EMAIL_HOST=smtp.qq.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your@qq.com
   EMAIL_PASS=应用密码
   ```

#### Gmail配置
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your@gmail.com
EMAIL_PASS=应用密码
```

#### 163邮箱配置
```
EMAIL_HOST=smtp.163.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your@163.com
EMAIL_PASS=应用密码
```

## 📱 使用指南

### 1. 首次访问
1. 打开浏览器访问 `http://localhost:3000`
2. 输入邮箱地址
3. 点击"发送验证码"
4. 查收邮件并输入6位验证码
5. 验证成功后进入主界面

### 2. 创建日程
1. 点击"添加日程"按钮
2. 填写日程信息：
   - 标题（必填）
   - 描述（可选）
   - 计划时间（必填）
   - 优先级（必选）
   - 最大提醒次数（1-5次）
3. 点击"保存"完成创建

### 3. 管理日程
- **查看**: 主界面显示所有日程
- **编辑**: 点击日程项右上角的编辑图标
- **完成**: 点击勾选按钮标记完成
- **删除**: 点击垃圾桶图标删除

## 🧪 故障排查

- 构建失败：请确认 .env 中 Email 配置填写完整（EMAIL_USER/EMAIL_PASS）
- 无法发送邮件：检查 SMTP 服务是否开启、密码是否为“应用密码”
- MySQL 连接失败：确认端口占用、环境变量、容器健康状态（docker-compose ps）
- 应用未就绪：查看健康检查日志 docker-compose logs app

## 🛡️ 安全建议
- 生产环境务必更改 JWT_SECRET
- 不要在公开仓库提交真实邮箱密码
- 建议使用专用 SMTP 账号或应用密码

## 📄 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。

## 🙏 致谢

感谢以下开源项目：
- [Node.js](https://nodejs.org/) - JavaScript运行环境
- [Express.js](https://expressjs.com/) - Web应用框架
- [MySQL](https://www.mysql.com/) - 关系型数据库
- [Nodemailer](https://nodemailer.com/) - 邮件发送库
- [Font Awesome](https://fontawesome.com/) - 图标库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 📧 Email: [fiee1213@outlook.com]
- 🐛 Issues: [GitHub Issues]
- 💬 Discussions: [GitHub Discussions]

---

**记住：好记性不如烂笔头，烂笔头不如邮件提醒！** 📧✨