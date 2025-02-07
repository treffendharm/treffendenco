<?php
$subtitle = get_field('subtitle');
$title = get_field('title');
$text = get_field('text');
$button = get_field('button');
$images = get_field('images');
?>


<section class="content-grid block block-about">
    <div class="col-7 subgrid-with">
        <div class="col-7 title">
            <h2><?= $title ?></h2>
        </div>
        <div class="col-7 subtitle">
            <p><?= $subtitle ?></p>
        </div>
        <div class="col-5 text-wrapper">
            <div class="text">
                <?= $text ?>
            </div>
            <?php if ($button) : ?>
                <a href="<?= $button['url'] ?>" class="button" target="<?= $button['target'] ?>"><?= $button['title'] ?></a>
            <?php endif; ?>
        </div>
    </div>
</section>