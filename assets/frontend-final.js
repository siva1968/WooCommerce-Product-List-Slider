/**
 * WooCommerce Product List Slider - Final Production Version
 * Combines Swiper with CSS fallback for maximum reliability
 * @version 1.0.0
 */

(function() {
    'use strict';
    
    console.log('WCPLS: Production slider initializing...');
    
    function initializeSliders() {
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        
        if (containers.length === 0) {
            console.log('WCPLS: No slider containers found');
            return;
        }
        
        console.log(`WCPLS: Found ${containers.length} containers`);
        
        // Check if Swiper is available
        if (typeof Swiper !== 'undefined') {
            console.log('WCPLS: Using Swiper implementation');
            initializeSwiperSliders(containers);
        } else {
            console.log('WCPLS: Using CSS fallback implementation');
            initializeCSSSliders(containers);
        }
    }
    
    function initializeSwiperSliders(containers) {
        containers.forEach((container, index) => {
            const swiperElement = container.querySelector('.swiper');
            
            if (!swiperElement) return;
            
            // Force container dimensions before Swiper init
            container.style.width = '100%';
            container.style.maxWidth = '100%';
            swiperElement.style.width = '100%';
            
            // Reset any problematic inline styles
            const wrapper = swiperElement.querySelector('.swiper-wrapper');
            const slides = swiperElement.querySelectorAll('.swiper-slide');
            
            if (wrapper) {
                wrapper.style.transform = '';
                wrapper.style.width = '100%';
            }
            
            slides.forEach(slide => {
                slide.style.width = '100%';
                slide.style.minWidth = '100%';
                slide.style.maxWidth = '100%';
            });
            
            try {
                // Get settings
                let speed = 3000;
                if (typeof wcplsSettings !== 'undefined') {
                    speed = wcplsSettings.speed || 3000;
                }
                
                const swiper = new Swiper(swiperElement, {
                    effect: 'slide',
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: true,
                    speed: 500,
                    centeredSlides: true,
                    autoplay: {
                        delay: speed,
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
                            console.log(`WCPLS: Swiper ${index} initialized`);
                            // Force correct dimensions after init
                            this.slides.forEach(slide => {
                                slide.style.width = '100%';
                                slide.style.minWidth = '100%';
                                slide.style.maxWidth = '100%';
                            });
                            this.update();
                        },
                        slideChange: function() {
                            // Continuously fix any dimension issues
                            this.slides.forEach(slide => {
                                slide.style.width = '100%';
                            });
                        }
                    }
                });
                
                container._swiperInstance = swiper;
                
                // Hover controls
                container.addEventListener('mouseenter', () => {
                    if (swiper.autoplay) swiper.autoplay.stop();
                });
                
                container.addEventListener('mouseleave', () => {
                    if (swiper.autoplay) swiper.autoplay.start();
                });
                
            } catch (error) {
                console.error(`WCPLS: Swiper ${index} failed:`, error);
                // Fallback to CSS for this container
                initializeSingleCSSSlider(container, index);
            }
        });
    }
    
    function initializeCSSSliders(containers) {
        containers.forEach((container, index) => {
            initializeSingleCSSSlider(container, index);
        });
    }
    
    function initializeSingleCSSSlider(container, index) {
        const slides = container.querySelectorAll('.swiper-slide');
        
        if (slides.length <= 1) return;
        
        console.log(`WCPLS: CSS slider ${index} with ${slides.length} slides`);
        
        // Style container
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        
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
        
        // Auto-advance
        let isPaused = false;
        const interval = setInterval(() => {
            if (isPaused) return;
            
            currentSlide = (currentSlide + 1) % slides.length;
            
            slides.forEach((slide, i) => {
                slide.style.opacity = i === currentSlide ? '1' : '0';
                slide.style.zIndex = i === currentSlide ? '10' : '1';
            });
        }, 3000);
        
        // Hover controls
        container.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        container.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // Cleanup
        container._cssSliderCleanup = () => clearInterval(interval);
    }
    
    // Continuous dimension monitoring
    function monitorDimensions() {
        setInterval(() => {
            const containers = document.querySelectorAll('.wc-product-list-slider-container');
            
            containers.forEach(container => {
                const slides = container.querySelectorAll('.swiper-slide');
                const wrapper = container.querySelector('.swiper-wrapper');
                
                let needsFixing = false;
                
                // Check for problematic widths
                slides.forEach(slide => {
                    const style = slide.getAttribute('style') || '';
                    if (style.includes('768000') || style.includes('e+')) {
                        needsFixing = true;
                        slide.style.width = '100%';
                        slide.style.minWidth = '100%';
                        slide.style.maxWidth = '100%';
                    }
                });
                
                // Check wrapper transform
                if (wrapper) {
                    const style = wrapper.getAttribute('style') || '';
                    if (style.includes('e+') || style.includes('3.84e+')) {
                        needsFixing = true;
                        wrapper.style.transform = 'translate3d(0px, 0px, 0px)';
                    }
                }
                
                if (needsFixing) {
                    console.log('WCPLS: Fixed dimension issues detected');
                }
            });
        }, 1000);
    }

    // Initialize when ready
    function start() {
        // Wait a bit for Swiper to load
        setTimeout(() => {
            initializeSliders();
            monitorDimensions(); // Start monitoring
        }, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
    
})();
