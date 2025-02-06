<?php

/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package treffend
 */

get_header();
?>

<div class="content-grid">
    <div class="content">
        <?= get_search_form()?>


        <div class="search-results-wrapper">
            <?php if (have_posts()) : ?>

                <?php
                /* Start the Loop */
                while (have_posts()) :
                    the_post(); ?>

                    <div class="result">
                        <a href="<?= get_the_permalink() ?>">
                            <?= get_the_title() ?>
                        </a>
                    </div>

                <?php

                endwhile;

                the_posts_navigation();
            else : ?>
                <p>Niks gevonden voor: <?= get_search_query() ?></p>
            <?php
            endif;
            ?>
        </div>
    </div>
</div>

<?php
get_footer();
