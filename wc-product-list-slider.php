<?php
/*
Plugin Name: WooCommerce Product List Slider
Plugin URI: https://github.com/yourname/wc-product-list-slider
Description: Display WooCommerce products in a responsive slider with hover effects and mobile touch support.
Version: 2.0.0
Author: Your Name
Author URI: https://yourwebsite.com
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: wc-product-list-slider
Domain Path: /languages
Requires at least: 5.0
Tested up to: 6.5
WC requires at least: 4.0
WC tested up to: 8.0
Network: false
*/

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants
define( 'WCPLS_VERSION', '2.0.0' );
define( 'WCPLS_PLUGIN_FILE', __FILE__ );
define( 'WCPLS_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'WCPLS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Check if WooCommerce is active (improved multisite compatibility)
function wcpls_is_woocommerce_active() {
    // Check if WooCommerce class exists
    if ( class_exists( 'WooCommerce' ) ) {
        return true;
    }
    
    // Check active plugins for single site
    if ( ! is_multisite() ) {
        return in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) );
    }
    
    // Check network active plugins for multisite
    $network_plugins = get_site_option( 'active_sitewide_plugins' );
    if ( is_array( $network_plugins ) && array_key_exists( 'woocommerce/woocommerce.php', $network_plugins ) ) {
        return true;
    }
    
    // Check current site plugins for multisite
    return in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) );
}

if ( ! wcpls_is_woocommerce_active() ) {
    add_action( 'admin_notices', function() {
        if ( current_user_can( 'activate_plugins' ) ) {
            echo '<div class="notice notice-error"><p><strong>WooCommerce Product List Slider</strong> requires WooCommerce to be installed and active.</p></div>';
        }
    } );
    return;
}

// Autoloader for plugin classes
spl_autoload_register( function ( $class ) {
    if ( strpos( $class, 'WC_Product_List_Slider' ) !== false ) {
        // Remove namespace prefix
        $class_name = str_replace( 'WC_Product_List_Slider\\', '', $class );
        
        // Convert class name to file name
        $class_file = 'class-' . strtolower( str_replace( '_', '-', $class_name ) ) . '.php';
        $full_path = plugin_dir_path( __FILE__ ) . 'includes/' . $class_file;
        
        if ( file_exists( $full_path ) ) {
            require_once $full_path;
        }
    }
} );

// Activation/Deactivation hooks
register_activation_hook( __FILE__, 'wcpls_activate_plugin' );
register_deactivation_hook( __FILE__, 'wcpls_deactivate_plugin' );
register_uninstall_hook( __FILE__, 'wcpls_uninstall_plugin' );

/**
 * Plugin activation callback
 */
function wcpls_activate_plugin() {
    // Check minimum requirements
    if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
        deactivate_plugins( plugin_basename( __FILE__ ) );
        wp_die( __( 'WooCommerce Product List Slider requires PHP 7.4 or higher. Your current PHP version is: ' . PHP_VERSION, 'wc-product-list-slider' ) );
    }
    
    if ( ! wcpls_is_woocommerce_active() && ! class_exists( 'WooCommerce' ) ) {
        deactivate_plugins( plugin_basename( __FILE__ ) );
        wp_die( __( 'WooCommerce Product List Slider requires WooCommerce to be installed and active. Please install and activate WooCommerce first.', 'wc-product-list-slider' ) );
    }
    
    // Check if required directories exist
    $required_dirs = [
        plugin_dir_path( __FILE__ ) . 'includes/',
        plugin_dir_path( __FILE__ ) . 'templates/',
        plugin_dir_path( __FILE__ ) . 'assets/'
    ];
    
    foreach ( $required_dirs as $dir ) {
        if ( ! is_dir( $dir ) ) {
            deactivate_plugins( plugin_basename( __FILE__ ) );
            wp_die( sprintf( __( 'WooCommerce Product List Slider is missing required directory: %s', 'wc-product-list-slider' ), $dir ) );
        }
    }
    
    // Check if critical files exist
    $required_files = [
        plugin_dir_path( __FILE__ ) . 'includes/class-wc-product-list-slider.php',
        plugin_dir_path( __FILE__ ) . 'includes/class-admin.php',
        plugin_dir_path( __FILE__ ) . 'includes/class-frontend.php',
        plugin_dir_path( __FILE__ ) . 'templates/product-slider.php'
    ];
    
    foreach ( $required_files as $file ) {
        if ( ! file_exists( $file ) ) {
            deactivate_plugins( plugin_basename( __FILE__ ) );
            wp_die( sprintf( __( 'WooCommerce Product List Slider is missing required file: %s', 'wc-product-list-slider' ), basename( $file ) ) );
        }
    }
    
    // Set default options (only if they don't exist)
    add_option( 'wcpls_enabled', '1' );
    add_option( 'wcpls_slider_speed', '2500' );
    add_option( 'wcpls_slider_effect', 'slide' );
    add_option( 'wcpls_premium_layout', 'default' );
    
    // Record activation timestamp
    add_option( 'wcpls_activated_time', current_time( 'timestamp' ) );
    
    // Flush rewrite rules if needed
    flush_rewrite_rules();
}

/**
 * Plugin deactivation callback
 */
function wcpls_deactivate_plugin() {
    // Clear any cached data
    wp_cache_flush();
}

/**
 * Plugin uninstall callback
 */
function wcpls_uninstall_plugin() {
    // Remove plugin options
    delete_option( 'wcpls_enabled' );
    delete_option( 'wcpls_slider_speed' );
    delete_option( 'wcpls_slider_effect' );
    delete_option( 'wcpls_premium_layout' );
    delete_option( 'wcpls_activated_time' );
    
    // Clean up transients
    delete_transient( 'wcpls_health_check' );
    
    // Remove any rate limiting transients
    global $wpdb;
    if ( $wpdb ) {
        $wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_wcpls_rate_limit_%'" );
        $wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_wcpls_rate_limit_%'" );
    }
    
    // Clear any cached data
    if ( function_exists( 'wp_cache_flush' ) ) {
        wp_cache_flush();
    }
    
    // Drop custom tables if any (future use)
    // wcpls_drop_tables();
}

// Load text domain for translations
add_action( 'plugins_loaded', 'wcpls_load_textdomain' );

function wcpls_load_textdomain() {
	load_plugin_textdomain( 
		'wc-product-list-slider', 
		false, 
		dirname( plugin_basename( __FILE__ ) ) . '/languages/' 
	);
}

/**
 * Plugin health check function
 */
function wcpls_health_check() {
    $issues = array();
    
    // Check WooCommerce
    if ( ! wcpls_is_woocommerce_active() ) {
        $issues[] = __( 'WooCommerce is not active', 'wc-product-list-slider' );
    }
    
    // Check critical files
    $critical_files = [
        'includes/class-wc-product-list-slider.php',
        'includes/class-admin.php', 
        'includes/class-frontend.php',
        'templates/product-slider.php',
        'assets/frontend.css'
    ];
    
    foreach ( $critical_files as $file ) {
        if ( ! file_exists( plugin_dir_path( __FILE__ ) . $file ) ) {
            $issues[] = sprintf( __( 'Missing critical file: %s', 'wc-product-list-slider' ), $file );
        }
    }
    
    // Check JavaScript files
    $js_files = [ 'frontend.js', 'frontend-simplified.js' ];
    $has_js = false;
    foreach ( $js_files as $js_file ) {
        if ( file_exists( plugin_dir_path( __FILE__ ) . 'assets/' . $js_file ) ) {
            $has_js = true;
            break;
        }
    }
    
    if ( ! $has_js ) {
        $issues[] = __( 'No JavaScript files found', 'wc-product-list-slider' );
    }
    
    return $issues;
}

// Initialize main plugin class with health checks
add_action( 'plugins_loaded', function() {
    // Run health check
    $health_issues = wcpls_health_check();
    
    if ( ! empty( $health_issues ) ) {
        // Log health issues
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( 'WCPLS Health Check Issues: ' . implode( ', ', $health_issues ) );
        }
        
        // Show admin notice for critical issues
        add_action( 'admin_notices', function() use ( $health_issues ) {
            if ( current_user_can( 'activate_plugins' ) ) {
                echo '<div class="notice notice-error"><p><strong>WooCommerce Product List Slider:</strong> ' . implode( '<br>', array_map( 'esc_html', $health_issues ) ) . '</p></div>';
            }
        } );
        
        // Don't initialize if critical issues exist
        if ( in_array( 'WooCommerce is not active', $health_issues ) ) {
            return;
        }
    }
    
    // Initialize plugin
    try {
        \WC_Product_List_Slider\WC_Product_List_Slider::get_instance();
    } catch ( Exception $e ) {
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( 'WCPLS Initialization Error: ' . $e->getMessage() );
        }
        
        add_action( 'admin_notices', function() use ( $e ) {
            if ( current_user_can( 'activate_plugins' ) ) {
                echo '<div class="notice notice-error"><p><strong>WooCommerce Product List Slider:</strong> Initialization failed. ' . esc_html( $e->getMessage() ) . '</p></div>';
            }
        } );
    }
}, 20 );
