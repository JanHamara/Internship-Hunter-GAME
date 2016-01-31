(function () {
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    //10%
    var topCompanies = [
        {
            name: 'google',
            image: 'assets/icon_google.png',
            effect: {
                dXP: 20,
                dSpeed: 0,
                dScale: 1.0
            }
        },
        {
            name: 'thales',
            image: 'assets/icon_thales.png',
            effect: {
                dXP: 15,
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
                dXP: 10,
                dSpeed: 0,
                dScale: 1.0
            }
        },
        {
            name: 'cantab',
            image: 'assets/icon_cantab.png',
            effect: {
                dXP: 10,
                dSpeed: 0,
                dScale: 1.0
            }
        }
    ];
    //15%
    var studies = {
        name: 'uoc', image: 'assets/uoc_logo.png',
        effect: {
            dXP: 30,
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
                dXP: -20,
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
            dXP: 20,
            dSpeed: 0,
            dScale: 1.0
        }
    };

    function preload() {

        game.load.image('sky', 'assets/map.png');
        game.load.image('ground', 'assets/wall.jpg');
        game.load.image('side', 'assets/wall2.jpg');
        game.load.image('obstacle', 'assets/obstacle.png');
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

        player_object.xp += item_object.effect.dxp;
        player_object.currentSpeed += item_object.effect.dSpeed;
        player_object.sprite.scale.setTo(item_object.effect.dScale * PLAYER_DEFAULT_SCALE, item_object.effect.dScale * PLAYER_DEFAULT_SCALE)
        objectSprite.kill();
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
})();