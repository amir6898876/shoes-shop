// کلاس مدیریت کاربران
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.checkAccess();
        this.loadUserData();
        this.setupEventListeners();
    }

    // بررسی دسترسی به پروفایل
    checkAccess() {
        if (!this.currentUser) {
            window.location.href = 'sing up.html';
            return;
        }
    }

    // بارگذاری اطلاعات کاربر
    loadUserData() {
        if (!this.currentUser) return;

        // پر کردن اطلاعات پروفایل
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAvatar = document.getElementById('profileAvatar');
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        if (profileName) profileName.textContent = this.currentUser.fullName || this.currentUser.username;
        if (profileEmail) profileEmail.textContent = this.currentUser.email || '';
        
        // بارگذاری آواتار
        if (this.currentUser.avatar && profileAvatar) {
            profileAvatar.src = this.currentUser.avatar;
        } else if (profileAvatar) {
            profileAvatar.src = 'https://via.placeholder.com/120x120?text=User';
        }

        // پر کردن فرم تنظیمات
        if (fullNameInput) fullNameInput.value = this.currentUser.fullName || '';
        if (emailInput) emailInput.value = this.currentUser.email || '';
        if (phoneInput) phoneInput.value = this.currentUser.phone || '';

        // بارگذاری آمار
        this.loadStats();
        
        // بارگذاری سفارشات
        this.loadOrders();
        
        // بارگذاری علاقه‌مندی‌ها
        this.loadWishlist();
        
        // بارگذاری آدرس‌ها
        this.loadAddresses();
    }

    // بارگذاری آمار
    loadStats() {
        const orders = this.currentUser.orders || [];
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

        const totalOrders = document.getElementById('totalOrders');
        const completedOrdersEl = document.getElementById('completedOrders');
        const pendingOrdersEl = document.getElementById('pendingOrders');
        const wishlistCount = document.getElementById('wishlistCount');

        if (totalOrders) totalOrders.textContent = orders.length;
        if (completedOrdersEl) completedOrdersEl.textContent = completedOrders;
        if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
        if (wishlistCount) wishlistCount.textContent = (this.currentUser.wishlist || []).length;
    }

    // بارگذاری سفارشات
    loadOrders(filter = 'all') {
        const orders = this.currentUser.orders || [];
        
        // فیلتر سفارشات
        let filteredOrders = orders;
        if (filter !== 'all') {
            filteredOrders = orders.filter(o => o.status === filter);
        }

        // نمایش آخرین سفارشات در داشبورد
        const recentOrdersList = document.getElementById('recentOrdersList');
        if (recentOrdersList) {
            recentOrdersList.innerHTML = '';
            if (filteredOrders.length === 0) {
                recentOrdersList.innerHTML = '<p class="empty-message">هیچ سفارشی یافت نشد</p>';
            } else {
                filteredOrders.slice(0, 3).forEach(order => {
                    recentOrdersList.appendChild(this.createOrderCard(order));
                });
            }
        }

        // نمایش همه سفارشات
        const allOrders = document.getElementById('allOrders');
        if (allOrders) {
            allOrders.innerHTML = '';
            if (filteredOrders.length === 0) {
                allOrders.innerHTML = '<p class="empty-message">هیچ سفارشی یافت نشد</p>';
            } else {
                filteredOrders.forEach(order => {
                    allOrders.appendChild(this.createOrderCard(order));
                });
            }
        }
    }

    // ساخت کارت سفارش
    createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';
        
        const statusClass = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        }[order.status] || 'status-pending';

        card.innerHTML = `
            <div class="order-info">
                <h4>سفارش #${order.id || '1234'}</h4>
                <p>تاریخ: ${order.date || '1403/12/01'}</p>
                <p>مبلغ: ${order.total?.toLocaleString() || '۰'} تومان</p>
                <p>تعداد اقلام: ${order.items || '۰'}</p>
            </div>
            <span class="order-status ${statusClass}">
                ${this.getStatusText(order.status)}
            </span>
        `;
        
        return card;
    }

    // دریافت متن وضعیت
    getStatusText(status) {
        const statusMap = {
            'pending': 'در انتظار',
            'processing': 'در حال پردازش',
            'completed': 'تکمیل شده',
            'cancelled': 'لغو شده'
        };
        return statusMap[status] || status;
    }

    // بارگذاری علاقه‌مندی‌ها
    loadWishlist() {
        const wishlist = this.currentUser.wishlist || [];
        const wishlistGrid = document.getElementById('wishlistItems');
        
        if (!wishlistGrid) return;

        wishlistGrid.innerHTML = '';
        
        if (wishlist.length === 0) {
            wishlistGrid.innerHTML = '<p class="empty-message">لیست علاقه‌مندی‌ها خالی است</p>';
            return;
        }

        wishlist.forEach((item, index) => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <img src="${item.image || 'https://via.placeholder.com/200x200?text=Product'}" alt="${item.title}">
                <button class="remove-wishlist" onclick="userManager.removeFromWishlist(${index})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="wishlist-item-info">
                    <h4>${item.title}</h4>
                    <p class="wishlist-item-price">${item.price?.toLocaleString() || '۰'} تومان</p>
                    <button class="add-to-cart-btn" onclick="userManager.addToCartFromWishlist(${index})">
                        افزودن به سبد خرید
                    </button>
                </div>
            `;
            wishlistGrid.appendChild(wishlistItem);
        });
    }

    // حذف از علاقه‌مندی‌ها
    removeFromWishlist(index) {
        if (!this.currentUser.wishlist) return;
        
        this.currentUser.wishlist.splice(index, 1);
        this.saveCurrentUser();
        this.loadWishlist();
        this.showNotification('محصول از علاقه‌مندی‌ها حذف شد');
    }

    // افزودن به سبد خرید از علاقه‌مندی‌ها
    addToCartFromWishlist(index) {
        const item = this.currentUser.wishlist[index];
        if (!item) return;

        // اضافه کردن به سبد خرید
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
            ...item,
            quantity: 1
        });
        localStorage.setItem('cart', JSON.stringify(cart));

        this.showNotification('محصول به سبد خرید اضافه شد');
    }

    // بارگذاری آدرس‌ها
    loadAddresses() {
        const addresses = this.currentUser.addresses || [];
        const addressesGrid = document.getElementById('addressesList');
        
        if (!addressesGrid) return;

        addressesGrid.innerHTML = '';
        
        if (addresses.length === 0) {
            addressesGrid.innerHTML = '<p class="empty-message">آدرسی ثبت نشده است</p>';
            return;
        }

        addresses.forEach((address, index) => {
            const addressCard = document.createElement('div');
            addressCard.className = `address-card ${address.isDefault ? 'default' : ''}`;
            
            let defaultBadge = '';
            if (address.isDefault) {
                defaultBadge = '<span class="address-badge">پیش‌فرض</span>';
            }

            addressCard.innerHTML = defaultBadge + `
                <h4>${address.title || 'آدرس'}</h4>
                <p><i class="fas fa-user"></i> ${address.receiverName || ''}</p>
                <p><i class="fas fa-phone"></i> ${address.receiverPhone || ''}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${address.province || ''}، ${address.city || ''}</p>
                <p>${address.address || ''}</p>
                <p><i class="fas fa-mail-bulk"></i> ${address.postalCode || ''}</p>
                <div class="address-actions">
                    <button class="edit-address" onclick="userManager.editAddress(${index})">
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    ${!address.isDefault ? `
                        <button class="set-default-address" onclick="userManager.setDefaultAddress(${index})">
                            <i class="fas fa-check"></i> پیش‌فرض
                        </button>
                    ` : ''}
                    <button class="delete-address" onclick="userManager.deleteAddress(${index})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            
            addressesGrid.appendChild(addressCard);
        });
    }

    // افزودن آدرس جدید
    addAddress(addressData) {
        if (!this.currentUser.addresses) {
            this.currentUser.addresses = [];
        }

        // اگر اولین آدرس است، پیش‌فرض شود
        if (this.currentUser.addresses.length === 0) {
            addressData.isDefault = true;
        }

        this.currentUser.addresses.push(addressData);
        this.saveCurrentUser();
        this.loadAddresses();
        this.closeAddressModal();
        this.showNotification('✅ آدرس با موفقیت اضافه شد');
    }

    // ویرایش آدرس
    editAddress(index) {
        const address = this.currentUser.addresses[index];
        if (!address) return;

        // پر کردن فرم با اطلاعات آدرس
        const titleInput = document.getElementById('addressTitle');
        const receiverNameInput = document.getElementById('receiverName');
        const receiverPhoneInput = document.getElementById('receiverPhone');
        const provinceSelect = document.getElementById('province');
        const cityInput = document.getElementById('city');
        const addressInput = document.getElementById('address');
        const postalCodeInput = document.getElementById('postalCode');

        if (titleInput) titleInput.value = address.title || '';
        if (receiverNameInput) receiverNameInput.value = address.receiverName || '';
        if (receiverPhoneInput) receiverPhoneInput.value = address.receiverPhone || '';
        if (provinceSelect) provinceSelect.value = address.province || '';
        if (cityInput) cityInput.value = address.city || '';
        if (addressInput) addressInput.value = address.address || '';
        if (postalCodeInput) postalCodeInput.value = address.postalCode || '';

        // ذخیره ایندکس آدرس در حال ویرایش
        this.editingAddressIndex = index;
        
        // باز کردن مودال
        const modal = document.getElementById('addressModal');
        if (modal) modal.classList.add('show');
    }

    // به‌روزرسانی آدرس
    updateAddress(index, addressData) {
        if (!this.currentUser.addresses[index]) return;

        this.currentUser.addresses[index] = {
            ...this.currentUser.addresses[index],
            ...addressData
        };

        this.saveCurrentUser();
        this.loadAddresses();
        this.closeAddressModal();
        this.showNotification('✅ آدرس با موفقیت ویرایش شد');
    }

    // حذف آدرس
    deleteAddress(index) {
        if (!confirm('آیا از حذف این آدرس مطمئن هستید؟')) return;

        const wasDefault = this.currentUser.addresses[index]?.isDefault;
        this.currentUser.addresses.splice(index, 1);

        // اگر آدرس پیش‌فرض حذف شد و آدرس دیگری وجود دارد، اولین آدرس را پیش‌فرض کن
        if (wasDefault && this.currentUser.addresses.length > 0) {
            this.currentUser.addresses[0].isDefault = true;
        }

        this.saveCurrentUser();
        this.loadAddresses();
        this.showNotification('✅ آدرس با موفقیت حذف شد');
    }

    // تنظیم آدرس پیش‌فرض
    setDefaultAddress(index) {
        if (!this.currentUser.addresses[index]) return;

        // حذف پیش‌فرض از همه آدرس‌ها
        this.currentUser.addresses.forEach(addr => addr.isDefault = false);
        
        // تنظیم آدرس جدید به عنوان پیش‌فرض
        this.currentUser.addresses[index].isDefault = true;

        this.saveCurrentUser();
        this.loadAddresses();
        this.showNotification('✅ آدرس پیش‌فرض تغییر کرد');
    }

    // ذخیره تنظیمات پروفایل
    saveSettings(formData) {
        let updated = false;

        // به‌روزرسانی اطلاعات
        if (formData.fullName) {
            this.currentUser.fullName = formData.fullName;
            updated = true;
        }
        if (formData.email) {
            this.currentUser.email = formData.email;
            updated = true;
        }
        if (formData.phone) {
            this.currentUser.phone = formData.phone;
            updated = true;
        }

        // تغییر رمز عبور
        if (formData.currentPassword && formData.newPassword) {
            if (this.currentUser.password === formData.currentPassword) {
                if (formData.newPassword === formData.confirmPassword) {
                    this.currentUser.password = formData.newPassword;
                    updated = true;
                    this.showNotification('✅ رمز عبور با موفقیت تغییر کرد');
                } else {
                    this.showNotification('❌ تکرار رمز عبور مطابقت ندارد', 'error');
                    return;
                }
            } else {
                this.showNotification('❌ رمز عبور فعلی اشتباه است', 'error');
                return;
            }
        }

        if (updated) {
            this.saveCurrentUser();
            this.loadUserData();
            this.showNotification('✅ اطلاعات با موفقیت به‌روزرسانی شد');
        }
    }

    // آپلود آواتار
    uploadAvatar(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentUser.avatar = e.target.result;
            this.saveCurrentUser();
            const avatarImg = document.getElementById('profileAvatar');
            if (avatarImg) avatarImg.src = e.target.result;
            this.showNotification('✅ تصویر پروفایل با موفقیت تغییر کرد');
        };
        reader.readAsDataURL(file);
    }

    // ذخیره کاربر فعلی
    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('loggedInUser', this.currentUser.username);
        
        // به‌روزرسانی در لیست کاربران
        const userIndex = this.users.findIndex(u => u.username === this.currentUser.username);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }


    // نمایش نوتیفیکیشن
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 'linear-gradient(45deg, #ff4444, #cc0000)'};
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            z-index: 10001;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            animation: slideDown 0.3s ease;
            direction: rtl;
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // بستن مودال آدرس
    closeAddressModal() {
        const modal = document.getElementById('addressModal');
        if (modal) {
            modal.classList.remove('show');
        }
        this.editingAddressIndex = null;
        const form = document.getElementById('addressForm');
        if (form) form.reset();
    }

    // تنظیم رویدادها
    setupEventListeners() {
        // تب‌ها
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                const tabId = btn.dataset.tab;
                const tabPane = document.getElementById(tabId);
                if (tabPane) {
                    tabPane.classList.add('active');
                }
            });
        });

        // فیلتر سفارشات
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadOrders(btn.dataset.filter);
            });
        });

        // ویرایش پروفایل
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                const settingsTab = document.querySelector('[data-tab="settings"]');
                if (settingsTab) {
                    settingsTab.click();
                }
            });
        }

        // دکمه خروج از پروفایل
        const logoutProfileBtn = document.getElementById('logoutProfileBtn');
        if (logoutProfileBtn) {
            logoutProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // فرم تنظیمات
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = {
                    fullName: document.getElementById('fullName')?.value || '',
                    email: document.getElementById('email')?.value || '',
                    phone: document.getElementById('phone')?.value || '',
                    currentPassword: document.getElementById('currentPassword')?.value || '',
                    newPassword: document.getElementById('newPassword')?.value || '',
                    confirmPassword: document.getElementById('confirmPassword')?.value || ''
                };
                this.saveSettings(formData);
            });
        }

        // افزودن آدرس
        const addAddressBtn = document.getElementById('addAddressBtn');
        if (addAddressBtn) {
            addAddressBtn.addEventListener('click', () => {
                this.editingAddressIndex = null;
                const form = document.getElementById('addressForm');
                if (form) form.reset();
                const modal = document.getElementById('addressModal');
                if (modal) modal.classList.add('show');
            });
        }

        // بستن مودال آدرس
        const closeModalBtn = document.getElementById('closeAddressModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeAddressModal();
            });
        }

        // فرم آدرس
        const addressForm = document.getElementById('addressForm');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const addressData = {
                    title: document.getElementById('addressTitle')?.value || '',
                    receiverName: document.getElementById('receiverName')?.value || '',
                    receiverPhone: document.getElementById('receiverPhone')?.value || '',
                    province: document.getElementById('province')?.value || '',
                    city: document.getElementById('city')?.value || '',
                    address: document.getElementById('address')?.value || '',
                    postalCode: document.getElementById('postalCode')?.value || ''
                };

                if (this.editingAddressIndex !== null) {
                    this.updateAddress(this.editingAddressIndex, addressData);
                } else {
                    this.addAddress(addressData);
                }
            });
        }

        // آپلود آواتار
        const avatarUpload = document.getElementById('avatarUpload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.uploadAvatar(e.target.files[0]);
                }
            });
        }

        // کلیک خارج از مودال
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('addressModal');
            if (e.target === modal) {
                this.closeAddressModal();
            }
        });
    }
}

// ایجاد نمونه از کلاس
const userManager = new UserManager();

// ذخیره در پنجره برای دسترسی از onclick
window.userManager = userManager;