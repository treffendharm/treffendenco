</main>
<footer class="content-grid">
   <div class="content col-wrapper">
      <div class="wrapper">
         <div class="col footer-logo">
            <a href="<?php home_url(); ?>/" title="<?= get_bloginfo() ?>">
               <?php include get_template_directory() . "/dist/images/svg/logo-100.svg"; ?>
            </a>
         </div>
         <div class="col">
            <a href="mailto:<?= get_field('email', 'option') ?>"><?= get_field('email', 'option') ?></a>
            <a href="tel:<?= get_field('phone', 'option') ?>"><?= get_field('phone_text', 'option') ?></a>
         </div>
         <div class="col">
            <p><?= get_field('street', 'option') ?></p>
            <p><?= get_field('address', 'option') ?></p>
         </div>
      </div>
      <div class="col">
         <?php if ($btn = get_field('footer_button', 'option')): ?>
            <a href="<?= $btn['url'] ?>" target="<?= $btn['target'] ?>" class="button__white-outline"><?= $btn['title'] ?></a>
         <?php endif; ?>
      </div>
   </div>


</footer>
<?php wp_footer(); ?>
</body>

</html>