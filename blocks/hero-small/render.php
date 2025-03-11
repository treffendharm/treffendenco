<div class="content-grid block-single-hero">
    <div class="col-8 start-3 title-wrapper">
        <h1><?= get_field('alt_title') ? get_field('alt_title') : get_the_title(); ?></h1>
        <div class="payoff">
            <?= get_field('payoff'); ?>
        </div>
    </div>
</div>