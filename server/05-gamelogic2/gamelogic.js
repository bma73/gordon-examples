var Thing = require('./thing');
var Dictionary = require('gordon-server/lib/util/dictionary');
var RoomEvent = require('gordon-server/lib/event/room');

function Gamelogic(room, color) {
    this.room = room;
    this.color = color;

    this.things = new Dictionary();
    var thingCount = 10;
    for (var i = 0; i < thingCount; ++i) {
        this.createThing();
    }

    //handle add and remove user events
    this.room.on(RoomEvent.ADD_USER, this._onAddUser.bind(this));
    this.room.on(RoomEvent.REMOVE_USER, this._onRemoveUser.bind(this));
    this.room.on(RoomEvent.CUSTOM_MESSAGE, this._onCustomMessage.bind(this));
}

var p = Gamelogic.prototype;

//will be called if the according room is removed
p.dispose = function () {
    //dispose dictionary and call the the dispose method of its contents
    this.things.dispose(true);
};


p._onAddUser = function (user) {
    console.log("new user:" + user.id);
};

p._onRemoveUser = function (user) {
    console.log("user left:" + user.id);
};

p._onCustomMessage = function (connection, buffer) {

    var type = buffer.readInt8(0);

    switch (type) {
        //type for "thing has been clicked" - is 11 for some unknown reason ;)
        case 11:
            var dataObjectId = buffer.readInt16BE(1);
            var user = connection.user;

            var thing = this.things.get(dataObjectId);
            console.log(thing.active, dataObjectId);
            //only active things are allowed to be deleted
            if (!thing.active) return;

            //remove the clicked dataObject
            this.removeThing(dataObjectId);
            //and create a new one
            this.createThing();
            break;

    }
};

p.createThing = function () {
    var thing = new Thing(this.room, this.color);
    this.things.put(thing.dataObject.id, thing);
};

p.removeThing = function (id) {
    var thing = this.things.remove(id);
    if (thing) thing.dispose();
};

module.exports = Gamelogic;


