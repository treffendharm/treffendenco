<?php
get_header();

?>

<?php
while (have_posts()):
    the_post();

?>

    <section class="page-content content-grid">
        <div class="col-10 start-2">
            <?= wp_get_img(get_post_thumbnail_id()); ?>
        </div>
    </section>
    <section class="content-grid">
        <div class="col-10 start-2 single-page-section">
            <h1 class="single-page-title"><?php the_title(); ?></h1>
        </div>
    </section>
    <section class="the_content">
        <?php the_content(); ?>
    </section>
<?php
endwhile;

get_footer();
