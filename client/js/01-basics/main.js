(function () {


    var log = function () {
        var args = Array.prototype.slice.call(arguments);
        $('#log').append(args.join(' ') + '<br>');
    };

    var g = new gordon.Client();
    g.connect('ws://127.0.0.1:9092');
    log('Connecting...');

    g.on(gordon.Event.CONNECTED, function (err) {
        if (!err) {
            var name = 'Gordon' + Math.round(Math.random() * 1000);

            var dataObject = new gordon.DataObject();
            dataObject.setUint16(0, 1000);
            dataObject.setString(1, "the answer is 42!");

            g.join('example01', 'lobby', name, dataObject);
            log('<strong>Joining as', name, '</strong>');
        }
        else {
            log('Connection error. Code:', err);
        }
    });

    g.on(gordon.Event.JOINED, function (err, user) {
        if (!err) {
            log('Joined. User id:', user.id);
        }
        else {
            log('Join error. Code:', err);
        }
    });

    g.on(gordon.Event.NEW_USER, function (user) {
        log(user.name, 'Id:', user.id, 'joined.');
    });

    g.on(gordon.Event.USER_LEFT, function (user) {
        log(user.name, 'Id:', user.id, 'left.');
    });

})();
