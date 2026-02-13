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
    const remember = document.querySelector('input[type="checkbox"]');
    const submitBtn = document.querySelector('.submit');
    
    if (!username || !password) return;
    
    username.addEventListener('input', updateButtonState);
    password.addEventListener('input', updateButtonState);
    
    function updateButtonState() {
        const isValid = username.value.length >= 3 && password.value.length >= 6;
        
        if (isValid) {
            submitBtn.style.opacity = '1';
            submitBtn.style.transform = 'scale(1.05)';
            submitBtn.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.6)';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.opacity = '0.7';
            submitBtn.style.transform = 'scale(1)';
            submitBtn.style.boxShadow = 'none';
            submitBtn.style.cursor = 'not-allowed';
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
            if (this.style.opacity !== '0.7') {
                this.style.transform = 'scale(1.1) rotate(1deg)';
                this.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.8)';
            }
        });
        
        submitBtn.addEventListener('mouseleave', function() {
            if (this.style.opacity !== '0.7') {
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
    form.style.animation = 'shake 0.5s';
    
    setTimeout(() => {
        form.style.animation = '';
    }, 500);
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
        `;
        document.body.appendChild(errorDiv);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    errorDiv.textContent = message;
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            errorDiv.remove();
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
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    
    loadingDiv.appendChild(spinner);
    document.body.appendChild(loadingDiv);
    document.head.appendChild(style);
}

// اضافه کردن استایل‌های داینامیک
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .labelinput {
            transition: all 0.3s ease;
            display: inline-block;
            margin-bottom: 8px;
        }
        
        input[type="text"], 
        input[type="password"] {
            transition: all 0.3s ease;
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 12px 15px;
            margin-bottom: 20px;
            width: 100%;
            box-sizing: border-box;
            font-size: 16px;
            outline: none;
        }
        
        .submit {
            transition: all 0.3s ease;
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            border: none;
            cursor: pointer;
            text-align: center;
            margin-top: 20px;
            width: auto;
        }
        
        .labelcheck {
            transition: all 0.3s ease;
        }
        
        input[type="checkbox"] {
            margin-left: 10px;
            transform: scale(1.2);
            cursor: pointer;
        }
        
        span a {
            transition: all 0.3s ease;
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    
    document.head.appendChild(style);
}

// بررسی وضعیت ورود
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (isLoggedIn === 'true' && loggedInUser) {
        const currentPage = window.location.pathname;
        if (currentPage.includes('sing up.html')) {
            window.location.href = 'index.html';
        }
    }
}

// =============== کدهای جدید برای تایید ربات ===============

// بررسی وضعیت تایید ربات
function checkRobotStatus() {
  const robotVerified = localStorage.getItem('robotVerified');
  const verificationTime = localStorage.getItem('verificationTime');
  const robotBtn = document.querySelector('.robot');
  const robotStatus = document.querySelector('.robot-status');
  const currentTime = Date.now();
  
  // اعتبار سنجی زمان (5 دقیقه اعتبار داره)
  const isValidTime = verificationTime && (currentTime - verificationTime < 5 * 60 * 1000);
  
  if (robotVerified === 'true' && isValidTime) {
    // سبز کردن دکمه بزن بریم
    if (robotBtn) {
      robotBtn.style.backgroundColor = '#4CAF50';
      robotBtn.style.cursor = 'default';
      robotBtn.disabled = true;
      robotBtn.textContent = '✓ تایید شد';
      robotBtn.style.opacity = '0.8';
    }
    
    // نمایش وضعیت
    if (robotStatus) {
      robotStatus.style.display = 'block';
    }
    
    // ذخیره وضعیت در localStorage
    localStorage.setItem('canAccessMain', 'true');
  } else {
    // برگردوندن دکمه بزن بریم به حالت عادی
    if (robotBtn) {
      robotBtn.style.backgroundColor = '';
      robotBtn.style.cursor = 'pointer';
      robotBtn.disabled = false;
      robotBtn.textContent = 'بزن بریم';
      robotBtn.style.opacity = '1';
    }
    
    // مخفی کردن وضعیت
    if (robotStatus) {
      robotStatus.style.display = 'none';
    }
    
    // پاک کردن وضعیت منقضی شده
    if (!isValidTime && robotVerified === 'true') {
      localStorage.removeItem('robotVerified');
      localStorage.removeItem('verificationTime');
      localStorage.removeItem('canAccessMain');
    }
  }
}

// اضافه کردن المنت وضعیت ربات به صفحه
function addRobotStatusElement() {
  if (!document.querySelector('.robot-status')) {
    const robotCol = document.querySelector('.robot-col');
    if (robotCol) {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'robot-status';
      statusDiv.style.cssText = `
        text-align: center;
        margin: 10px 0;
        padding: 10px;
        background: linear-gradient(45deg, #4CAF50, #45a049);
        border-radius: 10px;
        color: white;
        font-weight: bold;
        display: none;
      `;
      statusDiv.textContent = '✓ تایید ربات انجام شد';
      robotCol.appendChild(statusDiv);
    }
  }
}

// اعتبارسنجی دکمه ورود
function setupSubmitButton() {
  const submitBtn = document.querySelector('.submit');
  
  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const username = document.querySelector('input[type="text"]').value;
      const password = document.querySelector('input[type="password"]').value;
      
      // اول بررسی کن فیلدها پر شدن
      if (username.length < 3 || password.length < 6) {
        shakeForm();
        showError('نام کاربری باید حداقل ۳ کاراکتر و رمز عبور حداقل ۶ کاراکتر باشد');
        return;
      }
      
      // بعد بررسی کن ربات تایید شده یا نه
      const robotVerified = localStorage.getItem('robotVerified');
      const verificationTime = localStorage.getItem('verificationTime');
      const currentTime = Date.now();
      const isValidTime = verificationTime && (currentTime - verificationTime < 5 * 60 * 1000);
      
      if (!robotVerified || robotVerified !== 'true' || !isValidTime) {
        showError('❌ لطفا ابتدا در صفحه ربات تایید شوید!');
        
        setTimeout(() => {
          window.location.href = 'robot.html';
        }, 2000);
        
        return;
      }
      
      // اگه همه چی اوکی بود، برو به صفحه اصلی
      showLoading();
      localStorage.setItem('loggedInUser', username);
      localStorage.setItem('isLoggedIn', 'true');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    });
  }
}

// =============== اجرای توابع ===============

// اجرای همه توابع
function init() {
    setupAnimatedBackground();
    validateForm();
    setupInputEffects();
    setupButtonEffects();
    addDynamicStyles();
    checkLoginStatus();
    addRobotStatusElement();
    checkRobotStatus();
    setupSubmitButton();
}

// شروع اسکریپت
init();

// تمیز کردن انیمیشن‌ها هنگام خروج
window.addEventListener('beforeunload', function() {
    if (bgAnimation) {
        clearInterval(bgAnimation);
    }
});

// رصد تغییرات در localStorage برای همگام‌سازی بین تب‌ها
window.addEventListener('storage', function(e) {
    if (e.key === 'isLoggedIn') {
        checkLoginStatus();
    }
    if (e.key === 'robotVerified') {
        checkRobotStatus();
    }
});

// بررسی وضعیت هر 1 ثانیه برای به روز رسانی خودکار
setInterval(checkRobotStatus, 1000);