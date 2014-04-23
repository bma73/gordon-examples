(function () {

    var g = new gordon.Client();
    var players = new gordon.Dictionary();

    //create a timer running with 15 FPS
    var timer = new gordon.Timer(1000 / 15);

    var log = function () {
        var args = Array.prototype.slice.call(arguments);
        var l = $('#log');
        l.append(args.join(' ') + '<br>');
        l.scrollTop(l.height());
    };

    var startup = function () {

        g.connect('ws://88.198.10.112:9092');
        log('Connecting...');

        //Events
        g.on(gordon.Event.CONNECTED, function (err) {
            if (!err) {
                var name = 'Gordon' + Math.round(Math.random() * 1000);

                //create the player's dataObject
                var dataObject = new gordon.DataObject();
                dataObject.setInt16(gordonexample.Player.KEY_X_POS, -200);
                dataObject.setInt16(gordonexample.Player.KEY_Y_POS, -200);

                //join with defined dataObject
                g.join('example03', 'room1', name, dataObject);

                log('<strong>Joining as', name, '</strong>');
            }
            else {
                log('Connection error. Code:', err.id);
            }
        });

        g.on(gordon.Event.JOINED, function (err, user) {
            if (!err) {
                log('Joined. User id:', user.id);
                addUser(user, false);
            }
            else {
                log('Join error. Code:', err.id);
            }
        });

        g.on(gordon.Event.NEW_USER, function (user) {
            log(user.name, 'Id:', user.id, 'joined.');
            addUser(user, true);
        });

        g.on(gordon.Event.USER_LEFT, function (user) {
            log(user.name, 'Id:', user.id, 'left.');
            removeUser(user);
        });
    }

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

    startup();

})();




