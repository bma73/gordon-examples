var DataKey = require('./thingDataKey');
var Rnd = require('gordon-server/lib/util/rnd');

var __id = 0;

function Thing(room, gamelogic, timer) {
    this.room = room;
    this.id = __id++;
    this.gamelogic = gamelogic;
    this.timer = timer;
    this.moveDuration = Rnd.integer(500, 900);
    this.path = [];
    this.state = 'waiting';

    this.x = 1;
    this.y = 1;

    //every 'thing' is represented by a dataObject
    //define the dataObject's structure
    var values = {};
    values[DataKey.TYPE] = new Buffer(1);
    values[DataKey.X] = new Buffer(1);
    values[DataKey.Y] = new Buffer(1);
    values[DataKey.MOVE_DURATION] = new Buffer(2);

    //write the initial values
    values[DataKey.TYPE].writeInt8(1, 0);
    values[DataKey.X].writeInt8(this.x, 0);
    values[DataKey.Y].writeInt8(this.y, 0);
    values[DataKey.MOVE_DURATION].writeInt16BE(this.moveDuration, 0);

    this.dataObject = this.room.createDataObject(values, true);

    this.moveToNewPos();

    //add the thing to the timer loop
    this.timer.addObject(this);
}

var p = Thing.prototype;

p.moveToNewPos = function () {
    //find a random point to walk to
    this.state = 'waiting';
    this.gamelogic.calculatePath(this.id, [this.x, this.y], [Rnd.integer(0, 19), Rnd.integer(0, 15)], this.onPath.bind(this));
};

p.onPath = function (path) {
    if (path.length == 0) {
        this.moveToNewPos();
    } else {
        this.path = path;
        this.nextMoveTime = Date.now() + this.moveDuration;
        this.state = 'moving';
    }
};

p.loop = function (delta, time) {
    if (this.state == 'moving') {
        var now = Date.now();
        //already time to move to the next waypoint?
        if (now >= this.nextMoveTime) {
            //no waypoints left?
            if (this.path.length == 0) {
                //find a new target position
                this.moveToNewPos();
            } else {
                var wayPoint = this.path.shift();
                this.x = wayPoint[0];
                this.y = wayPoint[1];
                this.dataObject.getValue(DataKey.X).writeInt8(this.x, 0);
                this.dataObject.getValue(DataKey.Y).writeInt8(this.y, 0);
                this.dataObject.broadcastValues([DataKey.X, DataKey.Y]);
                this.nextMoveTime = now + this.moveDuration;
            }
        }
    }
};

p.dispose = function () {
    clearInterval(this._inv);
    //delete dataobject and broadcast event
    this.dataObject.dispose(true);
    this.room = null;
    this.timer.removeObject(this);
    this.timer = null;
};

module.exports = Thing;


