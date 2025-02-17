</main>
<footer class="content-grid">
   <div class="content subgrid footer-wrapper">
      <div class="col-5 contact-wrapper">
         <h4><?= get_field('footer_title_1', 'option'); ?></h4>
         <ul class="contact-info">
            <li><a href="mailto:<?= get_field('email', 'option'); ?>"><?= get_field('email', 'option'); ?></a></li>
            <li><a href="tel:<?= get_field('phone', 'option'); ?>"><?= get_field('phone_text', 'option'); ?></a></li>
         </ul>
         <h6><?= get_field('footer_title_2', 'option'); ?></h6>
         <a href="#" class="adres-info">
            <?= get_field('street', 'option'); ?> <br>
            <?= get_field('address', 'option'); ?>
         </a>
      </div>
      <div class="col-3 start-6 direct-contact-wrapper">
         <h6><?= get_field('footer_title_3', 'option'); ?></h6>
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
         <h6><?= get_field('footer_title_4', 'option'); ?></h6>
         <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Over ons</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Denklab</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Pacman</a></li>
         </ul>
      </div>
      <div class="col-2 start-11 social-wrapper">
         <h6><?= get_field('footer_title_5', 'option'); ?></h6>
         <ul>
            <?php foreach (get_field('socials', 'option') as $link) : ?>
               <li><a href="<?= $link['link']; ?>"><?= $link['title']; ?></a></li>
            <?php endforeach; ?>
         </ul>
      </div>
      <div class="content site-note">
         <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Algemene voorwaarden</a></li>
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