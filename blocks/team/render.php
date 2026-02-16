<?php
// Get all the team from the team post type
$team = get_posts([
    'post_type' => 'team',
    'numberposts' => -1,
    'orderby' => 'rand',
]);
$index = 0;
?>


<section class="content-grid block block-team" id="team">
    <div class="content">
        <div class="team-wrapper">
            <?php foreach ($team as $post) :
                setup_postdata($post);
            ?>
                <div class="team-item" data-index="<?= $index ?>" id="<?= strtolower(str_replace(' ', '-', get_the_title($post->ID))); ?>">
                    <h3 class="team-item-name"><?= get_the_title($post->ID); ?></h3>
                    <p class="team-item-jobtitle"><?= get_field('function', $post->ID); ?></p>
                    <?php $post_thumbnail_id = get_post_thumbnail_id($post->ID); ?>
                    <?php if ($post_thumbnail_id) : ?>
                        <div class="team-item-image">
                            <?= wp_get_img($post_thumbnail_id, 'large'); ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php $index++;
            endforeach; ?>
            <?php wp_reset_postdata(); ?>
        </div>
    </div>
</section>