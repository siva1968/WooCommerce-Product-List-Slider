<?php
namespace WC_Product_List_Slider;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Admin {
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'add_settings_page' ] );
		add_action( 'admin_init', [ $this, 'register_settings' ] );
	}

	public function add_settings_page() {
		add_options_page(
			__( 'Product List Slider Settings', 'wc-product-list-slider' ),
			__( 'Product List Slider', 'wc-product-list-slider' ),
			'manage_options',
			'wc-product-list-slider',
			[ $this, 'render_settings_page' ]
		);
	}

	public function register_settings() {
		register_setting( 'wcpls_settings', 'wcpls_enabled', [
			'type' => 'string',
			'sanitize_callback' => [ $this, 'sanitize_enabled' ],
			'default' => '1'
		] );
		register_setting( 'wcpls_settings', 'wcpls_slider_speed', [
			'type' => 'integer',
			'sanitize_callback' => [ $this, 'sanitize_speed' ],
			'default' => 2500
		] );
		register_setting( 'wcpls_settings', 'wcpls_slider_effect', [
			'type' => 'string',
			'sanitize_callback' => [ $this, 'sanitize_effect' ],
			'default' => 'slide'
		] );
		register_setting( 'wcpls_settings', 'wcpls_premium_layout', [
			'type' => 'string',
			'sanitize_callback' => [ $this, 'sanitize_layout' ],
			'default' => 'default'
		] );

		add_settings_section(
			'wcpls_main',
			__( 'Slider Settings', 'wc-product-list-slider' ),
			null,
			'wcpls_settings_section'
		);

		add_settings_field(
			'wcpls_enabled',
			__( 'Enable Slider', 'wc-product-list-slider' ),
			[ $this, 'field_enabled' ],
			'wcpls_settings_section',
			'wcpls_main'
		);
		add_settings_field(
			'wcpls_slider_speed',
			__( 'Slider Speed (ms)', 'wc-product-list-slider' ),
			[ $this, 'field_slider_speed' ],
			'wcpls_settings_section',
			'wcpls_main'
		);
		add_settings_field(
			'wcpls_slider_effect',
			__( 'Slider Effect', 'wc-product-list-slider' ),
			[ $this, 'field_slider_effect' ],
			'wcpls_settings_section',
			'wcpls_main'
		);
		add_settings_field(
			'wcpls_premium_layout',
			__( 'Premium Layout', 'wc-product-list-slider' ),
			[ $this, 'field_premium_layout' ],
			'wcpls_settings_section',
			'wcpls_main'
		);
	}

	public function field_slider_effect() {
		$val = get_option( 'wcpls_slider_effect', 'slide' );
		echo '<select name="wcpls_slider_effect">';
		$effects = [
			'slide' => __( 'Slide', 'wc-product-list-slider' ),
			'fade' => __( 'Fade', 'wc-product-list-slider' ),
			'cube' => __( 'Cube', 'wc-product-list-slider' ),
			'coverflow' => __( 'Coverflow', 'wc-product-list-slider' ),
			'flip' => __( 'Flip', 'wc-product-list-slider' ),
		];
		foreach ( $effects as $k => $label ) {
			echo '<option value="' . esc_attr( $k ) . '"' . selected( $val, $k, false ) . '>' . esc_html( $label ) . '</option>';
		}
		echo '</select> ' . esc_html__( 'Choose slider transition effect.', 'wc-product-list-slider' );
	}

	public function field_premium_layout() {
		$val = get_option( 'wcpls_premium_layout', 'default' );
		echo '<select name="wcpls_premium_layout">';
		$layouts = [
			'default' => __( 'Default', 'wc-product-list-slider' ),
			'carousel' => __( 'Carousel (Premium)', 'wc-product-list-slider' ),
			'masonry' => __( 'Masonry (Premium)', 'wc-product-list-slider' ),
			'grid' => __( 'Grid (Premium)', 'wc-product-list-slider' ),
		];
		foreach ( $layouts as $k => $label ) {
			echo '<option value="' . esc_attr( $k ) . '"' . selected( $val, $k, false ) . '>' . esc_html( $label ) . '</option>';
		}
		echo '</select> ' . esc_html__( 'Choose layout (Premium layouts require upgrade).', 'wc-product-list-slider' );
		if ( $val !== 'default' ) {
			echo '<p style="color:#c00;font-weight:bold;">' . esc_html__( 'Premium layouts are not available in the free version.', 'wc-product-list-slider' ) . '</p>';
		}
	}

	public function render_settings_page() {
		// Check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( __( 'You do not have sufficient permissions to access this page.', 'wc-product-list-slider' ) );
		}
		
		// Process form submission with nonce verification
		if ( isset( $_POST['submit'] ) && isset( $_POST['wcpls_settings_nonce'] ) ) {
			if ( ! wp_verify_nonce( $_POST['wcpls_settings_nonce'], 'wcpls_save_settings' ) ) {
				wp_die( __( 'Security check failed. Please try again.', 'wc-product-list-slider' ) );
			}
		}
		
		echo '<div class="wrap">';
		echo '<h1>' . esc_html__( 'Product List Slider Settings', 'wc-product-list-slider' ) . '</h1>';
		
		// Show success message
		if ( isset( $_GET['settings-updated'] ) && $_GET['settings-updated'] === 'true' ) {
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved successfully.', 'wc-product-list-slider' ) . '</p></div>';
		}
		
		// Show WooCommerce status
		if ( ! wcpls_is_woocommerce_active() ) {
			echo '<div class="notice notice-warning"><p>' . esc_html__( 'WooCommerce is not active. The slider will not function without WooCommerce.', 'wc-product-list-slider' ) . '</p></div>';
		}
		
		echo '<form method="post" action="options.php">';
		wp_nonce_field( 'wcpls_save_settings', 'wcpls_settings_nonce' );
		settings_fields( 'wcpls_settings' );
		do_settings_sections( 'wcpls_settings_section' );
		submit_button();
		echo '</form>';
		echo '</div>';
	}
	
	/**
	 * Sanitize enabled setting
	 */
	public function sanitize_enabled( $input ) {
		return '1' === $input ? '1' : '0';
	}
	
	/**
	 * Sanitize speed setting
	 */
	public function sanitize_speed( $input ) {
		$speed = absint( $input );
		return ( $speed >= 500 && $speed <= 10000 ) ? $speed : 2500;
	}
	
	/**
	 * Sanitize effect setting
	 */
	public function sanitize_effect( $input ) {
		$allowed_effects = [ 'slide', 'fade', 'cube', 'coverflow', 'flip' ];
		return in_array( $input, $allowed_effects, true ) ? $input : 'slide';
	}
	
	/**
	 * Sanitize layout setting
	 */
	public function sanitize_layout( $input ) {
		$allowed_layouts = [ 'default', 'carousel', 'masonry', 'grid' ];
		return in_array( $input, $allowed_layouts, true ) ? $input : 'default';
	}

	public function field_enabled() {
		$val = get_option( 'wcpls_enabled', '1' );
		echo '<input type="checkbox" name="wcpls_enabled" value="1" ' . checked( $val, '1', false ) . ' /> ' . esc_html__( 'Enable the product slider on shop/category pages.', 'wc-product-list-slider' );
	}

	public function field_slider_speed() {
		$val = esc_attr( get_option( 'wcpls_slider_speed', '2500' ) );
		echo '<input type="number" name="wcpls_slider_speed" value="' . $val . '" min="500" step="100" /> ' . esc_html__( 'Autoplay speed in milliseconds.', 'wc-product-list-slider' );
	}
}
