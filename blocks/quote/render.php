<?php
$quotes = get_field('quotes');
if (!$quotes) return;

$single_quote = count($quotes) === 1;
?>

<section class="content-grid block block-quote <?= $single_quote ? 'single' : '' ?>">
    <div class="content subgrid quote-wrapper">
        <div class="col-4 quote-info subgrid">
            <div class="quote-images col-2 start-2">
                <?php foreach ($quotes as $index => $quote) : ?>
                    <div class="quote-image <?= $index === 0 ? 'active' : '' ?>">
                        <?= wp_get_img($quote['afbeelding'], 'medium') ?>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="quote-authors col-4">
                <?php foreach ($quotes as $index => $quote) : ?>
                    <div class="quote-author <?= $index === 0 ? 'active' : '' ?>">
                        <p class="name"><?= $quote['name'] ?></p>
                        <p class="function"><?= $quote['function'] ?></p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="col-8 start-5 quote-content subgrid">
            <?php foreach ($quotes as $index => $quote) : ?>
                <div class="quote-text col-8 start-5 <?= $index === 0 ? 'active' : '' ?>">
                    <blockquote><?= $quote['quote'] ?></blockquote>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <?php if (!$single_quote) : ?>
        <div class="col-4 progress-wrapper">
            <div class="progress-bar"></div>
        </div>
        <div class=" col-4 controls">
            <button class="prev" aria-label="Previous quote">
                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="15" viewBox="0 0 33 15" fill="none">
                    <path d="M1.16301 6.71038C0.772488 7.1009 0.772488 7.73407 1.16301 8.12459L7.52697 14.4886C7.9175 14.8791 8.55066 14.8791 8.94119 14.4886C9.33171 14.098 9.33171 13.4649 8.94119 13.0743L3.28433 7.41748L8.94118 1.76063C9.33171 1.3701 9.33171 0.736939 8.94118 0.346415C8.55066 -0.0441096 7.9175 -0.0441095 7.52697 0.346415L1.16301 6.71038ZM32.8701 6.41748L1.87012 6.41748L1.87012 8.41748L32.8701 8.41748L32.8701 6.41748Z" fill="black" />
                </svg>
            </button>
            <button class="next" aria-label="Next quote">
                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="15" viewBox="0 0 33 15" fill="none">
                    <path d="M31.837 8.12459C32.2275 7.73406 32.2275 7.1009 31.837 6.71037L25.473 0.346413C25.0825 -0.0441117 24.4493 -0.0441117 24.0588 0.346413C23.6683 0.736937 23.6683 1.3701 24.0588 1.76063L29.7157 7.41748L24.0588 13.0743C23.6683 13.4649 23.6683 14.098 24.0588 14.4885C24.4493 14.8791 25.0825 14.8791 25.473 14.4885L31.837 8.12459ZM0.129883 8.41748H31.1299V6.41748H0.129883V8.41748Z" fill="black" />
                </svg>
            </button>
        </div>
    <?php else: ?>
        <div class=" col-4 controls">
        </div>
    <?php endif; ?>


    <div class="col-8 start-5 border">
    </div>
</section>