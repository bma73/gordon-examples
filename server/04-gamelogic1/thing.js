var DataKey = require('./thingDataKey.js');
var Rnd = require('gordon-server/lib/util/rnd');

var __id = 0;

function Thing(room) {
    this.room = room;
    this.id = __id++;

    //every 'thing' is represented by a dataObject
    //define the dataObject's structure
    var values = {};
    values[DataKey.TYPE] = new Buffer(1);
    values[DataKey.X] = new Buffer(2);
    values[DataKey.Y] = new Buffer(2);
    values[DataKey.ACTIVE] = new Buffer(1);

    this.active = Rnd.boolean();

    //write the initial values
    values[DataKey.TYPE].writeInt8(1, 0);
    values[DataKey.X].writeInt16BE(Rnd.integer(50, 1000), 0);
    values[DataKey.Y].writeInt16BE(Rnd.integer(50, 800), 0);
    values[DataKey.ACTIVE].writeInt8(Number(this.active), 0);

    this.dataObject = this.room.createDataObject(values, true);

    this._inv = setInterval(this.update.bind(this), Rnd.integer(1000, 4000));
}

var p = Thing.prototype;


p.update = function () {
    //toggle the status and broadcast it
    this.active = !this.active;
    this.dataObject.getValue(DataKey.ACTIVE).writeInt8(Number(this.active), 0);
    this.dataObject.broadcastValues([DataKey.ACTIVE]);
};

p.dispose = function () {
    clearInterval(this._inv);
    //delete dataobject and broadcast event
    this.dataObject.dispose(true);
    this.room = null;
};

module.exports = Thing;


