<?php

$title = get_field('title');
$text = get_field('text');
?>
<section class="content-grid block block-hero">
    <div class="content">
        <h1><?= $title ?></h1>
        <div class="text">
            <?= $text ?>
        </div>
    </div>
</section>
