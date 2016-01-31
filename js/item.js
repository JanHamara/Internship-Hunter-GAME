function Item(name, type, image){
    this.name = name;
    this.type = type;
    this.image = image;
}


Item.prototype.name = null;
Item.prototype.type = null;
Item.prototype.sprite = null;
Item.prototype.displayDuration = null;
Item.prototype.effectDuration = null;
Item.prototype.effect = {
    dXP: 0,
    dSpeed: 0,
    dScale: 0.0
};

