<?php
get_header();

?>

<?php
while (have_posts()):
    the_post();

?>

    <section class="the_content">
        <div class="block-single-hero content-grid">
            <div class="col-8 start-3">
                <h1><?php the_title(); ?></h1>
                <div class="payoff">
                    <?php the_field('payoff'); ?>
                </div>
            </div>
        </div>
        <?php the_content(); ?>

    </section>
<?php
endwhile;

get_footer();
