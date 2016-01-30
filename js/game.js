(function () {

    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', {preload: preload, create: create, update: update});

    function preload() {

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    }

    var player;
    var platforms;
    var cursors;
    var stars;
    var star;

    var starTimer;

    function create() {

        initEnvironmnent();

        initPlayer();

        stars = game.add.group();
        stars.enableBody = true;

        star = stars.create(70, 70, 'star');

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();

        starTimer = game.time.create(false);
        starTimer.start();
        starTimer.repeat(2000, 20, spawnStar, this);

    }

    function update() {

        //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);

        game.physics.arcade.overlap(player, stars, collectStar, null, this);

        movePlayer(player, cursors);


    }
    

    function initEnvironmnent() {
//  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 30, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(3, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = platforms.create(0, 0, 'ground');
        ledge.scale.setTo(3, 1);
        ledge.body.immovable = true;

        ledge = platforms.create(0, 0, 'ground');
        ledge.scale.setTo(.07, 30);
        ledge.body.immovable = true;

        ledge = platforms.create(game.world.width - 28, 0, 'ground');
        ledge.scale.setTo(.07, 30);
        ledge.body.immovable = true;
    }

    function initPlayer() {
// The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        player.animations.add('up', [5, 6, 7, 8], 10, true);
        player.animations.add('down', [5, 6, 7, 8], 10, true);
    }

    function movePlayer(player, cursors) {
//  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else if (cursors.up.isDown) {
            //  Move to the right
            player.body.velocity.y = -150;

            player.animations.play('up');
        }
        else if (cursors.down.isDown) {
            //  Move to the right
            player.body.velocity.y = 150;

            player.animations.play('down');
        }
        else {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }
    }

    function collectStar(){
        star.kill();
    }

    function  spawnStar(){
        console.log("spawn");
    }
})();