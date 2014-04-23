var FakePlayer = require('./fakePlayer');


module.exports = function (gordon) {
    var session = gordon.createSession('example07', 'Example 07 Query Stats');
    var room1 = session.createRoom('room1');
    var room2 = session.createRoom('room2');
    var room3 = session.createRoom('room3');
    var room4 = session.createRoom('room4');
    var room5 = session.createRoom('room5');

    //to populate the room a little bit we create some fake players
    for (var i = 0; i < 30; i++) {
        new FakePlayer('example07', 'room' + ((i % 5) + 1));
    }
};