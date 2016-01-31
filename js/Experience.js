function Experience(game, spriteName, bar, x, y) {
    this.game = game;
    this.bar = this.game.add.sprite(x + 30, 410, bar);
    this.bar.scale.setTo(0.7, 1);
    this.sprite = this.game.add.sprite(x, y, spriteName);
    this.drawXP();
};

Experience.prototype.xp = 0;
Experience.prototype.bar = null;
Experience.prototype.game = null;

Experience.prototype.getXP = function () {
    return this.xp;
};

Experience.prototype.setXP = function (xp) {
    this.xp = xp;
    this.drawXP();
};

Experience.prototype.drawXP = function () {
    this.bar.scale.setTo(0.7, this.xp / 100);
    this.bar.y = 675 - (this.xp * 2.7);
    console.log(this.xp);
};

Experience.prototype.addXP = function (xp) {
    var gameWon = false;
    if (this.xp + xp < 100) {
        this.xp += xp;
    }
    else {
        this.xp = 100;
        gameWon = true;
    }
    this.drawXP();
    return gameWon;
};