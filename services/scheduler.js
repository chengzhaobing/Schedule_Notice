const cron = require('node-cron');
const Schedule = require('../models/Schedule');
const { sendReminderEmail } = require('../config/email');
const moment = require('moment');

class SchedulerService {
  constructor() {
    this.isRunning = false;
    this.task = null;
  }

  // 启动定时任务
  start() {
    if (this.isRunning) {
      console.log('定时任务已在运行中');
      return;
    }

    // 每分钟检查一次待发送的提醒
    this.task = cron.schedule('* * * * *', async () => {
      await this.processReminders();
    }, {
      scheduled: false
    });

    this.task.start();
    this.isRunning = true;
    console.log('定时任务已启动，每分钟检查一次待发送提醒');
  }

  // 停止定时任务
  stop() {
    if (this.task) {
      this.task.stop();
      this.task = null;
    }
    this.isRunning = false;
    console.log('定时任务已停止');
  }

  // 处理提醒
  async processReminders() {
    try {
      const pendingReminders = await Schedule.getPendingReminders();
      
      if (pendingReminders.length === 0) {
        return;
      }

      console.log(`发现 ${pendingReminders.length} 个待发送提醒`);

      for (const reminder of pendingReminders) {
        try {
          await this.sendReminder(reminder);
        } catch (error) {
          console.error(`发送提醒失败 (ID: ${reminder.reminder_id}):`, error.message);
        }
      }
    } catch (error) {
      console.error('处理提醒时发生错误:', error.message);
    }
  }

  // 发送单个提醒
  async sendReminder(reminder) {
    try {
      // 计算剩余时间
      const timeLeft = this.calculateTimeLeft(reminder.schedule_time);
      
      // 计算剩余提醒次数
      const remainingReminders = reminder.max_reminders - reminder.sent_reminders - 1;

      // 发送邮件
      await sendReminderEmail(
        reminder.email,
        {
          title: reminder.title,
          description: reminder.description,
          schedule_time: reminder.schedule_time,
          priority: reminder.priority
        },
        timeLeft,
        remainingReminders
      );

      // 标记提醒已发送
      await Schedule.markReminderSent(reminder.reminder_id, reminder.id);

      console.log(`提醒发送成功: ${reminder.title} -> ${reminder.email}`);
    } catch (error) {
      console.error(`发送提醒失败: ${reminder.title}`, error.message);
      throw error;
    }
  }

  // 计算剩余时间的友好显示
  calculateTimeLeft(scheduleTime) {
    const now = moment();
    const schedule = moment(scheduleTime);
    const duration = moment.duration(schedule.diff(now));

    if (duration.asMilliseconds() <= 0) {
      return '已过期';
    }

    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    let timeLeft = '';
    
    if (days > 0) {
      timeLeft += `${days}天`;
    }
    
    if (hours > 0) {
      timeLeft += `${hours}小时`;
    }
    
    if (minutes > 0) {
      timeLeft += `${minutes}分钟`;
    }

    return timeLeft || '不到1分钟';
  }

  // 手动触发提醒检查（用于测试）
  async triggerCheck() {
    console.log('手动触发提醒检查...');
    await this.processReminders();
  }

  // 获取定时任务状态
  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.task ? '每分钟执行' : null
    };
  }

  // 清理过期的未完成日程（可选功能）
  async cleanupExpiredSchedules() {
    try {
      // 这里可以添加清理逻辑，比如将过期的日程标记为已过期
      // 或者发送过期通知等
      console.log('清理过期日程...');
    } catch (error) {
      console.error('清理过期日程失败:', error.message);
    }
  }
}

// 创建单例实例
const schedulerService = new SchedulerService();

module.exports = schedulerService;