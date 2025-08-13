const express = require('express');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const router = express.Router();

// 中间件：验证用户是否已验证
async function requireVerifiedUser(req, res, next) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      });
    }

    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在，请先注册'
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: '请先验证邮箱后再使用此功能'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('用户验证失败:', error.message);
    res.status(500).json({
      success: false,
      message: '用户验证失败: ' + error.message
    });
  }
}

// 创建新日程
router.post('/', requireVerifiedUser, async (req, res) => {
  try {
    const { title, description, schedule_time, priority, max_reminders } = req.body;

    // 验证必填字段
    if (!title || !schedule_time) {
      return res.status(400).json({
        success: false,
        message: '标题和计划时间为必填项'
      });
    }

    // 验证时间格式
    const scheduleDate = new Date(schedule_time);
    if (isNaN(scheduleDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: '时间格式不正确'
      });
    }

    // 验证优先级
    const validPriorities = ['urgent', 'important', 'normal'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: '优先级必须是 urgent、important 或 normal'
      });
    }

    const schedule = await Schedule.create(req.user.id, {
      title,
      description,
      schedule_time,
      priority: priority || 'normal',
      max_reminders: max_reminders || 3
    });

    res.status(201).json({
      success: true,
      message: '日程创建成功',
      data: schedule
    });
  } catch (error) {
    console.error('创建日程失败:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 获取用户的日程列表
router.get('/', async (req, res) => {
  try {
    const { email, priority, completed, search, startDate, endDate, page = 1, limit = 20 } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const options = {
      priority,
      completed: completed !== undefined ? completed === 'true' : undefined,
      search,
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const schedules = await Schedule.findByUserId(user.id, options);
    
    res.json({
      success: true,
      data: schedules,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: schedules.length
      }
    });
  } catch (error) {
    console.error('获取日程列表失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取日程列表失败: ' + error.message
    });
  }
});

// 获取单个日程详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      });
    }

    const schedule = await Schedule.findById(id);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: '日程不存在'
      });
    }

    // 验证日程所有者
    if (schedule.email !== email) {
      return res.status(403).json({
        success: false,
        message: '无权访问此日程'
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('获取日程详情失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取日程详情失败: ' + error.message
    });
  }
});

// 更新日程
router.put('/:id', requireVerifiedUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, schedule_time, priority, max_reminders, is_completed } = req.body;

    // 验证日程是否存在且属于当前用户
    const existingSchedule = await Schedule.findById(id);
    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: '日程不存在'
      });
    }

    if (existingSchedule.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: '无权修改此日程'
      });
    }

    // 验证时间格式（如果提供）
    if (schedule_time) {
      const scheduleDate = new Date(schedule_time);
      if (isNaN(scheduleDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: '时间格式不正确'
        });
      }
    }

    // 验证优先级（如果提供）
    if (priority) {
      const validPriorities = ['urgent', 'important', 'normal'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: '优先级必须是 urgent、important 或 normal'
        });
      }
    }

    const updatedSchedule = await Schedule.update(id, {
      title,
      description,
      schedule_time,
      priority,
      max_reminders,
      is_completed
    });

    res.json({
      success: true,
      message: '日程更新成功',
      data: updatedSchedule
    });
  } catch (error) {
    console.error('更新日程失败:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 删除日程
router.delete('/:id', requireVerifiedUser, async (req, res) => {
  try {
    const { id } = req.params;

    // 验证日程是否存在且属于当前用户
    const existingSchedule = await Schedule.findById(id);
    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: '日程不存在'
      });
    }

    if (existingSchedule.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: '无权删除此日程'
      });
    }

    const deleted = await Schedule.delete(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: '日程删除成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '删除失败'
      });
    }
  } catch (error) {
    console.error('删除日程失败:', error.message);
    res.status(500).json({
      success: false,
      message: '删除日程失败: ' + error.message
    });
  }
});

// 获取用户统计信息
router.get('/stats/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const stats = await Schedule.getStats(user.id);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取统计信息失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取统计信息失败: ' + error.message
    });
  }
});

// 标记日程完成
router.patch('/:id/complete', requireVerifiedUser, async (req, res) => {
  try {
    const { id } = req.params;

    // 验证日程是否存在且属于当前用户
    const existingSchedule = await Schedule.findById(id);
    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: '日程不存在'
      });
    }

    if (existingSchedule.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: '无权修改此日程'
      });
    }

    const updatedSchedule = await Schedule.update(id, { is_completed: true });

    res.json({
      success: true,
      message: '日程已标记为完成',
      data: updatedSchedule
    });
  } catch (error) {
    console.error('标记完成失败:', error.message);
    res.status(500).json({
      success: false,
      message: '标记完成失败: ' + error.message
    });
  }
});

module.exports = router;