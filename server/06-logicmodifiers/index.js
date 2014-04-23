var Gamelogic = require('./gamelogic');

module.exports = function (gordon) {
    var session = gordon.createSession('example06', 'Example 06 Gamelogic3');
    var room1 = session.createRoom('room1');
    var room2 = session.createRoom('room2');
    var room3 = session.createRoom('room3');

    //create the gamelogic module only for room1
    room1.logic = new Gamelogic(room1);
};