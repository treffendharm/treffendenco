<?php
$className = 'block-image-row';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}

if (!empty($block['style'])) {
    $style = str_replace('is-style-', '', $block['style']);
    $className .= ' ' . $style;
}

// Check if we're in the editor
$is_editor = defined('REST_REQUEST') && REST_REQUEST;
?>

<section class="content-grid <?= esc_attr($className); ?>">
    <div class="col-10 start-2 image-row-wrapper">
        <?php if ($is_editor): ?>
            <div class="image-row-placeholder">
                <span>Sleep hier je afbeeldingen</span>
            </div>
        <?php endif; ?>
        <InnerBlocks 
            allowedBlocks="<?= esc_attr(wp_json_encode(['core/image'])); ?>"
            template="<?= esc_attr(wp_json_encode([])); ?>"
        />
    </div>
</section> 