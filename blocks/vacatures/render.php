<?php
$subtitle = get_field('subtitle');
$title = get_field('title');
$text = get_field('text');

$vacatures = get_field('vacatures');
// Als er geen vacatures zijn, haal ze dan op uit de post type 'vacature'
if (!$vacatures) {
    $vacatures = get_posts([
        'post_type' => 'vacature',
        'posts_per_page' => -1
    ]);
}
?>


<section class="content-grid block block-vacatures">
    <?php if ($subtitle || $title) : ?>
        <div class="start-3 col-8 title-wrapper">
            <?php if ($subtitle) : ?>
                <p class="h5"><?= $subtitle ?></p>
            <?php endif; ?>
            <?php if ($title) : ?>
                <h2 class="h3"><?= $title ?></h2>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <?php if ($text) : ?>
        <div class="col-6 start-4 text-wrapper intro-wrapper">
            <div class="text-container intro-side">
                <?= $text ?>
            </div>
        </div>
    <?php endif; ?>

    <div class="col-6 start-4 vacatures-wrapper">
        <?php foreach ($vacatures as $vacature) : ?>
            <div class="vacature">
                <a href="<?= get_the_permalink($vacature) ?>" class="h5"><?= $vacature->post_title ?></a>
            </div>
        <?php endforeach; ?>
    </div>
</section>