<?php
$subtitle = get_field('subtitle');
$title = get_field('title');
$text = get_field('text');
$text_2 = get_field('text_2');
$button = get_field('button');
$button_2 = get_field('button_2');
$margin_top = get_field('margin_top_large');
$margin_bottom = get_field('margin_bottom_large');

$background_color = get_field('background_color');

?>


<section class="content-grid block block-text <?= $margin_top ? 'margin-top-large' : '' ?> <?= $margin_bottom ? 'margin-bottom-large' : '' ?> <?= $background_color ? 'background' : '' ?>">
    <?php if ($subtitle || $title) : ?>
        <div class="start-3 col-8">
            <?php if ($subtitle) : ?>
                <p class="h5"><?= $subtitle ?></p>
            <?php endif; ?>
            <?php if ($title) : ?>
                <h2 class="h3"><?= $title ?></h2>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <?php if ($text || $button) : ?>
        <div class="col-3 start-3 text-wrapper">
            <?php if ($text) : ?>
                <div class="text-container">
                    <?= $text ?>
                </div>
            <?php endif; ?>
            <?php if ($button) : ?>
                <a href="<?= $button['url'] ?>" class="btn" target="<?= $button['target'] ?>"><?= $button['title'] ?></a>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <?php if ($text_2 || $button_2) : ?>
        <div class="col-4 start-7 text-wrapper">
            <?php if ($text_2) : ?>
                <div class="text-container">
                    <?= $text_2 ?>
                </div>
            <?php endif; ?>
            <?php if ($button_2) : ?>
                <a href="<?= $button_2['url'] ?>" class="btn" target="<?= $button_2['target'] ?>"><?= $button_2['title'] ?></a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</section>