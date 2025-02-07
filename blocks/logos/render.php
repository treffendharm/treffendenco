<?php
$logos = get_field('logos'); // ACF repeater field
?>

<section class="content-grid block block-logos">
    <div class="content">
        <div class="logos-wrapper">
            <?php foreach ($logos as $logo) : ?>
                <div class="logo">
                    <?= wp_get_img($logo['logo'], 'medium'); ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>