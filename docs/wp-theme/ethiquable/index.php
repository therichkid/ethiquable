<!DOCTYPE html>
<html <?php language_attributes(); ?>
  >
  <head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <meta name="description" content="Die Infoseite für Fair Trade- und Bio-Produkte von ETHIQUABLE Deutschland eG" />
    <meta name="theme-color" content="#80a018" />
    <meta property="og:title" content="ETHIQUABLE Deutschland eG" />
    <meta
      property="og:description"
      content="Die Infoseite für Fair Trade- und Bio-Produkte von ETHIQUABLE Deutschland eG"
    />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:image" content="/wp-content/themes/ethiquable/dist/img/og_image.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="ETHIQUABLE Deutschland eG" />
    <meta itemprop="name" content="ETHIQUABLE Deutschland eG" />
    <meta
      itemprop="description"
      content="Die Infoseite für Fair Trade- und Bio-Produkte von ETHIQUABLE Deutschland eG"
    />
    <meta itemprop="image" content="/wp-content/themes/ethiquable/dist/img/og_image.jpg" />
    <link rel="icon" href="/wp-content/themes/ethiquable/dist/img/favicon.ico" />
    <title>ETHIQUABLE</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;700&display=swap"
      media="print"
      onload="this.media='all'"
    />
    <link
      rel="preload"
      as="style"
      href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css"
      media="print"
      onload="this.media='all'"
    />
    <script>
      if (/MSIE|Trident/.test(window.navigator.userAgent)) {
        document.write('<script src="https://unpkg.com/css-vars-ponyfill@2/dist/css-vars-ponyfill.min.js"><\/script>');
        window.addEventListener("load", function () {
          cssVars({});
        });
      }
    </script>
    <?php wp_head(); ?>
  </head>
  <body <?php body_class(); ?>
    >
    <?php wp_body_open(); ?>
    <noscript>
      <strong>
        We're sorry but ETHIQUABLE doesn't work properly without JavaScript enabled. Please enable it to continue.
      </strong>
    </noscript>
    <div id="app"></div>
    <?php wp_footer(); ?>
  </body>
</html>
