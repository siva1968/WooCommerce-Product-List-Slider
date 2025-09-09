/**
 * WooCommerce Product List Slider - Production Version
 * Optimized fade slider with Swiper.js
 * @version 1.0.0
 */

(function() {
    'use strict';
    
    function forceFixOpacity(container) {
        const slides = container.querySelectorAll('.swiper-slide');
        const activeSlide = container.querySelector('.swiper-slide-active');
        
        // Hide all slides first
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.zIndex = '1';
        });
        
        // Show only the active slide
        if (activeSlide) {
            activeSlide.style.opacity = '1';
            activeSlide.style.zIndex = '10';
        }
    }
    
    function initializeWhenReady() {
        if (typeof Swiper === 'undefined') {
            setTimeout(initializeWhenReady, 100);
            return;
        }
        
        // Show first slides immediately before Swiper init
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        containers.forEach(function(container) {
            const firstSlide = container.querySelector('.swiper-slide:first-child');
            if (firstSlide) {
                firstSlide.style.opacity = '1';
                firstSlide.style.zIndex = '10';
            }
        });
        
        initializeSliders();
    }
    
    function initializeSliders() {
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        
        if (containers.length === 0) {
            return;
        }
        
        containers.forEach(function(container, index) {
            const swiperElement = container.querySelector('.swiper');
            
            if (!swiperElement) {
                return;
            }
            
            try {
                // Get settings with fallbacks
                let speed = 2500;
                let effect = 'fade';
                
                if (typeof wcplsSettings !== 'undefined') {
                    speed = wcplsSettings.speed || 2500;
                    effect = wcplsSettings.effect || 'fade';
                }
                
                const swiper = new Swiper(swiperElement, {
                    effect: 'fade',
                    fadeEffect: {
                        crossFade: true
                    },
                    loop: true,
                    speed: 500,
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
                    navigation: {
                        nextEl: container.querySelector('.swiper-button-next'),
                        prevEl: container.querySelector('.swiper-button-prev'),
                    },
                    on: {
                        init: function() {
                            // Fix fade effect opacity issues
                            this.update();
                            setTimeout(() => {
                                forceFixOpacity(container);
                            }, 100);
                        },
                        slideChange: function() {
                            // Fix opacity after each slide change
                            setTimeout(() => {
                                forceFixOpacity(container);
                            }, 50);
                        }
                    }
                });
                
                container._swiperInstance = swiper;
                
                // Continuous opacity monitoring for fade effect
                const opacityMonitor = setInterval(() => {
                    forceFixOpacity(container);
                }, 200);
                
                // Stop monitoring after 30 seconds
                setTimeout(() => {
                    clearInterval(opacityMonitor);
                }, 30000);
                
                // Add hover controls
                container.addEventListener('mouseenter', function() {
                    if (swiper.autoplay) swiper.autoplay.stop();
                });
                
                container.addEventListener('mouseleave', function() {
                    if (swiper.autoplay) swiper.autoplay.start();
                });
                
            } catch (error) {
                // Silent fail in production
                console.error('WCPLS: Slider initialization failed:', error);
            }
        });
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initializeWhenReady, 100);
        });
    } else {
        setTimeout(initializeWhenReady, 100);
    }
    
})();
