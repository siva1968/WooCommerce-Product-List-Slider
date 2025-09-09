/**
 * WooCommerce Product List Slider - Ultra Debug Version
 * Maximum debugging and retry logic
 * @version 1.0.0
 */

(function() {
    'use strict';
    
    console.log('WCPLS: Ultra debug script loaded at', new Date().toLocaleTimeString());
    
    let retryCount = 0;
    const maxRetries = 50; // Try for 5 seconds (50 * 100ms)
    
    function debugEnvironment() {
        console.log('WCPLS: Environment check:');
        console.log('- Document ready state:', document.readyState);
        console.log('- Swiper available:', typeof Swiper);
        console.log('- jQuery available:', typeof jQuery);
        console.log('- Window Swiper:', typeof window.Swiper);
        
        // Check if Swiper scripts are in DOM
        const swiperScripts = document.querySelectorAll('script[src*="swiper"]');
        console.log('- Swiper scripts found:', swiperScripts.length);
        swiperScripts.forEach((script, i) => {
            console.log(`  Script ${i+1}:`, script.src, 'loaded:', script.readyState || 'unknown');
        });
        
        // Check for containers
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        console.log('- Slider containers found:', containers.length);
    }
    
    function initializeWhenReady() {
        retryCount++;
        
        console.log(`WCPLS: Attempt ${retryCount}/${maxRetries} - Checking Swiper availability...`);
        
        if (retryCount === 1 || retryCount % 10 === 0) {
            debugEnvironment();
        }
        
        // Check multiple ways Swiper might be available
        let SwiperClass = null;
        
        if (typeof Swiper !== 'undefined') {
            SwiperClass = Swiper;
            console.log('WCPLS: Found Swiper as global variable');
        } else if (typeof window.Swiper !== 'undefined') {
            SwiperClass = window.Swiper;
            console.log('WCPLS: Found Swiper as window.Swiper');
        } else if (window.Swiper) {
            SwiperClass = window.Swiper;
            console.log('WCPLS: Found Swiper via window object');
        }
        
        if (!SwiperClass) {
            if (retryCount >= maxRetries) {
                console.error('WCPLS: Swiper not found after', maxRetries, 'attempts. Giving up.');
                console.error('WCPLS: Check if Swiper.js is properly loaded in the page.');
                
                // Show error in UI
                showSwiperError();
                return;
            }
            
            console.log('WCPLS: Swiper not ready, retrying in 100ms... (attempt ' + retryCount + ')');
            setTimeout(initializeWhenReady, 100);
            return;
        }
        
        console.log('WCPLS: ✅ Swiper found! Initializing sliders...');
        initializeSliders(SwiperClass);
    }
    
    function showSwiperError() {
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        containers.forEach(function(container) {
            container.style.border = '3px solid #ff0000';
            container.style.boxShadow = '0 0 10px rgba(255,0,0,0.5)';
            
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255,0,0,0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-size: 14px;
                font-family: Arial, sans-serif;
                text-align: center;
                z-index: 1000;
                max-width: 250px;
            `;
            errorDiv.innerHTML = `
                <strong>Slider Error</strong><br>
                Swiper.js library not loaded<br>
                <small>Check browser console for details</small>
            `;
            container.style.position = 'relative';
            container.appendChild(errorDiv);
        });
    }
    
    function initializeSliders(SwiperClass) {
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        console.log('WCPLS: Found containers:', containers.length);
        
        if (containers.length === 0) {
            console.log('WCPLS: No slider containers found');
            return;
        }
        
        containers.forEach(function(container, index) {
            const swiperElement = container.querySelector('.swiper');
            
            if (!swiperElement) {
                console.error('WCPLS: No .swiper element found in container ' + index);
                return;
            }
            
            console.log('WCPLS: Initializing container ' + index);
            
            try {
                // Get settings with fallbacks
                let speed = 2500;
                let effect = 'fade';
                
                if (typeof wcplsSettings !== 'undefined') {
                    speed = wcplsSettings.speed || 2500;
                    effect = wcplsSettings.effect || 'fade';
                }
                
                console.log('WCPLS: Using speed:', speed, 'effect:', effect);
                
                const config = {
                    effect: 'fade', // Force fade for compatibility
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
                    on: {
                        init: function() {
                            console.log('WCPLS: ✅ Slider ' + index + ' initialized successfully!');
                            container.style.border = '3px solid #00ff00';
                            container.style.boxShadow = '0 0 10px rgba(0,255,0,0.5)';
                            
                            // Ensure proper slide stacking for fade effect
                            const slides = container.querySelectorAll('.swiper-slide');
                            slides.forEach(function(slide, i) {
                                slide.style.position = 'absolute';
                                slide.style.top = '0';
                                slide.style.left = '0';
                                slide.style.width = '100%';
                                slide.style.height = 'auto';
                                slide.style.opacity = i === 0 ? '1' : '0';
                                slide.style.zIndex = i === 0 ? '10' : '1';
                            });
                        },
                        slideChangeTransitionStart: function() {
                            console.log('WCPLS: Slide changing to:', this.activeIndex);
                        },
                        autoplayStart: function() {
                            console.log('WCPLS: Autoplay started for slider', index);
                        },
                        error: function(swiper, error) {
                            console.error('WCPLS: Swiper error:', error);
                        }
                    }
                };
                
                console.log('WCPLS: Creating Swiper with config:', config);
                const swiper = new SwiperClass(swiperElement, config);
                
                container._swiperInstance = swiper;
                
                // Add hover controls
                container.addEventListener('mouseenter', function() {
                    console.log('WCPLS: Mouse enter - pausing autoplay');
                    if (swiper.autoplay) swiper.autoplay.stop();
                });
                
                container.addEventListener('mouseleave', function() {
                    console.log('WCPLS: Mouse leave - resuming autoplay');
                    if (swiper.autoplay) swiper.autoplay.start();
                });
                
                console.log('WCPLS: Container ' + index + ' setup complete');
                
            } catch (error) {
                console.error('WCPLS: Failed to initialize slider for container ' + index + ':', error);
                container.style.border = '3px solid #ff0000';
                container.style.boxShadow = '0 0 10px rgba(255,0,0,0.5)';
            }
        });
    }
    
    // Start initialization
    console.log('WCPLS: Starting initialization process...');
    
    if (document.readyState === 'loading') {
        console.log('WCPLS: Waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('WCPLS: DOMContentLoaded fired');
            setTimeout(initializeWhenReady, 100); // Small delay to ensure scripts are loaded
        });
    } else {
        console.log('WCPLS: DOM already ready, starting immediately...');
        setTimeout(initializeWhenReady, 100); // Small delay
    }
    
})();
