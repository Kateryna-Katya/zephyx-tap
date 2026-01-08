/**
 * ZEPHYX-TAP — Official Final Script 2026
 * Оптимизированный JS: валидация, индивидуальные триггеры, анимации.
 */

// Регистрация плагинов
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. МОБИЛЬНОЕ МЕНЮ
    const burger = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    const toggleMenu = (forceClose = false) => {
        if (!mobileMenu || !burger) return;
        const isOpen = forceClose ? false : !mobileMenu.classList.contains('active');
        
        mobileMenu.classList.toggle('active', isOpen);
        burger.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        
        const lines = burger.children;
        if (lines.length >= 3) {
            gsap.to(lines[0], { y: isOpen ? 8 : 0, rotate: isOpen ? 45 : 0, duration: 0.3 });
            gsap.to(lines[1], { opacity: isOpen ? 0 : 1, duration: 0.2 });
            gsap.to(lines[2], { y: isOpen ? -8 : 0, rotate: isOpen ? -45 : 0, duration: 0.3 });
        }
    };

    if (burger) burger.addEventListener('click', () => toggleMenu());
    mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(true)));

    // 3. АНИМАЦИЯ HERO (SplitType + Градиентный Фикс)
    const heroTitle = document.querySelector('#hero-title');
    if (heroTitle) {
        new SplitType(heroTitle, { types: 'words, chars', tagName: 'span' });
        const chars = heroTitle.querySelectorAll('.char:not(span .char)');
        const gradientSpan = heroTitle.querySelector('span');

        const heroTl = gsap.timeline({ delay: 0.5 });
        heroTl.from('.hero__tagline', { opacity: 0, x: -30, duration: 0.8 })
              .from(chars, { opacity: 0, y: 30, rotateX: -90, stagger: 0.02, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4")
              .from(gradientSpan, { opacity: 0, y: 20, duration: 0.8, clearProps: "all" }, "-=0.6")
              .from('.hero__description, .hero__btns, .hero__stats', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, "-=0.4");
    }

    // 4. ИНДИВИДУАЛЬНЫЕ СКРОЛЛ-ТРИГГЕРЫ (Исправление "только первых элементов")
    // Каждый элемент анимируется независимо при входе во вьюпорт
    const selectorsToAnimate = ['.platform__card', '.benefit-card', '.blog-card', '.innovation-item'];
    
    selectorsToAnimate.forEach(selector => {
        gsap.utils.toArray(selector).forEach((item) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    });

    // 5. ИНТЕРАКТИВ (GLOW & PARALLAX)
    const glow = document.getElementById('hero-glow');
    const heroVisual = document.querySelector('.hero__visual');
    const heroCard = document.querySelector('.hero__card');

    window.addEventListener('mousemove', (e) => {
        if (glow) {
            gsap.to(glow, { x: e.clientX - 300, y: e.clientY - 300, duration: 1 });
        }
        if (heroVisual && heroCard) {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(heroCard, { rotateY: x * 15, rotateX: -y * 15, duration: 0.6 });
        }
    });

    // 6. ИННОВАЦИИ: ПЕРЕКЛЮЧЕНИЕ СЦЕН
    const innovationItems = document.querySelectorAll('.innovation-item');
    innovationItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const sceneId = item.getAttribute('data-scene');
            
            document.querySelectorAll('.innovation-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
            
            item.classList.add('active');
            const targetScene = document.getElementById(`scene-${sceneId}`);
            if (targetScene) {
                targetScene.classList.add('active');
                gsap.fromTo(targetScene, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
            }
        });
    });

    // 7. ВАЛИДАЦИЯ ФОРМЫ (Телефон без букв + Капча)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        // ЗАПРЕТ БУКВ: Оставляем только цифры и знак +
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d+]/g, '');
        });
    }

    const contactForm = document.getElementById('main-form');
    if (contactForm) {
        const captchaLabel = document.getElementById('captcha-label');
        const captchaInput = document.getElementById('captcha-input');
        
        let n1 = Math.floor(Math.random() * 10) + 1;
        let n2 = Math.floor(Math.random() * 5) + 1;
        let correctSum = n1 + n2;
        if (captchaLabel) captchaLabel.textContent = `Решите пример: ${n1} + ${n2} = ?`;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMsg = document.getElementById('form-success');
            const errorMsg = document.getElementById('form-error');

            if (parseInt(captchaInput.value) !== correctSum) {
                errorMsg.style.display = 'flex';
                gsap.from(errorMsg, { x: 10, repeat: 3, yoyo: true, duration: 0.1 });
                return;
            }

            const btn = contactForm.querySelector('button');
            btn.disabled = true;
            btn.textContent = "Отправка...";

            setTimeout(() => {
                btn.style.display = 'none';
                successMsg.style.display = 'flex';
                contactForm.reset();
            }, 1500);
        });
    }

    // 8. COOKIE POPUP
    const cookiePopup = document.getElementById('cookie-popup');
    const acceptCookies = document.getElementById('accept-cookies');

    if (cookiePopup && !localStorage.getItem('zephyx_cookies')) {
        setTimeout(() => cookiePopup.classList.add('active'), 3000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('zephyx_cookies', 'true');
            cookiePopup.classList.remove('active');
        });
    }
});