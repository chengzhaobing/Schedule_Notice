# 📅 日程通知系统

> 一个基于邮件提醒的智能日程管理系统，专为健忘症患者设计 🧠💭

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-支持-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 项目背景

作为一个记性很差的人，我经常忘记重要的事情。传统的闹钟提醒在嘈杂环境中容易被忽略，而邮件通知则更加可靠和持久。因此，我开发了这个基于邮件提醒的日程管理系统，让重要事项不再被遗忘。

## 🆕 最新更新

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
nano .env  # 编辑邮箱配置

# 一键部署
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
# 克隆项目
git clone <repository-url>
cd Schedule_Notice

# 配置环境变量
copy .env.docker .env
notepad .env  # 编辑邮箱配置

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

# 4. 初始化数据库
npm run init-db

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
- **搜索**: 使用搜索框按标题查找
- **筛选**: 按优先级和状态筛选
- **编辑**: 点击日程卡片进行编辑
- **完成**: 点击勾选框标记完成
- **删除**: 点击删除按钮移除日程

### 4. 邮件提醒
- 系统每分钟检查一次待提醒的日程
- 到达设定时间自动发送邮件提醒
- 邮件包含日程详细信息
- 发送失败会自动重试
- 达到最大提醒次数后停止发送

## 🔧 API 接口

### 用户认证
```http
# 发送验证码
POST /api/users/send-code
Content-Type: application/json
{
  "email": "user@example.com"
}

# 验证登录
POST /api/users/verify
Content-Type: application/json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### 日程管理
```http
# 获取日程列表
GET /api/schedules
Authorization: Bearer <token>

# 创建日程
POST /api/schedules
Authorization: Bearer <token>
Content-Type: application/json
{
  "title": "重要会议",
  "description": "项目讨论会议",
  "schedule_time": "2024-01-01T10:00:00",
  "priority": "important",
  "max_reminders": 3
}

# 更新日程
PUT /api/schedules/:id
Authorization: Bearer <token>

# 删除日程
DELETE /api/schedules/:id
Authorization: Bearer <token>
```

### 系统监控
```http
# 健康检查
GET /api/health

# 响应示例
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected",
  "email": "configured"
}
```

## 🐳 Docker 详细说明

### 容器架构
- **app**: 应用服务容器
- **mysql**: MySQL数据库容器
- **schedule_network**: 内部网络
- **mysql_data**: 数据持久化卷

### 常用命令
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f app
docker-compose logs -f mysql

# 进入容器
docker-compose exec app sh
docker-compose exec mysql mysql -uroot -p

# 备份数据库
docker-compose exec mysql mysqldump -uroot -p schedule_notice > backup.sql

# 恢复数据库
docker-compose exec -T mysql mysql -uroot -p schedule_notice < backup.sql
```

### 数据持久化
- MySQL数据存储在Docker卷中
- 应用日志映射到本地`./logs`目录
- 容器重启数据不会丢失

## 🔍 故障排除

### 常见问题

#### 1. 邮件发送失败
**症状**: 日程到时间但未收到邮件
**解决方案**:
- 检查邮箱配置是否正确
- 确认应用密码而非登录密码
- 查看应用日志确认错误信息
- 测试SMTP连接

#### 2. 数据库连接失败
**症状**: 应用启动报数据库连接错误
**解决方案**:
- 检查MySQL服务是否启动
- 确认数据库配置信息
- 检查防火墙设置
- 验证用户权限

#### 3. Docker部署问题
**症状**: 容器启动失败
**解决方案**:
```bash
# 查看详细日志
docker-compose logs

# 重新构建镜像
docker-compose build --no-cache

# 清理并重启
docker-compose down -v
docker-compose up -d
```

#### 4. 端口占用
**症状**: 端口3000已被占用
**解决方案**:
- 修改docker-compose.yml中的端口映射
- 或停止占用端口的服务

### 日志查看
```bash
# 应用日志
docker-compose logs -f app

# 数据库日志
docker-compose logs -f mysql

# 实时日志
tail -f logs/app.log
```

## 🔒 安全考虑

### 生产环境建议
1. **更改默认密码**: 修改数据库root密码
2. **JWT密钥**: 使用强随机密钥
3. **HTTPS**: 配置SSL证书
4. **防火墙**: 限制数据库端口访问
5. **备份**: 定期备份数据库
6. **监控**: 配置日志监控和告警

### 数据保护
- 验证码6位数字，5分钟过期
- JWT Token 24小时过期
- 数据库连接加密
- 邮箱信息不存储密码

## 📈 性能优化

### 数据库优化
- 添加必要索引
- 定期清理过期数据
- 连接池配置
- 查询优化

### 应用优化
- 静态资源缓存
- API响应压缩
- 连接复用
- 内存管理

## 🤝 贡献指南

### 开发环境搭建
```bash
# 克隆项目
git clone https://github.com/chengzhaobing/Schedule_Notice.git
cd Schedule_Notice

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

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