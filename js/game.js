(function () {
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '');

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

    var p1, p2;
    var exp1, exp2;

    var platforms;
    var items;
    var item;

    var starTimer;
    var obstacle, waterObstacle;


    var menuState = {
        preload:  function(){
            game.load.image('start', 'assets/first_screen.png');
        },
        create: function () {
            game.load.image('start', 'assets/map.png');
            game.add.sprite(0, 0, 'start');

            var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            wkey.onDown.addOnce(this.start, this);
        },
        start: function () {
            game.state.start('info');
        }
    };

    var infoState = {
        preload:  function(){
            game.load.image('start', 'assets/help_screen.png');
        },
        create: function () {
            game.load.image('start', 'assets/map.png');
            game.add.sprite(0, 0, 'start');

            var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            wkey.onDown.addOnce(this.start, this);

        },
        start: function () {
            game.state.start('game');
        }
    };

    //10%
    var topCompanies = [
        {
            name: 'google',
            image: 'assets/icon_google.png',
            effect: {
                dXP: 1,
                dSpeed: 0,
                dScale: 1.0
            }
        },
        {
            name: 'thales',
            image: 'assets/icon_thales.png',
            effect: {
                dXP: 1,
                dSpeed: 0,
                dScale: 1.0
            }
        }
    ];
    //25%
    var regularCompanies = [
        {
            name: 'gsa',
            image: 'assets/icon_gsa.png',
            effect: {
                dXP: 1,
                dSpeed: 0,
                dScale: 1.0
            }
        },
        {
            name: 'cantab',
            image: 'assets/icon_cantab.png',
            effect: {
                dXP: 1,
                dSpeed: 0,
                dScale: 1.0
            }
        }
    ];
    //15%
    var studies = {
        name: 'uoc', image: 'assets/uoc_logo.png',
        effect: {
            dXP: 5,
            dSpeed: 100,
            dScale: 1.2
        }
    };
    //20%
    var recreation = [
        {
            name: 'beer',
            image: 'assets/icon_beer.png',
            effect: {
                dXP: -1,
                dSpeed: -100,
                dScale: 1.5
            }
        },
        {
            name: 'redbull',
            image: 'assets/icon_redbull.png',
            effect: {
                dXP: 0,
                dSpeed: 500,
                dScale: 0.8
            }
        }
    ];
    //30%
    var hackathon = {
        name: 'mlh', image: 'assets/icon_mlh.png',
        effect: {
            dXP: 3,
            dSpeed: 0,
            dScale: 1.0
        }
    };


    var gameState = {
        preload: function () {
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
            var itemCollection = topCompanies.concat(regularCompanies.concat(recreation.concat(recreation)));
            itemCollection.push(hackathon);
            itemCollection.push(studies);
            for (var i = 0; i < itemCollection.length; i++) {
                var item = new Item(itemCollection[i].name, 0, itemCollection[i].image);
                item.effect = itemCollection[i].effect;
                game.load.image(item.name, item.image);
                ITEM_OBJECTS.push(item)
            }
        },
        create: function () {

            initEnvironmnent();

            p1 = new Player(game, 'player-red', x = 50, y = 50);
            p1.setControls({
                up: 'W',
                down: 'S',
                left: 'A',
                right: 'D',
                shoot: 'TAB'
            });

            p2 = new Player(game, 'player-white', x = game.world.width - 130, y = 50);
            p2.setControls({
                up: 'UP',
                down: 'DOWN',
                left: 'LEFT',
                right: 'RIGHT',
                shoot: 'L'
            });

            exp1 = new Experience(game, 'xpBar1', 'blueBar', 4, 400);
            exp2 = new Experience(game, 'xpBar2', 'redBar', 937, 400);
            p1.xp = exp1;
            p2.xp = exp2;


            items = game.add.group();
            items.enableBody = true;

            //  Our controls.
            p1Cursor = game.input.keyboard.createCursorKeys();
            p2Cursor = game.input.keyboard.createCursorKeys();

            starTimer = game.time.create(false);
            starTimer.start();
            starTimer.loop(ITEM_SPAWN_DELAY, spawnObject, this);


            function createAutoDestructTimer(target, time) {
                // Use this to destroy the item i.e. any object after creating it
                game.time.events.add(Phaser.Timer.SECOND * time, target.destroy, target);
            }

            function update() {

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


            function spawnObject() {
                var randomX = Math.floor(Math.random() * 800) + 30;
                var randomY = Math.floor(Math.random() * 680) + 30;
                var randomOdd = Math.floor(Math.random() * 100);
                var item;

                if (randomOdd < 15) {
                    var randomTop = topCompanies[Math.floor(Math.random() * topCompanies.length)].name;
                    item = items.create(randomX, randomY, randomTop);
                } else if (15 <= randomOdd && randomOdd < 40) {
                    var randomReg = regularCompanies[Math.floor(Math.random() * regularCompanies.length)].name;
                    item = items.create(randomX, randomY, randomReg);
                } else if (40 <= randomOdd && randomOdd < 65) {
                    var randomRec = recreation[Math.floor(Math.random() * recreation.length)].name
                    item = items.create(randomX, randomY, randomRec)
                } else if (65 <= randomOdd && randomOdd < 85) {
                    item = items.create(randomX, randomY, hackathon.name)

                } else if (85 <= randomOdd && randomOdd < 100) {
                    item = items.create(randomX, randomY, studies.name)
                }
                var autoDestruct = createAutoDestructTimer(item, 3)
            }
        },
        update: function () {
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

            function collectObject(playerSprite, objectSprite) {
                var item_object;
                var player_object;
                for (var i = 0; i< ITEM_OBJECTS.length; i++){
                    if (objectSprite.key == ITEM_OBJECTS[i].name){
                        item_object = ITEM_OBJECTS[i]
                        break;
                    }
                };
                if (playerSprite.key == p1.sprite.key){
                    player_object = p1
                }else{
                    player_object = p2
                };

                player_object.xp.addXP(item_object.effect.dXP);

                player_object.currentSpeed += item_object.effect.dSpeed;
                player_object.sprite.scale.setTo(item_object.effect.dScale * PLAYER_DEFAULT_SCALE, item_object.effect.dScale * PLAYER_DEFAULT_SCALE)
                objectSprite.kill();
            }
        }
    };

    game.state.add('menu', menuState);
    game.state.add('game', gameState);
    game.state.add('info', infoState);
    game.state.start('menu');

})();