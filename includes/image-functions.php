<?php
namespace WC_Product_List_Slider;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the featured image ID for a product.
 *
 * @param int $product_id Product ID
 * @return int|false Image ID or false if not found
 */
function get_product_featured_image_id( $product_id ) {
	// Use Security_Utils for validation
	$product_id = Security_Utils::sanitize_product_id( $product_id );
	if ( ! $product_id ) {
		return false;
	}
	
	// Verify product exists and is published
	$product = wc_get_product( $product_id );
	if ( ! $product || 'publish' !== $product->get_status() ) {
		return false;
	}
	
	$image_id = get_post_thumbnail_id( $product_id );
	
	// Validate image using Security_Utils
	if ( $image_id && Security_Utils::is_valid_image_attachment( $image_id ) ) {
		return $image_id;
	}
	
	return false;
}

/**
 * Get gallery image IDs for a product.
 *
 * @param int $product_id Product ID
 * @return array Array of image IDs
 */
function get_product_gallery_image_ids( $product_id ) {
	// Use Security_Utils for validation
	$product_id = Security_Utils::sanitize_product_id( $product_id );
	if ( ! $product_id ) {
		return array();
	}
	
	$product = wc_get_product( $product_id );
	if ( ! $product || 'publish' !== $product->get_status() ) {
		return array();
	}
	
	$gallery_ids = $product->get_gallery_image_ids();
	
	// Validate image IDs using Security_Utils
	$valid_ids = array();
	foreach ( $gallery_ids as $id ) {
		if ( Security_Utils::is_valid_image_attachment( $id ) ) {
			$valid_ids[] = absint( $id );
		}
	}
	
	return $valid_ids;
}

/**
 * Combine featured and gallery images, ensure minimum 2 images, fallback if needed.
 *
 * @param int $product_id Product ID
 * @return array Array of image IDs/URLs
 */
function get_product_slider_images( $product_id ) {
	// Use Security_Utils for validation
	$product_id = Security_Utils::sanitize_product_id( $product_id );
	if ( ! $product_id ) {
		return array();
	}
	
	// Check if slider is enabled
	if ( '1' !== get_option( 'wcpls_enabled', '1' ) ) {
		return array();
	}
	
	$featured = get_product_featured_image_id( $product_id );
	$gallery = get_product_gallery_image_ids( $product_id );
	$images = array();
	
	if ( $featured ) {
		$images[] = $featured;
	}
	
	$images = array_merge( $images, $gallery );
	$images = array_unique( $images );
	
	// Final validation of all images
	$validated_images = array();
	foreach ( $images as $image_id ) {
		if ( Security_Utils::is_valid_image_attachment( $image_id ) ) {
			$validated_images[] = $image_id;
		}
	}
	
	// Apply filters for customization
	$validated_images = apply_filters( 'wcpls_slider_images', $validated_images, $product_id );
	
	// Ensure filter result is still an array of valid images
	if ( ! is_array( $validated_images ) ) {
		$validated_images = array();
	}
	
	// Limit max images for performance
	$max_images = apply_filters( 'wcpls_max_images', 10, $product_id );
	$max_images = absint( $max_images );
	if ( $max_images < 1 ) $max_images = 10;
	
	if ( count( $validated_images ) > $max_images ) {
		$validated_images = array_slice( $validated_images, 0, $max_images );
	}
	
	// Allow display with 1+ images (single image shows without slider functionality)
	if ( count( $validated_images ) < 1 ) {
		// Log for debugging if needed
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG && ! empty( $images ) ) {
			error_log( sprintf( 'WCPLS: No valid images found for product %d', $product_id ) );
		}
		return array();
	}
	
	return $validated_images;
}
