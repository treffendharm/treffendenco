<?php
/**
 * Test Block Template.
 * This block only allows core blocks to be placed inside it.
 */

$template = [
    
];
?>
<section class="block block-text content-grid">
    <div class="col-10 start-2 content-wrapper single-page-section">
        <InnerBlocks 
            allowedBlocks='<?= esc_attr(wp_json_encode(["core/paragraph", "core/heading", "core/list"])); ?>'
            template='<?= esc_attr(wp_json_encode($template)); ?>'
        />
    </div>
</section>