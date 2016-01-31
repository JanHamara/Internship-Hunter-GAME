function Player (game, spriteName, x, y) {
    this.game = game;
    console.log("Game = %o", game);

    this.sprite = this.game.add.sprite(x, y, spriteName);

    //  We need to enable physics on the player
    game.physics.arcade.enable(this.sprite);

    //  Player physics properties. Give the little guy a slight bounce.
    this.sprite.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.sprite.animations.add('left', [6, 7, 8], 10, true);
    this.sprite.animations.add('right', [9, 10, 11], 10, true);
    this.sprite.animations.add('up', [0, 1, 2], 10, true);
    this.sprite.animations.add('down', [3, 4, 5], 10, true);

    this.sprite.scale.setTo(PLAYER_DEFAULT_SCALE, PLAYER_DEFAULT_SCALE);
};

Player.prototype.game = null;
Player.prototype.sprite = null;
Player.prototype.cursor = null;
Player.prototype.xp = 0;
Player.prototype.currentSpeed = PLAYER_DEFAULT_SPEED;
Player.prototype.currentSpriteFramerate = PLAYER_DEFAULT_SPRITE_FRAMERATE;
Player.prototype.currentScale = 1.0;
Player.prototype.ammo = 5;

Player.prototype.setControls = function (keymap) {
    this.cursor = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard[keymap.up]),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard[keymap.down]),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard[keymap.left]),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard[keymap.right])
    };
};

Player.prototype.movePlayer = function () {
    //  Reset the players velocity (movement)
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    if (this.cursor.left.isDown) {
        //  Move to the left
        this.sprite.body.velocity.x = -this.currentSpeed;
        this.sprite.animations.play('left');
    }
    else if (this.cursor.right.isDown) {
        //  Move to the right
        this.sprite.body.velocity.x = this.currentSpeed;
        this.sprite.animations.play('right');
    }
    else if (this.cursor.up.isDown) {
        //  Move to the right
        this.sprite.body.velocity.y = -this.currentSpeed;
        this.sprite.animations.play('up');
    }
    else if (this.cursor.down.isDown) {
        //  Move to the right
        this.sprite.body.velocity.y = this.currentSpeed;
        this.sprite.animations.play('down');
    }
    else {
        //  Stand still
        this.sprite.animations.stop();
        this.sprite.frame = 4;
    }
}