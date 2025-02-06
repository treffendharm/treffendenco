<?php

// Set favicon for backend 
function admin_favicon()
{
    $favicon = get_field('favicon', 'options')['url'] ?? get_template_directory_uri() . '/src/images/icons/favicon.png';
    if (DEVELOPMENT) {
        $favicon = get_template_directory_uri() . '/src/images/icons/dev-favicon.png';
    }
    echo '<link rel="shortcut icon" href="' . $favicon . '" />';
}
add_action('wp_head', 'admin_favicon');
add_action('admin_head', 'admin_favicon');
// add_editor_style('admincss.css');

/**
 * Disable comments
 */

// Remove comments from admin menu
function remove_comments_from_admin_menu()
{
    remove_menu_page('edit-comments.php');
}
add_action('admin_menu', 'remove_comments_from_admin_menu');

// Remove comments from posts and pages
function remove_comments_from_post_types()
{
    remove_post_type_support('post', 'comments');
    remove_post_type_support('page', 'comments');
}
add_action('init', 'remove_comments_from_post_types', 100);

// Remove comments from admin bar
function remove_comments_from_admin_bar()
{
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('comments');
}
add_action('wp_before_admin_bar_render', 'remove_comments_from_admin_bar');

/**
 * Remove link to customizer in frontend admin bar
 */
function labelvier_before_admin_bar_render()
{
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('customize');
}
add_action('wp_before_admin_bar_render', 'labelvier_before_admin_bar_render');


/**
 * Add theme support
 */
function treffend_theme_features()
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support( 'rank-math-breadcrumbs' );
    // add_theme_support('woocommerce');


    // Add widgets for the 4 footer columns
    // add_theme_support('widgets');

    remove_post_type_support('post', 'comments');
    remove_post_type_support('page', 'comments');

    register_nav_menus(array(
        'main_menu' => 'Navigatie bovenaan de pagina',
        'footer_menu' => 'Navigatie menu in de footer'
    ));
}

add_action('after_setup_theme', 'treffend_theme_features');

/**
 * Allow SVG uploads
 */
function treffend_file_type_allowes($type)
{
    $type['svg'] = 'image/svg+xml';
    $type['ico'] = 'image/x-icon';
    return $type;
}
add_filter('upload_mimes', 'treffend_file_type_allowes');

/**
 * Voor het inladen van scripts een module maken
 */
function make_it_a_module($tag, $handle, $src)
{
    if (strpos($handle, 'module_') !== false) {
        $tag = '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '"></script>';
    }
    return $tag;
}
add_filter('script_loader_tag', 'make_it_a_module', 10, 3);

/**
 * /search/ in plaats van ?s=
 */
function treffend_change_search_url()
{
    if (is_search() && !empty($_GET['s'])) {
        wp_redirect(home_url("/search/") . urlencode(get_query_var('s')));
        exit();
    }
}
add_action('template_redirect', 'treffend_change_search_url');

// Move Yoast to bottom
function yoasttobottom()
{
    return 'low';
}
add_filter('wpseo_metabox_prio', 'yoasttobottom');

add_filter('aioseo_post_metabox_priority', function ($priority) {
    return 'low';
});

/**
 * Custom styles voor in de editor
 */
function custom_editor_toolbar($toolbar)
{
    // Voeg aangepaste stijlkeuzelijst toe
    $toolbar[] = 'styleselect';

    return $toolbar;
}
add_filter('mce_buttons', 'custom_editor_toolbar');

// Voeg aangepaste stijlen toe aan de keuzelijst
function custom_editor_formats($init_array)
{
    // Voeg hier je aangepaste stijlen toe
    $custom_formats = array(
        array(
            'title' => 'Knop',
            'selector' => 'a',
            'classes' => 'button__primary',
        ),
        // array(
        //     'title' => 'Knop wit',
        //     'selector' => 'a',
        //     'classes' => 'button__white',
        // ),
        array(
            'title' => 'Download knop',
            'selector' => 'a',
            'classes' => 'button__download',
            'attributes' => array(
                'download' => 'download',
            ),
        ),
        array(
            'title' => 'Externe link',
            'selector' => 'a',
            'classes' => 'button__link',
        ),
    );
    $init_array['style_formats'] = json_encode($custom_formats);


    $block_formats = 'Paragraaf=p; Intro tekst=intro; Kop 2=h2;Kop 3=h3; Kop 4=h4';
    $init_array['block_formats'] = $block_formats;


    $init_array['toolbar1'] = 'formatselect, styleselect, link, bold, italic, bullist, numlist, blockquote, table, hr, pastetext, undo, redo';
    $init_array['toolbar2'] = '';


    return $init_array;
}
add_filter('tiny_mce_before_init', 'custom_editor_formats');


add_filter('acf/fields/wysiwyg/toolbars', 'custom_acf_toolbars');
function custom_acf_toolbars($toolbars)
{
    // Define a custom toolbar for ACF WYSIWYG fields
    $toolbars['Full'] = array();
    $toolbars['Full'][1] = array(
        'formatselect',
        'styleselect',
        'bold',
        'italic',
        'bullist',
        'numlist',
        'link',
        'blockquote',
        'table',
        'hr',
        'pastetext',
        'undo',
        'redo'
    );

    return $toolbars;
}

function add_the_table_plugin($plugins)
{
    $plugins['table'] = get_template_directory_uri() . '/src/js/tinymce-table.min.js'; // This version is smaller then the dist version lol
    return $plugins;
}
add_filter('mce_external_plugins', 'add_the_table_plugin');



function theme_after_wp_tiny_mce()
{
?>
    <script>
        jQuery(document).on('tinymce-editor-init', function(event, editor) {
            editor.formatter.register('intro', {
                block: 'p',
                classes: 'intro'
            });
        });
    </script>
<?php
}
add_action('after_wp_tiny_mce', 'theme_after_wp_tiny_mce');


// add_action('admin_head', 'remove_content_editor');
// function remove_content_editor()
// {
//     // remove the wordpress content editor from only the home page
//     $is_home = get_option('page_on_front') == get_the_ID();
//     if ($is_home) {
//         remove_post_type_support('page', 'editor');
//     }
// }

// Save custom excerpt on save_post
add_action('save_post', function ($post_id, $post) {
    if (has_blocks($post)) {
        $parsed_blocks = parse_blocks($post->post_content);

        $rendered_blocks = array_reduce($parsed_blocks, function ($prev_blocks, $current_block) {
            if ($current_block['blockName'] === 'acf/text') {
                // Special handling for text block
                $text_content = '';

                // Handle inner blocks
                if (!empty($current_block['innerBlocks'])) {
                    foreach ($current_block['innerBlocks'] as $inner_block) {
                        $text_content .= render_block($inner_block);
                    }
                }

                // Handle direct content
                if (!empty($current_block['attrs']['data']['content'])) {
                    $text_content .= $current_block['attrs']['data']['content'];
                }

                return $prev_blocks . $text_content;
            } elseif (strpos($current_block['blockName'], 'acf/') !== false) {
                return $prev_blocks . acf_rendered_block($current_block['attrs']);
            } elseif (strpos($current_block['blockName'], 'core/') !== false) {
                return $prev_blocks . render_block($current_block);
            }
            return $prev_blocks . '';
        });

        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="utf-8" ?>' . $rendered_blocks);

        $p_tags = $dom->getElementsByTagName('p');
        if ($p_tags) {
            $text = '';
            foreach ($p_tags as $p_tag) {
                $text .= ' ' . $p_tag->nodeValue;
            }

            update_post_meta($post->ID, 'treffend_blocks_excerpt', $text);
        }
    }
}, 10, 2);

// Filter excerpt to add custom blocks
add_filter('get_the_excerpt', function ($excerpt, $post) {
    if ($excerpt) {
        return $excerpt;
    }

    if ($treffend_blocks_excerpt = get_post_meta($post->ID, 'treffend_blocks_excerpt', true)) {
        $length = apply_filters('treffend_blocks_excerpt_length', apply_filters('excerpt_length', 20), $post); // Amount of words
        $more   = apply_filters('treffend_blocks_excerpt_more', apply_filters('excerpt_more', '...'), $post);

        return wp_trim_words($treffend_blocks_excerpt, $length, $more);
    }

    return '';
}, 20, 2);




// Function to get critical CSS
function get_critical_css() {
    $critical_css_path = get_template_directory() . '/dist/css/critical.css';
    if (file_exists($critical_css_path)) {
        return file_get_contents($critical_css_path);
    }
    return '';
}
