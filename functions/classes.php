<?php
class Treffend_Submenu_container extends Walker_Nav_Menu
{
    function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0)
    {
        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));

        // Check if this is the vacatures menu item
        if (in_array('vacatures', $classes)) {
            $vacancy_count = wp_count_posts('vacature')->publish;
            // Add the count span after the link
            // if count is 0, don't show the span
            if ($vacancy_count > 0) {
                $item->title .= '<span class="vacancy-count">' . $vacancy_count . '</span>';
            }
        }

        $output .= "<li class='" . esc_attr($class_names) . "'>";

        $attributes = '';
        ! empty($item->attr_title) and $attributes .= ' title="' . esc_attr($item->attr_title) . '"';
        ! empty($item->target) and $attributes .= ' target="' . esc_attr($item->target) . '"';
        ! empty($item->xfn) and $attributes .= ' rel="' . esc_attr($item->xfn) . '"';
        ! empty($item->url) and $attributes .= ' href="' . esc_attr($item->url) . '"';

        $item_output = $args->before;
        $item_output .= '<a' . $attributes . '>';
        $item_output .= $args->link_before . $item->title . $args->link_after;
        $item_output .= '</a>';
        $item_output .= $args->after;

        $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
    }
}


/**
 * Class GetField
 * 
 * This class provides a convenient way to retrieve custom fields in WordPress.
 */
class GetField
{
    /**
     * @var string $prefix The prefix to be added to the field name.
     */
    private $prefix;

    /**
     * @var bool $useOptionsDefaults Whether to use default values from the options page.
     */
    private $useOptionsDefaults;

    /**
     * @var array $fields An array to store the retrieved field values.
     */
    private $fields = [];

    /**
     * GetField constructor.
     *
     * @param string $prefix The prefix to be added to the field name.
     * @param bool $useOptionsDefaults Whether to use default values from the options page.
     */
    public function __construct($prefix, $useOptionsDefaults = false)
    {
        $this->prefix = $prefix;
        $this->useOptionsDefaults = $useOptionsDefaults;
    }

    /**
     * Magic method to retrieve the value of a field.
     *
     * @param string $field The name of the field.
     * @return mixed The value of the field.
     */
    public function __get($field)
    {
        if (!isset($this->fields[$field])) {
            $this->fields[$field] = $this->getFieldWithDefault($field);
        }
        return $this->fields[$field];
    }

    /**
     * Retrieves the value of a field with a default value.
     *
     * @param string $field The name of the field.
     * @return mixed The value of the field.
     */
    private function getFieldWithDefault($field)
    {
        $value = get_field($this->prefix . $field);
        if (!$value && $this->useOptionsDefaults) {
            $value = get_field($field, 'option');
            if (!$value) {
                $value = get_field($this->prefix . $field, 'option');
            }
        }
        return $value;
    }
}





/**
 * Utility function to display video or image content
 * @param array $args Array containing field values
 * @return string HTML output
 */
function get_video_image_output($args = [])
{
    // Get values from args or try to get from ACF fields
    $is_video = $args['video_image'] ?? get_field('video_image');
    $image = $args['image'] ?? get_field('image');
    $is_youtube = $args['youtube_file'] ?? get_field('youtube_file');
    $youtube_url = $args['youtube_url'] ?? get_field('youtube_url');
    $video_file = $args['video_file'] ?? get_field('video_file');
    $thumbnail = $args['thumbnail'] ?? get_field('thumbnail');
    $autoplay = $args['autoplay'] ?? get_field('autoplay') ?? true;
    $always_muted = $args['always_muted'] ?? get_field('always_muted') ?? false;
    $loop = $args['loop'] ?? get_field('loop') ?? false;
    $thumbnail_color = $args['thumbnail_color'] ?? get_field('thumbnail-color') ?? false;



    ob_start();

    // Video output
    if ($is_video) {
        if ($is_youtube && $youtube_url) {
            // Convert YouTube URL to embed URL
            $video_id = '';
            if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $youtube_url, $match)) {
                $video_id = $match[1];
            }
            if ($video_id) {
?>
                <div class="video-wrapper youtube">
                    <iframe
                        src="https://www.youtube-nocookie.com/embed/<?= esc_attr($video_id); ?>"
                        title="YouTube video"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            <?php
            }
        } else if ($video_file) {
            ?>
            <div class="video-wrapper file <?= $always_muted ? 'always-muted' : ''; ?>" <?= $loop ? 'data-loop' : ''; ?>>
                <video
                    preload="auto"
                    playsinline
                    data-always-muted="<?= $always_muted ? 'true' : 'false' ?>"
                    <?php if ($autoplay) { ?>
                    autoplay
                    muted
                    <?php } ?>

                    <?php if ($loop) { ?>
                    loop
                    <?php } ?>

                    <?php if ($thumbnail) : ?>
                    poster="<?= wp_get_attachment_image_url($thumbnail['ID'], 'full'); ?>"
                    <?php endif; ?>>

                    <source src="<?= esc_url($video_file['url']); ?>" type="<?= esc_attr($video_file['mime_type']); ?>">
                    Your browser does not support the video tag.
                </video>
                <?php if ($thumbnail_color || $thumbnail) : ?>
                    <div class="video-wrapper-overlay" style="background-color: <?= $thumbnail_color ? esc_attr($thumbnail_color) : ''; ?>">
                        <?= $thumbnail ? wp_get_img($thumbnail['ID'], 'large', false, ['loading' => 'eager', 'decoding' => 'sync']) : ''; ?>
                    </div>
                <?php endif; ?>
            </div>


<?php
        }
    }
    // Image output
    else if ($image) {
        // Get img ID
        $img_id = is_int($image) ? $image : $image['ID'];
        // If is hero image, no lazy loading, and set decoding sync. So only if attr hero is true
        $is_hero = $args['hero'] ?? false;
        echo wp_get_img($img_id, 'large', false, ['loading' => $is_hero ? 'eager' : 'lazy', 'decoding' => $is_hero ? 'sync' : 'async']);
    }

    return ob_get_clean();
}

/**
 * Echo the video/image output directly
 */
function the_video_image_output($args = [])
{
    echo get_video_image_output($args);
}
