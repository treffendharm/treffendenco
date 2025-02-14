<?php

/**
 * BLOCK: block-posts
 * @group_6759a7f97daa0.json is the file for the fields of this block
 */

$title = get_field('title') ?? 'Ons werk';
$posts = get_field('projects'); // returns array of post ids
if (!$posts) {
    $posts = get_posts([
        'post_type' => 'post',
        'posts_per_page' => 3,
        'post__not_in' => [get_the_ID()], // Exclude current post
    ]);
}

$classes = [
    'content-grid',
    'block block-posts'
];
?>
<section class="<?= implode(' ', array_filter($classes)); ?>">
    <div class="content block-header">
        <?php if ($title) : ?>
            <h2 class="block-posts__title"><?= $title ?></h2>
            <a href="<?= get_permalink(get_option('page_for_posts')) ?>">Bekijk projecten</a>
        <?php endif; ?>
    </div>
    <div class="content archive-grid">
        <div class="cards-wrapper">
            <?php
            foreach ($posts as $post):
                setup_postdata($post);
                get_template_part('template-parts/card', 'post', [
                    'post_id' => $post
                ]);
            endforeach;
            wp_reset_postdata();
            ?>

        </div>
    </div>

</section>