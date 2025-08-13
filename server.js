const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 导入配置和服务
const { testConnection } = require('./config/database');
const { verifyEmailConfig } = require('./config/email');
const schedulerService = require('./services/scheduler');

// 导入路由
const usersRouter = require('./routes/users');
const schedulesRouter = require('./routes/schedules');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api/users', usersRouter);
app.use('/api/schedules', schedulesRouter);

// 系统状态检查路由
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    const emailStatus = await verifyEmailConfig();
    const schedulerStatus = schedulerService.getStatus();
    
    res.json({
      success: true,
      status: 'healthy',
      services: {
        database: dbStatus ? 'connected' : 'disconnected',
        email: emailStatus ? 'configured' : 'error',
        scheduler: schedulerStatus.isRunning ? 'running' : 'stopped'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 手动触发提醒检查（用于测试）
app.post('/api/admin/trigger-reminders', async (req, res) => {
  try {
    await schedulerService.triggerCheck();
    res.json({
      success: true,
      message: '提醒检查已触发'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '触发提醒检查失败: ' + error.message
    });
  }
});

// 获取定时任务状态
app.get('/api/admin/scheduler-status', (req, res) => {
  const status = schedulerService.getStatus();
  res.json({
    success: true,
    data: status
  });
});

// 启动/停止定时任务
app.post('/api/admin/scheduler/:action', (req, res) => {
  try {
    const { action } = req.params;
    
    if (action === 'start') {
      schedulerService.start();
      res.json({
        success: true,
        message: '定时任务已启动'
      });
    } else if (action === 'stop') {
      schedulerService.stop();
      res.json({
        success: true,
        message: '定时任务已停止'
      });
    } else {
      res.status(400).json({
        success: false,
        message: '无效的操作，只支持 start 或 stop'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '操作失败: ' + error.message
    });
  }
});

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404处理
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      message: 'API接口不存在'
    });
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// 全局错误处理
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    console.log('正在测试数据库连接...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('数据库连接失败，请检查配置');
      process.exit(1);
    }

    // 测试邮件配置
    console.log('正在验证邮件配置...');
    const emailConfigured = await verifyEmailConfig();
    if (!emailConfigured) {
      console.warn('邮件配置验证失败，邮件功能可能无法正常工作');
    }

    // 启动定时任务
    console.log('正在启动定时任务...');
    schedulerService.start();

    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log('\n=================================');
      console.log('🚀 日程通知系统启动成功！');
      console.log('=================================');
      console.log(`📱 访问地址: http://localhost:${PORT}`);
      console.log(`🔧 API地址: http://localhost:${PORT}/api`);
      console.log(`💊 健康检查: http://localhost:${PORT}/api/health`);
      console.log('=================================\n');
      
      console.log('系统状态:');
      console.log(`✅ 数据库: ${dbConnected ? '已连接' : '连接失败'}`);
      console.log(`📧 邮件服务: ${emailConfigured ? '已配置' : '配置失败'}`);
      console.log(`⏰ 定时任务: ${schedulerService.getStatus().isRunning ? '运行中' : '已停止'}`);
      console.log('\n按 Ctrl+C 停止服务器');
    });
  } catch (error) {
    console.error('启动服务器失败:', error.message);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  schedulerService.stop();
  console.log('服务器已关闭');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n正在关闭服务器...');
  schedulerService.stop();
  console.log('服务器已关闭');
  process.exit(0);
});

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  schedulerService.stop();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  schedulerService.stop();
  process.exit(1);
});

// 启动服务器
startServer();

module.exports = app;