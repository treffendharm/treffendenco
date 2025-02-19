<?php
$className = 'block-image-row';

$margin_top = get_field('margin_top_large');
$margin_bottom = get_field('margin_bottom_large');

// Only try to access block data if it exists
if (!empty($block)) {
    if (!empty($block['className'])) {
        $className .= ' ' . $block['className'];
    }

    if (!empty($block['style'])) {
        $className .= ' ' . $block['style'];
    }
}

?>

<section class="content-grid <?= esc_attr($className); ?> <?= $margin_top ? 'margin-top-large' : '' ?> <?= $margin_bottom ? 'margin-bottom-large' : '' ?>">
    <div class="content image-row-wrapper">
        <?php
        if (get_field('images')):
            foreach (get_field('images') as $media):
                // Prepare media data for the utility function
                $media_data = [
                    'video_image' => $media['video_image'] ?? false,
                    'image' => $media['image'] ?? false,
                    'youtube_file' => $media['youtube_file'] ?? false,
                    'youtube_url' => $media['youtube_url'] ?? '',
                    'video_file' => $media['video_file'] ?? false,
                    'thumbnail' => $media['thumbnail'] ?? false,
                    'always_muted' => $media['always_muted'] ?? false,
                    'loop' => $media['loop_video'] ?? false,
                ];

                
                the_video_image_output($media_data);
            endforeach;
        endif;
        ?>
    </div>
</section>