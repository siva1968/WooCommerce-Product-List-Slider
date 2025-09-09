# WooCommerce Product List Slider Plugin - Development Prompt

## Project Overview
Create a WordPress plugin that enhances WooCommerce product listings by adding image sliders to each product in shop/category pages. The slider should appear on hover and display the product's featured image plus gallery images.

## Plugin Specifications

### Basic Information
- **Plugin Name**: WooCommerce Product List Slider Plugin
- **Plugin Slug**: woocommerce-product-list-slider
- **Version**: 1.0.0
- **WordPress Compatibility**: 5.0+
- **WooCommerce Compatibility**: 4.0+
- **PHP Version**: 7.4+

### Core Functionality Requirements

#### 1. Target Area
- **Location**: Frontend shop/category pages where customers browse products
- **Scope**: WooCommerce product loop items
- **Behavior**: Replace default product thumbnails with interactive sliders

#### 2. Image Sources
- **Primary**: Featured product image
- **Secondary**: Product gallery images
- **Fallback**: If only featured image exists, show static image (no slider)
- **Minimum**: Slider only activates when 2+ images available

#### 3. Slider Features
- **Trigger**: Appear on hover (desktop) / Always visible (mobile)
- **Auto-play**: Yes, with 2-second delay
- **Touch Support**: Full swipe/touch support for mobile devices
- **Navigation**: Pagination dots
- **Loop**: Infinite loop through images
- **Reset**: Return to first slide when hover ends

#### 4. Theme Compatibility
- **Primary Target**: Astra theme with Beaver Builder
- **General**: Should work with most WooCommerce-compatible themes
- **Responsive**: Mobile-first approach

### Technical Requirements

#### 1. Plugin Structure
```
woocommerce-product-list-slider/
├── woocommerce-product-list-slider.php (main plugin file)
├── includes/
│   ├── class-wc-product-list-slider.php (main class)
│   ├── class-admin.php (admin functionality)
│   └── class-frontend.php (frontend functionality)
├── assets/
│   ├── css/
│   │   ├── frontend.css (frontend styles)
│   │   └── admin.css (admin styles)
│   ├── js/
│   │   ├── frontend.js (frontend JavaScript)
│   │   └── swiper.min.js (Swiper library)
│   └── images/ (plugin images/icons)
├── templates/
│   └── product-slider.php (slider template)
└── readme.txt (WordPress plugin readme)
```

#### 2. WordPress Integration
- **Hooks**: Use WooCommerce hooks to replace product thumbnails
- **Filters**: Provide filters for customization
- **Actions**: Custom actions for theme developers
- **Enqueue**: Proper asset enqueuing with dependencies

#### 3. JavaScript Library
- **Library**: Swiper.js (latest stable version)
- **Loading**: Load only on shop/category pages
- **Initialization**: Initialize sliders after DOM ready
- **Performance**: Lazy loading for better performance

### Implementation Details

#### 1. Core Hook Integration
```php
// Primary hooks to implement
add_action('woocommerce_before_shop_loop_item_title', 'replace_product_thumbnail', 5);
add_action('wp_enqueue_scripts', 'enqueue_slider_assets');
add_filter('woocommerce_single_product_image_thumbnail_html', 'modify_thumbnail_html');
```

#### 2. Image Processing Logic
- Retrieve product featured image ID
- Get product gallery image IDs
- Combine into single array (featured first)
- Generate responsive image HTML for each
- Create slider markup only if 2+ images exist

#### 3. CSS Requirements
- Position slider absolutely over static image
- Smooth opacity transitions (0.3s ease)
- Maintain aspect ratios across themes
- Mobile-responsive breakpoints
- Astra theme specific compatibility

#### 4. JavaScript Functionality
- Initialize Swiper on hover (desktop)
- Start/stop autoplay on mouse enter/leave
- Reset to first slide on hover end
- Touch/swipe support for mobile
- Prevent conflicts with other scripts

### Admin Panel Features (Optional)
- Enable/disable plugin globally
- Slider speed settings
- Autoplay delay settings
- Mobile behavior options
- Theme compatibility mode selector

### Performance Considerations
- Load assets only where needed (shop/category pages)
- Minimize HTTP requests
- Optimize image loading
- Use CSS transforms for smooth animations
- Debounce hover events

### Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Security Requirements
- Sanitize all inputs
- Validate image IDs
- Escape all outputs
- Use WordPress nonces where applicable
- Follow WordPress coding standards

### Testing Requirements
- Test with default WooCommerce themes
- Test with Astra theme + Beaver Builder
- Test responsive behavior
- Test with various product configurations
- Test performance impact

### Deliverables
1. Complete WordPress plugin files
2. Installation instructions
3. Configuration documentation
4. Browser compatibility report
5. Performance impact assessment

### Code Quality Standards
- Follow WordPress Coding Standards
- Use proper OOP structure
- Include comprehensive comments
- Implement error handling
- Use semantic HTML markup
- Follow CSS BEM methodology
- Use ES6+ JavaScript features appropriately

### Future Enhancement Ideas
- Admin settings panel
- Multiple slider effects
- Custom animation speeds
- Integration with other page builders
- Product quick view integration
- Analytics tracking for slider interactions

## Development Priority
1. Core slider functionality
2. Astra theme compatibility
3. Mobile responsiveness
4. Performance optimization
5. Admin settings (if time permits)

This prompt should be used to generate a complete, production-ready WordPress plugin that meets all specified requirements while maintaining high code quality and performance standards.