<?php
$subtitle = get_field('subtitle');
$title = get_field('title');
$text = get_field('text');
$button = get_field('button');
$images = get_field('images');
?>


<section class="content-grid block block-about">
    <div class="content subgrid">
        <div class="col-7 subtitle">
            <p class="h5"><?= $subtitle ?></p>
        </div>
        <div class="col-7 title">
            <h2 class="h3"><?= $title ?></h2>
        </div>
        <div class="content text-wrapper subgrid">
            <div class="col-5 text-wrapper">
                <div class="text">
                    <p> <?= $text ?></p>
                </div>
                <?php if ($button) : ?>
                    <a href="<?= $button['url'] ?>" class="btn" target="<?= $button['target'] ?>"><?= $button['title'] ?></a>
                <?php endif; ?>
            </div>
            <div class="col-10 start-3 subgrid image-wrapper">
                <?php foreach ($images as $image) : ?>
                    <div class="image">
                        <img src="<?= $image['url'] ?>" alt="<?= $image['alt'] ?>" class="load-in">
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>