// اسکریپت صفحه ثبت نام

// وقتی صفحه کاملاً لود شد
window.addEventListener('load', function() {
    // پیدا کردن تمام عناصر
    const form = document.querySelector('form');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelectorAll('input[type="password"]')[0];
    const confirmPasswordInput = document.querySelectorAll('input[type="password"]')[1];
    const emailInput = document.querySelector('input[type="email"]');
    const phoneInput = document.querySelector('input[type="tel"]');
    const checkbox = document.querySelector('input[type="checkbox"]');
    const submitBtn = document.querySelector('.submit');
    
    // ذخیره کاربران در localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // تابع اعتبارسنجی فرم
    function validateForm() {
        let errors = [];
        
        // بررسی نام کاربری
        if (!usernameInput.value || usernameInput.value.length < 3) {
            errors.push('نام کاربری باید حداقل ۳ کاراکتر باشد');
            usernameInput.style.borderColor = 'red';
        } else {
            usernameInput.style.borderColor = '';
            
            // بررسی تکراری نبودن نام کاربری
            const userExists = users.some(user => user.username === usernameInput.value);
            if (userExists) {
                errors.push('این نام کاربری قبلاً ثبت شده است');
                usernameInput.style.borderColor = 'red';
            }
        }
        
        // بررسی رمز عبور
        if (!passwordInput.value || passwordInput.value.length < 6) {
            errors.push('رمز عبور باید حداقل ۶ کاراکتر باشد');
            passwordInput.style.borderColor = 'red';
        } else {
            passwordInput.style.borderColor = '';
        }
        
        // بررسی تطابق رمز عبور
        if (passwordInput.value !== confirmPasswordInput.value) {
            errors.push('رمز عبور و تأیید رمز عبور مطابقت ندارند');
            confirmPasswordInput.style.borderColor = 'red';
        } else if (confirmPasswordInput.value) {
            confirmPasswordInput.style.borderColor = '';
        }
        
        // بررسی ایمیل
        if (!emailInput.value) {
            errors.push('ایمیل را وارد کنید');
            emailInput.style.borderColor = 'red';
        } else if (!isValidEmail(emailInput.value)) {
            errors.push('ایمیل معتبر نیست');
            emailInput.style.borderColor = 'red';
        } else {
            emailInput.style.borderColor = '';
            
            // بررسی تکراری نبودن ایمیل
            const emailExists = users.some(user => user.email === emailInput.value);
            if (emailExists) {
                errors.push('این ایمیل قبلاً ثبت شده است');
                emailInput.style.borderColor = 'red';
            }
        }
        
        // بررسی شماره موبایل
        if (!phoneInput.value) {
            errors.push('شماره موبایل را وارد کنید');
            phoneInput.style.borderColor = 'red';
        } else if (!isValidPhone(phoneInput.value)) {
            errors.push('شماره موبایل معتبر نیست (مثال: 09123456789)');
            phoneInput.style.borderColor = 'red';
        } else {
            phoneInput.style.borderColor = '';
        }
        
        // بررسی قوانین
        if (!checkbox.checked) {
            errors.push('لطفاً قوانین را مطالعه و تأیید کنید');
        }
        
        return errors;
    }
    
    // تابع بررسی ایمیل
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // تابع بررسی شماره موبایل
    function isValidPhone(phone) {
        const re = /^09[0-9]{9}$/;
        return re.test(phone);
    }
    
    // نمایش خطا
    function showErrors(errors) {
        // حذیر پیغام‌های قبلی
        const oldErrors = document.querySelectorAll('.error-message');
        oldErrors.forEach(error => error.remove());
        
        // نمایش خطاهای جدید
        errors.forEach(error => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error;
            errorDiv.style.cssText = `
                background: #ffebee;
                color: #c62828;
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                border-right: 4px solid #c62828;
                text-align: right;
                font-size: 14px;
            `;
            form.insertBefore(errorDiv, form.firstChild);
        });
    }
    
    // نمایش موفقیت
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            background: #e8f5e9;
            color: #2e7d32;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border-right: 4px solid #2e7d32;
            text-align: right;
            font-size: 14px;
        `;
        form.insertBefore(successDiv, form.firstChild);
        
        // حذف پیغام بعد از 5 ثانیه
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // ریست فرم
    function resetForm() {
        usernameInput.value = '';
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        checkbox.checked = false;
        
        // حذف استایل‌های خطا
        const inputs = [usernameInput, passwordInput, confirmPasswordInput, emailInput, phoneInput];
        inputs.forEach(input => input.style.borderColor = '');
    }
    
    // ذخیره کاربر جدید
    function saveUser(userData) {
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
    }
    
    // رویداد کلیک روی دکمه ثبت نام
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // حذف پیغام‌های قبلی
        const oldMessages = document.querySelectorAll('.error-message, .success-message');
        oldMessages.forEach(msg => msg.remove());
        
        // اعتبارسنجی فرم
        const errors = validateForm();
        
        if (errors.length > 0) {
            showErrors(errors);
            return;
        }
        
        // ایجاد کاربر جدید
        const newUser = {
            id: Date.now(),
            username: usernameInput.value,
            password: passwordInput.value, // در حالت واقعی باید hash شود
            email: emailInput.value,
            phone: phoneInput.value,
            createdAt: new Date().toISOString(),
            cart: []
        };
        
        // ذخیره کاربر
        saveUser(newUser);
        
        // نمایش پیغام موفقیت
        showSuccess('ثبت نام با موفقیت انجام شد! در حال انتقال...');
        
        // انتقال به صفحه اصلی بعد از 2 ثانیه
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
    
    // رویداد focus برای حذف خطا
    const inputs = [usernameInput, passwordInput, confirmPasswordInput, emailInput, phoneInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                this.style.borderColor = '#667eea';
                this.style.boxShadow = '0 0 5px rgba(102, 126, 234, 0.3)';
                
                // حذف پیغام خطای مرتبط
                const errorMessages = document.querySelectorAll('.error-message');
                errorMessages.forEach(msg => {
                    if (msg.textContent.includes(this.placeholder) || 
                        msg.textContent.includes('نام کاربری') && this === usernameInput ||
                        msg.textContent.includes('رمز عبور') && (this === passwordInput || this === confirmPasswordInput) ||
                        msg.textContent.includes('ایمیل') && this === emailInput ||
                        msg.textContent.includes('موبایل') && this === phoneInput) {
                        msg.remove();
                    }
                });
            });
            
            input.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
            });
        }
    });
    
    // رویداد تغییر برای بررسی سریع رمزها
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (passwordInput.value && confirmPasswordInput.value) {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.style.borderColor = 'red';
                } else {
                    confirmPasswordInput.style.borderColor = 'green';
                    passwordInput.style.borderColor = 'green';
                }
            }
        });
        
        passwordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value) {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.style.borderColor = 'red';
                    passwordInput.style.borderColor = 'red';
                } else {
                    confirmPasswordInput.style.borderColor = 'green';
                    passwordInput.style.borderColor = 'green';
                }
            }
        });
    }
    
    // رویداد برای چک باکس
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            // حذف پیغام خطای قوانین
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => {
                if (msg.textContent.includes('قوانین')) {
                    msg.remove();
                }
            });
        });
    }
    
    // بررسی اگر کاربر قبلاً وارد شده باشد
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            window.location.href = 'index.html';
        }
    }
    
    // ایجاد استایل‌های لازم
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            animation: fadeIn 0.3s ease;
        }
        
        .success-message {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        input:focus {
            outline: none;
        }
    `;
    document.head.appendChild(style);
});