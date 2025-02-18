<?php
get_header();

$posts_page_id = get_option('page_for_posts');
setup_postdata($posts_page_id);
?>
<section class="the_content archive-wrapper">
    <?php the_content(); ?>
</section>
<?php
wp_reset_postdata();
get_footer();
