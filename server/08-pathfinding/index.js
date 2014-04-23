var childProcess = require('child_process');
var Gamelogic = require('./gamelogic');

//for the pathfinding fork a child process
var pathfinder = childProcess.fork(__dirname + '/pathfinder.js');

module.exports = function (gordon) {
    var session = gordon.createSession('example08', 'Example 08 Pathfinding');
    var room1 = session.createRoom('room1');
    room1.logic = new Gamelogic(room1, pathfinder);
};