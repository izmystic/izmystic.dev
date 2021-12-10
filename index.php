<?php include('config.php') ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title><?php echo $name ?></title>

    <!-- Meta Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="<?php echo $color ?>">
    <meta property="og:title" content="<?php echo $name ?>">
    <meta property="og:description" content="<?php echo $desc ?>">
    <meta property="og:image" content="<?php echo $logo ?>">
    <link rel="icon" type="image/png" href="<?php echo $logo ?>">

    <!-- CSS -->
    <!-- CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" >
    <link href="/assets/css/style.css" rel="stylesheet">
</head>
<style>
    .btn-color {
        background-color: <?php echo $color ?>;
    }

    .btn-color:hover {
        background-color: rgb(<?php echo $colordarker ?>);
    }
</style>

<body class="bg-<?php echo $theme ?>">
    <div class="container" id="main">
        <div class="row justify-content-md-center">
            <div class="col-md-auto">
                <div class="card text-center bg-<?php echo $theme ?> text-<?php echo $txtcolor ?>" id="card">
                    <div class="card-body">
                        <h5 class="card-title"><?php echo $name ?></h5>
                        <p class="card-text"><?php echo $desc ?></p>
                        <?php foreach ($links as $name => $button) { ?>
                            <a href="<?php echo $button['link'] ?>" target="_blank" class="btn btn-color text-<?php echo $txtcolor ?>"><i class="<?php echo $button['icon'] ?>"></i> <?php echo $name ?></a>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('contextmenu', event => event.preventDefault());
    </script>
</body>