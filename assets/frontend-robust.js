/**
 * WooCommerce Product List Slider - Robust Debug Version
 * @version 1.0.0
 */

(function() {
    'use strict';
    
    console.log('WCPLS: Script loaded');
    
    // Function to check if Swiper is available and initialize
    function initializeWhenReady() {
        console.log('WCPLS: Checking Swiper availability...');
        console.log('WCPLS: Swiper available:', typeof Swiper);
        console.log('WCPLS: Settings available:', typeof wcplsSettings);
        
        if (typeof Swiper === 'undefined') {
            console.log('WCPLS: Swiper not ready, retrying in 100ms...');
            setTimeout(initializeWhenReady, 100);
            return;
        }
        
        console.log('WCPLS: Swiper is ready! Initializing sliders...');
        initializeSliders();
    }
    
    // Initialize all sliders
    function initializeSliders() {
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
                // Get settings
                const speed = (typeof wcplsSettings !== 'undefined' && wcplsSettings.speed) ? wcplsSettings.speed : 2500;
                const effect = (typeof wcplsSettings !== 'undefined' && wcplsSettings.effect) ? wcplsSettings.effect : 'slide';
                
                console.log('WCPLS: Using speed:', speed, 'effect:', effect);
                
                const swiper = new Swiper(swiperElement, {
                    // Basic settings
                    loop: true,
                    effect: effect,
                    slidesPerView: 1,
                    spaceBetween: 0,
                    speed: 300,
                    
                    // Autoplay
                    autoplay: {
                        delay: speed,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },
                    
                    // Pagination
                    pagination: {
                        el: container.querySelector('.swiper-pagination'),
                        clickable: true,
                        dynamicBullets: true
                    },
                    
                    // Navigation (optional)
                    navigation: {
                        nextEl: container.querySelector('.swiper-button-next'),
                        prevEl: container.querySelector('.swiper-button-prev'),
                    },
                    
                    // Events
                    on: {
                        init: function() {
                            console.log('WCPLS: Swiper ' + index + ' initialized successfully!');
                            container.classList.remove('loading');
                            container.style.border = '3px solid #00ff00'; // Bright green = success
                            container.style.boxShadow = '0 0 10px rgba(0,255,0,0.5)';
                            
                            // Force reset slide dimensions to prevent massive widths
                            const slides = container.querySelectorAll('.swiper-slide');
                            slides.forEach(function(slide) {
                                slide.style.width = '100%';
                                slide.style.maxWidth = '100%';
                                slide.style.minWidth = '100%';
                            });
                            
                            // Reset wrapper transform if it's too extreme
                            const wrapper = container.querySelector('.swiper-wrapper');
                            if (wrapper) {
                                const transform = wrapper.style.transform;
                                if (transform && transform.includes('e+')) {
                                    console.log('WCPLS: Detected extreme transform, resetting...');
                                    wrapper.style.transform = 'translate3d(0px, 0px, 0px)';
                                    this.slideTo(0, 0); // Go to first slide immediately
                                }
                            }
                        },
                        slideChange: function() {
                            console.log('WCPLS: Slide changed to:', this.activeIndex);
                        },
                        autoplayStart: function() {
                            console.log('WCPLS: Autoplay started');
                        },
                        autoplayStop: function() {
                            console.log('WCPLS: Autoplay stopped');
                        }
                    }
                });
                
                // Store instance
                container._swiperInstance = swiper;
                
                // Add dimension monitoring
                const monitorDimensions = function() {
                    const slides = container.querySelectorAll('.swiper-slide');
                    let needsReset = false;
                    
                    slides.forEach(function(slide) {
                        const width = slide.style.width;
                        if (width && (width.includes('e+') || parseFloat(width) > 1000)) {
                            needsReset = true;
                        }
                    });
                    
                    if (needsReset) {
                        console.log('WCPLS: Detected dimension issues, fixing...');
                        slides.forEach(function(slide) {
                            slide.style.width = '100%';
                            slide.style.maxWidth = '100%';
                            slide.style.minWidth = '100%';
                        });
                        swiper.update();
                    }
                };
                
                // Monitor every 2 seconds for the first 30 seconds
                let monitorCount = 0;
                const monitorInterval = setInterval(function() {
                    monitorDimensions();
                    monitorCount++;
                    if (monitorCount >= 15) { // 15 * 2s = 30s
                        clearInterval(monitorInterval);
                    }
                }, 2000);
                
                // Manual hover events (backup for pauseOnMouseEnter)
                container.addEventListener('mouseenter', function() {
                    console.log('WCPLS: Mouse enter - stopping autoplay');
                    if (swiper && swiper.autoplay && swiper.autoplay.running) {
                        swiper.autoplay.stop();
                    }
                });
                
                container.addEventListener('mouseleave', function() {
                    console.log('WCPLS: Mouse leave - starting autoplay');
                    if (swiper && swiper.autoplay) {
                        swiper.autoplay.start();
                    }
                });
                
                console.log('WCPLS: Container ' + index + ' setup complete');
                
            } catch (error) {
                console.error('WCPLS: Failed to initialize Swiper for container ' + index + ':', error);
                container.style.border = '3px solid #ff0000'; // Red = error
                container.style.boxShadow = '0 0 10px rgba(255,0,0,0.5)';
                
                // Add error message
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,0,0,0.9);color:white;padding:10px;border-radius:5px;font-size:12px;z-index:1000;';
                errorDiv.textContent = 'Slider Error: ' + error.message;
                container.style.position = 'relative';
                container.appendChild(errorDiv);
            }
        });
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWhenReady);
    } else {
        // DOM already loaded
        initializeWhenReady();
    }
    
})();
