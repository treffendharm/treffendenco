<?php
$post_id = $args['post_id'] ?? get_the_ID();
$title = get_the_title($post_id);
$link = get_the_permalink($post_id);
$image = wp_get_img(get_post_thumbnail_id($post_id), 'large');
$categories = get_the_category($post_id);
$category_links = [];
foreach ($categories as $category) {
    $category_links[] = '<span>' . $category->name . '</span>';
}
$category_links = implode(' - ', $category_links);
?>

<a href="<?= $link; ?>" class="card-post load-in">
    <div class="card-post__image">
        <?= $image; ?>
    </div>
    <h3><?= $title; ?></h3>
    <div class="categories">
        <?= $category_links; ?>
    </div>
</a>