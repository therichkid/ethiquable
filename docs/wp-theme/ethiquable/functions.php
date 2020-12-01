<?php
// Remove all default WP template redirects/lookups
remove_action('template_redirect', 'redirect_canonical');

// Redirect all requests to index.php so the Vue app is loaded and 404s aren't thrown
function remove_redirects() {
  add_rewrite_rule('^/(.+)/?', 'index.php', 'top');
}
add_action('init', 'remove_redirects');

// Convert 404s thrown by WP to 202 Accepted
function convert_404_headers($status_header, $header) {
  if ((int)$header == 404) {
    return status_header(202);
  }
  return $status_header;
}
add_filter('status_header', 'convert_404_headers', 10, 2);

// Add scripts
function add_vue_scripts() {
  wp_enqueue_script('app', get_stylesheet_directory_uri() . '/dist/app.js', array('jquery'), filemtime(get_stylesheet_directory() . '/dist/app.js'), true);
  wp_enqueue_script('map', get_stylesheet_directory_uri() . '/dist/map.js', array('jquery'), filemtime(get_stylesheet_directory() . '/dist/map.js'), true);
  wp_enqueue_style('app', get_stylesheet_directory_uri() . '/dist/app.css', null, filemtime(get_stylesheet_directory() . '/dist/app.css'));
  wp_enqueue_style('map', get_stylesheet_directory_uri() . '/dist/map.css', null, filemtime(get_stylesheet_directory() . '/dist/map.css'));
}
add_action('wp_enqueue_scripts', 'add_vue_scripts');

// Add defer to map script
function add_defer_attribute($tag, $handle) {
  if ('map' !== $handle) {
    return $tag;
  }
  return str_replace(' src', ' defer="defer" src', $tag);
}
add_filter('script_loader_tag', 'add_defer_attribute', 10, 2);

// Disable WordPress emojis
function disable_emojis() {
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('admin_print_scripts', 'print_emoji_detection_script');
  remove_action('wp_print_styles', 'print_emoji_styles');
  remove_action('admin_print_styles', 'print_emoji_styles');
  remove_filter('the_content_feed', 'wp_staticize_emoji');
  remove_filter('comment_text_rss', 'wp_staticize_emoji');
  remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
  add_filter('tiny_mce_plugins', 'disable_emojis_tinymce');
}
add_action('init', 'disable_emojis');

// Filter out the tinymce emoji plugin
function disable_emojis_tinymce($plugins) {
  if (is_array($plugins)) {
    return array_diff($plugins, array('wpemoji'));
  }
  else {
    return array();
  }
}

// Add featured images
add_theme_support('post-thumbnails');

// Add helper lines for TinyMCE editor
add_editor_style('editor-style.css');
?>
