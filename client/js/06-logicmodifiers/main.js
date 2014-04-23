(function () {

    $('#room1').click(function () {
        changeRoom('room1');
    });

    $('#room2').click(function () {
        changeRoom('room2');
    });

    $('#room3').click(function () {
        changeRoom('room3');
    });

    $('#send').click(function () {
        sendMessage();
    });

    $('#sendCustomMessage').click(function () {
        sendCustomMessage();
    });

    $('#message').keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            sendMessage();
        }
    });


    showBlocker(true);

    var currentRoomId;
    var g = new gordon.Client();
    g.connect('ws://127.0.0.1:9092');
    log('Connecting...');

    //Events
    g.on(gordon.Event.CONNECTED, function (err) {
        if (!err) {

            var name = 'Gordon' + Math.round(Math.random() * 1000);

            //defining the data
            var dataObject = new gordon.DataObject();
            dataObject.setUint16(0, 1000);
            dataObject.setString(1, "the answer is 42!");
            g.join('example06', 'room1', name, dataObject);

            log('Joining with data:', dataObject.getUint16(0), ",", dataObject.getString(1));
        }
        else {
            log('Connection error. Code:', err.id);
        }
    });

    g.on(gordon.Event.CLOSED, function () {
        log('Connection closed.');
        showBlocker(false);
    });

    g.on(gordon.Event.JOINED, function (err, user) {
        if (!err) {
            log('Joined. User id:', user.id);

            //output the data that came back from the server
            log('<strong>Joined with data:', user.dataObject.getUint16(0), ',', user.dataObject.getString(1), '</strong>');

            selectRoom('room1');
        }
        else {
            log('Join error. Code:', err.id);
        }
        showBlocker(false);
    });

    g.on(gordon.Event.NEW_USER, function (user) {
        log(user.name, 'Id:', user.id, 'joined.');
    });

    g.on(gordon.Event.USER_LEFT, function (user) {
        log(user.name, 'Id:', user.id, 'left.');
    });

    g.on(gordon.Event.CHAT_MESSAGE, function (user, message) {
        addMessage(user, message);
    });

    g.on(gordon.Event.CUSTOM_MESSAGE, function (dataView) {
        log('Custom Message received');
        log('<pre>' + gordon.Util.hexDump(dataView.buffer).replace('\n', '<br>') + '</pre>');
    });


    var changeRoom = function (targetRoomId) {
        showBlocker(true);
        g.changeRoom(targetRoomId, '', function (err, newRoom) {
            if (err) {
                log('Change room failed:', err.id);
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

    var sendMessage = function () {
        var message = $('#message').val();
        if (message == '') return;
        $('#message').val('');
        g.sendChatMessage(message);
    };

    var sendCustomMessage = function () {
        var view = new DataView(new ArrayBuffer(2));
        view.setUint16(0, 0xc000);
        g.sendCustomMessage(view.buffer);
        log('Sending Custom Message');
        log('<pre>' + gordon.Util.hexDump(view.buffer).replace('\n', '<br>') + '</pre>');
    };

    var addMessage = function (sender, message) {
        var l = $('#messages');
        l.append('<i>' + sender.name + ': </i>' + message + '<br>');
        l.scrollTop(l.height());

    }


    function log() {
        var args = Array.prototype.slice.call(arguments);
        $('#log').append(args.join(' ') + '<br>');
    };

    function showBlocker(value, time) {
        value ? $('#blocker').fadeIn(time || 200) : $('#blocker').fadeOut(time || 200);
    };


})();
