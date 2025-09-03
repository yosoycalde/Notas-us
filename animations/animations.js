// Sistema de animaciones profesionales para Notas Us
class AnimationManager {
    constructor() {
        this.init();
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupParticleEffect();
    }

    init() {
        // Añadir clases CSS dinámicamente
        this.injectAnimationStyles();

        // Configurar animaciones de entrada
        this.setupPageLoadAnimations();

        // Configurar efectos de hover avanzados
        this.setupAdvancedHoverEffects();

        // Configurar animaciones de escritura
        this.setupTypingAnimations();

        // Configurar efectos de partículas en el header
        this.setupHeaderEffects();
    }

    injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animaciones de entrada */
            .fade-in {
                opacity: 0;
                transform: translateY(30px);
                animation: fadeInUp 0.8s ease forwards;
            }

            .slide-in-left {
                opacity: 0;
                transform: translateX(-50px);
                animation: slideInLeft 0.6s ease forwards;
            }

            .slide-in-right {
                opacity: 0;
                transform: translateX(50px);
                animation: slideInRight 0.6s ease forwards;
            }

            .scale-in {
                opacity: 0;
                transform: scale(0.8);
                animation: scaleIn 0.5s ease forwards;
            }

            .bounce-in {
                opacity: 0;
                transform: scale(0.3);
                animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            }

            /* Animaciones de salida */
            .fade-out {
                animation: fadeOut 0.3s ease forwards;
            }

            .slide-out-right {
                animation: slideOutRight 0.3s ease forwards;
            }

            /* Efectos de hover avanzados */
            .hover-lift {
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            .hover-lift:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }

            .hover-glow {
                transition: all 0.3s ease;
                position: relative;
            }

            .hover-glow:hover {
                box-shadow: 0 0 20px rgba(74, 144, 226, 0.4);
                text-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
            }

            .hover-pulse {
                animation: pulse 2s infinite;
            }

            /* Efectos de texto */
            .typewriter {
                overflow: hidden;
                border-right: 3px solid rgba(255, 255, 255, 0.75);
                white-space: nowrap;
                animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
            }

            .text-shimmer {
                background: linear-gradient(-45deg, #000 40%, #fff 50%, #000 60%);
                background-size: 200% 200%;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shimmer 2s ease-in-out infinite alternate;
            }

            /* Efectos de partículas */
            .particle {
                position: absolute;
                pointer-events: none;
                border-radius: 50%;
                animation: float 6s ease-in-out infinite;
                z-index: 1;
            }

            /* Loading animaciones */
            .loading-dots {
                display: inline-block;
            }

            .loading-dots::after {
                content: '';
                animation: loadingDots 1.5s infinite;
            }

            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton 1.5s ease-in-out infinite;
            }

            /* Efectos de scroll */
            .reveal-on-scroll {
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.8s ease;
            }

            .reveal-on-scroll.revealed {
                opacity: 1;
                transform: translateY(0);
            }

            /* Micro-interacciones */
            .button-ripple {
                position: relative;
                overflow: hidden;
            }

            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }

            /* Efectos especiales para el textarea */
            .enter {
                position: relative;
                overflow: hidden;
            }

            .enter::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(74, 144, 226, 0.1), transparent);
                transition: left 0.5s;
                pointer-events: none;
            }

            .enter:focus::after {
                left: 100%;
            }

            /* Efectos de notificación mejorados */
            .notification-message {
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
            }

            .notification-message::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                border-radius: inherit;
                z-index: -1;
                animation: borderGlow 2s linear infinite;
            }

            /* Keyframes */
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideInLeft {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideInRight {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes scaleIn {
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes bounceIn {
                0% {
                    opacity: 0;
                    transform: scale(0.3);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                70% {
                    transform: scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateY(-30px);
                }
            }

            @keyframes slideOutRight {
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            @keyframes typing {
                from {
                    width: 0;
                }
                to {
                    width: 100%;
                }
            }

            @keyframes blink-caret {
                from, to {
                    border-color: transparent;
                }
                50% {
                    border-color: rgba(255, 255, 255, 0.75);
                }
            }

            @keyframes shimmer {
                0% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }

            @keyframes float {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0.8;
                }
                50% {
                    transform: translateY(-20px) rotate(180deg);
                    opacity: 0.4;
                }
            }

            @keyframes loadingDots {
                0%, 80%, 100% {
                    content: '.';
                }
                20% {
                    content: '..';
                }
                40% {
                    content: '...';
                }
                60% {
                    content: '....';
                }
            }

            @keyframes skeleton {
                0% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }

            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            @keyframes borderGlow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Integración con estilos existentes */
            .note-card {
                will-change: transform, box-shadow;
                backface-visibility: hidden;
                perspective: 1000px;
            }

            .header {
                will-change: background-color, backdrop-filter;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .img-1 {
                will-change: transform;
                transform-style: preserve-3d;
            }

            /* Estados de focus mejorados */
            button:focus, .btn:focus {
                outline: 2px solid rgba(74, 144, 226, 0.5);
                outline-offset: 2px;
            }

            .enter:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
            }

            /* Mejoras para dispositivos móviles */
            @media (max-width: 768px) {
                .particle {
                    display: none;
                }
                
                .typewriter {
                    animation: none;
                    border-right: none;
                }
                
                .text-shimmer {
                    animation: none;
                    background: none;
                    -webkit-text-fill-color: initial;
                    color: rgb(0, 0, 0);
                }
            }

            /* Reducir movimiento para usuarios que lo prefieren */
            @media (prefers-reduced-motion: reduce) {
                *,
                *::before,
                *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupPageLoadAnimations() {
        // Animar header
        const header = document.querySelector('#main-header');
        if (header) {
            header.classList.add('slide-in-left');
        }

        // Animar título principal
        const title = document.querySelector('.notas-us');
        if (title) {
            setTimeout(() => title.classList.add('text-shimmer'), 500);
        }

        // Animar navegación
        const navItems = document.querySelectorAll('.list-1 li');
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in');
            }, 200 + (index * 100));
        });

        // Animar imagen principal
        const mainImage = document.querySelector('.img-1');
        if (mainImage) {
            setTimeout(() => {
                mainImage.classList.add('scale-in');
            }, 300);
        }

        // Animar sección de crear nota
        const createNote = document.querySelector('.create-note');
        if (createNote) {
            setTimeout(() => {
                createNote.classList.add('fade-in');
            }, 800);
        }
    }

    setupAdvancedHoverEffects() {
        // Aplicar efectos después de que el DOM esté listo
        setTimeout(() => {
            this.applyHoverEffectsToNotes();
        }, 100);

        // Observer para nuevas notas
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                this.applyHoverEffectsToNotes();
            }, 100);
        });

        const notesContainer = document.getElementById('my-notes');
        if (notesContainer) {
            observer.observe(notesContainer, { childList: true, subtree: true });
        }

        // Efectos para botones
        setTimeout(() => {
            const buttons = document.querySelectorAll('button, .btn');
            buttons.forEach(button => {
                button.classList.add('button-ripple', 'hover-lift');

                button.addEventListener('click', this.createRippleEffect.bind(this));
            });
        }, 100);

        // Efectos para links de navegación
        const navLinks = document.querySelectorAll('.list-1 a');
        navLinks.forEach(link => {
            link.classList.add('hover-glow');
        });
    }

    applyHoverEffectsToNotes() {
        const noteCards = document.querySelectorAll('.note-card');
        noteCards.forEach((card, index) => {
            // Evitar duplicar clases
            if (!card.classList.contains('hover-lift')) {
                card.classList.add('hover-lift');

                // Animación de entrada escalonada
                setTimeout(() => {
                    card.classList.add('bounce-in');
                }, index * 100);

                // Efecto hover personalizado
                card.addEventListener('mouseenter', () => {
                    this.addFloatingParticles(card);
                });
            }
        });

        // Efectos para botones de las notas
        const noteButtons = document.querySelectorAll('.btn-edit, .btn-delete');
        noteButtons.forEach(btn => {
            if (!btn.classList.contains('hover-pulse')) {
                btn.classList.add('hover-pulse');
            }
        });
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addFloatingParticles(element) {
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.width = Math.random() * 6 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 60%)`;
            particle.style.left = Math.random() * element.offsetWidth + 'px';
            particle.style.top = Math.random() * element.offsetHeight + 'px';

            element.style.position = 'relative';
            element.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 6000);
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observar elementos que deben aparecer al hacer scroll
        setTimeout(() => {
            const elementsToReveal = document.querySelectorAll('.create-note, #my-notes');
            elementsToReveal.forEach(el => {
                el.classList.add('reveal-on-scroll');
                observer.observe(el);
            });
        }, 100);
    }

    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // Parallax para la imagen principal
            const mainImage = document.querySelector('.img-1');
            if (mainImage) {
                mainImage.style.transform = `translateY(${rate}px)`;
            }

            // Efecto parallax en el header
            const header = document.querySelector('#main-header');
            if (header && scrolled > 100) {
                header.style.backgroundColor = 'rgba(245, 222, 179, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else if (header) {
                header.style.backgroundColor = 'bisque';
                header.style.backdropFilter = 'none';
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        });
    }

    setupTypingAnimations() {
        setTimeout(() => {
            const typewriterElements = document.querySelectorAll('.typewriter');

            typewriterElements.forEach(element => {
                const text = element.textContent;
                element.textContent = '';
                element.style.display = 'inline-block';

                let i = 0;
                const typeInterval = setInterval(() => {
                    element.textContent += text.charAt(i);
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeInterval);
                    }
                }, 100);
            });
        }, 1000);
    }

    setupHeaderEffects() {
        const header = document.querySelector('.header');
        if (!header) return;

        // Crear container para partículas de fondo
        const particleContainer = document.createElement('div');
        particleContainer.style.position = 'absolute';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.overflow = 'hidden';
        particleContainer.style.pointerEvents = 'none';
        particleContainer.style.zIndex = '-1';

        header.style.position = 'relative';
        header.appendChild(particleContainer);

        // Crear partículas flotantes
        this.createHeaderParticles(particleContainer);
    }

    createHeaderParticles(container) {
        const particleCount = 15;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            const duration = Math.random() * 10 + 10;
            particle.style.animation = `float ${duration}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 5 + 's';

            container.appendChild(particle);
        }
    }

    setupParticleEffect() {
        // Efecto de partículas al hacer clic en cualquier lugar
        document.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && !e.target.classList.contains('btn-edit') && !e.target.classList.contains('btn-delete')) {
                this.createClickParticles(e.clientX, e.clientY);
            }
        });
    }

    createClickParticles(x, y) {
        const particleCount = 6;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = '#4a90e2';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';

            const angle = (i / particleCount) * 2 * Math.PI;
            const velocity = 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            document.body.appendChild(particle);

            let opacity = 1;
            let posX = x;
            let posY = y;

            const animate = () => {
                opacity -= 0.02;
                posX += vx * 0.02;
                posY += vy * 0.02;

                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };

            animate();
        }
    }

    // Método para animar la aparición de nuevas notas
    animateNewNote(noteElement) {
        noteElement.classList.add('bounce-in');

        // Efecto especial para la nueva nota
        setTimeout(() => {
            noteElement.style.boxShadow = '0 0 30px rgba(74, 144, 226, 0.5)';
            setTimeout(() => {
                noteElement.style.boxShadow = '';
            }, 2000);
        }, 500);
    }

    // Método para animar la eliminación de notas
    animateNoteRemoval(noteElement, callback) {
        noteElement.classList.add('slide-out-right');
        setTimeout(() => {
            callback();
        }, 300);
    }

    // Método para loading states
    showLoadingAnimation(element) {
        element.classList.add('skeleton');
        element.innerHTML = '<span class="loading-dots">Cargando</span>';
    }

    hideLoadingAnimation(element, originalContent) {
        element.classList.remove('skeleton');
        element.innerHTML = originalContent;
    }
}

// Instanciar el sistema de animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Crear instancia de animaciones
    const animationManager = new AnimationManager();

    // Hacer disponible globalmente
    window.animationManager = animationManager;

    // Integración con el sistema de notas existente
    if (window.notesManager) {
        const originalDisplayNotes = window.notesManager.displayNotes;
        const originalDeleteNote = window.notesManager.deleteNote;

        // Añadir animaciones a displayNotes
        window.notesManager.displayNotes = function () {
            originalDisplayNotes.call(this);

            // Animar las notas después de mostrarlas
            setTimeout(() => {
                animationManager.applyHoverEffectsToNotes();
            }, 100);
        };

        // Añadir animación a deleteNote
        window.notesManager.deleteNote = function (id) {
            const noteElement = document.querySelector(`[data-id="${id}"]`);
            if (noteElement) {
                animationManager.animateNoteRemoval(noteElement, () => {
                    originalDeleteNote.call(this, id);
                });
            } else {
                originalDeleteNote.call(this, id);
            }
        };
    }
});