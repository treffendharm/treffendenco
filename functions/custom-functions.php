<?php

function input_to_button($button, $form)
{
    // Load the button HTML into a DOMDocument
    $dom = new DOMDocument();
    $dom->loadHTML('<?xml encoding="utf-8" ?>' . $button);

    $input = $dom->getElementsByTagName('input')->item(0);
    $new_button = $dom->createElement('button');
    $new_button->appendChild($dom->createTextNode($input->getAttribute('value')));

    foreach ($input->attributes as $attribute) {
        $attribute_name = $attribute->name;
        $attribute_value = $attribute->value;
        $new_button->setAttribute($attribute_name, $attribute_value);
    }
    $new_button->setAttribute('class', 'button');
    $input->parentNode->replaceChild($new_button, $input);

    return $dom->saveHtml($new_button);
}
add_filter('gform_next_button', 'input_to_button', 10, 2);
add_filter('gform_previous_button', 'input_to_button', 10, 2);
add_filter('gform_submit_button', 'input_to_button', 10, 2);


/**
 * Populate ACF select fields with Gravity Forms forms for fields ending with '_pop_form'
 */
function acf_populate_gf_forms_ids($field)
{
    // Check if the field name ends with '_pop_form'
    if (class_exists('GFFormsModel') && substr($field['name'], -9) === '_pop_form') {
        $choices = [];

        // Get all Gravity Forms forms
        foreach (\GFFormsModel::get_forms() as $form) {
            $choices[$form->id] = $form->title;
        }

        // Set the choices for the select field
        $field['choices'] = $choices;
    }

    return $field;
}
add_filter('acf/load_field', 'acf_populate_gf_forms_ids');



// shorter excerpt
// function custom_excerpt_lenth($length)
// {
//     return 12;
// }
// add_filter('excerpt_length', 'custom_excerpt_lenth', 999);

function custom_exerpt_more($more)
{
    return '&hellip;';
}
add_filter('excerpt_more', 'custom_exerpt_more');





function custom_excerpt($id, $size = 146, $trim = true)
{
    // Check if the post has a manual excerpt

    // If a manual excerpt exists, use it
    if (has_excerpt()) {
        return get_the_excerpt($id);
    }

    // Otherwise, get the post content and create a custom excerpt
    $excerpt = get_the_content($id);
    if ($trim == true) $excerpt = wp_strip_all_tags($excerpt); // Strip HTML tags and shortcodes


    // Limit the excerpt to 230 characters
    if (strlen($excerpt) > $size) {
        $excerpt = substr($excerpt, 0, $size) . '...'; // Add ellipsis
    }

    return $excerpt;
}


function get_block_posts($posts = null, $tag = 'project', $posts_per_page = 6)
{
    if (is_singular('post')) {
        $posts = [];

        // Get previous and next posts
        $previous_post = get_previous_post();
        $next_post = get_next_post();

        // If there's no previous post, loop to the last post
        if (!$previous_post) {
            $previous_post = get_posts([
                'posts_per_page' => 1,
                'orderby'        => 'date',
                'order'          => 'DESC',
                'post_type'      => get_post_type(),
                'post_status'    => 'publish',
                'tag'            => $tag
            ]);
            $previous_post = $previous_post[0] ?? null;
        }

        // If there's no next post, loop to the first post
        if (!$next_post) {
            $next_post = get_posts([
                'posts_per_page' => 1,
                'orderby'        => 'date',
                'order'          => 'ASC',
                'post_type'      => get_post_type(),
                'post_status'    => 'publish',
                'tag'            => $tag
            ]);
            $next_post = $next_post[0] ?? null;
        }

        // Add found post IDs to the array
        if ($next_post) {
            $posts[] = $next_post->ID;
        }
        if ($previous_post) {
            $posts[] = $previous_post->ID;
        }
    } elseif (!$posts) {
        // Default: Fetch latest posts
        $recent_posts = get_posts([
            'posts_per_page' => $posts_per_page,
            'orderby'        => 'date',
            'order'          => 'DESC',
            'post_status'    => 'publish',
            'tag'            => $tag
        ]);
        $posts = wp_list_pluck($recent_posts, 'ID');
    }

    return $posts;
}
