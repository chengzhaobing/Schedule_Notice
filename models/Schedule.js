const { query, transaction } = require('../config/database');
const moment = require('moment');

class Schedule {
  // 创建新日程
  static async create(userId, scheduleData) {
    try {
      const { title, description, schedule_time, priority, max_reminders } = scheduleData;
      
      // 验证必填字段
      if (!title || !schedule_time) {
        throw new Error('标题和计划时间为必填项');
      }

      // 验证时间不能是过去时间
      if (new Date(schedule_time) <= new Date()) {
        throw new Error('计划时间不能是过去时间');
      }

      // 验证优先级
      const validPriorities = ['urgent', 'important', 'normal'];
      if (!validPriorities.includes(priority)) {
        throw new Error('无效的优先级');
      }

      const result = await transaction(async (connection) => {
        // 插入日程
        const [scheduleResult] = await connection.execute(
          'INSERT INTO schedules (user_id, title, description, schedule_time, priority, max_reminders) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, title, description || null, schedule_time, priority, max_reminders || 3]
        );

        const scheduleId = scheduleResult.insertId;

        // 根据优先级创建提醒时间
        const reminderTimes = this.calculateReminderTimes(schedule_time, priority, max_reminders || 3);
        
        // 插入提醒记录
        for (const reminderTime of reminderTimes) {
          await connection.execute(
            'INSERT INTO reminders (schedule_id, reminder_time) VALUES (?, ?)',
            [scheduleId, reminderTime]
          );
        }

        return scheduleId;
      });

      return await this.findById(result);
    } catch (error) {
      throw new Error('创建日程失败: ' + error.message);
    }
  }

  // 计算提醒时间
  static calculateReminderTimes(scheduleTime, priority, maxReminders) {
    const scheduleDate = moment(scheduleTime);
    const reminderTimes = [];

    switch (priority) {
      case 'urgent':
        // 紧急：1天前、12小时前、1小时前
        if (maxReminders >= 1) reminderTimes.push(scheduleDate.clone().subtract(1, 'day').toDate());
        if (maxReminders >= 2) reminderTimes.push(scheduleDate.clone().subtract(12, 'hours').toDate());
        if (maxReminders >= 3) reminderTimes.push(scheduleDate.clone().subtract(1, 'hour').toDate());
        break;
        
      case 'important':
        // 重要：1小时前、30分钟前、10分钟前
        if (maxReminders >= 1) reminderTimes.push(scheduleDate.clone().subtract(1, 'hour').toDate());
        if (maxReminders >= 2) reminderTimes.push(scheduleDate.clone().subtract(30, 'minutes').toDate());
        if (maxReminders >= 3) reminderTimes.push(scheduleDate.clone().subtract(10, 'minutes').toDate());
        break;
        
      case 'normal':
        // 一般：10分钟前
        reminderTimes.push(scheduleDate.clone().subtract(10, 'minutes').toDate());
        break;
    }

    // 过滤掉已经过去的提醒时间
    return reminderTimes.filter(time => time > new Date());
  }

  // 根据ID查找日程
  static async findById(id) {
    try {
      const schedules = await query(
        'SELECT s.*, u.email FROM schedules s JOIN users u ON s.user_id = u.id WHERE s.id = ?',
        [id]
      );
      return schedules.length > 0 ? schedules[0] : null;
    } catch (error) {
      throw new Error('查找日程失败: ' + error.message);
    }
  }

  // 获取用户的所有日程
  static async findByUserId(userId, options = {}) {
    try {
      // 构建基础查询
      let sql = 'SELECT * FROM schedules WHERE user_id = ' + parseInt(userId);
      
      // 添加筛选条件
      if (options.priority) {
        sql += ' AND priority = "' + options.priority + '"';
      }

      if (options.completed !== undefined) {
        sql += ' AND is_completed = ' + (options.completed ? 1 : 0);
      }

      if (options.startDate) {
        sql += ' AND schedule_time >= "' + options.startDate + '"';
      }

      if (options.endDate) {
        sql += ' AND schedule_time <= "' + options.endDate + '"';
      }

      // 添加搜索条件
      if (options.search) {
        const searchTerm = options.search.replace(/'/g, "''"); // 转义单引号
        sql += ' AND (title LIKE "%' + searchTerm + '%" OR description LIKE "%' + searchTerm + '%")';
      }

      // 排序
      sql += ' ORDER BY schedule_time ASC';

      // 分页
      if (options.limit && !isNaN(options.limit)) {
        const limit = parseInt(options.limit);
        if (options.offset && !isNaN(options.offset)) {
          const offset = parseInt(options.offset);
          sql += ' LIMIT ' + offset + ', ' + limit;
        } else {
          sql += ' LIMIT ' + limit;
        }
      }

      console.log('执行SQL:', sql);
      
      return await query(sql);
    } catch (error) {
      console.error('SQL执行错误:', error);
      throw new Error('获取日程列表失败: ' + error.message);
    }
  }

  // 更新日程
  static async update(id, scheduleData) {
    try {
      const { title, description, schedule_time, priority, max_reminders, is_completed } = scheduleData;
      
      const updateFields = [];
      const params = [];

      if (title !== undefined) {
        updateFields.push('title = ?');
        params.push(title);
      }

      if (description !== undefined) {
        updateFields.push('description = ?');
        params.push(description);
      }

      if (schedule_time !== undefined) {
        if (new Date(schedule_time) <= new Date()) {
          throw new Error('计划时间不能是过去时间');
        }
        updateFields.push('schedule_time = ?');
        params.push(schedule_time);
      }

      if (priority !== undefined) {
        const validPriorities = ['urgent', 'important', 'normal'];
        if (!validPriorities.includes(priority)) {
          throw new Error('无效的优先级');
        }
        updateFields.push('priority = ?');
        params.push(priority);
      }

      if (max_reminders !== undefined) {
        updateFields.push('max_reminders = ?');
        params.push(max_reminders);
      }

      if (is_completed !== undefined) {
        updateFields.push('is_completed = ?');
        params.push(is_completed);
      }

      if (updateFields.length === 0) {
        throw new Error('没有要更新的字段');
      }

      params.push(id);
      
      await query(
        `UPDATE schedules SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        params
      );

      // 如果更新了时间或优先级，重新计算提醒时间
      if (schedule_time !== undefined || priority !== undefined) {
        await this.updateReminders(id);
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error('更新日程失败: ' + error.message);
    }
  }

  // 更新提醒时间
  static async updateReminders(scheduleId) {
    try {
      const schedule = await this.findById(scheduleId);
      if (!schedule) {
        throw new Error('日程不存在');
      }

      await transaction(async (connection) => {
        // 删除未发送的提醒
        await connection.execute(
          'DELETE FROM reminders WHERE schedule_id = ? AND is_sent = FALSE',
          [scheduleId]
        );

        // 重新计算提醒时间
        const reminderTimes = this.calculateReminderTimes(
          schedule.schedule_time, 
          schedule.priority, 
          schedule.max_reminders
        );

        // 插入新的提醒记录
        for (const reminderTime of reminderTimes) {
          await connection.execute(
            'INSERT INTO reminders (schedule_id, reminder_time) VALUES (?, ?)',
            [scheduleId, reminderTime]
          );
        }
      });
    } catch (error) {
      throw new Error('更新提醒失败: ' + error.message);
    }
  }

  // 删除日程
  static async delete(id) {
    try {
      const result = await query('DELETE FROM schedules WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('删除日程失败: ' + error.message);
    }
  }

  // 获取需要发送提醒的日程
  static async getPendingReminders() {
    try {
      const sql = `
        SELECT 
          s.*,
          u.email,
          r.id as reminder_id,
          r.reminder_time
        FROM schedules s
        JOIN users u ON s.user_id = u.id
        JOIN reminders r ON s.id = r.schedule_id
        WHERE 
          r.is_sent = FALSE 
          AND r.reminder_time <= NOW()
          AND s.is_completed = FALSE
          AND s.schedule_time > NOW()
          AND u.is_verified = TRUE
        ORDER BY r.reminder_time ASC
      `;
      
      return await query(sql);
    } catch (error) {
      throw new Error('获取待发送提醒失败: ' + error.message);
    }
  }

  // 标记提醒已发送
  static async markReminderSent(reminderId, scheduleId) {
    try {
      await transaction(async (connection) => {
        // 标记提醒已发送
        await connection.execute(
          'UPDATE reminders SET is_sent = TRUE, sent_at = NOW() WHERE id = ?',
          [reminderId]
        );

        // 增加已发送提醒次数
        await connection.execute(
          'UPDATE schedules SET sent_reminders = sent_reminders + 1 WHERE id = ?',
          [scheduleId]
        );
      });
    } catch (error) {
      throw new Error('标记提醒已发送失败: ' + error.message);
    }
  }

  // 获取统计信息
  static async getStats(userId) {
    try {
      const stats = await query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN is_completed = TRUE THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN is_completed = FALSE AND schedule_time > NOW() THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN is_completed = FALSE AND schedule_time <= NOW() THEN 1 ELSE 0 END) as overdue,
          SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
          SUM(CASE WHEN priority = 'important' THEN 1 ELSE 0 END) as important,
          SUM(CASE WHEN priority = 'normal' THEN 1 ELSE 0 END) as normal
        FROM schedules 
        WHERE user_id = ?
      `, [userId]);
      
      return stats[0] || {
        total: 0, completed: 0, pending: 0, overdue: 0,
        urgent: 0, important: 0, normal: 0
      };
    } catch (error) {
      throw new Error('获取统计信息失败: ' + error.message);
    }
  }
}

module.exports = Schedule;