document.body.style.overflowY = 'auto';
document.documentElement.style.overflowY = 'auto';

// =============== منوی همبرگر ===============
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuContainer = document.getElementById('menuContainer');
const body = document.body;
let isOpen = false;

if (hamburgerBtn && menuContainer) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        menuContainer.classList.toggle('open', isOpen);
        hamburgerBtn.classList.toggle('active', isOpen);
        body.classList.toggle('menu-open', isOpen);
    });

    document.querySelectorAll('.menu-items a').forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;
            menuContainer.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    document.addEventListener('click', (e) => {
        if (isOpen && !menuContainer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            isOpen = false;
            menuContainer.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            isOpen = false;
            menuContainer.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

// =============== انیمیشن‌های اولیه ===============
setTimeout(() => {
    const img1 = document.querySelector('.img1');
    if (img1) {
        img1.style.animation = 'imgReverse 1.5s ease-in forwards';
    }

    const col4 = document.querySelector('.col4');
    if (col4) {
        col4.style.animation = 'col2Reverse 1.5s ease-out forwards';
    }

    const row3 = document.querySelector('.row3');
    if (row3) {
        row3.style.display = 'block';
        row3.style.animation = 'row3Up 1.5s ease-out forwards';
    }

    const row4 = document.getElementById('row4');
    if (row4) {
        setTimeout(() => {
            row4.style.display = 'flex';
            row4.style.flexWrap = 'wrap';
            row4.style.justifyContent = 'center';
            row4.style.gap = '20px';
            row4.style.padding = '20px';
            row4.style.opacity = '0';
            row4.style.animation = 'fadeIn 1s ease forwards';
        }, 500);
    }
}, 3000);

// =============== اسلایدر ===============
const sliderTrack = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlide = 0;
const totalSlides = slides.length;

function updateSlider() {
    if (sliderTrack) {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.getAttribute('data-index'));
        updateSlider();
    });
});

// تاچ اسلایدر
let touchStartX = 0;
let touchEndX = 0;

if (sliderTrack) {
    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    } else if (touchEndX - touchStartX > swipeThreshold) {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
}

// اتوپلی اسلایدر
let autoPlayInterval;

function startAutoPlay() {
    if (totalSlides > 1) {
        autoPlayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 4000);
    }
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

startAutoPlay();

if (sliderTrack) {
    sliderTrack.addEventListener('mouseenter', stopAutoPlay);
    sliderTrack.addEventListener('mouseleave', startAutoPlay);
}

// استایل انیمیشن fadeIn
if (!document.querySelector('#fadeInStyle')) {
    const style = document.createElement('style');
    style.id = 'fadeInStyle';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
            from { transform: translate(-50%, -100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// =============== Intersection Observer برای انیمیشن بخش‌ها ===============
window.addEventListener('load', function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("slide-in-from-left");
            }
        });
    }, {
        threshold: 0.1
    });

    const elements = document.querySelectorAll('.colservic, #servis, #help, .about');
    elements.forEach(el => {
        if (el) observer.observe(el);
    });
});

// =============== مدیریت نمایش منو بر اساس سایز صفحه ===============
window.addEventListener('load', function () {
    function checkScreenSize() {
        const desktopMenu = document.querySelector('.desktop-menu');
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const menuContainer = document.querySelector('.menu-container');
        
        if (!desktopMenu || !hamburgerBtn || !menuContainer) return;
        
        if (window.innerWidth >= 768) {
            desktopMenu.style.display = 'block';
            hamburgerBtn.style.display = 'none';
            menuContainer.style.display = 'block';
        } else {
            desktopMenu.style.display = 'none';
            hamburgerBtn.style.display = 'flex';
            menuContainer.style.display = 'block';
        }
    }

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

// =============== سبد خرید ===============
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

// بارگذاری سبد خرید با مدیریت خطا
let cart = [];
try {
    const cartData = localStorage.getItem('cart');
    // اگه مقدار undefined یا null باشه، یه آرایه خالی در نظر بگیر
    if (cartData && cartData !== 'undefined' && cartData !== 'null') {
        cart = JSON.parse(cartData);
        // مطمئن شو آرایه هست
        if (!Array.isArray(cart)) {
            cart = [];
        }
    } else {
        cart = [];
        // اگه مقدار خراب بود، پاکش کن
        if (cartData === 'undefined' || cartData === 'null') {
            localStorage.removeItem('cart');
        }
    }
} catch (e) {
    console.log('خطا در بارگذاری سبد خرید:', e);
    cart = [];
    // اگه خطا داد، مقدار خراب رو پاک کن
    localStorage.removeItem('cart');
}

// ذخیره سبد خرید در localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// به‌روزرسانی نمایش سبد خرید
function updateCartDisplay() {
    if (!cartItems || !cartCount || !cartTotalPrice) return;
    
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">سبد خرید شما خالی است</p>';
        cartCount.textContent = '0';
        cartTotalPrice.textContent = '۰ تومان';
        return;
    }

    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} تومان</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">×</button>
        `;

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = totalItems;
    cartTotalPrice.textContent = total.toLocaleString() + ' تومان';
}

// اضافه کردن به سبد خرید
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    showNotification('محصول به سبد خرید اضافه شد!');
}

// حذف از سبد خرید
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
    showNotification('محصول از سبد خرید حذف شد!');
}

// به‌روزرسانی تعداد
window.updateQuantity = function(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            window.removeFromCart(index);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// نمایش نوتیفیکیشن
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #6a0dad, #4a0072);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        direction: rtl;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// مدیریت رویدادهای سبد خرید
if (cartToggle && cartSidebar) {
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });
}

if (closeCart && cartSidebar) {
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('سبد خرید شما خالی است!');
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showNotification(`سفارش شما با مبلغ ${total.toLocaleString()} تومان ثبت شد!`);
        cart = [];
        saveCart();
        updateCartDisplay();
        if (cartSidebar) cartSidebar.classList.remove('open');
    });
}

if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('سبد خرید شما خالی است!');
            return;
        }

        if (confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟')) {
            cart = [];
            saveCart();
            updateCartDisplay();
            showNotification('سبد خرید خالی شد!');
        }
    });
}

// بستن سبد خرید با کلیک خارج
document.addEventListener('click', (e) => {
    if (cartSidebar && cartToggle && cartSidebar.classList.contains('open') && 
        !cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
        cartSidebar.classList.remove('open');
    }
});

// استایل نوتیفیکیشن
if (!document.querySelector('#notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
// =============== جستجو و فیلتر محصولات ===============
function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const productCount = document.getElementById('productCount');
    
    if (!searchInput || !filterSelect || !productCount) return;
    
    const searchText = searchInput.value.toLowerCase().trim();
    const filterValue = filterSelect.value;
    
    // همه کارت‌های محصول رو بگیر (هم اصلی هم جدید)
    const allCards = document.querySelectorAll('.row4 .colcard');
    
    if (allCards.length === 0) {
        productCount.innerHTML = '۰ محصول نمایش داده شده';
        return;
    }
    
    let visibleCount = 0;
    
    allCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent || '';
        const titleLower = title.toLowerCase();
        
        // فیلتر بر اساس متن جستجو
        let matchesSearch = true;
        if (searchText !== '') {
            matchesSearch = titleLower.includes(searchText);
        }
        
        // فیلتر بر اساس دسته‌بندی
        let matchesFilter = true;
        if (filterValue !== 'all') {
            matchesFilter = titleLower.includes(filterValue.toLowerCase());
        }
        
        // نمایش یا مخفی کردن
        if (matchesSearch && matchesFilter) {
            card.style.display = ''; // نمایش عادی
            card.style.opacity = '1';
            visibleCount++;
        } else {
            card.style.display = 'none'; // مخفی
        }
    });
    
    // به‌روزرسانی شمارنده
    productCount.innerHTML = `${visibleCount} محصول نمایش داده شده`;
    
    // اگه محصولی پیدا نشد
    if (visibleCount === 0) {
        productCount.innerHTML += ' - محصولی یافت نشد ❌';
    }
}

function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    
    if (searchInput) searchInput.value = '';
    if (filterSelect) filterSelect.value = 'all';
    
    filterProducts();
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // یه کمی صبر کن تا محصولات لود بشن
    setTimeout(() => {
        filterProducts();
    }, 4000);
    
    // اضافه کردن رویداد به دکمه پاک کردن
    const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetFilters();
        });
    }
});

// مشاهده تغییرات برای محصولات جدید
const filterObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // وقتی محصول جدید اضافه شد، فیلتر رو دوباره اعمال کن
            setTimeout(() => {
                filterProducts();
            }, 100);
        }
    });
});

// شروع مشاهده
document.addEventListener('DOMContentLoaded', function() {
    const row4 = document.querySelector('.row4');
    if (row4) {
        filterObserver.observe(row4, { childList: true, subtree: false });
    }
});

// اضافه کردن رویداد به دکمه‌های محصولات جدید
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('show-more-btn') || e.target.closest('.show-more-btn')) {
        // وقتی دکمه نمایش بیشتر کلیک شد، بعد از اضافه شدن محصولات فیلتر رو اعمال کن
        setTimeout(() => {
            filterProducts();
        }, 600);
    }
});
// =============== دکمه "نمایش محصولات بیشتر" ===============
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const showMoreBtn = document.getElementById('showMoreBtn');
        const row4 = document.querySelector('.row4');

        if (showMoreBtn && row4) {
            // ذخیره محصولات اصلی
            const originalCards = Array.from(row4.querySelectorAll('.colcard')).map(card => {
                return {
                    html: card.outerHTML,
                    title: card.querySelector('h3')?.textContent || '',
                    price: card.querySelector('h4')?.textContent || '0',
                    image: card.querySelector('img')?.src || ''
                };
            });

            let hasLoadedMore = false;

            showMoreBtn.addEventListener('click', function () {
                if (hasLoadedMore || originalCards.length === 0) return;
                hasLoadedMore = true;

                // دکمه رو غیرفعال کن
                showMoreBtn.innerHTML = 'در حال بارگذاری...';
                showMoreBtn.disabled = true;

                setTimeout(() => {
                    // 10 محصول جدید اضافه کن
                    for (let i = 0; i < 10; i++) {
                        const productIndex = i % originalCards.length;
                        const product = originalCards[productIndex];

                        // ساخت کارت جدید
                        const newCard = document.createElement('div');
                        newCard.className = 'colcard new-product';
                        newCard.style.opacity = '0';
                        newCard.style.transform = 'translateY(20px)';

                        // قیمت رو محاسبه کن
                        let priceNum = 0;
                        try {
                            priceNum = parseInt(product.price.replace(/[^\d]/g, '')) || 0;
                        } catch {
                            priceNum = 100000;
                        }

                        // محتوای محصول جدید
                        newCard.innerHTML = `
                            <img class="imgcard" src="${product.image}" alt="محصول اضافی" />
                            <h3>${product.title}</h3>
                            <h4>${(priceNum + (i * 10000)).toLocaleString()} تومان</h4>
                            <button>افزودن به سبد خرید</button>
                        `;

                        // اضافه کردن به row4
                        row4.insertBefore(newCard, showMoreBtn);

                        // انیمیشن
                        setTimeout(() => {
                            newCard.style.transition = 'all 0.5s ease';
                            newCard.style.opacity = '1';
                            newCard.style.transform = 'translateY(0)';
                        }, i * 50);

                        // اضافه کردن event به دکمه
                        const newButton = newCard.querySelector('button');
                        if (newButton) {
                            newButton.addEventListener('click', function () {
                                const card = this.closest('.colcard');
                                if (!card) return;
                                
                                const title = card.querySelector('h3')?.textContent || '';
                                const priceText = card.querySelector('h4')?.textContent || '0';
                                const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
                                const image = card.querySelector('img')?.src || '';

                                const product = {
                                    id: Date.now() + i + 1000,
                                    title: title,
                                    price: price,
                                    image: image
                                };

                                addToCart(product);
                            });
                        }
                    }

                    // مخفی کردن دکمه
                    setTimeout(() => {
                        showMoreBtn.style.display = 'none';
                    }, 600);

                }, 500);
            });
        }
    }, 3500);
});

// =============== رویداد دکمه‌های افزودن به سبد خرید ===============
document.addEventListener('DOMContentLoaded', function() {
    // اضافه کردن رویداد به دکمه‌های اصلی
    const productButtons = document.querySelectorAll('.colcard button');
    productButtons.forEach((button, index) => {
        // جلوگیری از اضافه شدن چندباره رویداد
        if (button.hasAttribute('data-listener')) return;
        button.setAttribute('data-listener', 'true');
        
        button.addEventListener('click', function() {
            const card = this.closest('.colcard');
            if (!card) return;
            
            const title = card.querySelector('h3')?.textContent || '';
            const priceText = card.querySelector('h4')?.textContent || '0';
            const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
            const image = card.querySelector('img')?.src || '';
            
            const product = {
                id: Date.now() + index,
                title: title,
                price: price,
                image: image
            };
            
            addToCart(product);
        });
    });
});

// =============== پاک کردن مقدارهای خراب از localStorage ===============
function cleanupLocalStorage() {
    // پاک کردن مقدار "undefined" و "null" رشته‌ای
    const keysToCheck = ['currentUser', 'isLoggedIn', 'loggedInUser'];
    keysToCheck.forEach(key => {
        const value = localStorage.getItem(key);
        if (value === 'undefined' || value === 'null') {
            console.log(`پاک کردن مقدار خراب ${key}:`, value);
            localStorage.removeItem(key);
        }
    });
}

// اجرای پاکسازی در شروع
cleanupLocalStorage();

// =============== مدیریت منو بر اساس وضعیت ورود ===============
function updateMenuBasedOnLogin() {
    // پاکسازی اولیه
    cleanupLocalStorage();
    
    // بررسی صحیح وضعیت ورود با مدیریت ارور
    let currentUser = null;
    try {
        const userData = localStorage.getItem('currentUser');
        if (userData && userData !== 'undefined' && userData !== 'null') {
            currentUser = JSON.parse(userData);
        } else {
            currentUser = null;
            // پاک کردن مقدار خراب
            if (userData === 'undefined' || userData === 'null') {
                localStorage.removeItem('currentUser');
            }
        }
    } catch (e) {
        console.log('خطا در پارس کردن currentUser:', e);
        currentUser = null;
        // پاک کردن مقدار خراب
        localStorage.removeItem('currentUser');
    }
    
    const isLoggedIn = !!currentUser;
    
    console.log('وضعیت ورود:', isLoggedIn, 'کاربر:', currentUser);
    
    // اسمی که نمایش داده میشه
    const displayName = currentUser?.fullName || currentUser?.username || 'کاربر';
    
    // پیدا کردن همه لینک‌های ورود/ثبت‌نام
    const loginLinks = document.querySelectorAll('a[href="sing up.html"]');
    
    // پیدا کردن جایی که لینک پروفایل باید اضافه شود
    const desktopNav = document.querySelector('.desktop-nav');
    const mobileMenuItems = document.querySelector('.menu-items');
    
    // حذف لینک‌های پروفایل قبلی
    document.querySelectorAll('.profile-link, .logout-link').forEach(link => {
        if (link && link.closest('li')) {
            link.closest('li').remove();
        }
    });
    
    if (isLoggedIn) {
        console.log('کاربر لاگین است - اضافه کردن لینک پروفایل');
        
        // مخفی کردن لینک‌های ورود
        loginLinks.forEach(link => {
            if (link && link.closest('li')) {
                link.closest('li').style.display = 'none';
            }
        });
        
        // اضافه کردن لینک پروفایل به منوی دسکتاپ
        if (desktopNav) {
            // بررسی کن ببین لینک پروفایل از قبل وجود داره یا نه
            const existingProfile = desktopNav.querySelector('a[href="profile.html"]');
            if (!existingProfile) {
                const profileLi = document.createElement('li');
                profileLi.innerHTML = `<a href="profile.html" class="profile-link">پروفایل من (${displayName})</a>`;
                
                // پیدا کردن محل مناسب برای درج (بعد از صفحه اصلی)
                const firstLi = desktopNav.querySelector('li:first-child');
                if (firstLi) {
                    firstLi.insertAdjacentElement('afterend', profileLi);
                } else {
                    desktopNav.appendChild(profileLi);
                }
            }
        }
        
        // اضافه کردن لینک پروفایل به منوی موبایل
        if (mobileMenuItems) {
            // بررسی کن ببین لینک پروفایل از قبل وجود داره یا نه
            const existingMobileProfile = mobileMenuItems.querySelector('a[href="profile.html"]');
            if (!existingMobileProfile) {
                const profileMobileLi = document.createElement('li');
                profileMobileLi.innerHTML = `<a href="profile.html" class="profile-link">پروفایل من (${displayName})</a>`;
                
                // اضافه کردن به ابتدای منو
                if (mobileMenuItems.firstChild) {
                    mobileMenuItems.insertBefore(profileMobileLi, mobileMenuItems.firstChild);
                } else {
                    mobileMenuItems.appendChild(profileMobileLi);
                }
            }
            
            // اضافه کردن لینک خروج اگر وجود نداره
            const existingLogout = mobileMenuItems.querySelector('.logout-link');
            if (!existingLogout) {
                const logoutLi = document.createElement('li');
                logoutLi.innerHTML = '<a href="#" id="logoutLink" class="logout-link">🚪 خروج از حساب</a>';
                mobileMenuItems.appendChild(logoutLi);
                
                // اضافه کردن رویداد خروج
                const logoutLink = logoutLi.querySelector('a');
                if (logoutLink) {
                    logoutLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        logout();
                    });
                }
            }
        }
    } else {
        console.log('کاربر لاگین نیست - نمایش لینک ورود');
        
        // نمایش لینک‌های ورود
        loginLinks.forEach(link => {
            if (link && link.closest('li')) {
                link.closest('li').style.display = 'block';
            }
        });
    }
}

// تابع خروج از حساب
function logout() {
    if (confirm('آیا می‌خواهید از حساب خود خارج شوید؟')) {
        // پاک کردن کامل اطلاعات ورود
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loggedInUser');
        
        // نمایش پیام
        const logoutMsg = document.createElement('div');
        logoutMsg.style.cssText = `
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
        logoutMsg.textContent = '✅ با موفقیت خارج شدید';
        document.body.appendChild(logoutMsg);
        
        // به‌روزرسانی منو بلافاصله
        updateMenuBasedOnLogin();
        
        setTimeout(() => {
            logoutMsg.remove();
            // اگه تو صفحه پروفایل بودیم بریم به صفحه اصلی
            if (window.location.pathname.includes('profile.html')) {
                window.location.href = 'index.html';
            }
        }, 1500);
    }
}

// اجرا در زمان لود صفحه
document.addEventListener('DOMContentLoaded', function() {
    console.log('صفحه لود شد - به‌روزرسانی منو');
    updateMenuBasedOnLogin();
    updateCartDisplay();
});

// گوش دادن به تغییرات localStorage
window.addEventListener('storage', function(e) {
    console.log('تغییر در localStorage:', e.key);
    if (e.key === 'currentUser' || e.key === 'isLoggedIn' || e.key === 'loggedInUser') {
        updateMenuBasedOnLogin();
    }
    if (e.key === 'cart') {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartDisplay();
    }
});

// بررسی هر ثانیه برای به‌روزرسانی منو
setInterval(updateMenuBasedOnLogin, 1000);

// اضافه کردن توابع به پنجره برای دسترسی از onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.logout = logout;
(function() {
    // =============== مودال مشاهده محصول ===============
    const modal = document.getElementById('productModal');
    const modalOverlay = document.querySelector('.shoeshop-modal-overlay');
    const modalClose = document.querySelector('.shoeshop-modal-close');
    const modalImage = document.getElementById('modalProductImage');
    const modalTitle = document.getElementById('modalProductTitle');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalRating = document.getElementById('modalProductRating');
    const modalShipping = document.getElementById('modalProductShipping');
    const modalDeliveryTime = document.getElementById('modalDeliveryTime');
    const modalFeatures = document.getElementById('modalProductFeatures');
    const modalSelectedColor = document.getElementById('modalSelectedColor');
    const modalSelectedSize = document.getElementById('modalSelectedSize');
    const modalQuantity = document.getElementById('modalQuantity');
    const modalDecreaseQty = document.getElementById('modalDecreaseQty');
    const modalIncreaseQty = document.getElementById('modalIncreaseQty');
    const modalAddToCart = document.getElementById('modalAddToCart');
    
    let currentProduct = null;
    let currentColor = 'مشکی';
    let currentSize = '۴۲';
    let currentQuantity = 1;

    // اضافه کردن دکمه "مشاهده محصول" به هر کارت
    function addViewButtons() {
        const productCards = document.querySelectorAll('.row4 .colcard');
        
        productCards.forEach((card, index) => {
            // اگه دکمه از قبل اضافه شده، دیگه اضافه نکن
            if (card.querySelector('.view-product-btn')) return;
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'view-product-btn';
            viewBtn.innerHTML = 'مشاهده محصول';
            viewBtn.style.cssText = `
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 30px;
                margin-top: 10px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                width: 100%;
            `;
            
            // اضافه کردن رویداد کلیک
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openProductModal(card);
            });
            
            // اضافه کردن دکمه به کارت
            const existingButton = card.querySelector('button:not(.view-product-btn)');
            if (existingButton) {
                existingButton.style.marginBottom = '5px';
                card.insertBefore(viewBtn, existingButton.nextSibling);
            } else {
                card.appendChild(viewBtn);
            }
        });
    }

    // باز کردن مودال محصول
    function openProductModal(card) {
        // دریافت اطلاعات محصول
        const title = card.querySelector('h3')?.textContent || 'محصول';
        const priceText = card.querySelector('h4')?.textContent || '0';
        const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
        const image = card.querySelector('img')?.src || '';
        
        // اطلاعات تکمیلی (میتونی بر اساس محصول تغییر بدی)
        const productData = {
            id: Date.now(),
            title: title,
            price: price,
            image: image,
            description: getProductDescription(title),
            rating: getProductRating(title),
            features: getProductFeatures(title),
            deliveryDays: getDeliveryDays(title),
            colors: ['مشکی', 'سفید', 'آبی', 'قرمز'],
            sizes: ['۳۹', '۴۰', '۴۱', '۴۲', '۴۳', '۴۴']
        };
        
        currentProduct = productData;
        
        // پر کردن مودال با اطلاعات
        modalImage.src = productData.image;
        modalTitle.textContent = productData.title;
        modalPrice.textContent = productData.price.toLocaleString() + ' تومان';
        modalDescription.textContent = productData.description;
        modalRating.textContent = productData.rating;
        modalDeliveryTime.textContent = `ارسال: ${productData.deliveryDays}`;
        modalShipping.textContent = `ارسال ${productData.deliveryDays}`;
        
        // اضافه کردن ویژگی‌ها
        if (modalFeatures) {
            modalFeatures.innerHTML = '';
            productData.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = feature;
                modalFeatures.appendChild(li);
            });
        }
        
        // اضافه کردن رنگ‌ها
        const colorOptions = document.querySelector('.shoeshop-color-options');
        if (colorOptions) {
            colorOptions.innerHTML = '';
            productData.colors.forEach(color => {
                const colorSpan = document.createElement('span');
                colorSpan.className = 'shoeshop-color-option';
                if (color === 'مشکی') colorSpan.style.background = '#000';
                else if (color === 'سفید') { colorSpan.style.background = '#fff'; colorSpan.style.border = '1px solid #ddd'; }
                else if (color === 'آبی') colorSpan.style.background = '#3498db';
                else if (color === 'قرمز') colorSpan.style.background = '#e74c3c';
                else colorSpan.style.background = '#95a5a6';
                
                colorSpan.setAttribute('data-color', color);
                colorSpan.addEventListener('click', function() {
                    document.querySelectorAll('.shoeshop-color-option').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    currentColor = this.getAttribute('data-color');
                    modalSelectedColor.textContent = currentColor;
                });
                
                colorOptions.appendChild(colorSpan);
            });
            // انتخاب پیش‌فرض
            if (colorOptions.firstChild) {
                colorOptions.firstChild.classList.add('active');
            }
        }
        
        // اضافه کردن سایزها
        const sizeOptions = document.querySelector('.shoeshop-size-options');
        if (sizeOptions) {
            sizeOptions.innerHTML = '';
            productData.sizes.forEach(size => {
                const sizeSpan = document.createElement('span');
                sizeSpan.className = 'shoeshop-size-option';
                sizeSpan.textContent = size;
                sizeSpan.setAttribute('data-size', size);
                sizeSpan.addEventListener('click', function() {
                    document.querySelectorAll('.shoeshop-size-option').forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    currentSize = this.getAttribute('data-size');
                    modalSelectedSize.textContent = currentSize;
                });
                sizeOptions.appendChild(sizeSpan);
            });
            // انتخاب پیش‌فرض
            if (sizeOptions.children[3]) {
                sizeOptions.children[3].classList.add('active'); // سایز ۴۲
            }
        }
        
        // نمایش مودال
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // دریافت توضیحات محصول بر اساس عنوان
    function getProductDescription(title) {
        const descriptions = {
            'ایر': 'کفش ایر با طراحی مدرن و کفی ارگونومیک، مناسب برای استفاده روزمره و پیاده‌روی. این کفش با بهترین مواد اولیه تولید شده و دوخت بسیار باکیفیتی دارد.',
            'بسکتبال': 'کفش مخصوص بسکتبال با قابلیت جذب ضربه بالا و پشتیبانی عالی از مچ پا. زیره مقاوم در برابر سایش و رویه تنفس‌پذیر.',
            'پیاده روی': 'کفش راحت و سبک مناسب برای پیاده‌روی طولانی. با کفی طبی و قوس کف پا که از خستگی پا جلوگیری می‌کند.',
            'تمرین': 'کفش چندمنظوره مناسب برای تمرینات ورزشی در باشگاه. انعطاف‌پذیری بالا و چسبندگی عالی روی سطوح مختلف.',
            'نایک': 'کفش نایک اورجینال با تکنولوژی Air. طراحی اسپرت و مدرن مناسب برای استفاده روزمره و ورزشی.'
        };
        
        for (let key in descriptions) {
            if (title.includes(key)) {
                return descriptions[key];
            }
        }
        return 'کفش با کیفیت درجه یک از شوز شاپ. طراحی زیبا و راحت مناسب برای استفاده روزمره و ورزشی. با گارانتی اصالت کالا و ضمانت بازگشت ۷ روزه.';
    }

    // دریافت درصد رضایت
    function getProductRating(title) {
        const ratings = {
            'ایر': '۹۷٪',
            'بسکتبال': '۹۵٪',
            'پیاده روی': '۹۸٪',
            'تمرین': '۹۴٪',
            'نایک': '۹۹٪'
        };
        
        for (let key in ratings) {
            if (title.includes(key)) {
                return ratings[key];
            }
        }
        return '۹۶٪';
    }

    // دریافت ویژگی‌های محصول
    function getProductFeatures(title) {
        if (title.includes('بسکتبال')) {
            return [
                ' جذب ضربه عالی',
                ' رنگ‌بندی متنوع',
                ' پشتیبانی از مچ پا',
                ' تنفس‌پذیری بالا',
                ' گارانتی اصالت',
                ' زیره مقاوم'
            ];
        } else if (title.includes('پیاده روی')) {
            return [
                'کفی طبی',
                'طراحی ارگونومیک',
                'وزن بسیار سبک',
                'قابلیت شستشو',
                'گارانتی اصالت',
                'ضد تعریق'
            ];
        }
        return [
            ' کیفیت درجه یک',
            ' رنگ‌بندی متنوع',
            ' مناسب استفاده روزمره',
            ' قابلیت تنفس بالا',
            ' گارانتی اصالت',
            ' دوخت مقاوم'
        ];
    }

    // دریافت زمان ارسال
    function getDeliveryDays(title) {
        return '۲ تا ۴ روز کاری';
    }

    // بستن مودال
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentQuantity = 1;
        if (modalQuantity) modalQuantity.value = 1;
    }

    // رویدادهای مودال
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // کنترل تعداد
    if (modalDecreaseQty) {
        modalDecreaseQty.addEventListener('click', function() {
            let val = parseInt(modalQuantity.value) || 1;
            if (val > 1) {
                val--;
                modalQuantity.value = val;
                currentQuantity = val;
            }
        });
    }

    if (modalIncreaseQty) {
        modalIncreaseQty.addEventListener('click', function() {
            let val = parseInt(modalQuantity.value) || 1;
            if (val < 10) {
                val++;
                modalQuantity.value = val;
                currentQuantity = val;
            }
        });
    }

    // افزودن به سبد خرید از مودال
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function() {
            if (currentProduct) {
                const product = {
                    id: currentProduct.id,
                    title: currentProduct.title + ` (رنگ: ${currentColor}, سایز: ${currentSize})`,
                    price: currentProduct.price,
                    image: currentProduct.image,
                    quantity: currentQuantity
                };
                
                if (typeof window.addToCart === 'function') {
                    window.addToCart(product);
                }
                
                // نمایش پیام انتخاب
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(45deg, #4CAF50, #45a049);
                    color: white;
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 100000;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                    direction: rtl;
                `;
                notification.textContent = ` محصول با رنگ ${currentColor} و سایز ${currentSize} به سبد خرید اضافه شد`;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 2000);
            }
        });
    }

    // اجرا بعد از لود صفحه
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addViewButtons, 1000); // کمی صبر کن تا کارت‌ها لود بشن
        });
    } else {
        setTimeout(addViewButtons, 1000);
    }

    // اضافه کردن به محصولات جدید
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                setTimeout(addViewButtons, 500);
            }
        });
    });

    const row4 = document.querySelector('.row4');
    if (row4) {
        observer.observe(row4, { childList: true, subtree: false });
    }

    // کلید ESC برای بستن مودال
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
})();