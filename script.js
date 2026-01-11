(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = Array.from(document.querySelectorAll('.nav__link'));

        if (!navToggle || !navMenu) return;

        const openMenu = () => {
            navMenu.classList.add('show-menu');
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Fermer le menu');
        };

        const closeMenu = () => {
            navMenu.classList.remove('show-menu');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Ouvrir le menu');
        };

        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('show-menu')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => closeMenu());
        });

        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const clickedInsideNav = Boolean(target.closest('.nav'));
            if (!clickedInsideNav) closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });

        const header = document.getElementById('header');
        const sections = Array.from(document.querySelectorAll('section[id]'));

        const updateActiveLink = () => {
            const scrollY = window.scrollY;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 120;
                const sectionBottom = sectionTop + section.offsetHeight;
                const id = section.getAttribute('id');

                const link = navLinks.find((a) => a.getAttribute('href') === `#${id}`);
                if (!link) return;

                const isActive = scrollY >= sectionTop && scrollY < sectionBottom;
                link.classList.toggle('nav__link--active', isActive);
            });

            if (header) header.classList.toggle('header--scrolled', scrollY > 18);
        };

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    function initReveal() {
        const elements = Array.from(document.querySelectorAll('.reveal'));
        if (!elements.length) return;

        if (prefersReducedMotion) {
            elements.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                });
            },
            {
                threshold: 0.16,
                rootMargin: '0px 0px -10% 0px'
            }
        );

        elements.forEach((el) => observer.observe(el));
    }

    function initTiltCards() {
        if (prefersReducedMotion) return;

        const cards = Array.from(document.querySelectorAll('[data-tilt]'));

        cards.forEach((el) => {
            let raf = 0;
            let isPointerDown = false;

            const apply = (rx, ry) => {
                el.style.setProperty('--rx', `${rx}deg`);
                el.style.setProperty('--ry', `${ry}deg`);
                el.classList.add('is-tilting');
            };

            const reset = () => {
                el.classList.remove('is-tilting');
                el.style.removeProperty('--rx');
                el.style.removeProperty('--ry');
            };

            const onMove = (event) => {
                const rect = el.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const ry = (x - 0.5) * 10;
                const rx = (0.5 - y) * 10;

                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    apply(rx, ry);
                    raf = 0;
                });
            };

            el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));
            el.addEventListener('pointerleave', () => {
                isPointerDown = false;
                if (raf) cancelAnimationFrame(raf);
                reset();
            });

            el.addEventListener('pointermove', (event) => {
                if (event.pointerType === 'touch' && !isPointerDown) return;
                onMove(event);
            });

            el.addEventListener('pointerdown', (event) => {
                isPointerDown = true;
                el.setPointerCapture(event.pointerId);
                onMove(event);
            });

            el.addEventListener('pointerup', () => {
                isPointerDown = false;
                reset();
            });
        });
    }

    function initBeforeAfter() {
        const components = Array.from(document.querySelectorAll('[data-ba]'));

        components.forEach((component) => {
            const stage = component.querySelector('[data-ba-stage]');
            const range = component.querySelector('[data-ba-range]');

            if (!(stage instanceof HTMLElement) || !(range instanceof HTMLInputElement)) return;

            const setPos = (value) => {
                const v = clamp(value, 0, 100);
                stage.style.setProperty('--pos', `${v}%`);
                range.value = String(v);
            };

            setPos(Number(range.value || 50));

            range.addEventListener('input', () => setPos(Number(range.value)));

            if (prefersReducedMotion) return;

            let dragging = false;

            const updateFromPointer = (event) => {
                const rect = stage.getBoundingClientRect();
                const percent = ((event.clientX - rect.left) / rect.width) * 100;
                setPos(percent);
            };

            stage.addEventListener('pointerdown', (event) => {
                dragging = true;
                stage.setPointerCapture(event.pointerId);
                updateFromPointer(event);
            });

            stage.addEventListener('pointermove', (event) => {
                if (!dragging) return;
                updateFromPointer(event);
            });

            stage.addEventListener('pointerup', () => {
                dragging = false;
            });

            stage.addEventListener('pointercancel', () => {
                dragging = false;
            });
        });
    }

    function initGallerySlider() {
        const slidesEl = document.getElementById('gallery-slides');
        if (!slidesEl) return null;

        const slides = Array.from(slidesEl.querySelectorAll('.gallery__slide'));
        const prevBtn = document.querySelector('[data-gallery-prev]');
        const nextBtn = document.querySelector('[data-gallery-next]');
        const dots = Array.from(document.querySelectorAll('[data-gallery-dot]'));

        if (!slides.length) return null;

        let index = Math.max(
            0,
            slides.findIndex((s) => s.classList.contains('is-active'))
        );

        const emitChange = () => {
            const active = slides[index];
            const accent = active?.dataset?.accent || '#D4A574';

            window.dispatchEvent(
                new CustomEvent('gallery:change', {
                    detail: {
                        index,
                        accent
                    }
                })
            );
        };

        const setActive = (nextIndex) => {
            index = (nextIndex + slides.length) % slides.length;

            slides.forEach((s, i) => {
                s.classList.toggle('is-active', i === index);
            });

            dots.forEach((dot) => {
                const i = Number(dot.getAttribute('data-gallery-dot'));
                const isActive = i === index;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            emitChange();
        };

        prevBtn?.addEventListener('click', () => setActive(index - 1));
        nextBtn?.addEventListener('click', () => setActive(index + 1));

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const i = Number(dot.getAttribute('data-gallery-dot'));
                if (!Number.isNaN(i)) setActive(i);
            });
        });

        if (!prefersReducedMotion) {
            let startX = 0;
            let startY = 0;
            let tracking = false;

            slidesEl.addEventListener('pointerdown', (event) => {
                const target = event.target;
                if (target instanceof Element) {
                    const inBeforeAfter = Boolean(target.closest('[data-ba]'));
                    const inCanvas = target.tagName.toLowerCase() === 'canvas' || Boolean(target.closest('canvas'));
                    const inFormControl = Boolean(target.closest('input, select, textarea, button'));

                    if (inBeforeAfter || inCanvas || inFormControl) return;
                }

                tracking = true;
                startX = event.clientX;
                startY = event.clientY;
            });

            slidesEl.addEventListener('pointerup', (event) => {
                if (!tracking) return;
                tracking = false;

                const dx = event.clientX - startX;
                const dy = event.clientY - startY;

                if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;

                if (dx > 0) setActive(index - 1);
                else setActive(index + 1);
            });

            slidesEl.addEventListener('pointercancel', () => {
                tracking = false;
            });
        }

        emitChange();

        return {
            getAccent: () => slides[index]?.dataset?.accent || '#D4A574'
        };
    }

    function initForm() {
        const form = document.querySelector('.form');
        if (!(form instanceof HTMLFormElement)) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const button = form.querySelector('.form__button');
            if (!(button instanceof HTMLButtonElement)) return;

            const original = button.textContent;
            button.textContent = 'Envoi en cours…';
            button.disabled = true;

            window.setTimeout(() => {
                button.textContent = 'Demande envoyée !';

                window.setTimeout(() => {
                    button.textContent = original || 'Envoyer la demande';
                    button.disabled = false;
                    form.reset();
                }, 1600);
            }, 1100);
        });
    }

    function initThreeBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!(canvas instanceof HTMLCanvasElement)) return null;

        const THREE = window.THREE;
        if (!THREE || prefersReducedMotion) return null;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: window.devicePixelRatio <= 1.5,
            powerPreference: 'high-performance'
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight, false);

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 10, 22);

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 60);
        camera.position.set(0, 0.6, 9);

        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);

        const key = new THREE.DirectionalLight(0xffffff, 1.1);
        key.position.set(4, 6, 6);
        scene.add(key);

        const fill = new THREE.PointLight(0xffe6d3, 0.9, 40);
        fill.position.set(-5, -2, 10);
        scene.add(fill);

        const group = new THREE.Group();
        scene.add(group);

        const matGold = new THREE.MeshPhysicalMaterial({
            color: 0xD4A574,
            metalness: 0.85,
            roughness: 0.22,
            clearcoat: 1,
            clearcoatRoughness: 0.2
        });

        const matRose = new THREE.MeshPhysicalMaterial({
            color: 0xE8B4A8,
            metalness: 0.75,
            roughness: 0.28,
            clearcoat: 1,
            clearcoatRoughness: 0.2
        });

        const matBurgundy = new THREE.MeshPhysicalMaterial({
            color: 0x8B4C5C,
            metalness: 0.55,
            roughness: 0.32,
            clearcoat: 1,
            clearcoatRoughness: 0.25
        });

        const objects = [
            new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.28, 90, 12), matGold),
            new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 0), matRose),
            new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 0), matBurgundy)
        ];

        objects[0].position.set(-2.2, 0.6, -1);
        objects[1].position.set(2.25, -0.35, -1.2);
        objects[2].position.set(0.4, 1.55, -2);

        objects.forEach((obj) => group.add(obj));

        const pointsCount = 420;
        const positions = new Float32Array(pointsCount * 3);
        for (let i = 0; i < pointsCount; i += 1) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 18;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = -Math.random() * 18;
        }

        const particlesGeo = new THREE.BufferGeometry();
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMat = new THREE.PointsMaterial({
            size: 0.03,
            color: 0xD4A574,
            transparent: true,
            opacity: 0.5
        });

        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        let pointerX = 0;
        let pointerY = 0;
        let scrollY = window.scrollY;

        window.addEventListener(
            'pointermove',
            (event) => {
                pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
                pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
            },
            { passive: true }
        );

        window.addEventListener(
            'scroll',
            () => {
                scrollY = window.scrollY;
            },
            { passive: true }
        );

        const onResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', onResize, { passive: true });

        return {
            render: (time) => {
                const t = time * 0.0005;

                group.rotation.y = t * 0.6;
                group.rotation.x = Math.sin(t) * 0.08;

                objects[0].rotation.x += 0.004;
                objects[1].rotation.y += 0.003;
                objects[2].rotation.z += 0.0035;

                const scrollFactor = clamp(scrollY / 1400, 0, 1);

                camera.position.x = pointerX * 0.65;
                camera.position.y = 0.65 + -pointerY * 0.35 + scrollFactor * 0.35;
                camera.lookAt(0, 0.2, -2);

                renderer.render(scene, camera);
            },
            dispose: () => {
                renderer.dispose();
            }
        };
    }

    function initThreeGallery(getAccent) {
        const canvas = document.getElementById('gallery-canvas');
        if (!(canvas instanceof HTMLCanvasElement)) return null;

        const THREE = window.THREE;
        if (!THREE || prefersReducedMotion) return null;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: window.devicePixelRatio <= 1.5,
            powerPreference: 'high-performance'
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
        camera.position.set(0, 0.4, 6);

        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambient);

        const spot = new THREE.SpotLight(0xffffff, 1.2, 25, Math.PI / 5, 0.6, 1);
        spot.position.set(2.5, 5, 5);
        scene.add(spot);

        const rim = new THREE.PointLight(0xffe6d3, 0.9, 18);
        rim.position.set(-4, 1.5, 6);
        scene.add(rim);

        const group = new THREE.Group();
        scene.add(group);

        const material = new THREE.MeshPhysicalMaterial({
            color: 0xD4A574,
            metalness: 0.78,
            roughness: 0.22,
            clearcoat: 1,
            clearcoatRoughness: 0.18
        });

        const capMaterial = new THREE.MeshStandardMaterial({
            color: 0x2C2C2C,
            metalness: 0.5,
            roughness: 0.35
        });

        const profile = [
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.7, 0.0),
            new THREE.Vector2(0.78, 0.45),
            new THREE.Vector2(0.6, 1.15),
            new THREE.Vector2(0.55, 1.55),
            new THREE.Vector2(0.62, 2.1),
            new THREE.Vector2(0.42, 2.45),
            new THREE.Vector2(0.38, 2.75),
            new THREE.Vector2(0.45, 2.95),
            new THREE.Vector2(0.0, 2.95)
        ];

        const bottleGeo = new THREE.LatheGeometry(profile, 48);
        const bottle = new THREE.Mesh(bottleGeo, material);
        bottle.position.y = -1.15;
        group.add(bottle);

        const capGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.55, 32);
        const cap = new THREE.Mesh(capGeo, capMaterial);
        cap.position.y = 2.05;
        group.add(cap);

        const ringGeo = new THREE.TorusGeometry(0.85, 0.08, 18, 64);
        const ring = new THREE.Mesh(
            ringGeo,
            new THREE.MeshStandardMaterial({
                color: 0xE8B4A8,
                metalness: 0.8,
                roughness: 0.2
            })
        );
        ring.position.set(0, 0.25, -0.4);
        ring.rotation.x = Math.PI / 2.2;
        group.add(ring);

        const planeGeo = new THREE.CircleGeometry(2.1, 48);
        const plane = new THREE.Mesh(
            planeGeo,
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.18,
                metalness: 0.0,
                roughness: 0.95
            })
        );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -2.15;
        group.add(plane);

        let width = 0;
        let height = 0;

        const frame = canvas.parentElement;

        const resize = () => {
            const rect = frame?.getBoundingClientRect();
            if (!rect) return;

            width = Math.max(1, Math.floor(rect.width));
            height = Math.max(1, Math.floor(rect.height));

            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        resize();

        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
        if (frame && ro) ro.observe(frame);

        window.addEventListener('resize', resize, { passive: true });

        const setAccent = (hex) => {
            const color = new THREE.Color(hex);
            material.color.copy(color);
        };

        setAccent(getAccent?.() || '#D4A574');

        window.addEventListener('gallery:change', (event) => {
            const detail = event?.detail;
            if (!detail?.accent) return;
            setAccent(detail.accent);
        });

        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        canvas.addEventListener('pointerdown', (event) => {
            isDragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
            canvas.setPointerCapture(event.pointerId);
        });

        canvas.addEventListener('pointermove', (event) => {
            if (!isDragging) return;
            const dx = event.clientX - lastX;
            const dy = event.clientY - lastY;
            lastX = event.clientX;
            lastY = event.clientY;

            group.rotation.y += dx * 0.006;
            group.rotation.x += dy * 0.004;
            group.rotation.x = clamp(group.rotation.x, -0.6, 0.6);
        });

        canvas.addEventListener('pointerup', () => {
            isDragging = false;
        });

        canvas.addEventListener('pointercancel', () => {
            isDragging = false;
        });

        let active = true;
        const section = document.getElementById('galerie');
        if (section) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        active = entry.isIntersecting;
                    });
                },
                { threshold: 0.2 }
            );
            observer.observe(section);
        }

        return {
            render: (time) => {
                if (!active) return;

                const t = time * 0.0007;
                if (!isDragging) {
                    group.rotation.y += 0.005;
                    group.rotation.x = Math.sin(t) * 0.08;
                }

                ring.rotation.z += 0.006;

                camera.lookAt(0, 0.2, 0);
                renderer.render(scene, camera);
            },
            dispose: () => {
                if (ro) ro.disconnect();
                window.removeEventListener('resize', resize);
                renderer.dispose();
            }
        };
    }

    function initAnimationLoop(renderers) {
        if (prefersReducedMotion) return;

        let running = true;

        const loop = (time) => {
            if (!running) return;

            renderers.forEach((r) => r?.render?.(time));
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                running = false;
            } else {
                running = true;
                requestAnimationFrame(loop);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initNavigation();
        initReveal();
        initTiltCards();
        initBeforeAfter();
        const galleryApi = initGallerySlider();
        initForm();

        const bg = initThreeBackground();
        const gallery = initThreeGallery(galleryApi?.getAccent);

        initAnimationLoop([bg, gallery]);
    });
})();
