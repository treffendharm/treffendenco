<?php
$media_data = [
    'video_image' => get_field('video_image'),
    'image' => get_field('image'),
    'youtube_file' => get_field('youtube_file'),
    'youtube_url' => get_field('youtube_url'),
    'video_file' => get_field('video_file'),
    'thumbnail' => get_field('thumbnail'),
];

?>

<section class="content-grid block block-showreel">
    <div class="content">
        <div class="showreel-wrapper">
            <?php
            the_video_image_output($media_data);
            ?>
        </div>
    </div>
</section>