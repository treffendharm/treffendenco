<?php

/**
 * Block handling and configuration
 * 
 * This file contains all block-related functionality:
 * - Block registration
 * - Block restrictions
 * - Block rendering
 * - Block styling
 */

// =========================================
// BLOCK REGISTRATION
// =========================================

/**
 * Register ACF blocks automatically from the blocks directory
 */
function register_acf_blocks()
{
    $blocks = glob(get_template_directory() . '/blocks/*/block.json');
    foreach ($blocks as $block) {
        register_block_type($block, array(
            'render_callback' => 'treffend_acf_block_render_callback',
        ));
    }
}
add_action('init', 'register_acf_blocks');

// =========================================
// BLOCK RESTRICTIONS & PERMISSIONS
// =========================================

/**
 * Control which blocks are allowed in different contexts
 */
function treffend_allowed_block_types($allowed_blocks, $editor_context)
{
    // Auto-detect custom blocks
    $blocks_directory = get_template_directory() . '/blocks/';
    $single_blocks_directory = glob($blocks_directory . '*/', GLOB_ONLYDIR);

    // Start with core blocks and our custom blocks
    $allowed_block_list = [
        'core/block',
        'core/paragraph',
        'core/heading',
        'core/list',
        'core/image'
    ];

    // Add all custom blocks automatically
    foreach ($single_blocks_directory as $directory) {
        $allowed_block = 'acf/' . basename($directory);
        $allowed_block_list[] = $allowed_block;
    }


    return $allowed_block_list;
}
add_filter('allowed_block_types_all', 'treffend_allowed_block_types', 25, 2);

// =========================================
// BLOCK RENDERING & WRAPPING
// =========================================

/**
 * Main block render callback
 */
function treffend_acf_block_render_callback($block_attributes, $content = '', $is_preview = false, $post_id = 0)
{
    if ($is_preview === true) : ?>
        <div class="treffend-block">
            <span class="treffend-block-icon dashicons dashicons-<?= $block_attributes['icon'] ?>"></span>
            <span class="treffend-block-title"><?= $block_attributes['title'] ?></span>
            <span class="treffend-block-edit dashicons dashicons-edit"></span>
        </div>
<?php else :
        $block_index = $block_index ?? 0;
        $block_path  = $block_attributes['path'] . '/' . $block_attributes['render_template'];
        
        // Pass the block data to the template
        $block = $block_attributes; // Add this line to make block data available in template
        
        if ($anchor = $block_attributes['anchor'] ?? false) {
            ob_start();
            require $block_path;
            $block_html = ob_get_clean();
            echo preg_replace('/(<[a-z0-9]*)/', '$1 id="' . $anchor . '"', $block_html, 1);
        } else {
            require $block_path;
        }

        $block_index++;
    endif;
}

// =========================================
// EDITOR STYLING
// =========================================

/**
 * Add custom editor styles
 */
function add_editor_styles()
{
    $src = get_template_directory_uri() . '/includes/blocks.css';
    $version = '1.0';
    wp_enqueue_style('treffend-core-editor-style', $src, [], $version);
}
add_action('enqueue_block_editor_assets', 'add_editor_styles');

// function switch_to_classic_editor_for_specific_pages($use_block_editor, $post)
// {
//     // Voeg hier de pagina-ID's toe waar je de klassieke editor wilt gebruiken
//     $exclude_pages = array(47, 174, 147); // Home, Projecten en Contact

//     if (in_array($post->ID, $exclude_pages)) {
//         return false; // Zet de klassieke editor aan
//     }

//     return $use_block_editor; // Anders gebruik de blok editor
// }

// add_filter('use_block_editor_for_post', 'switch_to_classic_editor_for_specific_pages', 10, 2);

function treffend_setup_editor_settings()
{
    // Remove block patterns
    remove_theme_support('core-block-patterns');

    // Disable custom colors
    add_theme_support('disable-custom-colors');
    add_theme_support('editor-color-palette', []); // Empty array removes all colors

    // Set up font sizes
    add_theme_support('disable-custom-font-sizes');
    add_theme_support('editor-font-sizes', [
        [
            'name' => __('Normal', 'treffend'),
            'slug' => 'normal',
            'size' => 18,
        ],
        [
            'name' => __('Intro', 'treffend'),
            'slug' => 'intro',
            'size' => 24,
        ]
    ]);

    // Remove formatting options
    add_filter('block_editor_settings_all', function ($settings) {
        // Explicitly disable custom colors and font sizes
        $settings['disableCustomColors'] = true;
        $settings['disableCustomFontSizes'] = true;

        // Remove color palette
        $settings['colors'] = [];

        // Set available font sizes
        $settings['fontSizes'] = [
            [
                'name' => __('Normal', 'treffend'),
                'slug' => 'normal',
                'size' => 16,
            ],
            [
                'name' => __('Intro', 'treffend'),
                'slug' => 'intro',
                'size' => 20,
            ]
        ];

        return $settings;
    });

    // Limit allowed formats
    add_filter('wp_rich_text_allowed_formats', function () {
        return [
            'core/bold',
            'core/italic',
        ];
    });
}
add_action('after_setup_theme', 'treffend_setup_editor_settings');

/**
 * Register custom block category
 */
function register_block_categories($categories)
{
    return array_merge(
        [
            [
                'slug'  => 'treffend',
                'title' => 'Treffend',
                'icon'  => 'star-filled' // Je kunt hier een Dashicon kiezen: https://developer.wordpress.org/resource/dashicons/
            ],
        ],
        $categories
    );
}
add_filter('block_categories_all', 'register_block_categories', 10, 1);
