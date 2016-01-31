(function () {
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '');

    var p1, p2;
    var exp1, exp2;

    var platforms;
    var items;
    var item;

    var specialViewCollectCount = 0;

    var starTimer;
    var obstacle, waterObstacle;
    var musicPlaying = false;
    var ea,sound;

    var menuState = {
        preload: function () {
            game.load.image('start', 'assets/first_screen.png');
            ea = new Audio('assets/ea-sport.mp3');
        },
        create: function () {
            game.add.sprite(0, 0, 'start');
            ea.play();

            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.addOnce(this.start, this);
        },
        start: function () {
            game.state.start('info');
        }
    };

    var infoState = {
        preload: function () {
            game.load.image('start', 'assets/help_screen.png');
        },
        create: function () {
            game.add.sprite(0, 0, 'start');

            var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            wkey.onDown.addOnce(this.start, this);

        },
        start: function () {
            game.state.start('game');
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
            game.load.atlasJSONArray('player-red', 'sprites/red.png', 'sprites/red.json');
            game.load.atlasJSONArray('player-white', 'sprites/white.png', 'sprites/white.json');

            sound = new Audio('assets/80s-electric.mp3');

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
            if (!musicPlaying) {
                sound.play();
                musicPlaying = true;
            }
            
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

            var specialKey = game.input.keyboard.addKey(Phaser.Keyboard.B);
            specialKey.onDown.addOnce(this.start, this);
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
                for (var i = 0; i < ITEM_OBJECTS.length; i++) {
                    if (objectSprite.key == ITEM_OBJECTS[i].name) {
                        item_object = ITEM_OBJECTS[i]
                        break;
                    }
                }

                if (playerSprite.key == p1.sprite.key) {
                    player_object = p1
                } else {
                    player_object = p2
                }

                var gameWon = player_object.xp.addXP(item_object.effect.dXP);

                if (item_object.name == 'mlh')
                    game.state.start('special');

                if (item_object.name == "redbull") {
                    var redBullTimer = game.time.create(true);
                    redBullTimer.add(3000, function (player_object) {
                        player_object.currentSpeed = PLAYER_DEFAULT_SPEED;
                        player_object.sprite.scale.setTo(1.0 * PLAYER_DEFAULT_SCALE, 1.0 * PLAYER_DEFAULT_SCALE)
                    }, null, player_object);
                    redBullTimer.start();
                } else if (item_object.name == "beer") {
                    var beerTimer = game.time.create(true);
                    beerTimer.add(3000, function (player_object) {
                        player_object.currentSpeed = PLAYER_DEFAULT_SPEED;
                        player_object.sprite.scale.setTo(1.0 * PLAYER_DEFAULT_SCALE, 1.0 * PLAYER_DEFAULT_SCALE)
                    }, null, player_object);
                    beerTimer.start();
                }

                player_object.xp.addXP(item_object.effect.dXP);

                if (gameWon)
                    game.state.start('won');


                player_object.currentSpeed += item_object.effect.dSpeed;
                player_object.sprite.scale.setTo(item_object.effect.dScale * PLAYER_DEFAULT_SCALE, item_object.effect.dScale * PLAYER_DEFAULT_SCALE)
                objectSprite.kill();
            }

        },

        start: function () {
            game.state.start('special');
            console.log('special');
        }
    };

    var wonState = {
        preload: function () {
            game.load.image('start', 'assets/final_page.jpg');
        },
        create: function () {
            game.add.sprite(0, 0, 'start');
        },
        start: function () {

        }
    };

    var specialState = {
        preload: function () {
            game.load.atlasJSONArray('player-red', 'sprites/red.png', 'sprites/red.json');
            game.load.atlasJSONArray('player-white', 'sprites/white.png', 'sprites/white.json');
            game.load.atlasJSONArray('wifi', 'sprites/wifi.png', 'sprites/wifi.json');
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

            p1.xp = exp1;
            p2.xp = exp2;

            items = game.add.group();
            items.enableBody = true;

            starTimer = game.time.create(false);
            starTimer.start();
            starTimer.loop(ITEM_SPAWN_DELAY, spawnObject, this);


            function createAutoDestructTimer(target, time) {
                // Use this to destroy the item i.e. any object after creating it
                game.time.events.add(Phaser.Timer.SECOND * time, target.destroy, target);
            }


            function initObstacles() {

            }

            function initEnvironmnent() {
                //  We're going to be using physics, so enable the Arcade Physics system
                game.physics.startSystem(Phaser.Physics.ARCADE);

                //  A simple background for our game
                //game.add.sprite(0, 0, 'sky');


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

                item = items.create(randomX, randomY, 'wifi');
                item.animations.add('wifi', [0, 1, 2, 3], 3, true);
                item.animations.play('wifi', 3, true);
                item.scale.setTo(0.6, 0.6);
                createAutoDestructTimer(item, 2)
            }

            var specialKey = game.input.keyboard.addKey(Phaser.Keyboard.B);
            specialKey.onDown.addOnce(this.start, this);
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
                objectSprite.kill();
                specialViewCollectCount++;

                if (specialViewCollectCount >= WIFI_VIEW_COLLECTED) {
                    specialViewCollectCount = 0;
                    game.state.start('game');
                }
            }

        },

        start: function () {
            game.state.start('special');
            console.log('special');
        }
    };

    game.state.add('menu', menuState);
    game.state.add('game', gameState);
    game.state.add('info', infoState);
    game.state.add('won', wonState);
    game.state.add('special', specialState);
    game.state.start('menu');

})();