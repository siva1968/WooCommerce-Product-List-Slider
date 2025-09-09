/**
 * WooCommerce Product List Slider - Frontend JS
 * @version 1.0.0
 */
(function($, window, document) {
    'use strict';
    
    // Plugin object
    const WCProductSlider = {
        
        // Configuration
        config: {
            containerSelector: '.wc-product-list-slider-container',
            swiperSelector: '.swiper',
            slideSelector: '.swiper-slide',
            defaultSpeed: 2500,
            defaultEffect: 'slide'
        },
        
        // Initialize
        init: function() {
            // Check dependencies
            if (!this.checkDependencies()) {
                return;
            }
            
            // Initialize sliders
            this.initializeSliders();
            
            // Bind events
            this.bindEvents();
        },
        
        // Check if all dependencies are available
        checkDependencies: function() {
            if (typeof Swiper === 'undefined') {
                console.warn('WC Product List Slider: Swiper.js not loaded');
                return false;
            }
            
            if (typeof wcplsSettings === 'undefined') {
                console.warn('WC Product List Slider: Settings not available');
                return false;
            }
            
            if (!wcplsSettings.enabled) {
                return false;
            }
            
            return true;
        },
        
        // Initialize all sliders
        initializeSliders: function() {
            const self = this;
            const $containers = $(this.config.containerSelector);
            
            if ($containers.length === 0) {
                return;
            }
            
            // Process each slider container
            $containers.each(function() {
                self.initializeSingleSlider($(this));
            });
        },
        
        // Initialize a single slider
        initializeSingleSlider: function($container) {
            const $swiper = $container.find(this.config.swiperSelector);
            
            if ($swiper.length === 0) {
                return;
            }
            
            // Get settings
            const speed = this.validateSpeed(wcplsSettings.speed);
            const effect = this.validateEffect(wcplsSettings.effect);
            const layout = wcplsSettings.layout || 'default';
            
            // Check premium layout
            if (layout !== 'default') {
                this.showPremiumNotice();
            }
            
            // Show loading state
            $container.addClass('loading');
            
            try {
                // Initialize Swiper
                const swiper = new Swiper($swiper[0], {
                    loop: true,
                    effect: effect,
                    slidesPerView: 1,
                    spaceBetween: 0,
                    speed: 300,
                    autoplay: {
                        delay: speed,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        dynamicBullets: true
                    },
                    lazy: {
                        loadPrevNext: true,
                        loadPrevNextAmount: 2
                    },
                    a11y: {
                        enabled: true,
                        prevSlideMessage: wcplsSettings.prevSlideText || 'Previous slide',
                        nextSlideMessage: wcplsSettings.nextSlideText || 'Next slide'
                    },
                    on: {
                        init: function() {
                            $container.removeClass('loading');
                        },
                        slideChange: function() {
                            // Fire custom event
                            $container.trigger('wcpls:slideChange', [this.activeIndex]);
                        }
                    }
                });
                
                // Store swiper instance
                $container.data('swiper', swiper);
                
                // Bind hover events
                this.bindHoverEvents($container, swiper);
                
            } catch (error) {
                console.error('WC Product List Slider: Failed to initialize swiper', error);
                $container.removeClass('loading');
            }
        },
        
        // Bind hover events
        bindHoverEvents: function($container, swiper) {
            let hoverTimer;
            
            $container
                .on('mouseenter', function() {
                    clearTimeout(hoverTimer);
                    if (swiper && swiper.autoplay) {
                        swiper.autoplay.stop();
                    }
                })
                .on('mouseleave', function() {
                    hoverTimer = setTimeout(function() {
                        if (swiper && swiper.autoplay) {
                            swiper.autoplay.start();
                            // Reset to first slide after delay
                            setTimeout(function() {
                                if (swiper && !swiper.destroyed) {
                                    swiper.slideTo(0);
                                }
                            }, 1000);
                        }
                    }, 100);
                });
        },
        
        // Bind global events
        bindEvents: function() {
            const self = this;
            
            // Reinitialize on AJAX complete (for dynamic content)
            $(document).on('wc_fragments_loaded wc_fragments_refreshed', function() {
                setTimeout(function() {
                    self.initializeSliders();
                }, 100);
            });
            
            // Handle window resize
            let resizeTimer;
            $(window).on('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    self.handleResize();
                }, 250);
            });
        },
        
        // Handle window resize
        handleResize: function() {
            $(this.config.containerSelector).each(function() {
                const swiper = $(this).data('swiper');
                if (swiper && !swiper.destroyed) {
                    swiper.update();
                }
            });
        },
        
        // Validate speed setting
        validateSpeed: function(speed) {
            const numSpeed = parseInt(speed, 10);
            return (numSpeed >= 500 && numSpeed <= 10000) ? numSpeed : this.config.defaultSpeed;
        },
        
        // Validate effect setting
        validateEffect: function(effect) {
            const allowedEffects = ['slide', 'fade', 'cube', 'coverflow', 'flip'];
            return allowedEffects.includes(effect) ? effect : this.config.defaultEffect;
        },
        
        // Show premium notice
        showPremiumNotice: function() {
            if (!sessionStorage.getItem('wcpls_premium_notice_shown')) {
                console.info('WC Product List Slider: Premium layouts require upgrade.');
                sessionStorage.setItem('wcpls_premium_notice_shown', '1');
            }
        },
        
        // Destroy all sliders (cleanup)
        destroy: function() {
            $(this.config.containerSelector).each(function() {
                const swiper = $(this).data('swiper');
                if (swiper && !swiper.destroyed) {
                    swiper.destroy(true, true);
                }
                $(this).removeData('swiper');
            });
        }
    };
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        WCProductSlider.init();
    });
    
    // Make available globally for debugging
    window.WCProductSlider = WCProductSlider;
    
})(jQuery, window, document);