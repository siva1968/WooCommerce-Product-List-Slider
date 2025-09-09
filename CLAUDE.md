# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WordPress plugin called "WooCommerce Product List Slider" that replaces the default product thumbnails on WooCommerce shop and category pages with interactive image sliders. The plugin uses the Swiper.js library for slider functionality.

## Architecture

### Core Structure
- **Main Plugin File**: `wc-product-list-slider.php` - Entry point with activation/deactivation hooks and autoloader
- **Namespace**: `WC_Product_List_Slider` - All classes are namespaced
- **Singleton Pattern**: Main plugin class uses singleton pattern via `get_instance()`

### Key Classes
- `WC_Product_List_Slider\WC_Product_List_Slider` - Main plugin controller
- `WC_Product_List_Slider\Admin` - Admin settings interface 
- `WC_Product_List_Slider\Frontend` - Frontend asset loading and theme compatibility
- `WC_Product_List_Slider\Security_Utils` - Security utilities (if present)

### File Organization
- `/includes/` - PHP class files and helper functions
- `/templates/` - Template files (product-slider.php)
- `/assets/` - CSS/JS files and Swiper library
- `/docs/` - Documentation files

## Key Functionality

### Image Handling
- `includes/image-functions.php` contains functions for:
  - `get_product_featured_image_id()` - Gets featured image
  - `get_product_gallery_image_ids()` - Gets gallery images
  - `get_product_slider_images()` - Combines and validates images for slider

### Template System
- Uses `templates/product-slider.php` for slider output
- Supports template overrides via `wcpls_template_path` filter
- Includes accessibility attributes and lazy loading

### Settings
Plugin settings stored as WordPress options:
- `wcpls_enabled` - Enable/disable slider
- `wcpls_slider_speed` - Autoplay speed (500-10000ms)
- `wcpls_slider_effect` - Transition effect (slide, fade, cube, coverflow, flip)
- `wcpls_premium_layout` - Layout type (default, carousel, masonry, grid)

### WooCommerce Integration
- Hooks into `woocommerce_before_shop_loop_item_title` 
- Removes default product thumbnail and replaces with slider
- Only activates on shop/category/product pages when WooCommerce is active

## Development Guidelines

### Plugin Constants
- `WCPLS_VERSION` - Plugin version
- `WCPLS_PLUGIN_FILE` - Main plugin file path
- `WCPLS_PLUGIN_PATH` - Plugin directory path
- `WCPLS_PLUGIN_URL` - Plugin URL

### Security Practices
- All user input is sanitized via dedicated sanitize methods
- ABSPATH checks in all PHP files
- Nonce verification for admin forms
- Capability checks for admin access
- Image validation before output

### Performance Considerations
- Conditional asset loading (only on WooCommerce pages)
- Lazy loading for slider images (except first image)
- Maximum image limit (default 10, filterable)
- Minified asset detection and loading

### Developer Hooks
Available filters and actions documented in `docs/developer-hooks.md`:
- `wcpls_slider_images` - Filter image array
- `wcpls_before_slider` / `wcpls_after_slider` - Action hooks
- `wcpls_template_path` - Template path override
- `wcpls_max_images` - Maximum images limit

### Theme Compatibility
- Astra theme specific CSS overrides in Frontend class
- Uses WordPress image size `woocommerce_thumbnail`
- Responsive design considerations

## Asset Dependencies
- Swiper.js library (bundled in assets/)
- jQuery (WordPress core)
- CSS uses Swiper's styling as base

## Text Domain
- All strings use `wc-product-list-slider` text domain
- Translation ready with `load_plugin_textdomain()`