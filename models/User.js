const { query } = require('../config/database');
const { sendVerificationEmail } = require('../config/email');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class User {
  // 生成6位数验证码
  static generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 生成记住密码令牌
  static generateRememberToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // 密码哈希
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // 验证密码
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // 根据邮箱查找用户
  static async findByEmail(email) {
    try {
      const users = await query('SELECT * FROM users WHERE email = ?', [email]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error('查找用户失败: ' + error.message);
    }
  }

  // 根据ID查找用户
  static async findById(id) {
    try {
      const users = await query('SELECT * FROM users WHERE id = ?', [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error('查找用户失败: ' + error.message);
    }
  }

  // 创建或更新用户
  static async createOrUpdate(email) {
    try {
      const existingUser = await this.findByEmail(email);
      const verificationCode = this.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟后过期

      if (existingUser) {
        // 更新现有用户的验证码
        await query(
          'UPDATE users SET verification_code = ?, verification_expires = ?, is_verified = FALSE WHERE email = ?',
          [verificationCode, expiresAt, email]
        );
        
        // 发送验证码邮件
        await sendVerificationEmail(email, verificationCode);
        
        return {
          id: existingUser.id,
          email: email,
          isNew: false
        };
      } else {
        // 创建新用户
        const result = await query(
          'INSERT INTO users (email, verification_code, verification_expires) VALUES (?, ?, ?)',
          [email, verificationCode, expiresAt]
        );
        
        // 发送验证码邮件
        await sendVerificationEmail(email, verificationCode);
        
        return {
          id: result.insertId,
          email: email,
          isNew: true
        };
      }
    } catch (error) {
      throw new Error('创建或更新用户失败: ' + error.message);
    }
  }

  // 验证验证码
  static async verifyCode(email, code) {
    try {
      const user = await this.findByEmail(email);
      
      if (!user) {
        return { success: false, message: '用户不存在' };
      }

      if (!user.verification_code) {
        return { success: false, message: '请先获取验证码' };
      }

      if (new Date() > new Date(user.verification_expires)) {
        return { success: false, message: '验证码已过期，请重新获取' };
      }

      if (user.verification_code !== code) {
        return { success: false, message: '验证码错误' };
      }

      // 验证成功，更新用户状态
      await query(
        'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires = NULL WHERE email = ?',
        [email]
      );

      return { 
        success: true, 
        message: '验证成功',
        user: {
          id: user.id,
          email: user.email,
          is_verified: true
        }
      };
    } catch (error) {
      throw new Error('验证失败: ' + error.message);
    }
  }

  // 检查用户是否已验证
  static async isVerified(email) {
    try {
      const user = await this.findByEmail(email);
      return user && user.is_verified;
    } catch (error) {
      throw new Error('检查验证状态失败: ' + error.message);
    }
  }

  // 重新发送验证码
  static async resendVerificationCode(email) {
    try {
      const user = await this.findByEmail(email);
      
      if (!user) {
        throw new Error('用户不存在');
      }

      if (user.is_verified) {
        return { success: false, message: '用户已验证，无需重复验证' };
      }

      const verificationCode = this.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await query(
        'UPDATE users SET verification_code = ?, verification_expires = ? WHERE email = ?',
        [verificationCode, expiresAt, email]
      );

      await sendVerificationEmail(email, verificationCode);

      return { success: true, message: '验证码已重新发送' };
    } catch (error) {
      throw new Error('重新发送验证码失败: ' + error.message);
    }
  }

  // 获取所有已验证的用户
  static async getAllVerified() {
    try {
      return await query('SELECT * FROM users WHERE is_verified = TRUE ORDER BY created_at DESC');
    } catch (error) {
      throw new Error('获取用户列表失败: ' + error.message);
    }
  }

  // 设置用户密码
  static async setPassword(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error('用户不存在');
      }

      if (!user.is_verified) {
        throw new Error('请先验证邮箱后再设置密码');
      }

      const passwordHash = await this.hashPassword(password);
      await query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [passwordHash, email]
      );

      return { success: true, message: '密码设置成功' };
    } catch (error) {
      throw new Error('设置密码失败: ' + error.message);
    }
  }

  // 密码登录
  static async loginWithPassword(email, password, rememberMe = false) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        return { success: false, message: '邮箱或密码错误' };
      }

      if (!user.password_hash) {
        return { success: false, message: '该账户尚未设置密码，请使用邮箱验证登录' };
      }

      const isPasswordValid = await this.verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        return { success: false, message: '邮箱或密码错误' };
      }

      let rememberToken = null;
      if (rememberMe) {
        rememberToken = this.generateRememberToken();
        const tokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天
        await query(
          'UPDATE users SET remember_token = ?, token_expires_at = ? WHERE email = ?',
          [rememberToken, tokenExpiresAt, email]
        );
      }

      return {
        success: true,
        message: '登录成功',
        user: {
          id: user.id,
          email: user.email,
          is_verified: user.is_verified
        },
        rememberToken
      };
    } catch (error) {
      throw new Error('登录失败: ' + error.message);
    }
  }

  // 通过记住密码令牌登录
  static async loginWithRememberToken(token) {
    try {
      const users = await query(
        'SELECT * FROM users WHERE remember_token = ? AND token_expires_at > NOW()',
        [token]
      );

      if (users.length === 0) {
        return { success: false, message: '登录令牌无效或已过期' };
      }

      const user = users[0];
      return {
        success: true,
        message: '自动登录成功',
        user: {
          id: user.id,
          email: user.email,
          is_verified: user.is_verified
        }
      };
    } catch (error) {
      throw new Error('自动登录失败: ' + error.message);
    }
  }

  // 清除记住密码令牌
  static async clearRememberToken(email) {
    try {
      await query(
        'UPDATE users SET remember_token = NULL, token_expires_at = NULL WHERE email = ?',
        [email]
      );
      return { success: true, message: '已清除记住密码令牌' };
    } catch (error) {
      throw new Error('清除令牌失败: ' + error.message);
    }
  }
}

module.exports = User;