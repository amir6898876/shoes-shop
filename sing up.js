// تایمر برای پس‌زمینه متحرک
let bgAnimation;
let bgPosition = 0;

// پارامترهای انیمیشن
const animationParams = {
    speed: 0.5,
    color1: '#667eea',
    color2: '#764ba2',
    color3: '#f093fb',
    color4: '#f5576c'
};

// تنظیم پس‌زمینه متحرک
function setupAnimatedBackground() {
    document.body.style.background = `linear-gradient(135deg, ${animationParams.color1} 0%, ${animationParams.color2} 25%, ${animationParams.color3} 50%, ${animationParams.color4} 75%, ${animationParams.color3} 100%)`;
    document.body.style.backgroundSize = '400% 400%';
    
    bgAnimation = setInterval(() => {
        bgPosition += animationParams.speed;
        if (bgPosition >= 100) bgPosition = 0;
        document.body.style.backgroundPosition = `${bgPosition}% 50%`;
    }, 50);
}

// اعتبارسنجی فرم
function validateForm() {
    const username = document.querySelector('input[type="text"]');
    const password = document.querySelector('input[type="password"]');
    const submitBtn = document.querySelector('.submit');
    
    if (!username || !password || !submitBtn) return;
    
    username.addEventListener('input', updateButtonState);
    password.addEventListener('input', updateButtonState);
    
    function updateButtonState() {
        const isValid = username.value.length >= 3 && password.value.length >= 6;
        
        if (isValid) {
            submitBtn.style.opacity = '1';
            submitBtn.style.transform = 'scale(1.05)';
            submitBtn.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.6)';
            submitBtn.style.cursor = 'pointer';
            submitBtn.disabled = false;
        } else {
            submitBtn.style.opacity = '0.7';
            submitBtn.style.transform = 'scale(1)';
            submitBtn.style.boxShadow = 'none';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.disabled = true;
        }
    }
    
    updateButtonState();
}

// افکت‌های ورودی
function setupInputEffects() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 15px rgba(102, 126, 234, 0.5)';
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
            
            const label = this.previousElementSibling;
            if (label && label.classList.contains('labelinput')) {
                label.style.color = '#667eea';
                label.style.transform = 'translateY(-10px) scale(0.9)';
            }
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
            this.style.transform = 'translateY(0)';
            
            const label = this.previousElementSibling;
            if (label && label.classList.contains('labelinput')) {
                if (!this.value) {
                    label.style.color = '#777';
                    label.style.transform = 'translateY(0) scale(1)';
                }
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                this.style.background = 'white';
            }
        });
    });
}

// افکت دکمه‌ها
function setupButtonEffects() {
    const submitBtn = document.querySelector('.submit');
    const createAccountLink = document.querySelector('span a');
    
    if (submitBtn) {
        submitBtn.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(1.1) rotate(1deg)';
                this.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.8)';
            }
        });
        
        submitBtn.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.6)';
            }
        });
    }
    
    if (createAccountLink) {
        createAccountLink.addEventListener('mouseenter', function() {
            this.style.color = '#ff416c';
            this.style.transform = 'translateX(-5px)';
        });
        
        createAccountLink.addEventListener('mouseleave', function() {
            this.style.color = '#667eea';
            this.style.transform = 'translateX(0)';
        });
    }
}

// لرزاندن فرم هنگام خطا
function shakeForm() {
    const form = document.querySelector('form');
    if (form) {
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// نمایش خطا
function showError(message) {
    let errorDiv = document.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff416c, #ff4b2b);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(255, 65, 108, 0.4);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-family: system-ui, -apple-system, sans-serif;
            font-weight: 500;
            direction: rtl;
        `;
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 300);
    }, 3000);
}

// نمایش لودینگ
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        direction: ltr;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 60px;
        height: 60px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #667eea;
        animation: spin 1s linear infinite;
    `;
    
    loadingDiv.appendChild(spinner);
    document.body.appendChild(loadingDiv);
    return loadingDiv;
}

// اضافه کردن استایل‌های داینامیک
function addDynamicStyles() {
    if (document.querySelector('#loginStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'loginStyles';
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'IRANSans', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            padding: 20px;
            direction: rtl;
        }
        
        .blur {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 450px;
            width: 100%;
            animation: fadeInUp 0.6s ease;
        }
        
        form {
            width: 100%;
        }
        
        .labelinput {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        input[type="text"], 
        input[type="password"] {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
            margin-bottom: 20px;
            background: white;
            direction: rtl;
            font-family: inherit;
        }
        
        input[type="text"]:focus, 
        input[type="password"]:focus {
            border-color: #667eea;
            outline: none;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .labelcheck {
            display: inline-block;
            margin-right: 10px;
            color: #555;
            cursor: pointer;
        }
        
        input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            vertical-align: middle;
            margin: 0 5px 0 0;
        }
        
        .submit {
            width: 100%;
            padding: 14px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 20px 0;
            opacity: 0.7;
        }
        
        .submit:not(:disabled) {
            opacity: 1;
            cursor: pointer;
        }
        
        .not-robot {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin: 10px 0;
        }
        
        .robot-col {
            text-align: center;
            margin: 15px 0;
        }
        
        .robot {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .robot:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        h4 {
            text-align: center;
            color: #666;
            margin-top: 20px;
            font-size: 14px;
        }
        
        span a {
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
            margin-right: 5px;
            transition: all 0.3s ease;
        }
        
        span a:hover {
            color: #ff416c;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
}

// بررسی وضعیت ورود
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (currentUser && isLoggedIn === 'true') {
        const currentPage = window.location.pathname;
        if (currentPage.includes('sing up.html') || currentPage.includes('login.html')) {
            window.location.href = 'profile.html';
        }
    }
}

// تنظیم فرم ورود
function setupSubmitButton() {
    const submitBtn = document.querySelector('.submit');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const username = document.querySelector('input[type="text"]').value;
            const password = document.querySelector('input[type="password"]').value;
            const rememberMe = document.querySelector('input[type="checkbox"]').checked;
            
            // اعتبارسنجی اولیه
            if (username.length < 3) {
                shakeForm();
                showError('❌ نام کاربری باید حداقل ۳ کاراکتر باشد');
                return;
            }
            
            if (password.length < 6) {
                shakeForm();
                showError('❌ رمز عبور باید حداقل ۶ کاراکتر باشد');
                return;
            }
            
            // بررسی در localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // ورود موفق
                const loadingDiv = showLoading();
                
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', user.username);
                
                // اگه گزینه "مرا بخاطر بسپار" فعال بود، یه مدت طولانی‌تر تو localStorage می‌مونه
                if (rememberMe) {
                    // اینجا می‌تونی یه تاریخ انقضا هم بذاری
                }
                
                setTimeout(() => {
                    loadingDiv.remove();
                    window.location.href = 'profile.html';
                }, 1500);
            } else {
                // بررسی وجود کاربر
                const userExists = users.some(u => u.username === username);
                if (userExists) {
                    shakeForm();
                    showError('❌ رمز عبور اشتباه است');
                } else {
                    shakeForm();
                    showError('❌ کاربری با این نام کاربری یافت نشد');
                }
            }
        });
    }
}

// =============== اجرای توابع ===============

// اجرای همه توابع
function init() {
    addDynamicStyles();
    setupAnimatedBackground();
    validateForm();
    setupInputEffects();
    setupButtonEffects();
    checkLoginStatus();
    setupSubmitButton();
}

// شروع اسکریپت
document.addEventListener('DOMContentLoaded', init);

// تمیز کردن انیمیشن‌ها هنگام خروج
window.addEventListener('beforeunload', function() {
    if (bgAnimation) {
        clearInterval(bgAnimation);
    }
});

// رصد تغییرات در localStorage برای همگام‌سازی بین تب‌ها
window.addEventListener('storage', function(e) {
    if (e.key === 'isLoggedIn' || e.key === 'currentUser') {
        checkLoginStatus();
    }
});