<?php

/**
 * BLOCK: block-posts
 * @group_6759a7f97daa0.json is the file for the fields of this block
 */

$title = get_field('title') ?? 'Gerelateerde projecten';
$posts = get_field('featured_projects'); // returns array of post ids
if (!$posts) {
    $posts = get_posts([
        'post_type' => 'post',
        'posts_per_page' => 3,
        'post__not_in' => [get_the_ID()], // Exclude current post
    ]);
}

$classes = [
    'block block-posts',
    'content-grid'
];
?>
<section class="<?= implode(' ', array_filter($classes)); ?> content-grid page-content">
    <?php if ($title) : ?>
        <div class="col-10 start-2">
            <h2 class="block-posts__title"><?= $title ?></h2>
        </div>
    <?php endif; ?>
    <div class="col-10 start-2 archive-grid">
        <div class="cards-wrapper">
            <?php
            $counter = 1;
            foreach ($posts as $post):
                setup_postdata($post);
                get_template_part('template-parts/archive/card', 'post', [
                    'post_number' => str_pad($counter, 2, '0', STR_PAD_LEFT),
                    'post_id' => $post
                ]);
                $counter++;
            endforeach;
            wp_reset_postdata();
            ?>

        </div>
    </div>

</section>