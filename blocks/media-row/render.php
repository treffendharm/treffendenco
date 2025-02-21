<?php
$className = 'block-media-row';

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
    <div class="content media-row-wrapper">
        <?php
        if (get_field('images')):
            foreach (get_field('images') as $media):
                // Prepare media data for the utility function
                $media_data = [
                    'video_image' => $media['video_image'],
                    'image' => $media['image'],
                    'youtube_file' => $media['youtube_file'],
                    'youtube_url' => $media['youtube_url'],
                    'video_file' => $media['video_file'],
                    'thumbnail' => $media['thumbnail'],
                    'always_muted' => $media['always_muted'],
                    'loop' => $media['loop_video'],
                    'thumbnail_color' => $media['thumbnail-color'],
                ];


                the_video_image_output($media_data);
            endforeach;
        endif;
        ?>
    </div>
</section>