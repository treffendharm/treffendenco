<?php
/* Custom search form */
?>

<form class="searchform" role="search" method="get" id="search-form" action="<?= esc_url(home_url('/')); ?>">
    <input type="search" placeholder="" aria-label="search vcog" name="s" value="<?= esc_attr(get_search_query()); ?>">
    <span>
    </span>
</form>