<?php
$contact_title = get_field('contact_title');
$address_title = get_field('address_title');
$social_title = get_field('social_title');

$text = get_field('text');
$text_2 = get_field('text_2');
?>
<div class="block-contact"></div>


<section class="content-grid block-single-hero">
    <div class="col-8 start-3 title-wrapper">
        <h1><?= get_field('alt_title') ? get_field('alt_title') : get_the_title(); ?></h1>
    </div>
</section>

<section class="content-grid block block-text">
    <?php if ($text) : ?>
        <div class="col-3 start-3 text-wrapper intro-wrapper">
            <div class="text-container">
                <p class="intro"><?= $text ?></p>
            </div>
        </div>
    <?php endif; ?>

    <?php if ($text_2) : ?>
        <div class="col-4 start-7 text-wrapper">
            <div class="text-container">
                <?= $text_2 ?>
            </div>
        </div>
    <?php endif; ?>
</section>

<section class="content-grid block block-text">
    <div class="border col-8 start-3"></div>
    <div class="col-3 start-3 text-wrapper">
        <h2 class="h4"><?= $contact_title ?></h2>
    </div>

    <div class="col-4 start-7 text-wrapper">
        <ul class="contact-info">
            <li><a href="mailto:<?= get_field('email', 'option'); ?>"><?= get_field('email', 'option'); ?></a></li>
            <li><a href="tel:<?= get_field('phone', 'option'); ?>"><?= get_field('phone_text', 'option'); ?></a></li>
        </ul>
        <div class="direct-contact-wrapper">

            <ul>
                <?php foreach (get_field('team', 'option') as $team_member) : ?>
                    <li>
                        <div class="image" style="--_scale: <?= get_field('footer_img_scale', $team_member->ID); ?>">
                            <?php
                            $footer_img_id = get_field('footer_img', $team_member->ID);
                            if ($footer_img_id) {
                                echo wp_get_img($footer_img_id, 'medium');
                            } else {
                                echo wp_get_img(get_post_thumbnail_id($team_member->ID), 'medium');
                            }
                            ?>
                        </div>
                        <div class="quick-contact-info">
                            <div class="name"><?= $team_member->post_title; ?></div>
                            <div class="function"><?= get_field('function', $team_member->ID); ?></div>
                            <a class="email" href="mailto:<?= get_field('email', $team_member->ID); ?>"><?= get_field('email', $team_member->ID); ?></a>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>

<section class="content-grid block block-text">
    <div class="border col-8 start-3"></div>
    <div class="col-3 start-3 text-wrapper">
        <h2 class="h4"><?= $address_title ?></h2>
    </div>

    <div class="col-4 start-7 text-wrapper ">
        <a href="#" class="adres-info">
            <?= get_field('street', 'option'); ?> <br>
            <?= get_field('address', 'option'); ?>
        </a>
    </div>
</section>

<section class="content-grid block block-text">
    <div class="border col-8 start-3"></div>
    <div class="col-3 start-3 text-wrapper">
        <h2 class="h4"><?= $social_title ?></h2>
    </div>

    <div class="col-4 start-7 text-wrapper social-wrapper">
        <ul>
            <?php foreach (get_field('socials', 'option') as $link) : ?>
                <li><a href="<?= $link['link']; ?>"><?= $link['title']; ?></a></li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>