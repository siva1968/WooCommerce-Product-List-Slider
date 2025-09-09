/**
 * WooCommerce Product List Slider - Debug Version
 * @version 1.0.0
 */
(function($, window, document) {
    'use strict';
    
    console.log('WCPLS: Script loaded');
    
    $(document).ready(function() {
        console.log('WCPLS: DOM ready');
        console.log('WCPLS: jQuery version:', $.fn.jquery);
        console.log('WCPLS: Swiper available:', typeof Swiper);
        console.log('WCPLS: Settings available:', typeof wcplsSettings);
        
        if (typeof wcplsSettings !== 'undefined') {
            console.log('WCPLS: Settings:', wcplsSettings);
        }
        
        // Find slider containers
        const containers = $('.wc-product-list-slider-container');
        console.log('WCPLS: Found containers:', containers.length);
        
        containers.each(function(index) {
            const $container = $(this);
            const $swiper = $container.find('.swiper');
            console.log('WCPLS: Container ' + index + ':', $container[0]);
            console.log('WCPLS: Swiper element ' + index + ':', $swiper[0]);
            
            if ($swiper.length && typeof Swiper !== 'undefined') {
                try {
                    console.log('WCPLS: Initializing Swiper for container ' + index);
                    
                    const swiper = new Swiper($swiper[0], {
                        loop: true,
                        effect: 'slide',
                        slidesPerView: 1,
                        spaceBetween: 0,
                        speed: 300,
                        autoplay: {
                            delay: wcplsSettings && wcplsSettings.speed ? wcplsSettings.speed : 2500,
                            disableOnInteraction: false
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                            dynamicBullets: true
                        },
                        on: {
                            init: function() {
                                console.log('WCPLS: Swiper initialized for container ' + index);
                                $container.removeClass('loading');
                            },
                            slideChange: function() {
                                console.log('WCPLS: Slide changed to:', this.activeIndex);
                            }
                        }
                    });
                    
                    console.log('WCPLS: Swiper instance created:', swiper);
                    
                    // Test hover events
                    $container.on('mouseenter', function() {
                        console.log('WCPLS: Mouse enter');
                        if (swiper && swiper.autoplay) {
                            swiper.autoplay.stop();
                        }
                    }).on('mouseleave', function() {
                        console.log('WCPLS: Mouse leave');
                        if (swiper && swiper.autoplay) {
                            swiper.autoplay.start();
                        }
                    });
                    
                } catch (error) {
                    console.error('WCPLS: Failed to initialize Swiper:', error);
                }
            } else {
                console.error('WCPLS: Missing requirements - Swiper element:', $swiper.length, 'Swiper class:', typeof Swiper);
            }
        });
    });
    
})(jQuery, window, document);
