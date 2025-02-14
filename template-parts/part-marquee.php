<?php
$marquee_text = get_field('marquee_items', 'option'); 
?>

<section class="marquee">
    <?php foreach ($marquee_text as $text): ?>
        <p><?= $text['text'] ?></p>
    <?php endforeach; ?>
</section>