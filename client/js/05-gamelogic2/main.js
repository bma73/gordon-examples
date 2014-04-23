this.gordonexample = this.gordonexample || {};
(function () {

    var g = gordonexample.gordon = new gordon.Client();
    var players = new gordon.Dictionary();
    var currentRoomId;

    //create a timer running with 15 FPS
    var timer = new gordon.Timer(1000 / 15);

    var log = function () {
        var args = Array.prototype.slice.call(arguments);
        var l = $('#log');
        l.append(args.join(' ') + '<br>');
        l.scrollTop(l.height());
    };

    var showBlocker = function (value, time) {
        value ? $('#blocker').fadeIn(time || 200) : $('#blocker').fadeOut(time || 200);
    };

    var startup = function () {

        g.connect('ws://127.0.0.1:9092');
        log('Connecting...');

        $('#room1').click(function () {
            changeRoom('room1');
        });

        $('#room2').click(function () {
            changeRoom('room2');
        });

        $('#room3').click(function () {
            changeRoom('room3');
        });

        //Events
        g.on(gordon.Event.CONNECTED, function (err) {
            if (!err) {
                var name = 'Gordon' + Math.round(Math.random() * 1000);

                //create the player's dataObject
                var dataObject = new gordon.DataObject();
                dataObject.setInt16(gordonexample.Player.KEY_X_POS, -200);
                dataObject.setInt16(gordonexample.Player.KEY_Y_POS, -200);
                g.join('example05', 'room1', name, dataObject);

                log('<strong>Joining as', name, '</strong>');
            }
            else {
                log('Connection error. Code:', err.id);
            }
        });

        g.on(gordon.Event.CLOSED, function () {
            log('Connection closed.');
        });

        g.on(gordon.Event.JOINED, function (err, user) {
            if (!err) {
                log('Joined. User id:', user.id);
                selectRoom('room1');
                addUser(user, false);
            }
            else {
                log('Join error. Code:', err.id);

            }
            showBlocker(false);
        });

        g.on(gordon.Event.NEW_USER, function (user) {
            log(user.name, 'Id:', user.id, 'joined.');
            addUser(user, true);
        });

        g.on(gordon.Event.USER_LEFT, function (user) {
            log(user.name, 'Id:', user.id, 'left.');
            removeUser(user);
        });

        g.on(gordon.Event.NEW_DATA_OBJECT, function (dataObject) {
            var type = dataObject.getInt8(gordonexample.Thing.KEY_TYPE);
            if (type == 1) {
                new gordonexample.Thing(dataObject, onThingClicked.bind(this));
            }
        });
    };


    var changeRoom = function (targetRoomId) {
        showBlocker(true);
        g.changeRoom(targetRoomId, '', function (err, newRoom) {
            if (err) {
                log('Change room failed:', err);
            }
            else {
                log('Room changed', newRoom.id);
                selectRoom(newRoom.id);
            }
            showBlocker(false);
        });
    };

    var selectRoom = function (id) {
        if (currentRoomId) {
            $('#' + currentRoomId).removeClass('selected');
        }
        $('#' + id).addClass('selected');
        currentRoomId = id;
    };

    var addUser = function (user, isRemotePlayer) {
        var player = new gordonexample.Player(user, isRemotePlayer);
        players.put(user, player);

        if (!isRemotePlayer) {
            timer.addObject(player);
        }
    };
    var removeUser = function (user) {
        var player = players.remove(user, true);
        player.dispose();
    };

    var onThingClicked = function (thing) {
        log('Thing clicked', thing.dataObject.id);

        //we'll use a custom message to inform the server about the click event
        var view = new DataView(new ArrayBuffer(1 + 2));
        //let the code for the click event be - ehrm - 11 ;)
        view.setInt8(0, 11);
        //write the dataobject id
        view.setUint16(1, thing.dataObject.id);
        //send the message to the server
        g.sendCustomMessage(view.buffer);
    };

    startup();

})();




