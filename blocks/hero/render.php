<?php

$title = get_field('title');
$text = get_field('text');


?>
hello
<section class="content-grid">
    <div class="content">
        <h1><?= $title ?></h1>
        <div class="text">
            <?= $text ?>
        </div>
    </div>
</section>
