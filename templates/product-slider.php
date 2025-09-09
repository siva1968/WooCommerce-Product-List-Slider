<?php
/**
 * Product Slider Template
 *
 * @param array $images Array of image IDs or URLs
 * @param int $product_id Product ID
 * @version 1.0.0
 */

// Security check
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Validate inputs
if ( empty( $images ) || ! is_array( $images ) ) {
	return;
}

// Use Security_Utils for product validation
$product_id = \WC_Product_List_Slider\Security_Utils::sanitize_product_id( $product_id );
if ( ! $product_id ) {
	return;
}

// Final validation of all images before output
$validated_images = array();
foreach ( $images as $image_id ) {
	if ( \WC_Product_List_Slider\Security_Utils::is_valid_image_attachment( $image_id ) ) {
		$validated_images[] = absint( $image_id );
	}
}

if ( empty( $validated_images ) ) {
	return;
}

// Update $images with validated ones
$images = $validated_images;

// Action hook for before slider
do_action( 'wcpls_before_slider', $product_id, $images );
?>

<div class="wc-product-list-slider-container" data-product-id="<?php echo esc_attr( $product_id ); ?>">
	<?php if ( count( $images ) > 1 ) : ?>
		<div class="swiper" role="region" aria-label="<?php esc_attr_e( 'Product images slider', 'wc-product-list-slider' ); ?>">
			<div class="swiper-wrapper">
				<?php foreach ( $images as $index => $img ) : ?>
					<div class="swiper-slide" role="group" aria-label="<?php echo esc_attr( sprintf( __( 'Image %d of %d', 'wc-product-list-slider' ), $index + 1, count( $images ) ) ); ?>">
						<?php
						if ( is_numeric( $img ) && wp_attachment_is_image( $img ) ) {
							$image_alt = get_post_meta( $img, '_wp_attachment_image_alt', true );
							$image_alt = $image_alt ? $image_alt : sprintf( __( 'Product image %d', 'wc-product-list-slider' ), $index + 1 );
							
							echo wp_get_attachment_image( 
								$img, 
								'woocommerce_thumbnail', 
								false, 
								[
									'class' => 'slider-image',
									'data-product-id' => $product_id,
									'alt' => $image_alt,
									'loading' => $index === 0 ? 'eager' : 'lazy'
								]
							);
						} else {
							// Fallback for placeholder images
							echo '<img src="' . esc_url( $img ) . '" class="slider-image" data-product-id="' . esc_attr( $product_id ) . '" alt="' . esc_attr__( 'Product placeholder', 'wc-product-list-slider' ) . '" loading="lazy" />';
						}
						?>
					</div>
				<?php endforeach; ?>
			</div>
			
			<!-- Add pagination -->
			<div class="swiper-pagination" role="tablist" aria-label="<?php esc_attr_e( 'Slider pagination', 'wc-product-list-slider' ); ?>"></div>
		</div>
	<?php else : ?>
		<!-- Fallback for single image -->
		<?php
		$img = $images[0];
		if ( is_numeric( $img ) && wp_attachment_is_image( $img ) ) {
			echo wp_get_attachment_image( $img, 'woocommerce_thumbnail', false, [ 'class' => 'single-product-image' ] );
		}
		?>
	<?php endif; ?>
</div>

<?php
// Action hook for after slider
do_action( 'wcpls_after_slider', $product_id, $images );
?>
