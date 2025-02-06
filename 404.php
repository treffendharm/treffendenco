<?php
get_header();
?>


<section class="content-grid page-content">
    <div class="col-10 start-2 single-page-section">
        <h1><?= get_field('404_title', 'option') ?? '404 - Pagina niet gevonden' ?></h1>
        <?= get_field('404_content', 'option') ?>
    </div>
</section>



<?php
get_footer();
?>