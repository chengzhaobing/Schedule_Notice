const express = require('express');
const User = require('../models/User');
const router = express.Router();

// 发送验证码
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }

    const result = await User.createOrUpdate(email);
    
    res.json({
      success: true,
      message: '验证码已发送到您的邮箱，请查收',
      data: {
        userId: result.id,
        email: result.email,
        isNew: result.isNew
      }
    });
  } catch (error) {
    console.error('发送验证码失败:', error.message);
    res.status(500).json({
      success: false,
      message: '发送验证码失败: ' + error.message
    });
  }
});

// 验证验证码
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: '邮箱和验证码不能为空'
      });
    }

    const result = await User.verifyCode(email, code);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result.user
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('验证失败:', error.message);
    res.status(500).json({
      success: false,
      message: '验证失败: ' + error.message
    });
  }
});

// 重新发送验证码
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      });
    }

    const result = await User.resendVerificationCode(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('重新发送验证码失败:', error.message);
    res.status(500).json({
      success: false,
      message: '重新发送验证码失败: ' + error.message
    });
  }
});

// 检查用户验证状态
router.get('/verify-status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址不能为空'
      });
    }

    const isVerified = await User.isVerified(email);
    const user = await User.findByEmail(email);
    
    res.json({
      success: true,
      data: {
        email: email,
        isVerified: isVerified,
        exists: !!user
      }
    });
  } catch (error) {
    console.error('检查验证状态失败:', error.message);
    res.status(500).json({
      success: false,
      message: '检查验证状态失败: ' + error.message
    });
  }
});

// 获取用户信息
router.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败: ' + error.message
    });
  }
});

// 获取所有已验证用户（管理功能）
router.get('/all', async (req, res) => {
  try {
    const users = await User.getAllVerified();
    
    res.json({
      success: true,
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        is_verified: user.is_verified
      }))
    });
  } catch (error) {
    console.error('获取用户列表失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败: ' + error.message
    });
  }
});

// 设置密码
router.post('/set-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度不能少于6位'
      });
    }

    const result = await User.setPassword(email, password);
    res.json(result);
  } catch (error) {
    console.error('设置密码失败:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 密码登录
router.post('/login-password', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      });
    }

    const result = await User.loginWithPassword(email, password, rememberMe);
    
    if (result.success && result.rememberToken) {
      // 设置记住密码的cookie
      res.cookie('remember_token', result.rememberToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }

    res.json(result);
  } catch (error) {
    console.error('密码登录失败:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 记住密码令牌登录
router.post('/login-remember', async (req, res) => {
  try {
    const { token } = req.body;
    const cookieToken = req.cookies.remember_token;
    
    const loginToken = token || cookieToken;
    
    if (!loginToken) {
      return res.status(400).json({
        success: false,
        message: '登录令牌不存在'
      });
    }

    const result = await User.loginWithRememberToken(loginToken);
    res.json(result);
  } catch (error) {
    console.error('自动登录失败:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 退出登录（清除记住密码令牌）
router.post('/logout', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (email) {
      await User.clearRememberToken(email);
    }
    
    // 清除cookie
    res.clearCookie('remember_token');
    
    res.json({
      success: true,
      message: '退出登录成功'
    });
  } catch (error) {
    console.error('退出登录失败:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;