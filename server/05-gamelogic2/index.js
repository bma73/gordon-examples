var Gamelogic = require('./gamelogic');

module.exports = function (gordon) {
    var session = gordon.createSession('example05', 'Example 05 Gamelogic2');

    //the rooms will be created automatically when the first player joins
    session.autoRoomCreate = true;

    //create the gamelogic according to the room name
    session.logicFactory = function (room) {

        var gamelogic;

        if (room.id == 'room1') {
            gamelogic = new Gamelogic(room, 0x800080);
            //by default rooms will be removed automatically after 2 sec if empty
            //setting the persistent flag to true will prevent this
            room.persistent = true;
            return gamelogic;
        }

        if (room.id == 'room2') {
            gamelogic = new Gamelogic(room, 0xFF8000);
            room.persistent = true;
            return gamelogic;
        }

        if (room.id == 'room3') {
            gamelogic = new Gamelogic(room, 0x80FF00);
            room.persistent = true;
            return gamelogic;
        }
    };
};