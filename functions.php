<?php
if (strpos($_SERVER['HTTP_HOST'], '.local') !== false) {
    define('DEVELOPMENT', true);
} else {
    define('DEVELOPMENT', false);
}

require_once __DIR__ . '/functions/autoload.php';

function treffend_theme_files()
{
    // no block editor
    wp_deregister_style('wp-block-library');
    wp_dequeue_style('global-styles');

    // Main theme styles - with preload
    wp_enqueue_style('treffend_main_style', get_template_directory_uri() . '/dist/css/style.css', [], '1.0.0');
    wp_enqueue_style('swiper-css', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');

    // Add preload for main stylesheet
    add_action('wp_head', function () {
        echo '<link rel="preload" href="' . get_template_directory_uri() . '/dist/css/style.css" as="style">';
    }, 1);

    // Main script
    wp_enqueue_script(
        'treffend_main_script',
        get_template_directory_uri() . '/dist/js/bundle.js',
        ['jquery'],
        filemtime(get_template_directory() . '/dist/js/bundle.js'),
        false
    );

    // --- GSAP --- \\
    wp_enqueue_script('gsap-js', 'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js', array(), false, true);
    wp_enqueue_script('gsap-st', 'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js', array('gsap-js'), false, true);
    wp_enqueue_script('gsap-f', 'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/Draggable.min.js', array('gsap-js'), false, true);
    
    
    wp_enqueue_script('swiper-js', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(''), false, true);
    wp_enqueue_script('mouse-follower', get_template_directory_uri() . '/src/js/vendor/MouseFollower.js', array(''), false, true);
}
add_action('wp_enqueue_scripts', 'treffend_theme_files');


// Add a custom css file to the wordpress admin
function treffend_admin_files()
{
    wp_enqueue_style('custom_wp_admin_css', get_template_directory_uri() . '/dist/css/admincss.css');

    // Only load Gutenberg filters on post edit screens
    $current_screen = get_current_screen();
    if ($current_screen && $current_screen->is_block_editor()) {
        wp_enqueue_script(
            'gutenberg-filters',
            get_template_directory_uri() . '/dist/js/filter-gutenberg-blocks.js',
            ['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
            filemtime(get_template_directory() . '/dist/js/filter-gutenberg-blocks.js'),
            true
        );
    }
}
add_action('admin_enqueue_scripts', 'treffend_admin_files');


$projectClass = register_filter('post');