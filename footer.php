</main>
<footer class="content-grid">
   <div class="content subgrid footer-wrapper">
      <div class="col-5 contact-wrapper">
         <div class="h4"><?= get_field('footer_title_1', 'option'); ?></div>
         <ul class="contact-info">
            <li><a href="mailto:<?= get_field('email', 'option'); ?>"><?= get_field('email', 'option'); ?></a></li>
            <li><a href="tel:<?= get_field('phone', 'option'); ?>"><?= get_field('phone_text', 'option'); ?></a></li>
         </ul>
         <div class="h6"><?= get_field('footer_title_2', 'option'); ?></div>
         <a href="#" class="adres-info">
            <?= get_field('street', 'option'); ?> <br>
            <?= get_field('address', 'option'); ?>
         </a>
      </div>
      <div class="col-3 start-6 direct-contact-wrapper">
         <div class="h6"><?= get_field('footer_title_3', 'option'); ?></div>
         <ul>
            <?php foreach (get_field('team', 'option') as $team_member) : ?>
               <li>
                  <div class="image">
                     <?= wp_get_img(get_post_thumbnail_id($team_member->ID), 'medium'); ?>
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
      <div class="col-2 start-9 quick-menu-wrapper">
         <div class="h6"><?= get_field('footer_title_4', 'option'); ?></div>
         <ul class="menu">
            <?php
            wp_nav_menu(array(
               'theme_location' => 'footer_menu',
               'container' => false,
               'items_wrap' => '%3$s',
               'walker' => new Treffend_Submenu_container()
            ));
            ?>
         </ul>
      </div>
      <div class="col-2 start-11 social-wrapper">
         <div class="h6"><?= get_field('footer_title_5', 'option'); ?></div>
         <ul>
            <?php foreach (get_field('socials', 'option') as $link) : ?>
               <li><a href="<?= $link['link']; ?>"><?= $link['title']; ?></a></li>
            <?php endforeach; ?>
         </ul>
      </div>
      <div class="content site-note">
         <ul>
            <?php if (have_rows('footer_links', 'option')) : ?>
               <?php while (have_rows('footer_links', 'option')) : the_row(); ?>
                  <li><a href="<?= get_sub_field('link')['url']; ?>"><?= get_sub_field('link')['title']; ?></a></li>
               <?php endwhile; ?>
            <?php endif; ?>
         </ul>
      </div>
      <div class="content logo-wrapper">
         <a href="<?php home_url(); ?>/" title="logo" class="footer-logo">
            <?= wp_get_img(get_field('logo_light', 'option')); ?>
         </a>
      </div>
   </div>
</footer>
<?php wp_footer(); ?>
</body>

</html>