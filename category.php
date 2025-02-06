<?php
// Make it go to the page that is seeclted as posts page. And get the current category name. And make it the ?category=current-category-name

$category = get_queried_object();

$url = get_permalink(get_option('page_for_posts')) . '?category=' . $category->slug;

header('Location: ' . $url);
exit();
