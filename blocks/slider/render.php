<?php
$className = 'block-slider';


// Only try to access block data if it exists
if (!empty($block)) {
    if (!empty($block['className'])) {
        $className .= ' ' . $block['className'];
    }

    if (!empty($block['style'])) {
        $className .= ' ' . $block['style'];
    }
}

?>

<section class="content-grid <?= esc_attr($className); ?>">
    <div class="content">
        <div class="slider-container">
            <div class="swiper">
                <div class="swiper-wrapper">
                    <?php
                    if (get_field('slider')):
                        foreach (get_field('slider') as $slide):
                            // Prepare media data for the utility function
                            $media_data = [
                                'video_image' => $slide['video_image'],
                                'image' => $slide['image'],
                                'youtube_file' => $slide['youtube_file'],
                                'youtube_url' => $slide['youtube_url'],
                                'video_file' => $slide['video_file'],
                                'thumbnail' => $slide['thumbnail'],
                                'always_muted' => $slide['always_muted'],
                                'loop' => $slide['loop_video'],
                                'thumbnail_color' => $slide['thumbnail-color'],
                            ];
                            $slide_title = $slide['title'];
                    ?>
                            <div class="slide swiper-slide">
                                <div class="slide-media media-wrapper">
                                    <?php the_video_image_output($media_data); ?>
                                </div>
                                <?php if (!empty($slide_title)): ?>
                                <div class="slide-title">
                                    <?= $slide_title; ?>
                                </div>
                                <?php endif; ?>
                            </div>
                    <?php
                        endforeach;
                    endif;
                    ?>
                </div>
                <!-- Add a spacer element to ensure last slide is fully visible -->
                <div class="swiper-slide-spacer"></div>
            </div>
            <!-- <button class="slider-nav prev swiper-button-prev" aria-label="Previous slide">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            <button class="slider-nav next swiper-button-next" aria-label="Next slide">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button> -->
        </div>
    </div>
</section>