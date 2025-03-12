<?php
$text = get_field('text');
$button = get_field('button');
?>


<section class="content-grid block block-text-single">
    <?php if ($text || $button) : ?>
        <div class="col-6 start-4 text-wrapper">
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
</section>