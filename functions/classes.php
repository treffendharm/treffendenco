<?php
class Treffend_Submenu_container extends Walker_Nav_Menu {}


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
                        allowfullscreen

                        </iframe>
                </div>
            <?php
            }
        } else if ($video_file) {
            ?>
            <div class="video-wrapper file <?= $always_muted ? 'always-muted' : ''; ?>" <?= $loop ? 'data-loop' : ''; ?>>
                <video
                    controls
                    preload="none"
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
                <div class="video-wrapper-overlay">
                    <?= wp_get_img($thumbnail['ID'], 'full', false, ['loading' => 'eager', 'decoding' => 'sync']); ?>
                </div>
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
