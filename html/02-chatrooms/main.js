(function () {

    var g = new gordon.Client();
    var currentRoomId;


    var startup = function () {

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

        $('#message').keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                sendMessage();
            }
        });

        showBlocker(true);

        g.connect('ws://88.198.10.112:9092');
        log('Connecting...');

        //Events
        g.on(gordon.Event.CONNECTED, function (err) {
            if (!err) {
                var name = 'Gordon' + Math.round(Math.random() * 1000);
                g.join('example02', 'room1', name);
                log('<strong>Joining as', name, '</strong>');
            }
            else {
                log('Connection error. Code:', err.id);
            }
        });

        g.on(gordon.Event.JOINED, function (err, user) {
            if (!err) {
                log('Joined. User id:', user.id);
                addUserToList(user);
            }
            else {
                log('Join error. Code:', err);
            }
            showBlocker(false);
        });

        g.on(gordon.Event.NEW_USER, function (user) {
            log(user.name, 'Id:', user.id, 'joined.');
            addUserToList(user);
        });

        g.on(gordon.Event.USER_LEFT, function (user) {
            log(user.name, 'Id:', user.id, 'left.');
            removeUserFromList(user);
        });

        g.on(gordon.Event.CHAT_MESSAGE, function (user, message) {
            addMessage(user, message);
        });
    }

    var showBlocker = function (value, time) {
        value ? $('#blocker').fadeIn(time || 200) : $('#blocker').fadeOut(time || 200);
    };


    var changeRoom = function (targetRoomId) {
        showBlocker(true);
        g.changeRoom(targetRoomId, '', function (err, newRoom) {
            if (err) {
                log('Change room failed:', err);
            }
            else {
                selectRoom(targetRoomId);
                $('#userlist').empty();
                $('#messages').text('');
                addUserToList(g.me);
                log('Room changed', newRoom.id);
            }
            showBlocker(false);
        });
    };

    var addUserToList = function (user) {
        var user = $('<div id="user' + user.id + '">' + user.name + '</div>');
        $('#userlist').append(user);
    };

    var removeUserFromList = function (user) {
        $('#user' + user.id).remove();
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

    var addMessage = function (sender, message) {
        var l = $('#messages');
        l.append('<i>' + sender.name + ': </i>' + message + '<br>');
        l.scrollTop(l.height());

    }

    var log = function () {
        var args = Array.prototype.slice.call(arguments);
        var l = $('#log');
        l.append(args.join(' ') + '<br>');
        l.scrollTop(l.height());

    };

    selectRoom('room1');
    startup();

})();

