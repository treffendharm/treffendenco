<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<!-- Realisatie: Treffend & Co  -->

<head>
    <?php if (get_field('head_code', 'options')) { ?>
        <?php the_field('head_code', 'options'); ?>
    <?php } ?>

    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="description" content="<?php bloginfo('description'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Preload the fonts
    <link rel="preconnect" href="https://use.typekit.net" crossorigin>
    <link rel="preload" fetchpriority="highest" href="https://use.typekit.net/gvu7pwb.css" as="style" crossorigin> -->
    <link rel="stylesheet"fetchpriority="highest" href="https://use.typekit.net/gvu7pwb.css">

    <?php
    // Get header image from different possible sources
    $header_image = (get_field('hero_image') && is_front_page()) ? get_field('hero_image') : 
                   (get_field('header_image') ? get_field('header_image') : 
                   (has_post_thumbnail() ? get_post_thumbnail_id() : null));

    if ($header_image) {
        $large_image = wp_get_attachment_image_src($header_image, 'large');
        if ($large_image) {
            ?>
            <link rel="preload" 
                  fetchpriority="highest" 
                  href="<?= esc_url($large_image[0]); ?>" 
                  as="image"
                  imagesrcset="<?= wp_get_attachment_image_srcset($header_image, 'large') ?>"
                  imagesizes="100vw">
            <?php
        }
    }
    ?>

    <!-- Inline critical CSS -->
    <style id="critical-css">
        <?php echo get_critical_css(); ?>
    </style>

    <?php wp_head(); ?>
</head>

<body <?php body_class('hero-image-scroller'); ?>>
    <?php if (get_field('body_code', 'options')) { ?>
        <?php the_field('body_code', 'options'); ?>
    <?php } ?>

    <?php wp_body_open(); ?>

    <noscript>
        <style>
            body {
                opacity: 1;
                transition: none;
            }
        </style>
        <div class="content-grid" style="background-color: var(--color-primary);">
            <p class="content" style="color: white; text-align: center;">JavaScript is uitgeschakeld, waardoor deze website niet goed functioneert. Schakel JavaScript in om de site correct te laten werken.</p>
        </div>
    </noscript>

    <?php get_template_part('template-parts/part', 'nav'); ?>


    <?php
    if (is_front_page()) {
    } else {
        get_template_part('template-parts/header/part', 'hero-page');
    }
    ?>


    <main />