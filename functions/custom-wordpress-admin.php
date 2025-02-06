<?php
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
