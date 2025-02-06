<header class="content-grid" data-open="false">
    <nav class="content">

        <div class="navigation-menu-wrapper">
            <div class="inner">
                <ul class="menu">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'main_menu',
                        'container' => false,
                        'items_wrap' => '%3$s',
                        'walker' => new Treffend_Submenu_container()
                    ));
                    ?>
                </ul>
            </div>
        </div>

        <div class="menu-toggle">
            <div class="burger">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
            <p>Menu</p>
        </div>

        <a href="<?php home_url(); ?>/" title="logo" class="nav-logo">
            <?php include get_template_directory() . "/dist/images/svg/logo-100.svg"; ?>
        </a>

    </nav>
</header>