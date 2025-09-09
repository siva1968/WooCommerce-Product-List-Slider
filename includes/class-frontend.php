<?php
namespace WC_Product_List_Slider;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Frontend {
	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	public function enqueue_assets() {
		// Only load on WooCommerce pages
		if ( ! ( is_shop() || is_product_category() || is_product_tag() || is_product() ) ) {
			return;
		}
		
		// Check if slider is enabled
		if ( '1' !== get_option( 'wcpls_enabled', '1' ) ) {
			return;
		}
		
		$ver = WCPLS_VERSION . '-stable-' . time(); // Stable cache busting for updates
		$assets = plugin_dir_url( dirname( __FILE__ ) ) . 'assets/';
		$assets_path = plugin_dir_path( dirname( __FILE__ ) ) . 'assets/';
		
		// Use CSS fallback - no Swiper dependencies
		$css_file = 'frontend.css';
		$js_file = 'frontend-css-fallback.js';
		
		// Don't load Swiper at all - we're using pure CSS
		// wp_enqueue_style( 'swiper', 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css', [], $ver );
		// wp_enqueue_script( 'swiper', 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js', [], $ver, false );
		
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'WCPLS: Using pure CSS fallback (no Swiper dependencies).' );
		}
		
		// Enqueue plugin assets - no dependencies since we're using pure CSS
		wp_enqueue_style( 'wc-product-list-slider', $assets . $css_file, [], $ver );
		wp_enqueue_script( 'wc-product-list-slider', $assets . $js_file, [], $ver, true );

		// Pass settings to JS
		$enabled = get_option( 'wcpls_enabled', '1' ) === '1';
		$speed = absint( get_option( 'wcpls_slider_speed', 2500 ) );
		$effect = sanitize_text_field( get_option( 'wcpls_slider_effect', 'slide' ) );
		$layout = sanitize_text_field( get_option( 'wcpls_premium_layout', 'default' ) );
		
		// Validate settings before passing to JS
		$allowed_effects = [ 'slide', 'fade', 'cube', 'coverflow', 'flip' ];
		$effect = in_array( $effect, $allowed_effects, true ) ? $effect : 'slide';
		
		$speed = ( $speed >= 500 && $speed <= 10000 ) ? $speed : 2500;
		
		wp_localize_script( 'wc-product-list-slider', 'wcplsSettings', [
			'enabled' => $enabled,
			'speed'   => $speed,
			'effect'  => $effect,
			'layout'  => $layout,
			'nonce'   => wp_create_nonce( 'wcpls_frontend' ),
			'ajaxUrl' => admin_url( 'admin-ajax.php' )
		] );

		// Astra theme compatibility
		if ( $this->is_astra_theme() ) {
			wp_add_inline_style( 'wc-product-list-slider', $this->astra_css_overrides() );
		}
	}

	/**
	 * Detect if Astra theme is active
	 */
	public function is_astra_theme() {
		return ( function_exists( 'wp_get_theme' ) && strpos( strtolower( wp_get_theme()->get( 'Name' ) ), 'astra' ) !== false );
	}

	/**
	 * Astra-specific CSS overrides
	 */
	public function astra_css_overrides() {
		return '.astra .wc-product-list-slider-container { box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-radius: 8px; }';
	}
}

// --- Performance: Lazy loading for slider images ---
namespace WC_Product_List_Slider;

/**
 * Add loading="lazy" to slider images for performance
 */
function wcpls_add_lazy_loading( $content ) {
	if ( strpos( $content, 'slider-image' ) !== false ) {
		$content = preg_replace( '/<img(.*?)class="([^"]*slider-image[^"]*)"(.*?)>/', '<img$1class="$2" loading="lazy"$3>', $content );
	}
	return $content;
}

/**
 * Register lazy loading filter
 */
function wcpls_register_lazy_loading() {
	add_filter( 'woocommerce_before_shop_loop_item_title', __NAMESPACE__ . '\wcpls_add_lazy_loading', 20 );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\wcpls_register_lazy_loading' );
