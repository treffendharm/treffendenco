<?php

/**
 * This file contains a filter for post types
 * There are multiple filters you can enable:
 * - By price range (with a slider)
 * - By category'
 * - By tag
 * - By ACF field
 *      - Checkbox or
 *      - Select or
 *      - Radio or
 *      - Text or
 *      - Number or
 *      - Range (slider) or
 *      - Min max.
 * - By search
 *
 * Also pagination is included
 * 
 * Everything works with ajax so the page doesn't reload
 * 
 * @package TreffendTheme
 * @since TreffendTheme 1.0.0
 * @author Harm van de Kraats
 * 
 * For any functions we can call globaly to show that make the functionname start with treffend_
 */


class postTypeFilter
{

    private $post_type = "post";
    private $taxonomy = "category";
    private $has_pagination = true;
    private $category = '';

    public function __construct($post_type = 'post', $taxonomy = 'category', $has_pagination = true)
    {
        $this->post_type = $post_type;
        $this->taxonomy = $taxonomy;
        $this->has_pagination = $has_pagination;
    }

    public function set_taxonomy($taxonomy)
    {
        $this->taxonomy = $taxonomy;
    }


    public function get_categories($raw = false)
    {
        $categories = get_terms([
            'taxonomy' => $this->taxonomy,
            'hide_empty' => false,
        ]);

        if ($raw) return $categories;
        $categories_array = [];
        foreach ($categories as $category) {
            $category_array = [];
            $category_array['name'] = $category->name;
            $category_array['slug'] = $category->slug;
            $category_array['children'] = [];

            if ($category->parent === 0) {
                foreach ($categories as $child) {
                    if ($child->parent === $category->term_id) {
                        $child_array = [];
                        $child_array['name'] = $child->name;
                        $child_array['slug'] = $child->slug;
                        array_push($category_array['children'], $child_array);
                    }
                }
                array_push($categories_array, $category_array);
            }
        }
        return $categories_array;
    }

    public function get_post_type()
    {
        return $this->post_type;
    }

    public function get_taxonomy()
    {
        return $this->taxonomy;
    }

    public function calculate_pages($post_loop)
    {
        $post_amount = $post_loop->found_posts;
        $post_per_page = get_option('posts_per_page');

        $pages = ceil($post_amount  / $post_per_page);
        return $pages;
    }

    public function pagination_bar($post_loop, $current_page = false)
    {
        $pages = intval($this->calculate_pages($post_loop));

        if ($pages < 2) {
            return false;
        }

        // Render the pagination bar
        ob_start();
        get_template_part('template-parts/filter/filter', 'pagination', array(
            'pages' => $pages,
            'current_page' => $current_page
        ));
        $pagination = ob_get_clean();

        return $pagination;
    }



    /**
     * The purpose of this function is that you can create this filter anywhere in your theme
     * Then you will be able to choose what categories you want to show in the filter. 
     * If you leave empty it selects all the categories for the current post type.
     * 
     * Also keep in mind the pagination
     * 
     * @param array $categories
     * @return void
     */
    public function create_category_filter($args = array())
    {

        if (!isset($args['categories'])) {
            $args['categories'] = $this->get_categories();
        }

        ob_start();
        get_template_part('template-parts/filter/filter', 'category', $args);

        return ob_get_clean();
    }


    public function get_posts($method)
    {

        $method ?? $_POST;

        $post_offset = isset($method['is_page']) ? ($method['is_page'] - 1) * get_option('posts_per_page') : 0;

        // Define the base query arguments
        $args = [
            'post_type'         => $this->post_type,
            'post_status'       => 'publish',
            'posts_per_page'    => get_option('posts_per_page'),
            'orderby'           => 'date',
            'order'             => 'desc',
            'offset'            => $post_offset,
        ];

        // Get the category and search term from the GET parameters
        $category = $method['category'] ?? '';
        $search_term = $method['search'] ?? '';

        // If a category is selected, add it to the tax_query
        if (!empty($category) && $category !== 'all') {
            $args['tax_query'] = [
                [
                    'taxonomy' => $this->taxonomy,
                    'field'    => 'slug',
                    'terms'    => $category,
                ]
            ];
        } elseif ($category === 'all') {
            unset($args['tax_query']);
        }

        // If a search term is provided, add it to the query arguments
        if (!empty($search_term)) {
            $args['s'] = sanitize_text_field($search_term); // Sanitize the search term input
        }

        return new WP_Query($args);
    }


    public function print_posts($query, $args = array())
    {
        if ($query->have_posts()) {
            ob_start();
            
            // Calculate starting post number based on pagination
            $posts_per_page = get_option('posts_per_page');
            $current_page = isset($_POST['is_page']) ? (int)$_POST['is_page'] : 1;
            $start_number = (($current_page - 1) * $posts_per_page) + 1;
            
            $counter = $start_number;
            while ($query->have_posts()) {
                $query->the_post();
                get_template_part(
                    'template-parts/card',
                    $this->post_type,
                    array(
                        'args' => $args,
                        'post_number' => $counter
                    )
                );
                $counter++;
            }
            wp_reset_postdata();
            $content = ob_get_clean();

            // For initial page load, wrap in container
            if (!wp_doing_ajax()) {
                return sprintf(
                    '<div id="posts_wrapper" class="%s-wrapper cards-wrapper" data-post_type="%s" data-taxonomy="%s">%s</div>',
                    $this->post_type,
                    $this->post_type,
                    $this->taxonomy,
                    $content
                );
            }

            return $content;
        } else {
            $archive_page_id = get_option('page_for_posts');
            return sprintf(
                '<div id="posts_wrapper" class="%s-wrapper cards-wrapper" data-post_type="%s" data-taxonomy="%s">
                    <div class="not-found">
                        <p class="not-found">Geen %s gevonden</p><br>
                        <a href="#" class="clear-filters button__secondary-small">Reset</a>
                    </div>
                </div>',
                $this->post_type,
                $this->post_type, 
                $this->taxonomy,
                strtolower(get_the_title($archive_page_id))
            );
        }
    }




    function filter_post_type()
    {
        $response = array();

        $filterd_posts = $this->get_posts($_POST);

        $afterQueryResponse = array(
            'html' => [],
            'post' => $_POST,
            'pagination' => '',
            'post_type' => $this->post_type,
            'taxonomy' => $this->taxonomy,
            'query' => $filterd_posts,
            'has_posts' => $filterd_posts->have_posts(),
        );

        $response = array_merge($response, $afterQueryResponse);


        if ($filterd_posts->have_posts()) {
            $is_page = $_POST['is_page'] ?? 1;
            $pages = $this->pagination_bar($filterd_posts, $is_page);
            $response['pagination'] = $pages;
        }
        // Use print_posts function to print the posts
        $response['html'][] = $this->print_posts($filterd_posts);

        // Send the response as JSON
        echo json_encode($response);
        exit;
    }
}

function register_filter($post_type, $args = array())
{
    $taxonomy = isset($args['taxonomy']) ? $args['taxonomy'] : 'category';

    $filter = new postTypeFilter($post_type, $taxonomy);
    add_action('wp_ajax_filter_post_type', array($filter, 'filter_post_type'));
    add_action('wp_ajax_nopriv_filter_post_type', array($filter, 'filter_post_type'));

    return $filter; // Return the filter object for further use
}
