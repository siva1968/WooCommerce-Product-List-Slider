/**
 * WooCommerce Product List Slider - Simple Diagnostic Version
 * Debug and fix Swiper initialization issues
 * @version 1.0.0
 */

console.log('🔍 WCPLS: Diagnostic script starting...');

(function() {
    'use strict';
    
    function diagnosticCheck() {
        console.log('🔍 WCPLS: Running diagnostic check...');
        
        // Check environment
        console.log('📊 Environment Check:');
        console.log('  - Document ready:', document.readyState);
        console.log('  - Swiper available:', typeof Swiper !== 'undefined' ? '✅' : '❌');
        console.log('  - jQuery available:', typeof jQuery !== 'undefined' ? '✅' : '❌');
        console.log('  - Settings available:', typeof wcplsSettings !== 'undefined' ? '✅' : '❌');
        
        // Check for Swiper scripts
        const swiperScripts = document.querySelectorAll('script[src*="swiper"]');
        console.log('  - Swiper scripts found:', swiperScripts.length);
        swiperScripts.forEach((script, i) => {
            console.log(`    Script ${i+1}: ${script.src}`);
        });
        
        // Check for containers
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        console.log('  - Slider containers found:', containers.length);
        
        if (containers.length > 0) {
            containers.forEach((container, i) => {
                console.log(`  - Container ${i+1}: Product ID ${container.dataset.productId}`);
                const slides = container.querySelectorAll('.swiper-slide');
                console.log(`    Slides: ${slides.length}`);
            });
        }
        
        return containers.length > 0;
    }
    
    function initializeSimpleSlider() {
        console.log('🎯 WCPLS: Attempting to initialize sliders...');
        
        if (typeof Swiper === 'undefined') {
            console.error('❌ WCPLS: Swiper not available, cannot initialize');
            initializeCSSOnlySlider();
            return;
        }
        
        console.log('✅ WCPLS: Swiper found, initializing...');
        
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        
        containers.forEach((container, index) => {
            const swiperElement = container.querySelector('.swiper');
            
            if (!swiperElement) {
                console.error(`❌ Container ${index}: No .swiper element found`);
                return;
            }
            
            try {
                console.log(`🔄 Initializing container ${index}...`);
                
                const swiper = new Swiper(swiperElement, {
                    effect: 'slide', // Use slide instead of fade
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: true,
                    speed: 500,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },
                    pagination: {
                        el: container.querySelector('.swiper-pagination'),
                        clickable: true,
                        dynamicBullets: true
                    },
                    on: {
                        init: function() {
                            console.log(`✅ Container ${index}: Swiper initialized successfully`);
                            container.style.border = '2px solid #00aa00';
                        },
                        slideChange: function() {
                            console.log(`🔄 Container ${index}: Slide changed to ${this.activeIndex}`);
                        }
                    }
                });
                
                // Store reference
                container._swiperInstance = swiper;
                
                // Add hover controls
                container.addEventListener('mouseenter', () => {
                    if (swiper.autoplay) swiper.autoplay.stop();
                });
                
                container.addEventListener('mouseleave', () => {
                    if (swiper.autoplay) swiper.autoplay.start();
                });
                
            } catch (error) {
                console.error(`❌ Container ${index}: Failed to initialize -`, error);
                container.style.border = '2px solid #ff0000';
            }
        });
    }
    
    function initializeCSSOnlySlider() {
        console.log('🎨 WCPLS: Using CSS-only fallback slider...');
        
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        
        containers.forEach((container, index) => {
            const slides = container.querySelectorAll('.swiper-slide');
            
            if (slides.length <= 1) {
                console.log(`Container ${index}: Only ${slides.length} slide(s), skipping`);
                return;
            }
            
            console.log(`🎨 Setting up CSS slider for container ${index} with ${slides.length} slides`);
            
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            container.style.border = '2px solid #0073aa';
            
            let currentSlide = 0;
            
            // Style slides
            slides.forEach((slide, i) => {
                slide.style.position = 'absolute';
                slide.style.top = '0';
                slide.style.left = '0';
                slide.style.width = '100%';
                slide.style.opacity = i === 0 ? '1' : '0';
                slide.style.transition = 'opacity 0.5s ease';
                slide.style.zIndex = i === 0 ? '10' : '1';
            });
            
            // Auto-advance slides
            const autoSlide = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                
                slides.forEach((slide, i) => {
                    slide.style.opacity = i === currentSlide ? '1' : '0';
                    slide.style.zIndex = i === currentSlide ? '10' : '1';
                });
                
                console.log(`🎨 Container ${index}: Advanced to slide ${currentSlide}`);
            }, 3000);
            
            // Store cleanup function
            container._cssSliderCleanup = () => clearInterval(autoSlide);
            
            console.log(`✅ Container ${index}: CSS slider initialized`);
        });
    }
    
    function startInitialization() {
        console.log('🚀 WCPLS: Starting initialization process...');
        
        // Run diagnostic first
        const hasContainers = diagnosticCheck();
        
        if (!hasContainers) {
            console.log('ℹ️ WCPLS: No slider containers found, exiting');
            return;
        }
        
        // Try Swiper initialization
        let attempts = 0;
        const maxAttempts = 20;
        
        function tryInitialize() {
            attempts++;
            console.log(`🔄 WCPLS: Initialization attempt ${attempts}/${maxAttempts}`);
            
            if (typeof Swiper !== 'undefined') {
                console.log('✅ WCPLS: Swiper ready!');
                initializeSimpleSlider();
                return;
            }
            
            if (attempts >= maxAttempts) {
                console.log('⚠️ WCPLS: Swiper not found after max attempts, using CSS fallback');
                initializeCSSOnlySlider();
                return;
            }
            
            setTimeout(tryInitialize, 200);
        }
        
        tryInitialize();
    }
    
    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startInitialization);
    } else {
        startInitialization();
    }
    
})();

console.log('🔍 WCPLS: Diagnostic script loaded and ready');
