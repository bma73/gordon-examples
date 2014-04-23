var FakePlayer = require('./fakePlayer');
var Timer = require('gordon-server/lib/util/timer');

//create a timer running with 10 FPS
var timer = new Timer(1000 / 15);

module.exports = function (gordon) {
    var session = gordon.createSession('example03', 'Example 03 DataObjects');
    var room1 = session.createRoom('room1');

    //to populate the room a little bit we create some fake players
    for (var i = 0; i < 5; i++) {
        new FakePlayer('example03', 'room1', timer);
    }
};