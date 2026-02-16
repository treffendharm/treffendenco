<?php
$post = get_queried_object();
if ($post) {
    $slug = $post->post_name;
    wp_redirect(home_url('/over-ons#' . $slug));
    exit;
}
?>
