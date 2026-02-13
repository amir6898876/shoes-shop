document.body.style.overflowY = 'auto';
document.documentElement.style.overflowY = 'auto';

const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuContainer = document.getElementById('menuContainer');
const body = document.body;
let isOpen = false;

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

if (!document.querySelector('#fadeInStyle')) {
    const style = document.createElement('style');
    style.id = 'fadeInStyle';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

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

    const elements = document.querySelectorAll('.colservic');

    elements.forEach(el => {
        observer.observe(el);
    });
});

window.addEventListener('load', function () {
    function checkScreenSize() {
        if (window.innerWidth >= 768) {
            document.querySelector('.desktop-menu').style.display = 'block';
            document.querySelector('.hamburger-btn').style.display = 'none';
            document.querySelector('.menu-container').style.display = 'none';
        } else {
            document.querySelector('.desktop-menu').style.display = 'none';
            document.querySelector('.hamburger-btn').style.display = 'flex';
        }
    }

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
});
// سبد خرید
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ذخیره سبد خرید در localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// به‌روزرسانی نمایش سبد خرید
function updateCartDisplay() {
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
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
    showNotification('محصول از سبد خرید حذف شد!');
}

// به‌روزرسانی تعداد
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            removeFromCart(index);
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
    notification.textContent = message;
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
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// مدیریت رویدادهای سبد خرید
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

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
    cartSidebar.classList.remove('open');
});

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

// بستن سبد خرید با کلیک خارج
document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target) && cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
    }
});

// انیمیشن‌های نوتیفیکیشن
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

// اضافه کردن رویداد به دکمه‌های افزودن به سبد خرید// کد برای دکمه "نمایش محصولات بیشتر"
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const showMoreBtn = document.getElementById('showMoreBtn');
        const row4 = document.querySelector('.row4');

        if (showMoreBtn && row4) {
            // ذخیره محصولات اصلی
            const originalCards = Array.from(row4.querySelectorAll('.colcard')).map(card => {
                return {
                    html: card.outerHTML,
                    title: card.querySelector('h3').textContent,
                    price: card.querySelector('h4').textContent,
                    image: card.querySelector('img').src
                };
            });

            let hasLoadedMore = false;

            showMoreBtn.addEventListener('click', function () {
                if (hasLoadedMore) return;
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
                        newCard.className = 'colcard new-product'; // کلاس new-product اضافه شد
                        newCard.style.opacity = '0';
                        newCard.style.transform = 'translateY(20px)';

                        // محتوای محصول جدید
                        newCard.innerHTML = `
                            <img class="imgcard" src="${product.image}" alt="محصول اضافی" />
                            <h3>${product.title}</h3>
                            <h4>${parseInt(product.price.replace(/[^\d]/g, '')) + (i * 10000)} تومان</h4>
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
                        newButton.addEventListener('click', function () {
                            const card = this.closest('.colcard');
                            const title = card.querySelector('h3').textContent;
                            const priceText = card.querySelector('h4').textContent;
                            const price = parseInt(priceText.replace(/[^\d]/g, ''));
                            const image = card.querySelector('img').src;

                            const product = {
                                id: Date.now() + i + 1000,
                                title: title,
                                price: price,
                                image: image
                            };

                            addToCart(product);
                        });
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
// ==== منوی همبرگر - کد جدید ====
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menuContainer = document.getElementById('menuContainer');
    const body = document.body;

    console.log('عناصر منو:', { hamburgerBtn, menuContainer });

    // بررسی وجود المان‌ها
    if (!hamburgerBtn || !menuContainer) {
        console.error('عناصر منو پیدا نشدند!');
        return;
    }

    // حتماً مطمئن شو منو نمایش داده می‌شود
    menuContainer.style.display = 'block';
    menuContainer.style.zIndex = '9999';

    // تابع مدیریت اندازه صفحه
    function handleResponsive() {
        if (window.innerWidth >= 768) {
            // دسکتاپ - منوی اصلی نمایش داده شود
            if (document.querySelector('.desktop-menu')) {
                document.querySelector('.desktop-menu').style.display = 'block';
            }
            hamburgerBtn.style.display = 'none';
            menuContainer.style.display = 'none';
            menuContainer.classList.remove('open');
            body.classList.remove('menu-open');
        } else {
            // موبایل - منوی همبرگر نمایش داده شود
            if (document.querySelector('.desktop-menu')) {
                document.querySelector('.desktop-menu').style.display = 'none';
            }
            hamburgerBtn.style.display = 'flex';
            menuContainer.style.display = 'block';
        }
    }

    // اجرای اولیه
    handleResponsive();

    // گوش دادن به تغییر اندازه صفحه
    window.addEventListener('resize', handleResponsive);

    // کلیک روی دکمه همبرگر
    hamburgerBtn.addEventListener('click', function (e) {
        e.stopPropagation();

        console.log('دکمه همبرگر کلیک شد');

        if (menuContainer.classList.contains('open')) {
            // بستن منو
            menuContainer.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            body.classList.remove('menu-open');
        } else {
            // باز کردن منو
            menuContainer.classList.add('open');
            hamburgerBtn.classList.add('active');
            body.classList.add('menu-open');
        }
    });

    // بستن منو با کلیک روی لینک‌ها
    const menuLinks = menuContainer.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            console.log('لینک کلیک شد');
            menuContainer.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // بستن منو با کلیک خارج از آن
    document.addEventListener('click', function (e) {
        if (menuContainer.classList.contains('open') &&
            !menuContainer.contains(e.target) &&
            !hamburgerBtn.contains(e.target)) {
            menuContainer.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // بستن منو با کلید ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuContainer.classList.contains('open')) {
            menuContainer.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
});
// انیمیشن ورود از چپ برای بخش‌ها
window.addEventListener('load', function () {

    // بخش‌های اصلی
    const sections = ['#servis', '#help', '.about'];

    sections.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('slide-in-from-left');
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(element);
        }
    });

    // کارت‌های محصولات (از ردیف ۲ شروع کن - کارت‌های ۱۱ به بعد)
    const cards = document.querySelectorAll('.colcard:nth-child(n+11)');
    cards.forEach((card, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.8s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(card);
    });

    // کارت‌های ردیف اول (کارت‌های ۱ تا ۱۰) بدون انیمیشن رها کن
    const firstRowCards = document.querySelectorAll('.colcard:nth-child(-n+10)');
    firstRowCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
    });
});
// انیمیشن ورود از چپ فقط برای بخش‌های خاص
window.addEventListener('load', function () {

    // فقط این بخش‌ها انیمیشن داشته باشن
    const sections = ['#servis', '#help', '.about'];

    sections.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('slide-in-from-left');
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(element);
        }
    });

    // محصولات هیچ انیمیشنی ندارن - حذف کد مربوط به محصولات
});
// اضافه کردن رویداد کلیک به دکمه‌های "افزودن به سبد خرید"
document.addEventListener('DOMContentLoaded', function() {
    // اضافه کردن رویداد به دکمه‌های اصلی (10 محصول اول)
    const productButtons = document.querySelectorAll('.colcard button');
    productButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const card = this.closest('.colcard');
            const title = card.querySelector('h3').textContent;
            const priceText = card.querySelector('h4').textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ''));
            const image = card.querySelector('img').src;
            
            const product = {
                id: Date.now() + index, // شناسه منحصر به فرد
                title: title,
                price: price,
                image: image
            };
            
            addToCart(product);
        });
    });
    
    // اضافه کردن رویداد به دکمه‌های اسلایدر (اگر موجود باشد)
    const sliderButtons = document.querySelectorAll('.slide');
    sliderButtons.forEach((slide, index) => {
        // اگر نیاز است دکمه‌ای در اسلایدر هم باشد
        // این قسمت را بر اساس نیاز تنظیم کنید
    });
});
