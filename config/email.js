const nodemailer = require('nodemailer');
require('dotenv').config();

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100
});

// 验证邮件配置
async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('邮件服务配置验证成功');
    return true;
  } catch (error) {
    console.error('邮件服务配置验证失败:', error.message);
    return false;
  }
}

// 发送验证码邮件
async function sendVerificationEmail(to, code) {
  const mailOptions = {
    from: {
      name: '日程通知系统',
      address: process.env.EMAIL_USER
    },
    to: to,
    subject: '邮箱验证码 - 日程通知系统',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📅 日程通知系统</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #667eea;">
          <h2 style="color: #333; margin-top: 0;">邮箱验证</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">您好！感谢您使用日程通知系统。</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">您的验证码是：</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px dashed #667eea;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${code}</span>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            <strong>注意：</strong>验证码有效期为10分钟，请及时使用。如果您没有申请验证码，请忽略此邮件。
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>此邮件由系统自动发送，请勿回复。</p>
          <p>© 2024 日程通知系统. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('验证码邮件发送成功:', info.messageId);
    return true;
  } catch (error) {
    console.error('验证码邮件发送失败:', error.message);
    throw error;
  }
}

// 发送日程提醒邮件
async function sendReminderEmail(to, schedule, timeLeft, remainingReminders) {
  const priorityMap = {
    urgent: { name: '紧急', color: '#ff4757', icon: '🚨' },
    important: { name: '重要', color: '#ffa502', icon: '⚠️' },
    normal: { name: '一般', color: '#2ed573', icon: '📝' }
  };

  const priority = priorityMap[schedule.priority];
  
  const mailOptions = {
    from: {
      name: '日程通知系统',
      address: process.env.EMAIL_USER
    },
    to: to,
    subject: `${priority.icon} 日程提醒：${schedule.title}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="background: linear-gradient(135deg, ${priority.color} 0%, ${priority.color}dd 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${priority.icon} 日程提醒</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid ${priority.color};">
          <h2 style="color: #333; margin-top: 0; display: flex; align-items: center;">
            <span style="background: ${priority.color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 10px;">${priority.name}</span>
            ${schedule.title}
          </h2>
          
          ${schedule.description ? `<p style="color: #666; font-size: 16px; line-height: 1.6; background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #ddd;">${schedule.description}</p>` : ''}
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <span style="color: #666;">📅 计划时间：</span>
              <span style="font-weight: bold; color: #333;">${new Date(schedule.schedule_time).toLocaleString('zh-CN')}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <span style="color: #666;">⏰ 剩余时间：</span>
              <span style="font-weight: bold; color: ${priority.color};">${timeLeft}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #666;">🔔 剩余提醒次数：</span>
              <span style="font-weight: bold; color: #333;">${remainingReminders} 次</span>
            </div>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 3px solid #2196f3;">
            <p style="margin: 0; color: #1976d2; font-size: 14px;">
              💡 <strong>温馨提示：</strong>请及时处理您的日程安排，避免错过重要事项。
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>此邮件由系统自动发送，请勿回复。</p>
          <p>© 2024 日程通知系统. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('提醒邮件发送成功:', info.messageId);
    return true;
  } catch (error) {
    console.error('提醒邮件发送失败:', error.message);
    throw error;
  }
}

module.exports = {
  transporter,
  verifyEmailConfig,
  sendVerificationEmail,
  sendReminderEmail
};