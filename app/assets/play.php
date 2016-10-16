
<?php

  $world = isset($_REQUEST['world']) ? $_REQUEST['world'] : 1;
  $level = isset($_REQUEST['level']) ? $_REQUEST['level'] : 1;

?>

<!DOCTYPE html>
<html lang="en">

<?php include_once('elements/head.php'); ?>

<body>

<div class="page">


  <?php include_once('elements/header.php'); ?>


  <main class="main container large">

    <div class="content">

      <!--
      <h3>Play Sokoban Levels</h3>
      <p><a href="/help.php">How to play?</a></p>

      <div class="container">

        <div class="column large-12">

          <p>
            <select id="levels" name="levels">
              <option value="0">Level Wählen ...</option>
              <option value="1">TK 01</option>
              <option value="2">TK 02</option>
              <option value="3">TK 03</option>
            </select>
          </p>

        </div>

      </div>
      -->

      <div class="container">

        <div class="column large-12">

          <iframe id="game" src="./game.php?world=<?php echo $world ?>&level=<?php echo $level ?>" frameborder="0"></iframe>

        </div>

      </div>


      <div class="container">

        <div class="column large-4">

          <?php include_once('elements/sections/bestlist.php'); ?>

        </div>

        <div class="column large-8">

          <?php include_once('elements/sections/level-info.php'); ?>

        </div>

      </div>


    </div>

  </main>


  <?php include_once('elements/footer.php'); ?>


</div>

</body>
</html>
