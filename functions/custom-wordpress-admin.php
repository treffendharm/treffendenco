<?php
add_action('acf/init', 'my_acf_init');
function my_acf_init()
{
    acf_update_setting('show_admin', true);
}
function set_user_color_scheme($user_id)
{
    // Set the color scheme to 'modern' for all new users
    update_user_meta($user_id, 'admin_color', 'modern');
}
add_action('user_register', 'set_user_color_scheme');


function hide_dashboard_widgets()
{
    // Remove default dashboard widgets
    remove_meta_box('dashboard_quick_press', 'dashboard', 'side');
    remove_meta_box('dashboard_right_now', 'dashboard', 'normal');
    remove_meta_box('dashboard_activity', 'dashboard', 'normal');
    remove_meta_box('dashboard_site_health', 'dashboard', 'normal');

    // Remove the Gravity Forms dashboard widget if it exists
    remove_meta_box('rg_forms_dashboard', 'dashboard', 'normal');

    // Remove the primary dashboard widget
    remove_meta_box('dashboard_primary', 'dashboard', 'side');
    remove_action('welcome_panel', 'wp_welcome_panel');
}

// Hook into the dashboard setup
add_action('wp_dashboard_setup', 'hide_dashboard_widgets');


function treffend_welcome()
{
    // Add a meta box to the dashboard
    add_meta_box(
        'treffend_welcome', // Widget ID
        'Direct aan de slag',               // Title
        'treffend_welcome_content', // Callback function
        'dashboard',               // Screen (dashboard)
        'normal',                  // Context
        'high'                     // Priority
    );
}

// Callback function to display the content of the custom dashboard widget
function treffend_welcome_content()
{ ?>
    <ul class="quick-links-panel">
        <li><?php printf('<a href="%s" class="icon welcome-add-post">' . __('Maak een nieuw bericht') . '</a>', admin_url('post-new.php?post_type=post')); ?></li>
        <li><?php printf('<a href="%s" class="icon welcome-view-site" target="_blank">' . __('Bekijk de site') . '</a>', home_url('/')); ?></li>
    </ul>
    <style>
        .quick-links-panel {
            margin-bottom: -10px;
        }

        .quick-links-panel li {
            line-height: 1.14285714;
            list-style-type: none;
            padding: 0 0 8px;
        }

        .quick-links-panel .icon:before {
            color: #646970;
            font: normal 20px/1 dashicons;
            speak: never;
            display: inline-block;
            padding: 0 10px 0 0;
            position: relative;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-decoration: none !important;
            vertical-align: top;
        }

        .quick-links-panel .welcome-add-page:before {
            content: "\f133";
            top: -3px;
        }

        .quick-links-panel .welcome-add-post:before {
            content: "\f109";
            top: -3px;
        }

        .quick-links-panel .welcome-view-site:before {
            content: "\f115";
            top: -2px;
        }

        .quick-links-panel .welcome-change-menu:before {
            content: "\f333";
            top: -2px;
        }

        .quick-links-panel .welcome-theme-settings:before {
            content: "\f111";
            top: -3px;
        }
    </style>
<?php

}

add_action('wp_dashboard_setup', 'treffend_welcome');


function quick_fill_marquee()
{
    add_meta_box(
        'quick_fill_marquee',
        'Marquee tekst bewerken',
        'quick_fill_marquee_content',
        'dashboard',
        'normal',
        'high'
    );
}

function quick_fill_marquee_content()
{
    // Check if form was submitted and show notice
    if (isset($_GET['updated']) && $_GET['updated'] == 'true') {
        echo '<div class="notice notice-success inline" style="margin: 0 0 15px 0;"><p>Marquee tekst is succesvol bijgewerkt!</p></div>';
    }

    // Get the field object
    $field = get_field_object('marquee_items', 'option');

    // Create options page form elements
    acf_form_head();
    acf_form([
        'post_id' => 'option',
        'field_groups' => false,
        'fields' => ['marquee_items'],
        'submit_value' => 'Marquee bijwerken',
        'html_submit_button'  => '<input type="submit" class="acf-button button button-primary" value="%s" />',
        'html_after_fields'  => '',
        'return' => add_query_arg('updated', 'true', admin_url('index.php')), // Add success parameter
        'updated_message' => false // Disable default ACF message
    ]);
}

// Add the dashboard widget
add_action('wp_dashboard_setup', 'quick_fill_marquee');




// Function to change "posts" to "news" in the admin side menu
function change_post_menu_label()
{
    global $menu;
    global $submenu;
    $menu[5][0] = 'Projecten';
    $submenu['edit.php'][5][0] = 'Projecten';
    $submenu['edit.php'][10][0] = 'Project toevoegen';
    $submenu['edit.php'][16][0] = 'Tags';
    echo '';
}
add_action('admin_menu', 'change_post_menu_label');
// Function to change post object labels to "projects"
function change_post_object_label()
{
    global $wp_post_types;
    $labels = &$wp_post_types['post']->labels;
    $labels->name = 'Projecten';
    $labels->singular_name = 'Project';
    $labels->add_new = 'Voeg project toe';
    $labels->add_new_item = 'Nieuw project toevoegen';
    $labels->edit_item = 'Bewerk project';
    $labels->new_item = 'Project';
    $labels->view_item = 'Bekijk project';
    $labels->search_items = 'Zoek projecten';
    $labels->not_found = 'Geen projecten gevonden';
    $labels->not_found_in_trash = 'Geen projecten gevonden in Trash';
}
add_action('init', 'change_post_object_label');

function change_admin_bar_menu($wp_admin_bar)
{
    $node = $wp_admin_bar->get_node('view');
    if ($node) {
        $node->title = str_replace('Bericht bekijken', 'Project bekijken', $node->title);
        $wp_admin_bar->add_node($node);
    }
}
add_action('admin_bar_menu', 'change_admin_bar_menu', 999);
