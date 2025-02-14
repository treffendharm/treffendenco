<?php

// intro_text, title, subtitle and services. This from a block field. When one is empty, get it from the options page with the prefix 'services_'

$fields = ['intro', 'title', 'subtitle', 'services'];
$prefix = 'services_';

foreach ($fields as $field) {
    ${$field} = get_field($field) ?: get_field($prefix . $field, 'option');
}


?>


<section class="content-grid block block-services">
    <div class="col-6 intro">
        <?= $intro ?>
    </div>
    <div class="content title">
        <h2> <?= $title ?></h2>
    </div>
    <div class="content arrow-wrapper">
        <div class="arrow"></div>
    </div>
    <div class="content subtitle-wrapper">
        <h5 class="subtitle">
            <?= $subtitle ?>
        </h5>
    </div>
    <div class="content subgrid services">
        <div class="services-wrapper content subgrid">
            <?php $count = 0; ?>
            <?php foreach ($services as $service) : $count++; ?>
                <div class="service content subgrid">
                    <div class="service-item-hero content subgrid">
                        <div class="number col-1">
                            <p><?= $count ?>.</p>
                        </div>
                        <div class="title-wrapper col-6 start-2">
                            <p><b><?= $service['title'] ?></b> <?= $service['subtitle'] ?></p>
                        </div>
                        <div class="service-toggle col-12 start-12"></div>
                    </div>
                    <div class="service-content col-7 start-2">
                        <div class="inner">
                            <div class="content-wrapper">
                                <?= $service['text'] ?>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>