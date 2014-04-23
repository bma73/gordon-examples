var DataKey = require('./fakePlayerDataKey');
var Rnd = require('gordon-server/lib/util/rnd');

var DataObject = require('gordon-server/lib/structure/data-object');
var Structure = require('gordon-server/lib/structure/structure');

var Timer = require('gordon-server/lib/util/timer');
var logger = require('gordon-server/lib/util/logger');

var TWEEN = require('tween.js');

//create a timer running with 10 FPS
var timer = new Timer(1000 / 15);

function FakePlayer(sessionUUID, roomUUID) {

    var name = "FakePlayer" + Rnd.integer(1000, 9999);

    //create the player's dataObject
    var values = {};
    values[DataKey.X_POS] = new Buffer(2);
    values[DataKey.Y_POS] = new Buffer(2);

    //write the initial values
    this.position = {x: Rnd.integer(50, 900), y: Rnd.integer(50, 700)};
    values[DataKey.X_POS].writeInt16BE(this.position.x, 0);
    values[DataKey.Y_POS].writeInt16BE(this.position.y, 0);

    //create a dataObject not bound to any room using the static DataObject.createObject() method
    this.dataObject = DataObject.createObject(values);

    //create the user without a connection
    this.user = Structure.createUser(sessionUUID, roomUUID, null, name, this.dataObject);


//    timer.addObject(this);

//    this.setNextTargetPos();
}

var p = FakePlayer.prototype;

p.setNextTargetPos = function () {
    var target = {x: Rnd.integer(50, 900), y: Rnd.integer(50, 700)};
    var time = Rnd.integer(500, 2000);
    var delay = Rnd.boolean() ? 0 : Rnd.integer(3000, 6000);

    var tween = new TWEEN.Tween(this.position).to(target, time);
    tween.easing(TWEEN.Easing.Linear.None);
    tween.delay(delay);
    tween.onUpdate(this.onUpdate.bind(this));
    tween.onComplete(this.setNextTargetPos.bind(this));
    tween.start();
};

p.onUpdate = function () {
    this.dataObject.getValue(DataKey.X_POS).writeInt16BE(Math.round(this.position.x), 0);
    this.dataObject.getValue(DataKey.Y_POS).writeInt16BE(Math.round(this.position.y), 0);

    //broadcast values into fake user's room
    this.dataObject.broadcastValues([DataKey.X_POS, DataKey.Y_POS]);
};


p.loop = function (delta, time) {
    TWEEN.update();
};


p.dispose = function () {
    timer.removeObject(this);
};

module.exports = FakePlayer;


