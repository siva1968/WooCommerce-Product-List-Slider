<?php
namespace WC_Product_List_Slider;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WC_Product_List_Slider {
	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		// Init plugin
		add_action( 'init', [ $this, 'init_hooks' ] );
		// Initialize frontend
		if ( ! is_admin() ) {
			new Frontend();
		} else {
			new Admin();
		}
	}

	public function init_hooks() {
		// Only on frontend and if WooCommerce is active
		if ( is_admin() || ! class_exists( 'WooCommerce' ) ) return;

		// Remove default thumbnail and add slider
		remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
		add_action( 'woocommerce_before_shop_loop_item_title', [ $this, 'output_product_slider' ], 10 );
	}

	public function output_product_slider() {
		global $product;
		
		// Validate product object
		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
			// Fallback to default thumbnail if no valid product
			if ( function_exists( 'woocommerce_template_loop_product_thumbnail' ) ) {
				woocommerce_template_loop_product_thumbnail();
			}
			return;
		}
		
		// Check if product is published and visible
		if ( 'publish' !== $product->get_status() || ! $product->is_visible() ) {
			if ( function_exists( 'woocommerce_template_loop_product_thumbnail' ) ) {
				woocommerce_template_loop_product_thumbnail();
			}
			return;
		}
		
		// Load image functions if not already loaded
		if ( ! function_exists( '\WC_Product_List_Slider\get_product_slider_images' ) ) {
			require_once plugin_dir_path( __FILE__ ) . 'image-functions.php';
		}
		
		try {
			// Get slider images
			$images = \WC_Product_List_Slider\get_product_slider_images( $product->get_id() );
			
			// Only show slider if we have images
			if ( empty( $images ) ) {
				// Fallback to default thumbnail
				if ( function_exists( 'woocommerce_template_loop_product_thumbnail' ) ) {
					woocommerce_template_loop_product_thumbnail();
				}
				return;
			}
			
			$product_id = $product->get_id();
			
			// Include template with error handling
			$template_path = apply_filters( 'wcpls_template_path', plugin_dir_path( __DIR__ ) . 'templates/product-slider.php' );
			
			if ( file_exists( $template_path ) ) {
				include $template_path;
			} else {
				// Template missing - log error and show fallback
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					error_log( 'WCPLS: Template file not found at: ' . $template_path );
				}
				if ( function_exists( 'woocommerce_template_loop_product_thumbnail' ) ) {
					woocommerce_template_loop_product_thumbnail();
				}
			}
			
		} catch ( Exception $e ) {
			// Handle any errors gracefully
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'WCPLS Error: ' . $e->getMessage() );
			}
			// Show default thumbnail as fallback
			if ( function_exists( 'woocommerce_template_loop_product_thumbnail' ) ) {
				woocommerce_template_loop_product_thumbnail();
			}
		}
	}
}
