var Gamelogic = require('./gamelogic');

module.exports = function (gordon) {
    var session = gordon.createSession('example04', 'Example 04 Gamelogic1');
    var room = session.createRoom('room1');

    //create the gamelogic module for this room
    room.logic = new Gamelogic(room);
};