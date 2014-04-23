module.exports = function (gordon) {
    var session = gordon.createSession('example02', 'Example 02 Chatrooms');
    var room1 = session.createRoom('room1');
    var room2 = session.createRoom('room2');
    var room3 = session.createRoom('room3');
};