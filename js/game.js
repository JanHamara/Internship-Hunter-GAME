(function () {
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    var menuState = {
        create: function () {
            game.add.text(100, 100, 'Hello',
                {font: '50px Arial', fill: '#ffffff'});

            var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            wkey.onDown.addOnce(this.start, this);

        },
        start: function () {
            game.state.start('game');
        }
    };

    var gameState = {
        create: function() {

        },
        update: function(){}
    };

    game.state.add('menu', menuState);
    game.state.add('game', gameState);
    game.state.start('menu');


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
        game.load.image('blueBar', 'assets/platform.png');
        game.load.image('redBar', 'assets/platform2.png');
        game.load.image('obstacle', 'assets/obstacle.png');
        game.load.image('xpBar1', 'assets/xpBarP1.png');
        game.load.image('xpBar2', 'assets/xpBarP2.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.atlasJSONArray('player-red', 'sprites/red.png', 'sprites/red.json');
        game.load.atlasJSONArray('player-white', 'sprites/white.png', 'sprites/white.json');

        // load different items that can be picked up
        for (var i = 0; i < itemCollection.length; i++) {
            game.load.image(itemCollection[i].name, itemCollection[i].image);
        }
    }

    var p1, p2;
    var exp1, exp2;

    var platforms;
    var items;
    var item;

    var starTimer;
    var obstacle, waterObstacle;

    function create() {

        initEnvironmnent();

        p1 = new Player(game, 'player-red', x = 50, y = 50);
        p1.setControls({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });

        p2 = new Player(game, 'player-white', x = game.world.width - 130, y = 50);
        p2.setControls({
            up: 'UP',
            down: 'DOWN',
            left: 'LEFT',
            right: 'RIGHT'
        });

        exp1 = new Experience(game, 'xpBar1', 'blueBar', 4, 400);
        exp2 = new Experience(game, 'xpBar2', 'redBar', 937, 400);


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

        game.physics.arcade.collide(items, platforms);
        game.physics.arcade.overlap(platforms, items, collectObject, null, this);

        p1.movePlayer();
        p2.movePlayer();
    }


    function initObstacles() {
//obstacles
        obstacle = platforms.create(430, 355, 'obstacle');
        obstacle.scale.setTo(0.365, 0.8);
        obstacle.body.immovable = true;

        obstacle = platforms.create(585, 310, 'obstacle');
        obstacle.scale.setTo(0.06, 2);
        obstacle.body.immovable = true;

        obstacle = platforms.create(335, 0, 'obstacle');
        obstacle.scale.setTo(0.52, 2.2);
        obstacle.body.immovable = true;

        //water
        waterObstacle = platforms.create(730, 575, 'obstacle');
        waterObstacle.scale.setTo(0.4, 1.7);
        waterObstacle.body.immovable = true;

        waterObstacle = platforms.create(0, 620, 'obstacle');
        waterObstacle.scale.setTo(0.35, 3);
        waterObstacle.body.immovable = true;

        waterObstacle = platforms.create(400, 650, 'obstacle');
        waterObstacle.scale.setTo(0.16, 3);
        waterObstacle.body.immovable = true;

        waterObstacle = platforms.create(570, 600, 'obstacle');
        waterObstacle.scale.setTo(0.05, 1);
        waterObstacle.body.immovable = true;


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
        initObstacles();


    }


    function collectObject(player, object) {
        object.kill();
    }

    function spawnObject() {
        var randomX = Math.floor(Math.random() * 800) + 30;
        var randomY = Math.floor(Math.random() * 650) + 30;
        var randomItem = itemCollection[Math.floor(Math.random() * itemCollection.length)].name;
        item = items.create(randomX, randomY, randomItem);
        var autoDestruct = createAutoDestructTimer(item, 100)
    }

})();