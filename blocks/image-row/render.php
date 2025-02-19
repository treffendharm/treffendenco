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

        <!-- Acf galary field -->
        <?php
        if (get_field('images')):
            foreach (get_field('images') as $image):
                echo wp_get_img($image, 'full', false, ['class' => 'load-in']);
            endforeach;
        endif;
        ?>

    </div>
</section>