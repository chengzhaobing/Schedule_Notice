// 全局变量
let currentUser = null;
let schedules = [];
let editingScheduleId = null;
let countdownInterval = null;

// API基础URL
const API_BASE = '/api';

// DOM元素
const elements = {
    loading: document.getElementById('loading'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    loginModal: document.getElementById('loginModal'),
    scheduleModal: document.getElementById('scheduleModal'),
    confirmModal: document.getElementById('confirmModal'),
    helpModal: document.getElementById('helpModal'),
    mainContent: document.getElementById('mainContent'),
    userInfo: document.getElementById('userInfo'),
    userEmail: document.getElementById('userEmail'),
    
    // 欢迎界面
    startBtn: document.getElementById('startBtn'),
    guestBtn: document.getElementById('guestBtn'),
    helpBtn: document.getElementById('helpBtn'),
    
    // 登录界面
    closeLoginBtn: document.getElementById('closeLoginBtn'),
    passwordTabBtn: document.getElementById('passwordTabBtn'),
    emailTabBtn: document.getElementById('emailTabBtn'),
    passwordLogin: document.getElementById('passwordLogin'),
    emailLogin: document.getElementById('emailLogin'),
    
    // 密码登录相关
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    togglePassword: document.getElementById('togglePassword'),
    rememberMe: document.getElementById('rememberMe'),
    passwordLoginBtn: document.getElementById('passwordLoginBtn'),
    switchToEmailBtn: document.getElementById('switchToEmailBtn'),
    
    // 邮箱验证相关
    emailInput: document.getElementById('emailInput'),
    sendCodeBtn: document.getElementById('sendCodeBtn'),
    emailStep: document.getElementById('emailStep'),
    codeStep: document.getElementById('codeStep'),
    passwordStep: document.getElementById('passwordStep'),
    emailDisplay: document.getElementById('emailDisplay'),
    codeInput: document.getElementById('codeInput'),
    verifyCodeBtn: document.getElementById('verifyCodeBtn'),
    resendCodeBtn: document.getElementById('resendCodeBtn'),
    backToEmailBtn: document.getElementById('backToEmailBtn'),
    countdown: document.getElementById('countdown'),
    stepDots: document.querySelectorAll('.step-dot'),
    stepLines: document.querySelectorAll('.step-line'),
    
    // 设置密码相关
    newPassword: document.getElementById('newPassword'),
    confirmPassword: document.getElementById('confirmPassword'),
    toggleNewPassword: document.getElementById('toggleNewPassword'),
    toggleConfirmPassword: document.getElementById('toggleConfirmPassword'),
    setPasswordBtn: document.getElementById('setPasswordBtn'),
    skipPasswordBtn: document.getElementById('skipPasswordBtn'),
    
    // 统计相关
    urgentCount: document.getElementById('urgentCount'),
    importantCount: document.getElementById('importantCount'),
    normalCount: document.getElementById('normalCount'),
    completedCount: document.getElementById('completedCount'),
    
    // 日程相关
    addScheduleBtn: document.getElementById('addScheduleBtn'),
    scheduleList: document.getElementById('scheduleList'),
    emptyState: document.getElementById('emptyState'),
    searchInput: document.getElementById('searchInput'),
    priorityFilter: document.getElementById('priorityFilter'),
    statusFilter: document.getElementById('statusFilter'),
    
    // 日程表单
    scheduleForm: document.getElementById('scheduleForm'),
    scheduleModalTitle: document.getElementById('scheduleModalTitle'),
    scheduleTitle: document.getElementById('scheduleTitle'),
    scheduleDescription: document.getElementById('scheduleDescription'),
    scheduleDateTime: document.getElementById('scheduleDateTime'),
    schedulePriority: document.getElementById('schedulePriority'),
    maxReminders: document.getElementById('maxReminders'),
    
    // 按钮
    logoutBtn: document.getElementById('logoutBtn'),
    closeScheduleModal: document.getElementById('closeScheduleModal'),
    cancelScheduleBtn: document.getElementById('cancelScheduleBtn'),
    saveScheduleBtn: document.getElementById('saveScheduleBtn'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    
    notifications: document.getElementById('notifications')
};

// 量子背景动画类
class QuantumBackground {
    static particles = [];
    static connections = [];
    static container = null;
    
    static init() {
        this.container = document.querySelector('.quantum-background');
        if (!this.container) return;
        
        // 创建不同类型的粒子
        this.createFloatingParticles();
        this.createPulsingOrbs();
        this.createTwinklingStars();
        
        // 创建动态连接线
        this.createDynamicConnections();
        
        // 启动动画循环
        this.startAnimationLoop();
        
        // 添加鼠标交互
        this.addMouseInteraction();
    }
    
    static createFloatingParticles() {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle floating';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            particle.style.left = x + '%';
            particle.style.top = y + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            
            // 随机大小
            const size = 2 + Math.random() * 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            this.container.appendChild(particle);
            this.particles.push({ element: particle, x, y, vx: 0, vy: 0, type: 'floating' });
        }
    }
    
    static createPulsingOrbs() {
        const orbCount = 8;
        
        for (let i = 0; i < orbCount; i++) {
            const orb = document.createElement('div');
            orb.className = 'quantum-orb';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            orb.style.left = x + '%';
            orb.style.top = y + '%';
            orb.style.animationDelay = Math.random() * 6 + 's';
            
            this.container.appendChild(orb);
            this.particles.push({ element: orb, x, y, vx: 0, vy: 0, type: 'orb' });
        }
    }
    
    static createTwinklingStars() {
        const starCount = 12;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'quantum-star';
            
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 5 + 's';
            
            this.container.appendChild(star);
        }
    }
    
    static createDynamicConnections() {
        const connectionCount = 6;
        
        for (let i = 0; i < connectionCount; i++) {
            const connection = document.createElement('div');
            connection.className = 'quantum-connection';
            
            connection.style.left = Math.random() * 100 + '%';
            connection.style.top = Math.random() * 100 + '%';
            connection.style.width = (50 + Math.random() * 200) + 'px';
            connection.style.transform = `rotate(${Math.random() * 360}deg)`;
            connection.style.animationDelay = Math.random() * 4 + 's';
            
            this.container.appendChild(connection);
            this.connections.push(connection);
        }
    }
    
    static startAnimationLoop() {
        const animate = () => {
            // 更新粒子位置
            this.particles.forEach(particle => {
                if (particle.type === 'floating') {
                    // 添加微妙的漂浮运动
                    particle.vx += (Math.random() - 0.5) * 0.02;
                    particle.vy += (Math.random() - 0.5) * 0.02;
                    
                    // 限制速度
                    particle.vx = Math.max(-0.1, Math.min(0.1, particle.vx));
                    particle.vy = Math.max(-0.1, Math.min(0.1, particle.vy));
                    
                    // 更新位置
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // 边界检查
                    if (particle.x < 0 || particle.x > 100) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > 100) particle.vy *= -1;
                    
                    particle.element.style.left = particle.x + '%';
                    particle.element.style.top = particle.y + '%';
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    static addMouseInteraction() {
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 100;
            mouseY = (e.clientY / window.innerHeight) * 100;
            
            // 粒子跟随鼠标
            this.particles.forEach(particle => {
                if (particle.type === 'floating') {
                    const dx = mouseX - particle.x;
                    const dy = mouseY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 20) {
                        particle.vx += dx * 0.001;
                        particle.vy += dy * 0.001;
                    }
                }
            });
        });
    }
}

// 工具函数
class Utils {
    // 显示通知
    static showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div>${message}</div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        elements.notifications.appendChild(notification);
        
        // 关闭按钮事件
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // 自动关闭
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
    
    // 显示模态框
    static showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // 隐藏模态框
    static hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // 格式化时间
    static formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // 计算时间差
    static getTimeLeft(targetTime) {
        const now = new Date();
        const target = new Date(targetTime);
        const diff = target - now;
        
        if (diff <= 0) {
            return '已过期';
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        let result = '';
        if (days > 0) result += `${days}天`;
        if (hours > 0) result += `${hours}小时`;
        if (minutes > 0) result += `${minutes}分钟`;
        
        return result || '不到1分钟';
    }
    
    // 获取优先级显示名称
    static getPriorityName(priority) {
        const names = {
            urgent: '紧急',
            important: '重要',
            normal: '一般'
        };
        return names[priority] || '一般';
    }
    
    // 设置最小日期时间
    static setMinDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1); // 至少1分钟后
        const minDateTime = now.toISOString().slice(0, 16);
        elements.scheduleDateTime.min = minDateTime;
    }
}

// API调用类
class API {
    static async request(url, options = {}) {
        try {
            const response = await fetch(`${API_BASE}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || '请求失败');
            }
            
            return data;
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
        }
    }
    
    // 用户相关API
    static async sendVerificationCode(email) {
        return this.request('/users/send-verification', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }
    
    static async verifyCode(email, code) {
        return this.request('/users/verify-code', {
            method: 'POST',
            body: JSON.stringify({ email, code })
        });
    }
    
    static async resendVerificationCode(email) {
        return this.request('/users/resend-verification', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }
    
    static async checkVerifyStatus(email) {
        return this.request(`/users/verify-status/${encodeURIComponent(email)}`);
    }
    
    // 密码相关API
    static async loginWithPassword(email, password, rememberMe = false) {
        return this.request('/users/login-password', {
            method: 'POST',
            body: JSON.stringify({ email, password, rememberMe })
        });
    }
    
    static async setPassword(email, password) {
        return this.request('/users/set-password', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }
    
    static async loginWithRememberToken() {
        return this.request('/users/login-remember', {
            method: 'POST'
        });
    }
    
    static async logout() {
        return this.request('/users/logout', {
            method: 'POST'
        });
    }
    
    // 日程相关API
    static async createSchedule(scheduleData) {
        return this.request('/schedules', {
            method: 'POST',
            body: JSON.stringify({ ...scheduleData, email: currentUser.email })
        });
    }
    
    static async getSchedules(filters = {}) {
        const params = new URLSearchParams({ email: currentUser.email, ...filters });
        return this.request(`/schedules?${params}`);
    }
    
    static async updateSchedule(id, scheduleData) {
        return this.request(`/schedules/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...scheduleData, email: currentUser.email })
        });
    }
    
    static async deleteSchedule(id) {
        return this.request(`/schedules/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ email: currentUser.email })
        });
    }
    
    static async completeSchedule(id) {
        return this.request(`/schedules/${id}/complete`, {
            method: 'PATCH',
            body: JSON.stringify({ email: currentUser.email })
        });
    }
    
    static async getStats() {
        return this.request(`/schedules/stats/${encodeURIComponent(currentUser.email)}`);
    }
}

// 登录管理类
class LoginManager {
    static init() {
        // 开始使用按钮
        elements.startBtn.addEventListener('click', this.showLoginModal.bind(this));
        
        // 游客浏览按钮
        elements.guestBtn.addEventListener('click', this.showGuestMainContent.bind(this));
        
        // 关闭登录模态框
        elements.closeLoginBtn.addEventListener('click', this.closeLoginModal.bind(this));
        
        // 登录方式切换
        elements.passwordTabBtn.addEventListener('click', () => this.switchLoginTab('password'));
        elements.emailTabBtn.addEventListener('click', () => this.switchLoginTab('email'));
        
        // 密码登录相关
        elements.passwordLoginBtn.addEventListener('click', this.passwordLogin.bind(this));
        elements.switchToEmailBtn.addEventListener('click', () => this.switchLoginTab('email'));
        elements.togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
        
        // 邮箱验证相关
        elements.sendCodeBtn.addEventListener('click', this.sendCode.bind(this));
        elements.verifyCodeBtn.addEventListener('click', this.verifyCode.bind(this));
        elements.resendCodeBtn.addEventListener('click', this.resendCode.bind(this));
        elements.backToEmailBtn.addEventListener('click', this.backToEmailStep.bind(this));
        
        // 设置密码相关
        elements.setPasswordBtn.addEventListener('click', this.setPassword.bind(this));
        elements.skipPasswordBtn.addEventListener('click', this.skipPasswordSetting.bind(this));
        elements.toggleNewPassword.addEventListener('click', () => this.togglePasswordVisibility('new'));
        elements.toggleConfirmPassword.addEventListener('click', () => this.togglePasswordVisibility('confirm'));
        
        // 回车键处理
        elements.loginEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                elements.loginPassword.focus();
            }
        });
        
        elements.loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.passwordLogin();
            }
        });
        
        elements.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendCode();
            }
        });
        
        elements.codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyCode();
            }
        });
        
        elements.newPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                elements.confirmPassword.focus();
            }
        });
        
        elements.confirmPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setPassword();
            }
        });
        
        // 验证码输入格式化
        elements.codeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
        });
        
        // 检查记住密码登录
        this.checkRememberLogin();
    }
    
    static showLoginModal() {
        elements.welcomeScreen.style.display = 'none';
        Utils.showModal(elements.loginModal);
        this.switchLoginTab('password'); // 默认显示密码登录
        elements.loginEmail.focus();
    }
    
    static closeLoginModal() {
        Utils.hideModal(elements.loginModal);
        elements.welcomeScreen.style.display = 'flex';
        this.resetAllForms();
    }
    
    static switchLoginTab(tab) {
        // 获取标签页容器
        const loginTabs = document.querySelector('.login-tabs');
        
        // 切换标签页样式
        if (tab === 'password') {
            elements.passwordTabBtn.classList.add('active');
            elements.emailTabBtn.classList.remove('active');
            elements.passwordLogin.style.display = 'block';
            elements.emailLogin.style.display = 'none';
            loginTabs.setAttribute('data-active', 'password');
            elements.loginEmail.focus();
        } else {
            elements.passwordTabBtn.classList.remove('active');
            elements.emailTabBtn.classList.add('active');
            elements.passwordLogin.style.display = 'none';
            elements.emailLogin.style.display = 'block';
            loginTabs.setAttribute('data-active', 'email');
            this.resetEmailSteps();
            elements.emailInput.focus();
        }
    }
    
    static resetAllForms() {
        // 重置密码登录表单
        elements.loginEmail.value = '';
        elements.loginPassword.value = '';
        elements.rememberMe.checked = false;
        
        // 重置邮箱验证表单
        this.resetEmailSteps();
        
        // 重置密码设置表单
        elements.newPassword.value = '';
        elements.confirmPassword.value = '';
    }
    
    static resetEmailSteps() {
        // 重置到第一步
        elements.emailStep.style.display = 'block';
        elements.codeStep.style.display = 'none';
        elements.passwordStep.style.display = 'none';
        
        // 重置步骤指示器
        this.updateStepIndicator(1);
        
        // 清空输入
        elements.emailInput.value = '';
        elements.codeInput.value = '';
        
        // 重置按钮状态
        elements.sendCodeBtn.disabled = false;
        elements.verifyCodeBtn.disabled = false;
        elements.resendCodeBtn.disabled = true;
        
        // 清除倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        elements.countdown.textContent = '';
    }
    
    // 密码登录相关方法
    static async passwordLogin() {
        const email = elements.loginEmail.value.trim();
        const password = elements.loginPassword.value;
        const rememberMe = elements.rememberMe.checked;
        
        if (!email) {
            Utils.showNotification('请输入邮箱地址', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            Utils.showNotification('邮箱格式不正确', 'error');
            return;
        }
        
        if (!password) {
            Utils.showNotification('请输入密码', 'error');
            return;
        }
        
        try {
            elements.passwordLoginBtn.disabled = true;
            elements.passwordLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
            
            const result = await API.loginWithPassword(email, password, rememberMe);
            
            currentUser = result.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            Utils.hideModal(elements.loginModal);
            this.showMainContent();
            
            Utils.showNotification('登录成功！', 'success');
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        } finally {
            elements.passwordLoginBtn.disabled = false;
            elements.passwordLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 登录';
        }
    }
    
    static togglePasswordVisibility(type = 'login') {
        let passwordInput, toggleBtn;
        
        if (type === 'login') {
            passwordInput = elements.loginPassword;
            toggleBtn = elements.togglePassword;
        } else if (type === 'new') {
            passwordInput = elements.newPassword;
            toggleBtn = elements.toggleNewPassword;
        } else if (type === 'confirm') {
            passwordInput = elements.confirmPassword;
            toggleBtn = elements.toggleConfirmPassword;
        }
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            passwordInput.type = 'password';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }
    
    static async checkRememberLogin() {
        try {
            // 检查是否有记住密码的cookie
            const hasRememberToken = document.cookie.includes('remember_token=');
            if (!hasRememberToken) {
                return; // 没有记住密码token，跳过自动登录
            }
            
            const result = await API.loginWithRememberToken();
            if (result.success) {
                currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                this.showMainContent();
                Utils.showNotification('自动登录成功！', 'success');
            }
        } catch (error) {
            // 自动登录失败，不显示错误信息
            console.log('自动登录失败:', error.message);
        }
    }
    
    static updateStepIndicator(step) {
        elements.stepDots.forEach((dot, index) => {
            if (index < step) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        elements.stepLines.forEach((line, index) => {
            if (index < step - 1) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }
    
    static backToEmailStep() {
        elements.codeStep.style.display = 'none';
        elements.emailStep.style.display = 'block';
        this.updateStepIndicator(1);
        
        // 清除倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        elements.countdown.textContent = '';
        elements.resendCodeBtn.disabled = true;
        
        elements.emailInput.focus();
    }
    
    static async sendCode() {
        const email = elements.emailInput.value.trim();
        
        if (!email) {
            Utils.showNotification('请输入邮箱地址', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            Utils.showNotification('邮箱格式不正确', 'error');
            return;
        }
        
        try {
            elements.sendCodeBtn.disabled = true;
            elements.sendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
            
            await API.sendVerificationCode(email);
            
            elements.emailDisplay.textContent = email;
            elements.emailStep.style.display = 'none';
            elements.codeStep.style.display = 'block';
            this.updateStepIndicator(2);
            
            this.startCountdown();
            Utils.showNotification('验证码已发送，请查收邮件', 'success');
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        } finally {
            elements.sendCodeBtn.disabled = false;
            elements.sendCodeBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 发送验证码';
        }
    }
    
    static async verifyCode() {
        const email = elements.emailInput.value.trim();
        const code = elements.codeInput.value.trim();
        
        if (!code) {
            Utils.showNotification('请输入验证码', 'error');
            return;
        }
        
        if (code.length !== 6) {
            Utils.showNotification('验证码应为6位数字', 'error');
            return;
        }
        
        try {
            elements.verifyCodeBtn.disabled = true;
            elements.verifyCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 验证中...';
            
            const result = await API.verifyCode(email, code);
            
            // 验证成功后跳转到密码设置步骤
            elements.codeStep.style.display = 'none';
            elements.passwordStep.style.display = 'block';
            this.updateStepIndicator(3);
            
            // 临时保存用户信息
            this.tempUser = result.data;
            
            Utils.showNotification('验证成功！请设置密码', 'success');
            elements.newPassword.focus();
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        } finally {
            elements.verifyCodeBtn.disabled = false;
            elements.verifyCodeBtn.innerHTML = '<i class="fas fa-check"></i> 验证';
        }
    }
    
    static async resendCode() {
        const email = elements.emailInput.value.trim();
        
        try {
            elements.resendCodeBtn.disabled = true;
            elements.resendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
            
            await API.resendVerificationCode(email);
            
            this.startCountdown();
            Utils.showNotification('验证码已重新发送', 'success');
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        } finally {
            elements.resendCodeBtn.disabled = false;
            elements.resendCodeBtn.innerHTML = '<i class="fas fa-redo"></i> 重新发送';
        }
    }
    
    static startCountdown() {
        let seconds = 60;
        elements.resendCodeBtn.disabled = true;
        
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        countdownInterval = setInterval(() => {
            seconds--;
            elements.countdown.textContent = `${seconds}秒后可重新发送`;
            
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                elements.resendCodeBtn.disabled = false;
                elements.countdown.textContent = '';
            }
        }, 1000);
    }
    
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // 设置密码相关方法
    static async setPassword() {
        const newPassword = elements.newPassword.value;
        const confirmPassword = elements.confirmPassword.value;
        
        if (!newPassword) {
            Utils.showNotification('请输入新密码', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            Utils.showNotification('密码长度至少6位', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            Utils.showNotification('两次输入的密码不一致', 'error');
            return;
        }
        
        try {
            elements.setPasswordBtn.disabled = true;
            elements.setPasswordBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 设置中...';
            
            await API.setPassword(this.tempUser.email, newPassword);
            
            // 设置密码成功，完成登录
            currentUser = this.tempUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            Utils.hideModal(elements.loginModal);
            this.showMainContent();
            
            Utils.showNotification('密码设置成功！', 'success');
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        } finally {
            elements.setPasswordBtn.disabled = false;
            elements.setPasswordBtn.innerHTML = '<i class="fas fa-key"></i> 设置密码';
        }
    }
    
    static skipPasswordSetting() {
        // 跳过密码设置，直接完成登录
        currentUser = this.tempUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        Utils.hideModal(elements.loginModal);
        this.showMainContent();
        
        Utils.showNotification('登录成功！', 'success');
    }
    
    static showMainContent() {
        elements.userEmail.textContent = currentUser.email;
        elements.userInfo.style.display = 'flex';
        elements.mainContent.style.display = 'block';
        
        // 显示添加日程按钮和操作栏（已登录用户）
        if (elements.addScheduleBtn) {
            elements.addScheduleBtn.style.display = 'block';
        }
        const operationBar = document.querySelector('.operation-bar');
        if (operationBar) {
            operationBar.style.display = 'flex';
        }
        
        // 显示统计卡片
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => {
            card.style.display = 'block';
        });
        
        ScheduleManager.init();
    }
    
    static showGuestMainContent() {
        // 隐藏欢迎界面，显示游客模式的主页面
        elements.welcomeScreen.style.display = 'none';
        elements.userInfo.style.display = 'none';
        elements.mainContent.style.display = 'block';
        
        // 隐藏添加日程按钮和操作栏（游客模式不可用）
        if (elements.addScheduleBtn) {
            elements.addScheduleBtn.style.display = 'none';
        }
        const operationBar = document.querySelector('.operation-bar');
        if (operationBar) {
            operationBar.style.display = 'none';
        }
        
        // 初始化日程管理器（游客模式）
        ScheduleManager.initGuestMode();
        
        // 显示游客提示
        Utils.showNotification('您正在以游客模式浏览，登录后可添加和管理日程', 'info', 8000);
    }
    
    static async checkExistingUser() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                const status = await API.checkVerifyStatus(user.email);
                
                if (status.data.isVerified) {
                    currentUser = user;
                    this.showMainContent();
                    return true;
                }
            } catch (error) {
                console.error('检查用户状态失败:', error);
                localStorage.removeItem('currentUser');
            }
        }
        // 未登录用户不显示主页面，保持欢迎界面
        return false;
    }
}

// 日程管理类
class ScheduleManager {
    static init() {
        // 绑定事件
        elements.addScheduleBtn.addEventListener('click', this.showAddModal.bind(this));
        elements.scheduleForm.addEventListener('submit', this.saveSchedule.bind(this));
        elements.closeScheduleModal.addEventListener('click', this.hideScheduleModal.bind(this));
        elements.cancelScheduleBtn.addEventListener('click', this.hideScheduleModal.bind(this));
        
        // 搜索和筛选
        elements.searchInput.addEventListener('input', this.filterSchedules.bind(this));
        elements.priorityFilter.addEventListener('change', this.filterSchedules.bind(this));
        elements.statusFilter.addEventListener('change', this.filterSchedules.bind(this));
        
        // 删除确认
        elements.cancelDeleteBtn.addEventListener('click', () => {
            Utils.hideModal(elements.confirmModal);
        });
        
        // 帮助按钮事件
        elements.helpBtn.addEventListener('click', () => {
            Utils.showModal(elements.helpModal);
        });
        
        // 设置最小时间
        Utils.setMinDateTime();
        
        // 加载数据
        this.loadSchedules();
        this.loadStats();
    }
    
    static initGuestMode() {
        // 游客模式初始化 - 只绑定必要的事件，不包括添加/编辑功能
        
        // 帮助按钮事件
        if (elements.helpBtn) {
            elements.helpBtn.addEventListener('click', () => {
                Utils.showModal(elements.helpModal);
            });
        }
        
        // 显示游客模式的空状态
        this.renderGuestEmptyState();
    }
    
    static renderGuestEmptyState() {
        // 显示游客模式专用的空状态
        elements.scheduleList.innerHTML = '';
        elements.emptyState.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-lock"></i>
                <h3>欢迎使用日程通知系统</h3>
                <p>您正在以游客模式浏览</p>
                <p>登录后即可添加和管理您的日程安排</p>
                <button class="btn btn-primary" onclick="EmailVerification.showEmailModal()">
                    <i class="fas fa-sign-in-alt"></i>
                    立即登录
                </button>
            </div>
        `;
        elements.emptyState.style.display = 'block';
        
        // 隐藏统计卡片（游客模式无数据）
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => {
            card.style.display = 'none';
        });
    }
    
    static showAddModal() {
        // 检查用户是否已登录
        if (!currentUser) {
            Utils.showNotification('请先登录后再添加日程', 'warning');
            EmailVerification.showEmailModal();
            return;
        }
        
        editingScheduleId = null;
        elements.scheduleModalTitle.innerHTML = '<i class="fas fa-calendar-plus"></i> 添加日程';
        elements.scheduleForm.reset();
        elements.maxReminders.value = 3;
        Utils.setMinDateTime();
        Utils.showModal(elements.scheduleModal);
    }
    
    static showEditModal(schedule) {
        editingScheduleId = schedule.id;
        elements.scheduleModalTitle.innerHTML = '<i class="fas fa-edit"></i> 编辑日程';
        
        elements.scheduleTitle.value = schedule.title;
        elements.scheduleDescription.value = schedule.description || '';
        elements.scheduleDateTime.value = new Date(schedule.schedule_time).toISOString().slice(0, 16);
        elements.schedulePriority.value = schedule.priority;
        elements.maxReminders.value = schedule.max_reminders;
        
        Utils.showModal(elements.scheduleModal);
    }
    
    static hideScheduleModal() {
        Utils.hideModal(elements.scheduleModal);
        editingScheduleId = null;
    }
    
    static async saveSchedule(e) {
        e.preventDefault();
        
        const formData = {
            title: elements.scheduleTitle.value.trim(),
            description: elements.scheduleDescription.value.trim(),
            schedule_time: elements.scheduleDateTime.value,
            priority: elements.schedulePriority.value,
            max_reminders: parseInt(elements.maxReminders.value)
        };
        
        if (!formData.title) {
            Utils.showNotification('请输入日程标题', 'error');
            return;
        }
        
        if (!formData.schedule_time) {
            Utils.showNotification('请选择计划时间', 'error');
            return;
        }
        
        // 验证时间不能是过去时间
        if (new Date(formData.schedule_time) <= new Date()) {
            Utils.showNotification('计划时间不能是过去时间', 'error');
            return;
        }
        
        try {
            elements.saveScheduleBtn.disabled = true;
            elements.saveScheduleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
            
            if (editingScheduleId) {
                await API.updateSchedule(editingScheduleId, formData);
                Utils.showNotification('日程更新成功', 'success');
            } else {
                await API.createSchedule(formData);
                Utils.showNotification('日程创建成功', 'success');
            }
            
            this.hideScheduleModal();
            this.loadSchedules();
            this.loadStats();
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        } finally {
            elements.saveScheduleBtn.disabled = false;
            elements.saveScheduleBtn.innerHTML = '<i class="fas fa-save"></i> 保存';
        }
    }
    
    static async loadSchedules() {
        if (!currentUser) {
            // 未登录用户显示空状态
            schedules = [];
            this.renderSchedules();
            return;
        }
        
        try {
            const result = await API.getSchedules();
            schedules = result.data;
            this.renderSchedules();
        } catch (error) {
            Utils.showNotification('加载日程失败: ' + error.message, 'error');
        }
    }
    
    static async loadStats() {
        if (!currentUser) {
            // 未登录用户显示零统计
            elements.urgentCount.textContent = '0';
            elements.importantCount.textContent = '0';
            elements.normalCount.textContent = '0';
            elements.completedCount.textContent = '0';
            return;
        }
        
        try {
            const result = await API.getStats();
            const stats = result.data;
            
            elements.urgentCount.textContent = stats.urgent;
            elements.importantCount.textContent = stats.important;
            elements.normalCount.textContent = stats.normal;
            elements.completedCount.textContent = stats.completed;
        } catch (error) {
            console.error('加载统计失败:', error);
        }
    }
    
    static renderSchedules(filteredSchedules = null) {
        const schedulesToRender = filteredSchedules || schedules;
        
        if (schedulesToRender.length === 0) {
            let emptyStateContent;
            
            if (!currentUser) {
                // 未登录用户的空状态
                emptyStateContent = `
                    <div class="empty-state">
                        <i class="fas fa-user-lock"></i>
                        <h3>欢迎使用智能日程提醒系统</h3>
                        <p>您正在以游客模式浏览，登录后可以添加和管理您的日程</p>
                        <button class="btn btn-primary" onclick="EmailVerification.showEmailModal()">
                            <i class="fas fa-sign-in-alt"></i> 立即登录
                        </button>
                    </div>
                `;
            } else if (filteredSchedules) {
                // 已登录用户的搜索无结果状态
                emptyStateContent = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>没有找到匹配的日程</h3>
                        <p>请尝试调整搜索条件或筛选器</p>
                    </div>
                `;
            } else {
                // 已登录用户的空日程状态
                emptyStateContent = `
                    <div class="empty-state">
                        <i class="fas fa-calendar-plus"></i>
                        <h3>暂无日程</h3>
                        <p>点击上方按钮添加您的第一个日程</p>
                    </div>
                `;
            }
            
            elements.scheduleList.innerHTML = emptyStateContent;
            return;
        }
        
        const html = schedulesToRender.map(schedule => this.renderScheduleItem(schedule)).join('');
        elements.scheduleList.innerHTML = html;
        
        // 绑定事件
        this.bindScheduleEvents();
    }
    
    static renderScheduleItem(schedule) {
        const isCompleted = schedule.is_completed;
        const timeLeft = Utils.getTimeLeft(schedule.schedule_time);
        const priorityName = Utils.getPriorityName(schedule.priority);
        
        return `
            <div class="schedule-item ${isCompleted ? 'completed' : ''}" data-id="${schedule.id}">
                <div class="schedule-header">
                    <div>
                        <div class="schedule-title">
                            ${schedule.title}
                            <span class="priority-badge ${schedule.priority}">${priorityName}</span>
                        </div>
                        ${schedule.description ? `<div class="schedule-description">${schedule.description}</div>` : ''}
                    </div>
                    <div class="schedule-actions">
                        ${!isCompleted ? `<button class="action-btn complete" data-action="complete" title="标记完成">
                            <i class="fas fa-check"></i>
                        </button>` : ''}
                        <button class="action-btn edit" data-action="edit" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-action="delete" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="schedule-meta">
                    <div class="schedule-time">
                        <i class="fas fa-clock"></i>
                        ${Utils.formatDateTime(schedule.schedule_time)}
                        ${!isCompleted && timeLeft !== '已过期' ? `(${timeLeft}后)` : ''}
                    </div>
                    <div class="schedule-reminders">
                        <i class="fas fa-bell"></i>
                        已提醒 ${schedule.sent_reminders}/${schedule.max_reminders} 次
                    </div>
                </div>
            </div>
        `;
    }
    
    static bindScheduleEvents() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const scheduleId = btn.closest('.schedule-item').dataset.id;
                const schedule = schedules.find(s => s.id == scheduleId);
                
                switch (action) {
                    case 'complete':
                        this.completeSchedule(scheduleId);
                        break;
                    case 'edit':
                        this.showEditModal(schedule);
                        break;
                    case 'delete':
                        this.showDeleteConfirm(scheduleId);
                        break;
                }
            });
        });
    }
    
    static async completeSchedule(id) {
        try {
            await API.completeSchedule(id);
            Utils.showNotification('日程已标记为完成', 'success');
            this.loadSchedules();
            this.loadStats();
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        }
    }
    
    static showDeleteConfirm(id) {
        Utils.showModal(elements.confirmModal);
        
        elements.confirmDeleteBtn.onclick = () => {
            this.deleteSchedule(id);
            Utils.hideModal(elements.confirmModal);
        };
    }
    
    static async deleteSchedule(id) {
        try {
            await API.deleteSchedule(id);
            Utils.showNotification('日程删除成功', 'success');
            this.loadSchedules();
            this.loadStats();
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        }
    }
    
    static filterSchedules() {
        const search = elements.searchInput.value.toLowerCase().trim();
        const priority = elements.priorityFilter.value;
        const status = elements.statusFilter.value;
        
        let filtered = schedules;
        
        // 搜索过滤
        if (search) {
            filtered = filtered.filter(schedule => 
                schedule.title.toLowerCase().includes(search) ||
                (schedule.description && schedule.description.toLowerCase().includes(search))
            );
        }
        
        // 优先级过滤
        if (priority) {
            filtered = filtered.filter(schedule => schedule.priority === priority);
        }
        
        // 状态过滤
        if (status !== '') {
            const isCompleted = status === 'true';
            filtered = filtered.filter(schedule => schedule.is_completed === isCompleted);
        }
        
        this.renderSchedules(filtered);
    }
}

// 应用初始化
class App {
    static async init() {
        // 初始化量子背景动画
        QuantumBackground.init();
        
        // 隐藏加载动画并检查用户状态
        setTimeout(() => {
            elements.loading.style.display = 'none';
            
            // 显示欢迎界面
            elements.welcomeScreen.style.display = 'flex';
            elements.mainContent.style.display = 'none';
        }, 1000);
        
        // 初始化登录管理器
        LoginManager.init();
        
        // 使用说明按钮事件
        if (elements.helpBtn) {
            elements.helpBtn.addEventListener('click', () => {
                Utils.showModal(elements.helpModal);
            });
        }
        
        // 登出功能
        elements.logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            location.reload();
        });
        
        // 模态框点击外部关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                Utils.hideModal(e.target);
            }
        });
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    Utils.hideModal(modal);
                });
            }
        });
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});