var Thing = require('./thing');
var Dictionary = require('gordon-server/lib/util/dictionary');

function Gamelogic(room) {
    this.room = room;

    //create some things
    this.things = new Dictionary();
    var thingCount = 20;
    for (var i = 0; i < thingCount; ++i) {
        var thing = new Thing(room);
        this.things.put(thing.id, thing);
    }
}

var p = Gamelogic.prototype;

//will be called if the according room is removed
p.dispose = function () {
    //dispose dictionary and call the the dispose method of its contents
    this.things.dispose(true);
};

module.exports = Gamelogic;


