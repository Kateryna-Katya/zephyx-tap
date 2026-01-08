// Регистрируем плагины
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. МОБИЛЬНОЕ МЕНЮ (forEach для ссылок)
    const burger = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('active');
        burger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        
        const b = burger.children;
        gsap.to(b[0], {y: isOpen ? 8 : 0, rotate: isOpen ? 45 : 0, duration: 0.3});
        gsap.to(b[1], {opacity: isOpen ? 0 : 1, duration: 0.2});
        gsap.to(b[2], {y: isOpen ? -8 : 0, rotate: isOpen ? -45 : 0, duration: 0.3});
    };

    if (burger) burger.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(mobileMenu.classList.contains('active')) toggleMenu();
        });
    });

    // 3. АНИМАЦИЯ HERO (с фиксом градиента)
    if (document.querySelector('#hero-title')) {
        new SplitType('#hero-title', { types: 'words, chars', tagName: 'span' });
        const chars = document.querySelectorAll('.hero__title .char');
        const gradientSpan = document.querySelector('.hero__title span');

        const heroTl = gsap.timeline({delay: 0.5});
        heroTl.from(chars, { opacity: 0, y: 30, rotateX: -90, stagger: 0.02, duration: 0.8, ease: "back.out(1.7)" })
              .from(gradientSpan, { opacity: 0, y: 20, duration: 0.8, clearProps: "all" }, "-=0.4")
              .from('.hero__tagline', { opacity: 0, x: -20 }, 0)
              .from('.hero__description, .hero__btns, .hero__stats', { opacity: 0, y: 20, stagger: 0.1 }, "-=0.2");
    }

    // 4. СКРОЛЛ-АНИМАЦИИ (Групповой перебор через forEach)
    const scrollAnims = [
        { selector: '.platform__card', trigger: '.platform__grid', start: '80%' },
        { selector: '.benefit-card', trigger: '.benefits__grid', start: '75%' },
        { selector: '.blog-card', trigger: '.blog__grid', start: '80%' }
    ];

    scrollAnims.forEach(anim => {
        gsap.from(anim.selector, {
            scrollTrigger: { trigger: anim.trigger, start: `top ${anim.start}` },
            opacity: 0, y: 40, stagger: 0.15, duration: 0.8, ease: "power2.out"
        });
    });

    // 5. ИННОВАЦИИ: Смена сцен (forEach)
    const innovationItems = document.querySelectorAll('.innovation-item');
    const scenes = document.querySelectorAll('.scene');

    innovationItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const sceneId = item.getAttribute('data-scene');
            
            innovationItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            scenes.forEach(s => {
                s.classList.remove('active');
                if(s.id === `scene-${sceneId}`) s.classList.add('active');
            });
            
            gsap.fromTo(`#scene-${sceneId}`, {scale: 0.95, opacity: 0}, {scale: 1, opacity: 1, duration: 0.4});
        });
    });

    // 6. ФОРМА КОНТАКТОВ: Валидация и Капча
    const form = document.getElementById('main-form');
    const phoneInput = document.getElementById('phone');
    const captchaLabel = document.getElementById('captcha-label');
    const captchaInput = document.getElementById('captcha-input');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    // Генерация капчи
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 5) + 1;
    let correctSum = num1 + num2;
    if(captchaLabel) captchaLabel.textContent = `Решите пример: ${num1} + ${num2} = ?`;

    // Валидация телефона (только цифры)
    if(phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
        });
    }

    // Обработка отправки
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            if(parseInt(captchaInput.value) !== correctSum) {
                errorMsg.style.display = 'flex';
                return;
            }

            const btn = form.querySelector('button');
            btn.disabled = true;
            btn.textContent = "Отправка...";

            setTimeout(() => {
                btn.style.display = 'none';
                successMsg.style.display = 'flex';
                form.reset();
            }, 1500);
        });
    }
});