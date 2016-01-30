(function () {

    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', {preload: preload, create: create, update: update});
    var itemCollection = [{
        name: 'star',
        image: 'assets/star.png'
    }, {
        name: 'diamond',
        image: 'assets/diamond.png'
    },{
        name: 'firstAid',
        image: 'assets/firstaid.png'
    }];

    function preload() {

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        for(var i = 0; i < itemCollection.length; i++){
            game.load.image(itemCollection[i].name, itemCollection[i].image);
        }

    }

    var DEFAULT_SPEED = 400;
    var DEFAULT_SPRITE_FRAMERATE = 5;

    var player;
    var platforms;
    var p1Cursor;
    var p2Cursor;
    var items;
    var item;

    var starTimer;

    function create() {

        initEnvironmnent();

        initPlayer();

        items = game.add.group();
        items.enableBody = true;

        //  Our controls.
        p1Cursor = game.input.keyboard.createCursorKeys();
        p2Cursor = game.input.keyboard.createCursorKeys();

        starTimer = game.time.create(false);
        starTimer.start();
        starTimer.repeat(300, 20, spawnObject, this);

    }

    function createAutoDestructTimer(target, time) {
        // Use this to destroy the item i.e. any object after creating it
        game.time.events.add(Phaser.Timer.SECOND * time, target.destroy, target);
    }

    function update() {

        //  Collide the player and the items with the platforms
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(items, platforms);

        game.physics.arcade.overlap(player, items, collectObject, null, this);

        movePlayer(player, p1Cursor, DEFAULT_SPEED);


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
        player.animations.add('left', [0, 1, 2, 3], DEFAULT_SPRITE_FRAMERATE, true);
        player.animations.add('right', [5, 6, 7, 8], DEFAULT_SPRITE_FRAMERATE, true);
        player.animations.add('up', [5, 6, 7, 8], DEFAULT_SPRITE_FRAMERATE, true);
        player.animations.add('down', [5, 6, 7, 8], DEFAULT_SPRITE_FRAMERATE, true);
    }

    function movePlayer(player, cursor, speed) {
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursor.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -speed;

            player.animations.play('left');
        }
        else if (cursor.right.isDown) {
            //  Move to the right
            player.body.velocity.x = speed;

            player.animations.play('right');
        }
        else if (cursor.up.isDown) {
            //  Move to the right
            player.body.velocity.y = -speed;

            player.animations.play('up');
        }
        else if (cursor.down.isDown) {
            //  Move to the right
            player.body.velocity.y = speed;

            player.animations.play('down');
        }
        else {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }
    }

    function collectObject(player, object) {
        object.kill();
    }

    function spawnObject() {
        var randomX = Math.floor(Math.random() * 800) + 30;
        var randomY = Math.floor(Math.random() * 680) + 30;
        var randomItem = itemCollection[Math.floor(Math.random() * itemCollection.length)].name;
        item = items.create(randomX, randomY, randomItem);
        var autoDestruct = createAutoDestructTimer(item, 3)
    }
})();