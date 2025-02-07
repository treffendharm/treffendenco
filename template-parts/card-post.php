<?php
$post_id = $args['post_id'];
$title = get_the_title($post_id);
$link = get_the_permalink($post_id);
$image = wp_get_img(get_post_thumbnail_id($post_id), 'medium');
$categories = get_the_category($post_id);
$category_links = [];
foreach ($categories as $category) {
    $category_links[] = '<a href="' . get_category_link($category->term_id) . '">' . $category->name . '</a>';
}
$category_links = implode(' - ', $category_links);
?>

<div class="card-post">
    <div class="card-post__image">
        <?= $image; ?>
    </div>
    <h3><?= $title; ?></h3>
    <div class="categories">
        <?= $category_links; ?>
    </div>
</div>