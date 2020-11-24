
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
    <script>
      if (/MSIE|Trident/.test(window.navigator.userAgent)) {
        document.write('<script src="https://unpkg.com/css-vars-ponyfill@2/dist/css-vars-ponyfill.min.js"><\/script>');
        window.addEventListener("load", function () {
          cssVars({});
        });
      }
    </script>
    <link href="/wp-content/themes/ethiquable/dist/map.css" rel="prefetch">
    <link href="/wp-content/themes/ethiquable/dist/app.css" rel="preload" as="style">
    <link href="/wp-content/themes/ethiquable/dist/app.css" rel="stylesheet">
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
