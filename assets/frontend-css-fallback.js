/**
 * WooCommerce Product List Slider - Pure CSS Fallback
 * Works with            // Fixed container styles - explicit dimensions with hidden overflow
            const containerStyles = [
                'position: relative !important',
                'overflow: hidden !important',
                'width: 100% !important',
                'height: 300px !important',
                'min-height: 300px !important',
                'max-height: 300px !important',
                'border: 1px solid #ddd !important',
                'border-radius: 8px !important',
                'box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important',
                'display: block !important',
                'background: #fff !important',
                'box-sizing: border-box !important',
                'cursor: pointer !important',
                'z-index: 9999 !important',
                'isolation: isolate !important'
            ].join('; '); library
 * @version 2.0.0-PRODUCTION
 */

(function() {
    'use strict';
    
    console.log('WCPLS: Product slider initialized', new Date().toTimeString());
    
    // Enhanced diagnostic function to check page structure
    function runDiagnostics() {
        console.log('🔍 WCPLS DIAGNOSTICS:');
        console.log('  - All divs on page:', document.querySelectorAll('div').length);
        console.log('  - WC containers:', document.querySelectorAll('.wc-product-list-slider-container').length);
        console.log('  - Any slider class:', document.querySelectorAll('[class*="slider"]').length);
        console.log('  - Product images:', document.querySelectorAll('img').length);
        console.log('  - WooCommerce products:', document.querySelectorAll('.product').length);
        
        // Show first few containers if any exist
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        containers.forEach((container, i) => {
            if (i < 3) { // Show first 3 only
                console.log(`  - Container ${i}: Product ID ${container.dataset.productId}, Slides: ${container.querySelectorAll('.swiper-slide').length}`);
                
                // Check images in this container
                const images = container.querySelectorAll('img');
                images.forEach((img, imgIndex) => {
                    const computedStyle = window.getComputedStyle(img);
                    console.log(`    📷 Image ${imgIndex}:`, {
                        src: img.src.substring(0, 100) + '...',
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity,
                        width: computedStyle.width,
                        height: computedStyle.height,
                        position: computedStyle.position,
                        zIndex: computedStyle.zIndex,
                        loaded: img.complete,
                        naturalSize: `${img.naturalWidth}x${img.naturalHeight}`
                    });
                });
            }
        });
    }
    
    // Simple CSS-only slider implementation
    function initializeCSSSliders() {
        const containers = document.querySelectorAll('.wc-product-list-slider-container');
        console.log('🔍 WCPLS: Found containers for CSS fallback:', containers.length);
        
        if (containers.length === 0) {
            console.log('⚠️ WCPLS: No slider containers found! Retrying in 1 second...');
            setTimeout(initializeCSSSliders, 1000);
            return;
        }
        
        containers.forEach(function(container, index) {
            console.log('🔧 WCPLS: Setting up CSS-only slider for container', index, 'Product ID:', container.dataset.productId);
            
            const slides = container.querySelectorAll('.swiper-slide');
            let pagination = container.querySelector('.swiper-pagination');
            
            if (slides.length === 0) {
                console.log('❌ WCPLS: No slides found in container', index);
                return;
            }
            
            console.log('✅ WCPLS: Found', slides.length, 'slides in container', index);
            
            // FORCE container styles by overriding everything
            console.log('🎨 WCPLS: Applying container styles to', container.dataset.productId);
            
            // FORCE STYLES WITH DIRECT ATTRIBUTE - fixed height issue
            const forceStyles = [
                'position: relative !important',
                'overflow: visible !important', 
                'width: 100% !important',
                'height: 300px !important',
                'min-height: 300px !important',
                'max-height: 300px !important',
                'border: 1px solid #ddd !important',
                'border-radius: 8px !important',
                'box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important',
                'display: block !important',
                'background: #fff !important',
                'box-sizing: border-box !important',
                'cursor: pointer !important',
                'z-index: 9999 !important',
                'isolation: isolate !important'
            ].join('; ');
            
            // Remove existing style attribute completely and force our styles
            container.removeAttribute('style');
            container.setAttribute('style', forceStyles);
            
            // Also add CSS class as backup
            container.classList.add('wcpls-forced-container');
            
            // Use both methods to ensure styles stick
            container.style.cssText = forceStyles;
            
            console.log('💥 WCPLS: FORCED container styles with direct attribute for product', container.dataset.productId);
            
            // Log computed styles for debugging
            setTimeout(function() {
                const computedStyle = window.getComputedStyle(container);
                console.log('📏 WCPLS: Container computed styles for product', container.dataset.productId);
                console.log('  - Height:', computedStyle.height);
                console.log('  - Display:', computedStyle.display);
                console.log('  - Position:', computedStyle.position);
                console.log('  - Overflow:', computedStyle.overflow);
                console.log('  - Border:', computedStyle.border);
            }, 100);
            
            // Remove debug indicators - production ready
            
            let currentSlide = 0;
            
            // Force style all slides with DIRECT ATTRIBUTE METHOD
            slides.forEach(function(slide, i) {
                console.log('🎯 WCPLS: FORCING slide', i, 'of', slides.length);
                
                // Fixed slide styles - explicit height dimensions
                const slideStyles = [
                    'position: absolute !important',
                    'top: 0 !important',
                    'left: 0 !important', 
                    'width: 100% !important',
                    'height: 300px !important',
                    'min-height: 300px !important',
                    'max-height: 300px !important',
                    `opacity: ${i === 0 ? '1' : '0'} !important`,
                    'transition: opacity 0.4s ease !important',
                    `z-index: ${i === 0 ? '10' : '1'} !important`,
                    'display: block !important',
                    'padding: 0 !important',
                    'box-sizing: border-box !important',
                    'overflow: hidden !important'
                ].join('; ');
                
                slide.removeAttribute('style');
                slide.setAttribute('style', slideStyles);
                slide.style.cssText = slideStyles;
                
                console.log('✅ WCPLS: FORCED slide', i, 'with direct attribute method');
                
                // Force style the image within each slide - ULTRA AGGRESSIVE FORCE
                const img = slide.querySelector('img');
                if (img) {
                    console.log('📷 WCPLS: FORCING image in slide', i, 'Source:', img.src);
                    
                    // Fixed image styles - explicit 300px height to match container
                    const imageStyles = [
                        'display: block !important',
                        'visibility: visible !important',
                        'opacity: 1 !important',
                        'width: 100% !important',
                        'height: 300px !important',
                        'min-height: 300px !important',
                        'max-height: 300px !important',
                        'object-fit: cover !important',
                        'object-position: center center !important',
                        'margin: 0 !important',
                        'padding: 0 !important',
                        'border: none !important',
                        'border-radius: 8px !important',
                        'position: absolute !important',
                        'top: 0 !important',
                        'left: 0 !important',
                        'z-index: 5 !important',
                        'background: #f5f5f5 !important',
                        'box-sizing: border-box !important',
                        'flex-shrink: 0 !important',
                        'vertical-align: top !important',
                        'outline: none !important',
                        'clip: auto !important',
                        'clip-path: none !important',
                        'transform: none !important',
                        'filter: none !important'
                    ].join('; ');
                    
                    // NUCLEAR OPTION: Remove all classes and attributes that might interfere
                    const originalClasses = img.className;
                    img.className = 'slider-image';
                    
                    // Apply styles with EVERY possible method for maximum reliability
                    img.removeAttribute('style');
                    img.setAttribute('style', imageStyles);
                    img.style.cssText = imageStyles;
                    
                    // Force individual style properties as backup
                    img.style.display = 'block';
                    img.style.visibility = 'visible';
                    img.style.opacity = '1';
                    img.style.width = '100%';
                    img.style.height = '300px';
                    img.style.minHeight = '300px';
                    img.style.maxHeight = '300px';
                    img.style.objectFit = 'cover';
                    img.style.background = '#f5f5f5';
                    img.style.zIndex = '5';
                    img.style.position = 'absolute';
                    img.style.top = '0';
                    img.style.left = '0';
                    
                    // Force image to load and show
                    img.setAttribute('loading', 'eager');
                    img.setAttribute('decoding', 'sync');
                    
                    // Multiple force applications
                    setTimeout(function() {
                        img.style.cssText = imageStyles;
                        img.style.display = 'block';
                        img.style.visibility = 'visible';
                        img.style.opacity = '1';
                    }, 1);
                    
                    setTimeout(function() {
                        img.style.cssText = imageStyles;
                    }, 50);
                    
                    setTimeout(function() {
                        img.style.cssText = imageStyles;
                    }, 200);
                    
                    // Handle image load events
                    if (!img.complete) {
                        img.onload = function() {
                            img.style.cssText = imageStyles;
                            console.log('📸 WCPLS: Image loaded successfully:', img.src);
                        };
                        img.onerror = function() {
                            console.error('❌ WCPLS: Image failed to load:', img.src);
                            slide.innerHTML = '<div style="width:100%;height:280px;background:#ff0000;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;">IMAGE FAILED TO LOAD</div>';
                        };
                    }
                    
                    console.log('🖼️ WCPLS: NUCLEAR FORCED image with all methods - Natural size:', img.naturalWidth + 'x' + img.naturalHeight);
                } else {
                    console.log('❌ WCPLS: No image found in slide', i);
                    // If no image, add a placeholder
                    slide.innerHTML = '<div style="width:100%;height:280px;background:#f0f0f0;border:2px solid red;display:flex;align-items:center;justify-content:center;">NO IMAGE FOUND</div>';
                }
            });
            
            // Hide pagination dots completely
            if (pagination) {
                pagination.style.cssText = 'display: none !important;';
            }
            
            // Also hide any existing pagination elements
            const existingPagination = container.querySelectorAll('.swiper-pagination, .css-pagination');
            existingPagination.forEach(function(pag) {
                pag.style.cssText = 'display: none !important;';
            });
            
            // Function to show specific slide (no pagination updates needed)
            function showSlide(slideIndex) {
                slides.forEach(function(slide, i) {
                    slide.style.opacity = i === slideIndex ? '1' : '0';
                    slide.style.zIndex = i === slideIndex ? '10' : '1';
                });
                
                currentSlide = slideIndex;
                console.log('WCPLS: CSS slider showing slide', slideIndex, 'for product', container.dataset.productId);
            }
            
            // Hover-triggered sliding (Desktop) + Swipe support (Mobile)
            if (slides.length > 1) {
                let hoverInterval;
                let isHovering = false;
                
                // Desktop: Start sliding on hover
                container.addEventListener('mouseenter', function() {
                    isHovering = true;
                    console.log('WCPLS: Started hover sliding for product', container.dataset.productId);
                    
                    hoverInterval = setInterval(function() {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }, 1500); // Faster on hover - 1.5 seconds
                });
                
                // Desktop: Stop sliding when hover ends
                container.addEventListener('mouseleave', function() {
                    isHovering = false;
                    console.log('WCPLS: Stopped hover sliding for product', container.dataset.productId);
                    
                    if (hoverInterval) {
                        clearInterval(hoverInterval);
                        hoverInterval = null;
                    }
                    
                    // Reset to first slide after hover ends
                    setTimeout(function() {
                        if (!isHovering) {
                            currentSlide = 0;
                            showSlide(currentSlide);
                        }
                    }, 500);
                });
                
                // Mobile: Touch/Swipe support
                let touchStartX = 0;
                let touchEndX = 0;
                
                container.addEventListener('touchstart', function(e) {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });
                
                container.addEventListener('touchend', function(e) {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                }, { passive: true });
                
                function handleSwipe() {
                    const swipeThreshold = 50; // Minimum swipe distance
                    const diff = touchStartX - touchEndX;
                    
                    if (Math.abs(diff) > swipeThreshold) {
                        if (diff > 0) {
                            // Swipe left - next slide
                            currentSlide = (currentSlide + 1) % slides.length;
                        } else {
                            // Swipe right - previous slide
                            currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
                        }
                        showSlide(currentSlide);
                        console.log('WCPLS: Swiped to slide', currentSlide, 'for product', container.dataset.productId);
                    }
                }
                
                // Store cleanup function
                container._cssSliderCleanup = function() {
                    if (hoverInterval) {
                        clearInterval(hoverInterval);
                    }
                };
            }
            
            console.log('WCPLS: CSS-only slider initialized for container', index, 'with', slides.length, 'slides');
            
            // CRITICAL: Check if images are actually visible after all styling
            setTimeout(function() {
                console.log('🔍 WCPLS: POST-INIT IMAGE VISIBILITY CHECK for product', container.dataset.productId);
                const images = container.querySelectorAll('img');
                let visibleCount = 0;
                
                images.forEach((img, imgIndex) => {
                    const computedStyle = window.getComputedStyle(img);
                    const rect = img.getBoundingClientRect();
                    const isVisible = (
                        computedStyle.display !== 'none' &&
                        computedStyle.visibility !== 'hidden' &&
                        parseFloat(computedStyle.opacity) > 0 &&
                        rect.width > 0 &&
                        rect.height > 0
                    );
                    
                    if (isVisible) visibleCount++;
                    
                    console.log(`📷 Image ${imgIndex} visibility:`, {
                        visible: isVisible,
                        display: computedStyle.display,
                        visibility: computedStyle.visibility, 
                        opacity: computedStyle.opacity,
                        rect: `${rect.width}x${rect.height}`,
                        computed: `${computedStyle.width}x${computedStyle.height}`,
                        src: img.src.substring(img.src.lastIndexOf('/') + 1)
                    });
                    
                    // If image is not visible, try emergency fix
                    if (!isVisible) {
                        console.log('🚨 WCPLS: EMERGENCY FIX for invisible image', imgIndex);
                        img.style.cssText = 'display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;height:280px!important;object-fit:cover!important;position:relative!important;z-index:999!important;background:red!important;';
                    }
                });
                
                console.log(`WCPLS: Visibility summary for product ${container.dataset.productId}: ${visibleCount}/${images.length} images visible`);
                
                if (visibleCount === 0 && images.length > 0) {
                    console.log('💥 WCPLS: ZERO IMAGES VISIBLE! Adding debug overlay...');
                    container.innerHTML = `
                        <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(45deg,red,orange);color:white;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:bold;z-index:9999;">
                            NO IMAGES VISIBLE!<br>
                            Product ID: ${container.dataset.productId}<br>
                            Found ${images.length} images<br>
                            Check browser console
                        </div>
                    `;
                }
            }, 500);
        });
    }
    
    // Force CSS-only implementation immediately and repeatedly
    function forceInitialization() {
        console.log('WCPLS: 🚀 Force initializing CSS-only sliders (no Swiper)...', new Date().toTimeString());
        runDiagnostics();
        initializeCSSSliders();
    }
    
    // Initialize immediately
    forceInitialization();
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceInitialization);
    }
    
    // Initialize after page load
    window.addEventListener('load', forceInitialization);
    
    // Initialize with delays to catch dynamic content
    setTimeout(forceInitialization, 100);
    setTimeout(forceInitialization, 500);
    setTimeout(forceInitialization, 1000);
    setTimeout(forceInitialization, 2000);
    
    // Also initialize on scroll (for lazy loaded products)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(forceInitialization, 200);
    });
    
})();
