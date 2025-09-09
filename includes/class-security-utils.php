<?php
namespace WC_Product_List_Slider;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Security and utility functions
 */
class Security_Utils {
	
	/**
	 * Verify nonce for AJAX requests
	 *
	 * @param string $nonce Nonce value
	 * @param string $action Nonce action
	 * @return bool
	 */
	public static function verify_nonce( $nonce, $action = 'wcpls_frontend' ) {
		return wp_verify_nonce( $nonce, $action );
	}
	
	/**
	 * Check user capabilities
	 *
	 * @param string $capability Required capability
	 * @return bool
	 */
	public static function current_user_can( $capability = 'manage_options' ) {
		return current_user_can( $capability );
	}
	
	/**
	 * Sanitize product ID
	 *
	 * @param mixed $product_id Product ID
	 * @return int|false
	 */
	public static function sanitize_product_id( $product_id ) {
		$id = absint( $product_id );
		if ( ! $id || 'product' !== get_post_type( $id ) ) {
			return false;
		}
		return $id;
	}
	
	/**
	 * Rate limit check for AJAX requests
	 *
	 * @param string $key Unique key for rate limiting
	 * @param int $limit Number of requests allowed
	 * @param int $window Time window in seconds
	 * @return bool
	 */
	public static function rate_limit_check( $key, $limit = 60, $window = 60 ) {
		$transient_key = 'wcpls_rate_limit_' . md5( $key );
		$current_count = get_transient( $transient_key );
		
		if ( false === $current_count ) {
			set_transient( $transient_key, 1, $window );
			return true;
		}
		
		if ( $current_count >= $limit ) {
			return false;
		}
		
		set_transient( $transient_key, $current_count + 1, $window );
		return true;
	}
	
	/**
	 * Log security events
	 *
	 * @param string $message Log message
	 * @param string $level Log level
	 */
	public static function log_security_event( $message, $level = 'warning' ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( sprintf( '[WCPLS Security] %s: %s', strtoupper( $level ), $message ) );
		}
	}
	
	/**
	 * Validate image attachment
	 *
	 * @param int $attachment_id Attachment ID
	 * @return bool
	 */
	public static function is_valid_image_attachment( $attachment_id ) {
		$attachment_id = absint( $attachment_id );
		
		if ( ! $attachment_id ) {
			return false;
		}
		
		if ( ! wp_attachment_is_image( $attachment_id ) ) {
			return false;
		}
		
		$attachment_post = get_post( $attachment_id );
		if ( ! $attachment_post || 'attachment' !== $attachment_post->post_type ) {
			return false;
		}
		
		return true;
	}
}
