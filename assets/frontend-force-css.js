/**
 * WooCommerce Product List Slider - Force CSS Mode
 * Completely bypasses Swiper to use pure CSS implementation
 * @version 1.0.0
 */

(function() {
    'use strict';
    
    console.log('WCPLS: Force CSS mode initializing...');
    
    function forceDestroySwipers() {
        // Destroy any existing Swiper instances
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        
        containers.forEach(container => {
            // Try to destroy Swiper instance if it exists
            if (container._swiperInstance) {
                try {
                    container._swiperInstance.destroy(true, true);
                    container._swiperInstance = null;
                } catch (e) {
                    console.log('WCPLS: Swiper instance cleanup');
                }
            }
            
            // Keep original structure but remove problematic classes and attributes
            const swiperEl = container.querySelector('.swiper');
            if (swiperEl) {
                // Don't change class names, just clean up attributes
                swiperEl.removeAttribute('role');
                swiperEl.removeAttribute('aria-label');
                
                const wrapper = swiperEl.querySelector('.swiper-wrapper');
                if (wrapper) {
                    wrapper.removeAttribute('style');
                    wrapper.removeAttribute('id');
                    wrapper.removeAttribute('aria-live');
                }
                
                const slides = swiperEl.querySelectorAll('.swiper-slide');
                slides.forEach(slide => {
                    slide.removeAttribute('style');
                    slide.removeAttribute('role');
                    slide.removeAttribute('aria-label');
                    slide.removeAttribute('data-swiper-slide-index');
                });
                
                // Remove Swiper-generated elements
                const pagination = container.querySelector('.swiper-pagination');
                if (pagination) pagination.remove();
                
                const notification = container.querySelector('.swiper-notification');
                if (notification) notification.remove();
            }
        });
    }
    
    function initializeCSSSliders() {
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        
        if (containers.length === 0) {
            console.log('WCPLS: No slider containers found');
            return;
        }
        
        console.log(`WCPLS: Initializing ${containers.length} CSS sliders`);
        
        containers.forEach((container, index) => {
            const slides = container.querySelectorAll('.swiper-slide');
            
            if (slides.length <= 1) {
                console.log(`WCPLS: Container ${index} has only ${slides.length} slide(s), skipping`);
                return;
            }
            
            console.log(`WCPLS: ✅ Setting up CSS slider ${index} with ${slides.length} slides`);
            
            // Style container
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            container.style.width = '100%';
            container.style.height = 'auto';
            
            // Style wrapper
            const wrapper = container.querySelector('.swiper-wrapper');
            if (wrapper) {
                wrapper.style.position = 'relative';
                wrapper.style.width = '100%';
                wrapper.style.height = 'auto';
                wrapper.style.display = 'block';
                wrapper.style.transform = 'none';
            }
            
            let currentSlide = 0;
            
            // Style slides
            slides.forEach((slide, i) => {
                slide.style.position = 'absolute';
                slide.style.top = '0';
                slide.style.left = '0';
                slide.style.width = '100%';
                slide.style.height = 'auto';
                slide.style.opacity = i === 0 ? '1' : '0';
                slide.style.transition = 'opacity 0.5s ease';
                slide.style.zIndex = i === 0 ? '10' : '1';
                slide.style.transform = 'none';
                
                // Ensure images are properly sized
                const img = slide.querySelector('img');
                if (img) {
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    img.style.display = 'block';
                }
            });
            
            // Set container height based on first image
            const firstImg = slides[0]?.querySelector('img');
            if (firstImg) {
                firstImg.onload = () => {
                    container.style.height = firstImg.offsetHeight + 'px';
                };
                if (firstImg.complete) {
                    container.style.height = firstImg.offsetHeight + 'px';
                }
            }
            
            // Auto-advance functionality
            let isPaused = false;
            const interval = setInterval(() => {
                if (isPaused) return;
                
                // Hide current slide
                slides[currentSlide].style.opacity = '0';
                slides[currentSlide].style.zIndex = '1';
                
                // Move to next slide
                currentSlide = (currentSlide + 1) % slides.length;
                
                // Show new slide
                slides[currentSlide].style.opacity = '1';
                slides[currentSlide].style.zIndex = '10';
                
                console.log(`WCPLS: CSS slider ${index} advanced to slide ${currentSlide + 1}/${slides.length}`);
            }, 3000);
            
            // Hover controls
            container.addEventListener('mouseenter', () => {
                isPaused = true;
                console.log(`WCPLS: Slider ${index} paused`);
            });
            
            container.addEventListener('mouseleave', () => {
                isPaused = false;
                console.log(`WCPLS: Slider ${index} resumed`);
            });
            
            // Manual navigation (click to advance)
            container.addEventListener('click', (e) => {
                if (e.target.closest('a')) return; // Don't interfere with links
                
                // Hide current slide
                slides[currentSlide].style.opacity = '0';
                slides[currentSlide].style.zIndex = '1';
                
                // Move to next slide
                currentSlide = (currentSlide + 1) % slides.length;
                
                // Show new slide
                slides[currentSlide].style.opacity = '1';
                slides[currentSlide].style.zIndex = '10';
                
                console.log(`WCPLS: Manual advance to slide ${currentSlide + 1}/${slides.length}`);
            });
            
            // Store cleanup function
            container._cssSliderCleanup = () => clearInterval(interval);
            
            console.log(`WCPLS: ✅ CSS slider ${index} fully initialized and running`);
        });
    }
    
    // Main initialization
    function initialize() {
        console.log('WCPLS: Starting force CSS initialization...');
        
        // First destroy any Swiper instances
        forceDestroySwipers();
        
        // Then initialize CSS sliders
        setTimeout(() => {
            initializeCSSSliders();
        }, 100);
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also run after a short delay to catch any late-loading content
    setTimeout(initialize, 1000);
    
})();
