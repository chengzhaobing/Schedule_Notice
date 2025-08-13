-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS schedule_notice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE schedule_notice;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    verification_code VARCHAR(6),
    code_expires_at DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    remember_token VARCHAR(255),
    token_expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_verification_code (verification_code),
    INDEX idx_remember_token (remember_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 添加密码字段到现有用户表（如果表已存在）
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) AFTER email,
ADD COLUMN IF NOT EXISTS remember_token VARCHAR(255) AFTER is_verified,
ADD COLUMN IF NOT EXISTS token_expires_at DATETIME AFTER remember_token,
ADD INDEX IF NOT EXISTS idx_remember_token (remember_token);

-- 创建日程表
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    schedule_time DATETIME NOT NULL,
    priority ENUM('urgent', 'important', 'normal') DEFAULT 'normal',
    is_completed BOOLEAN DEFAULT FALSE,
    max_reminders INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_schedule_time (schedule_time),
    INDEX idx_user_id (user_id),
    INDEX idx_priority (priority),
    INDEX idx_is_completed (is_completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建提醒记录表
CREATE TABLE IF NOT EXISTS reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reminder_count INT DEFAULT 1,
    status ENUM('sent', 'failed') DEFAULT 'sent',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_sent_at (sent_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例数据（可选）
-- INSERT INTO users (email, is_verified) VALUES ('demo@example.com', TRUE);
-- INSERT INTO schedules (user_id, title, description, schedule_time, priority) 
-- VALUES (1, '示例日程', '这是一个示例日程', DATE_ADD(NOW(), INTERVAL 1 HOUR), 'normal');

COMMIT;