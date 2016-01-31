(function () {
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });


    var itemCollection = [{
        name: 'google',
        image: 'assets/icon_google.png'
    }, {
        name: 'mlh',
        image: 'assets/icon_mlh.png'
    }, {
        name: 'thales',
        image: 'assets/icon_thales.png'
    }, {
        name: 'uoc',
        image: 'assets/uoc_logo.png'
    }, {
        name: 'redbull',
        image: 'assets/icon_redbull.png'
    }, {
        name: 'beer',
        image: 'assets/icon_beer.png'
    }, {
        name: 'gsa',
        image: 'assets/icon_gsa.png'
    }, {
        name: 'cantab',
        image: 'assets/icon_cantab.png'
    }];

    function preload() {

        game.load.image('sky', 'assets/map.png');
        game.load.image('ground', 'assets/wall.jpg');
        game.load.image('side', 'assets/wall2.jpg');
        game.load.image('obstacle', 'assets/obstacle.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.atlasJSONArray('player-red', 'sprites/red.png', 'sprites/red.json');
        game.load.atlasJSONArray('player-white', 'sprites/white.png', 'sprites/white.json');

        // load different items that can be picked up
        for (var i = 0; i < itemCollection.length; i++) {
            game.load.image(itemCollection[i].name, itemCollection[i].image);
        }
    }

    var p1, p2;

    var platforms;
    var items;
    var item;

    var starTimer;

    function create() {

        initEnvironmnent();

        p1 = new Player(game, 'player-red', x = 50, y = 50);
        p1.setControls({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });

        p2 = new Player(game, 'player-white', x = game.world.width - 130, y = game.world.height - 130);
        p2.setControls({
            up: 'UP',
            down: 'DOWN',
            left: 'LEFT',
            right: 'RIGHT'
        });

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
        game.physics.arcade.collide(p1.sprite, platforms);
        game.physics.arcade.overlap(p1.sprite, items, collectObject, null, this);

        game.physics.arcade.collide(p1.sprite, p2.sprite);

        game.physics.arcade.collide(p2.sprite, platforms);
        game.physics.arcade.overlap(p2.sprite, items, collectObject, null, this);

        p1.movePlayer();
        p2.movePlayer();
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
        ground.body.immovable = true;

        var ledge = platforms.create(0, 0, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(0, 0, 'side');
        ledge.body.immovable = true;

        ledge = platforms.create(game.world.width - 30, 0, 'side');
        ledge.body.immovable = true;

        //obstacles
        var obstacle = platforms.create(430, 355, 'obstacle');
        obstacle.scale.setTo(0.365, 0.8);
        obstacle.body.immovable = true;

        obstacle = platforms.create(585, 310, 'obstacle');
        obstacle.scale.setTo(0.06, 2);
        obstacle.body.immovable = true;
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