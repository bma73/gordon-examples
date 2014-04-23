function Gamelogic(room) {
    this.room = room;

}

var p = Gamelogic.prototype;

//defining logic modifiers

//modifying a join request
p.joinLogic = function (user, proceed) {
    //alter the user's dataObject values
    user.dataObject.getValue(0).writeInt16BE(500, 0);
    user.dataObject.getValue(1).write('the answer is 39!!');

    //simulating a long running e.g. database query
    setTimeout(function () {
        /*to let the user join pass 'true' to provided proceed function*/
        proceed(true);

        /*to cancel the join request pass 'false' */
        //proceed(false);

        /*or close the user's connection*/
        //user.connection.dispose();
        //proceed(false);

    }, 2000);
};

//modifying a change room request
p.changeRoomLogic = function (user, newRoom, oldRoom, proceed) {

    //don't allow users to change from room1 to room3 (this logic only runs in room1 - see index.js)
    if (newRoom.id == 'room3') {
        proceed(false);
    } else {
        proceed(true);
    }
};

//modifying a chat message
p.chatMessageLogic = function (target, message, proceed) {
    //target could be a user or an object with user.id/user key/value
    message = message.split('').reverse().join('');
    proceed(true, message);
};

//modifying a custom message
p.customMessageLogic = function (buffer, proceed) {
    if (buffer.readUInt16BE(0) == 0xc000){
        var b = new Buffer(4);
        b.writeUInt32BE(0xffffffff, 0);
        proceed(true, b);
    }
};

//will be called if the according room is removed
p.dispose = function () {
    //dispose dictionary and call the the dispose method of its contents
    this.things.dispose(true);
};


module.exports = Gamelogic;


