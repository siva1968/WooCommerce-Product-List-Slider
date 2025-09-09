/**
 * WooCommerce Product List Slider - Simplified No-Width Version
 * Uses fade effect to avoid width calculation issues
 * @version 1.0.0
 */

(function() {
    'use strict';
    
    console.log('WCPLS: Simplified script loaded');
    
    function initializeWhenReady() {
        console.log('WCPLS: Checking Swiper availability...');
        
        if (typeof Swiper === 'undefined') {
            console.log('WCPLS: Swiper not ready, retrying...');
            setTimeout(initializeWhenReady, 100);
            return;
        }
        
        console.log('WCPLS: Swiper ready, initializing...');
        initializeSliders();
    }
    
    function initializeSliders() {
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        console.log('WCPLS: Found containers:', containers.length);
        
        containers.forEach(function(container, index) {
            const swiperElement = container.querySelector('.swiper');
            
            if (!swiperElement) {
                console.error('WCPLS: No .swiper element found in container ' + index);
                return;
            }
            
            console.log('WCPLS: Initializing simplified slider for container ' + index);
            
            try {
                // Use fade effect to completely avoid width calculations
                const swiper = new Swiper(swiperElement, {
                    effect: 'fade', // Force fade effect
                    fadeEffect: {
                        crossFade: true
                    },
                    loop: true,
                    speed: 500,
                    autoplay: {
                        delay: 2500,
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
                            console.log('WCPLS: Simplified slider ' + index + ' initialized!');
                            container.style.border = '3px solid #00ff00';
                            container.style.boxShadow = '0 0 10px rgba(0,255,0,0.5)';
                            
                            // Ensure all slides are properly positioned
                            const slides = container.querySelectorAll('.swiper-slide');
                            slides.forEach(function(slide, i) {
                                slide.style.position = 'absolute';
                                slide.style.top = '0';
                                slide.style.left = '0';
                                slide.style.width = '100%';
                                slide.style.height = '100%';
                                slide.style.opacity = i === 0 ? '1' : '0';
                            });
                        },
                        slideChangeTransitionStart: function() {
                            console.log('WCPLS: Slide changing to:', this.activeIndex);
                        }
                    }
                });
                
                container._swiperInstance = swiper;
                
                // Add hover controls
                container.addEventListener('mouseenter', function() {
                    if (swiper.autoplay) swiper.autoplay.stop();
                });
                
                container.addEventListener('mouseleave', function() {
                    if (swiper.autoplay) swiper.autoplay.start();
                });
                
            } catch (error) {
                console.error('WCPLS: Error initializing simplified slider:', error);
                container.style.border = '3px solid #ff0000';
            }
        });
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWhenReady);
    } else {
        initializeWhenReady();
    }
    
})();
