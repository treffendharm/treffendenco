<?php

/**
 * Dit is het bestand dat de archive pagina's toont. Dus het overzicht pagina van de Cases, Actueel, en opleidingen. 
 * Ook de team leden, maar daar is nergens een link voor. Maar dat is puur voor google ;)
 */

get_header();
global $projectClass;
$projects = $projectClass;
$post_type = get_post_type();

$posts = $projects->get_posts($_GET);

$posts_page_id = get_option('page_for_posts');
?>


<section class="archive-wrapper content-grid page-content">
    <div class="content">
        <h1><?= get_the_title($posts_page_id); ?></h1>
    </div>
    <div class="content archive-grid">
        <?= $projects->create_category_filter(); ?>
    </div>
    <div class="content archive-grid">

        <?= $projects->print_posts($posts); ?>
        <div class="pagination">
            <?= $projects->pagination_bar($posts); ?>
        </div>
    </div>

</section>

<?php
wp_reset_postdata();

get_footer();
?>