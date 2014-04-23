module.exports = function (gordon) {
    var session = gordon.createSession('example01', 'Example 01 Session');
    var room = session.createRoom('lobby');
};