// =============== کدهای ثبت‌نام کامل ===============

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn');
    const user = document.getElementById('user');
    const password = document.getElementById('password');
    const againpassword = document.getElementById('againpassword');
    const email = document.getElementById('email');
    const tel = document.getElementById('tel');
    const checkbox = document.getElementById('checkbox');

    const allow = document.getElementById('allow');
    const allowpass = document.getElementById('allowpass');
    const allowagain = document.getElementById('allowagain');
    const allowemail = document.getElementById('allowemail');
    const allowtel = document.getElementById('allowtel');
    const allowcheck = document.getElementById('allowcheck');

    if (btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            
            let isValid = true;
            
            // ریست کردن همه پیام‌ها
            resetMessages();
            
            // بررسی نام کاربری
            if (user.value.trim() === '') {
                showError(allow, '❌ نام کاربری را وارد نکردید');
                isValid = false;
            } else if (user.value.length < 3) {
                showError(allow, '❌ نام کاربری باید حداقل ۳ کاراکتر باشد');
                isValid = false;
            } else {
                allow.style.display = 'none';
            }
            
            // بررسی رمز عبور
            if (password.value === '') {
                showError(allowpass, '❌ رمز عبور را وارد نکردید');
                isValid = false;
            } else if (password.value.length < 6) {
                showError(allowpass, '❌ رمز عبور باید حداقل ۶ کاراکتر باشد');
                isValid = false;
            } else {
                allowpass.style.display = 'none';
            }
            
            // بررسی تکرار رمز عبور
            if (againpassword.value === '') {
                showError(allowagain, '❌ تکرار رمز عبور را وارد نکردید');
                isValid = false;
            } else {
                allowagain.style.display = 'none';
            }
            
            // بررسی ایمیل
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value === '') {
                showError(allowemail, '❌ ایمیل را وارد نکردید');
                isValid = false;
            } else if (!emailPattern.test(email.value)) {
                showError(allowemail, '❌ ایمیل معتبر وارد کنید (مثال: example@gmail.com)');
                isValid = false;
            } else {
                allowemail.style.display = 'none';
            }
            
            // بررسی شماره همراه
            const phonePattern = /^09\d{9}$/;
            if (tel.value === '') {
                showError(allowtel, '❌ شماره همراه را وارد نکردید');
                isValid = false;
            } else if (!phonePattern.test(tel.value)) {
                showError(allowtel, '❌ شماره همراه معتبر وارد کنید (مثال: 09123456789)');
                isValid = false;
            } else {
                allowtel.style.display = 'none';
            }
            
            // بررسی مطابقت رمز و تکرار آن
            if (password.value !== againpassword.value && password.value !== '' && againpassword.value !== '') {
                showError(allowpass, '❌ رمز عبور و تکرار آن مطابقت ندارند');
                isValid = false;
            }
            
            // بررسی قبول قوانین
            if (!checkbox.checked) {
                showError(allowcheck, '❌ لطفا قوانین را بپذیرید');
                isValid = false;
            } else {
                allowcheck.style.display = 'none';
            }
            
            // اگر اعتبارسنجی اولیه درست بود
            if (isValid) {
                // بررسی تکراری نبودن نام کاربری
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const existingUser = users.find(u => u.username === user.value);
                
                if (existingUser) {
                    showError(allow, '❌ این نام کاربری قبلاً ثبت شده است');
                    isValid = false;
                }
            }
            
            // بررسی تکراری نبودن ایمیل
            if (isValid) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const existingEmail = users.find(u => u.email === email.value);
                
                if (existingEmail) {
                    showError(allowemail, '❌ این ایمیل قبلاً ثبت شده است');
                    isValid = false;
                }
            }
            
            // بررسی تکراری نبودن شماره همراه
            if (isValid) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const existingPhone = users.find(u => u.phone === tel.value);
                
                if (existingPhone) {
                    showError(allowtel, '❌ این شماره همراه قبلاً ثبت شده است');
                    isValid = false;
                }
            }
            
            // اگر همه چیز درست بود
            if (isValid) {
                // ایجاد کاربر جدید
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const newUser = {
                    id: Date.now(),
                    username: user.value,
                    fullName: user.value,
                    password: password.value,
                    email: email.value,
                    phone: tel.value,
                    avatar: null,
                    orders: [],
                    wishlist: [],
                    addresses: [],
                    registeredAt: new Date().toLocaleDateString('fa-IR')
                };
                
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // ذخیره کاربر فعلی
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', user.value);
                
                // نمایش پیام موفقیت
                showSuccessMessage('✅ ثبت نام با موفقیت انجام شد');
                
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 2000);
            }
        });
    }

    // تابع ریست پیام‌ها
    function resetMessages() {
        const messages = [allow, allowpass, allowagain, allowemail, allowtel, allowcheck];
        messages.forEach(msg => {
            if (msg) {
                msg.style.display = 'none';
                msg.style.background = '#ff4444';
                msg.style.color = 'white';
                msg.style.padding = '10px 15px';
                msg.style.borderRadius = '5px';
                msg.style.marginBottom = '10px';
                msg.style.fontSize = '14px';
                msg.style.textAlign = 'center';
                msg.style.transition = 'all 0.3s ease';
            }
        });
    }

    // تابع نمایش خطا
    function showError(element, message) {
        if (!element) return;
        
        // اگر تایمر قبلی وجود داشت، پاکش کن
        if (element.timeoutId) {
            clearTimeout(element.timeoutId);
        }
        
        element.style.display = 'block';
        element.textContent = message;
        element.style.background = '#ff4444';
        element.style.color = 'white';
        element.style.padding = '10px 15px';
        element.style.borderRadius = '5px';
        element.style.marginBottom = '10px';
        element.style.fontSize = '14px';
        element.style.textAlign = 'center';
        element.style.animation = 'shake 0.3s ease';
        
        // تایمر ۳ ثانیه برای مخفی شدن
        element.timeoutId = setTimeout(() => {
            element.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                element.style.display = 'none';
                element.style.animation = '';
            }, 300);
        }, 3000);
    }

    // تابع نمایش پیام موفقیت
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            animation: slideDown 0.3s ease;
            direction: rtl;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
            }, 300);
        }, 2000);
    }
});

// اضافه کردن انیمیشن‌ها
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    input:focus {
        outline: none;
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }
    
    .allow, #allow, #allowpass, #allowagain, #allowemail, #allowtel, #allowcheck {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);