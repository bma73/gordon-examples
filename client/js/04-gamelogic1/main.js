(function () {

    var g = new gordon.Client();

    var log = function () {
        var args = Array.prototype.slice.call(arguments);
        var l = $('#log');
        l.append(args.join(' ') + '<br>');
        l.scrollTop(l.height());
    };

    var startup = function () {

        g.connect('ws://127.0.0.1:9092');
        log('Connecting...');

        //Events
        g.on(gordon.Event.CONNECTED, function (err) {
            if (!err) {
                var name = 'Gordon' + Math.round(Math.random() * 1000);

                g.join('example04', 'room1', name);

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

        g.on(gordon.Event.NEW_DATA_OBJECT, function (dataObject) {
            log('DataObject created.');
            var type = dataObject.getInt8(gordonexample.Thing.KEY_TYPE);
            if (type == 1) {
                var thing = new gordonexample.Thing(dataObject);
            }
        });
    };

    startup();

})();




