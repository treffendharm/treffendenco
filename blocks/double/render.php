<?php

// Set default prefix if not provided
$prefix = isset($args['prefix']) ? $args['prefix'] . '_' : '';

$media_data = [
    'video_image' => get_field($prefix . 'video_image'),
    'image' => get_field($prefix . 'image'),
    'youtube_file' => get_field($prefix . 'youtube_file'),
    'youtube_url' => get_field($prefix . 'youtube_url'),
    'video_file' => get_field($prefix . 'video_file'),
    'thumbnail' => get_field($prefix . 'thumbnail'),
    'autoplay' => false,
];

$media_pos = get_field($prefix . 'media_pos');
$title = get_field($prefix . 'title');
$content = get_field($prefix . 'content');
$buttons = get_field($prefix . 'buttons');





// Get media fields

if (!$content && !$media_data['image']) return;


$classes = [
    'block block-2-col',
    'content-grid',
    ($media_data['image'] || $media_data['video_image']) ? ($media_pos === true ? 'media-left' : 'media-right') : 'no-media',
];


$anchor = '';
if (! empty($block['anchor'])) {
    $anchor = 'id="' . esc_attr($block['anchor']) . '" ';
}


?>


<section class="<?= implode(' ', array_filter($classes)); ?>" id="<?= $anchor; ?>">
    <div class="content-wrapper">
        <div class="single-page-section content">
            <div class="inner-blocks-content">
                <h2><?=$title ?></h2>
                <?= $content; ?>
            </div>

            <?php if ($buttons): ?>
                <div class="buttons">
                    <?php foreach ($buttons as $button): ?>
                        <a href="<?= esc_url($button['button']['url']); ?>" target="<?= esc_attr($button['button']['target']); ?>" <?php if (isset($button['style'])): ?>class="button__<?= $button['style'] ?>" <?php endif; ?>>
                            <?= esc_html($button['button']['title']); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <?php if ($media_data['image'] || $media_data['video_image'] || $media_data['youtube_file'] || $media_data['video_file']) : ?>
            <div class="media">
                <?php the_video_image_output($media_data); ?>
            </div>
        <?php endif; ?>
    </div>
</section>