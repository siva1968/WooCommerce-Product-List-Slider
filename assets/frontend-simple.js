/**
 * WooCommerce Product List Slider - Simple Debug Version
 * @version 1.0.0
 */

// Don't wait for jQuery - use vanilla JavaScript first
document.addEventListener('DOMContentLoaded', function() {
    console.log('WCPLS: DOM loaded (vanilla JS)');
    console.log('WCPLS: Swiper available:', typeof Swiper);
    console.log('WCPLS: jQuery available:', typeof jQuery);
    console.log('WCPLS: Settings available:', typeof wcplsSettings);
    
    if (typeof wcplsSettings !== 'undefined') {
        console.log('WCPLS: Settings:', wcplsSettings);
    }
    
    // Find slider containers
    const containers = document.querySelectorAll('.wc-product-list-slider-container');
    console.log('WCPLS: Found containers:', containers.length);
    
    if (containers.length === 0) {
        console.log('WCPLS: No slider containers found');
        return;
    }
    
    if (typeof Swiper === 'undefined') {
        console.error('WCPLS: Swiper not available');
        return;
    }
    
    // Initialize each slider
    containers.forEach(function(container, index) {
        const swiperElement = container.querySelector('.swiper');
        console.log('WCPLS: Container ' + index + ':', container);
        console.log('WCPLS: Swiper element ' + index + ':', swiperElement);
        
        if (!swiperElement) {
            console.error('WCPLS: No .swiper element found in container ' + index);
            return;
        }
        
        try {
            console.log('WCPLS: Initializing Swiper for container ' + index);
            
            const swiperConfig = {
                loop: true,
                effect: 'slide',
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 300,
                autoplay: {
                    delay: (typeof wcplsSettings !== 'undefined' && wcplsSettings.speed) ? wcplsSettings.speed : 2500,
                    disableOnInteraction: false
                },
                pagination: {
                    el: container.querySelector('.swiper-pagination'),
                    clickable: true,
                    dynamicBullets: true
                },
                on: {
                    init: function() {
                        console.log('WCPLS: Swiper initialized for container ' + index);
                        container.classList.remove('loading');
                        container.style.border = '2px solid green'; // Success indicator
                    },
                    slideChange: function() {
                        console.log('WCPLS: Slide changed to:', this.activeIndex);
                    }
                }
            };
            
            console.log('WCPLS: Swiper config:', swiperConfig);
            
            const swiper = new Swiper(swiperElement, swiperConfig);
            
            console.log('WCPLS: Swiper instance created:', swiper);
            
            // Store instance for later use
            container._swiperInstance = swiper;
            
            // Add hover events
            container.addEventListener('mouseenter', function() {
                console.log('WCPLS: Mouse enter');
                if (swiper && swiper.autoplay) {
                    swiper.autoplay.stop();
                }
            });
            
            container.addEventListener('mouseleave', function() {
                console.log('WCPLS: Mouse leave');
                if (swiper && swiper.autoplay) {
                    swiper.autoplay.start();
                }
            });
            
        } catch (error) {
            console.error('WCPLS: Failed to initialize Swiper:', error);
            container.style.border = '2px solid red'; // Error indicator
        }
    });
});

// Also try with jQuery when available (fallback)
if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(function($) {
        console.log('WCPLS: jQuery ready fallback');
        // Additional jQuery-based initialization if needed
    });
} else {
    console.log('WCPLS: jQuery not available, using vanilla JS only');
}
