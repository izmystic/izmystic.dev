<?php
    // Website Name
    $name = "izMystic";

    // Descripton
    $desc = "Bot Developer | Software Developer | Graphic Designer";

    // Theme (light or dark)
    $theme = "dark";

    // Domain (with trailing slash)
    $domain = "https://izmystic.dev/";

    // Color (hex)
    $color = "#ff00ff";

    // Logo (must be an image ".png, .jpg, .gif, etc")
    $logo = $domain."assets/img/logo.png";

    // Links
    $links = [
        "Discord" => [ // Button Label
            "link" => "https://izmystic.dev/discord", // Button Link
            "icon" => "fab fa-discord" // Button Icon
        ],
        "Github" => [
            "link" => "https://github.com/izMystic",
            "icon" => "fab fa-github"
        ],
        "Twitter" => [
            "link" => "https://twitter.com/iz_mystic",
            "icon" => "fab fa-twitter"
        ],
    ];

    // Text Color
    if ($theme == "light"){
        $txtcolor = "dark";
    } else if ($theme == "dark") {
        $txtcolor = "light";
    }

    // Convert HEX provided to RGB
	list($r, $g, $b) = sscanf($color, "#%02x%02x%02x");
	$colorrgb = $r.", ".$g.", ".$b;

	// Make color darked
	$darkerpercent = ".75";
	$colordarker = $r*$darkerpercent.", ".$g*$darkerpercent.", ".$b*$darkerpercent;
?>