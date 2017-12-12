<?php
	$currentUrl  = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
 	$currentPath = parse_url( $currentUrl, PHP_URL_PATH);

 	global $post;
 	$title = $post->post_title;
 	$postID = $post->ID;

?><!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
<!-- <html class="no-js" style="html {margin-top: 0 !important;}" <?php language_attributes(); ?>> -->
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<link rel="apple-touch-icon" href="apple-touch-icon.png">

<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/vendor<?php echo (WP_DEBUG) ? "" : ".min" ?>.css?<?php echo wp_get_theme()->get( 'Version' ) ?>">
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/main<?php echo (WP_DEBUG) ? "" : ".min" ?>.css?<?php echo wp_get_theme()->get( 'Version' ) ?>">
<link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri(); ?>/foundation-icons/foundation-icons.css">

<script>
    window.theme_url = "<?= get_template_directory_uri(); ?>";
    window.home_url = "<?= get_home_url(); ?>";
	window.ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
</script>

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<div class="modal main-nav">
		<?php wp_nav_menu(array(
				'menu_class' => 'grid-container grid-x'
			)); // main navigation modal ?>
	</div>
	<div class="mainContent">
		<div class="top-bar">
		  <div class="top-bar-left">
		    <ul class="menu">
		      <li class="menu-text">
		      	<a class="brand" href="<?= get_home_url(); ?>">brainds</a>
		      	<a class="current-menu" href="<?= get_section_url(); ?>"><?= get_section_name() ? get_section_name() : '&nbsp;'; ?></a>
		      </li>
		    </ul>
		  </div>
		  <div class="top-bar-right">
		    <ul class="menu">
		      <li><a class="menu-icon"><span></span></a></li>
		      <!-- <li><a href="#"><i class="fi-magnifying-glass"></i></a></li> -->
		    </ul>
		  </div>
		</div>