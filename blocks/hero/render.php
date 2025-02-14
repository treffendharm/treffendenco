<?php
$title = get_field('title');
$text = get_field('text');
?>
<section class="content-grid block block-hero">
    <div class="content subgrid-with hero-wrapper">
        <div class="col-4 start-3 arrow-wrapper">
            <div class="hero__arrow">
                <?php include get_template_directory() . '/dist/images/svg/pijl.svg' ?>
            </div>
        </div>
        <div class="col-6 start-7">
            <p><?= $text ?></p>
        </div>
        <div class="col-8 start-5">
            <h1><?= $title ?></h1>
        </div>
    </div>
</section>

<?php include get_template_directory() . '/template-parts/part-marquee.php'; ?>