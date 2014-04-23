var Thing = require('./thing');
var Timer = require('gordon-server/lib/util/timer');
var grid = require('./grid');
var gordon = require('gordon-server');

//create a timer running with 15 FPS
var timer = new Timer(1000 / 15);

function Gamelogic(room, pathfinder) {
    this.room = room;
    this.pathfinder = pathfinder;
    this.map = [];

    this.pathfinder.on('message', this.onPath.bind(this));

    //create some things
    var thingCount = 50;
    for (var i = 0; i < thingCount; ++i) {
        new Thing(this.room, this, timer);
    }
}

var p = Gamelogic.prototype;

p.joinLogic = function (user, proceed) {

    //send an init message with the grid data to the joining client
    var initMessage = JSON.stringify(grid);
    var buffer = new Buffer(initMessage.length + 1);
    //we choose 1 for the initMessage code
    //so other custom messages with different codes could be send
    //and the clients can figure what kind of custom message it is
    buffer.writeInt8(1, 0);
    buffer.write(initMessage, 1);
    gordon.sendCustomMessage(buffer, user);

    //proceed with the standard join process
    proceed(true);
};


p.calculatePath = function (id, start, end, callback) {
    //store the request callback in the map
    this.map[id] = callback;
    var m = {
        start: start,
        end: end,
        id:id
    };
    //send the new path request to the pathfinder process
    this.pathfinder.send(m);
};

p.onPath = function(m) {
    //pathfinder process sent back the computed path
    //get the callback and trigger it
    this.map[m.id].apply(null, [m.path]);
};

//will be called if the according room is removed
p.dispose = function () {
    //dispose dictionary and call the the dispose method of its contents
};

module.exports = Gamelogic;