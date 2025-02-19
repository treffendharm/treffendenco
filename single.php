<?php
get_header();

?>

<?php
while (have_posts()):
    the_post();

?>

    <section class="the_content">
        <?php the_content(); ?>
    </section>
<?php
endwhile;

get_footer();


