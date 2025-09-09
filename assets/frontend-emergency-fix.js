/**
 * WooCommerce Product List Slider - Emergency Dimension Fix
 * This aggressively overrides the massive width issue
 * @version 1.0.0
 */

(function() {
    'use strict';
    
    console.log('WCPLS: Emergency fix script loaded');
    
    // Function to aggressively fix slide dimensions
    function forceFixDimensions() {
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        
        containers.forEach(function(container, index) {
            const slides = container.querySelectorAll('.swiper-slide');
            const wrapper = container.querySelector('.swiper-wrapper');
            
            // Force reset slide widths by removing and re-setting style attribute
            slides.forEach(function(slide) {
                const currentStyle = slide.getAttribute('style') || '';
                
                // Check if width is problematic
                if (currentStyle.includes('e+') || currentStyle.includes('3.355')) {
                    console.log('WCPLS: Fixing problematic slide width for container', index);
                    
                    // Remove all width-related inline styles and replace
                    let newStyle = currentStyle
                        .replace(/width:\s*[^;]+;?/gi, '')
                        .replace(/min-width:\s*[^;]+;?/gi, '')
                        .replace(/max-width:\s*[^;]+;?/gi, '');
                    
                    // Add proper width
                    newStyle += 'width: 100% !important; min-width: 100% !important; max-width: 100% !important;';
                    
                    slide.setAttribute('style', newStyle);
                }
            });
            
            // Fix wrapper transform if it's extreme
            if (wrapper) {
                const currentStyle = wrapper.getAttribute('style') || '';
                if (currentStyle.includes('e+')) {
                    console.log('WCPLS: Fixing problematic wrapper transform for container', index);
                    
                    let newStyle = currentStyle.replace(/transform:\s*[^;]+;?/gi, '');
                    newStyle += 'transform: translate3d(0px, 0px, 0px) !important;';
                    
                    wrapper.setAttribute('style', newStyle);
                    
                    // Force Swiper to recalculate
                    const swiperInstance = container._swiperInstance;
                    if (swiperInstance) {
                        setTimeout(() => {
                            swiperInstance.slideTo(0, 0);
                            swiperInstance.update();
                        }, 100);
                    }
                }
            }
        });
    }
    
    // Function to override Swiper's internal dimension calculations
    function interceptSwiper() {
        if (typeof Swiper === 'undefined') {
            setTimeout(interceptSwiper, 100);
            return;
        }
        
        console.log('WCPLS: Intercepting Swiper for dimension fixes');
        
        // Override Swiper's slide sizing method if it exists
        const originalUpdateSlidesSize = Swiper.prototype.updateSlidesSize;
        if (originalUpdateSlidesSize) {
            Swiper.prototype.updateSlidesSize = function() {
                console.log('WCPLS: Intercepting updateSlidesSize');
                
                // Call original method
                originalUpdateSlidesSize.call(this);
                
                // Then force fix our dimensions
                const slides = this.slides;
                if (slides) {
                    slides.forEach(function(slide) {
                        slide.style.width = '100%';
                        slide.style.minWidth = '100%';
                        slide.style.maxWidth = '100%';
                    });
                }
            };
        }
    }
    
    // Aggressive monitoring - check every 500ms
    function startAggressiveMonitoring() {
        console.log('WCPLS: Starting aggressive dimension monitoring');
        
        setInterval(function() {
            forceFixDimensions();
        }, 500);
    }
    
    // MutationObserver to catch when Swiper modifies the DOM
    function startDOMObserver() {
        const observer = new MutationObserver(function(mutations) {
            let needsFix = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.classList.contains('swiper-slide') || target.classList.contains('swiper-wrapper')) {
                        const style = target.getAttribute('style') || '';
                        if (style.includes('e+')) {
                            needsFix = true;
                        }
                    }
                }
            });
            
            if (needsFix) {
                console.log('WCPLS: DOM mutation detected problematic styles, fixing...');
                setTimeout(forceFixDimensions, 50);
            }
        });
        
        // Observe the entire document for style changes
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
        
        console.log('WCPLS: DOM observer started');
    }
    
    // Initialize everything
    function initialize() {
        console.log('WCPLS: Emergency fix initializing...');
        
        // Start monitoring immediately
        startAggressiveMonitoring();
        
        // Start DOM observer
        startDOMObserver();
        
        // Try to intercept Swiper
        interceptSwiper();
        
        // Initial fix
        setTimeout(forceFixDimensions, 1000);
        setTimeout(forceFixDimensions, 2000);
        setTimeout(forceFixDimensions, 5000);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();
