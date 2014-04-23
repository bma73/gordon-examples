(function () {

    var g = new gordon.Client();


    var startup = function () {

        showBlocker(true);

        g.connect('ws://88.198.10.112:9092');
        log('Connecting...');

        //Events
        g.on(gordon.Event.CONNECTED, function (err) {
            showBlocker(false);
            if (!err) {
                log('Connected.');
                getSessionList();
            }
            else {
                log('Connection error. Code:', err.id);
            }
        });
    };

    var getSessionList = function () {
        g.getSessionList(function (list) {
            showList(list, '#sessionlist', function (sessionId) {
                $('#roomlist').empty();
                $('#userlist').empty();
                $('#user').empty();
                getRoomList(sessionId);
            });
        });
    };

    var getRoomList = function (sessionId) {
        g.getRoomList(sessionId, function (list) {
            showList(list, '#roomlist', function (roomId) {
                $('#userlist').empty();
                $('#user').empty();
                getUserList(sessionId, roomId);
            });
        });
    };

    var getUserList = function (sessionId, roomId) {
        g.getUserList(sessionId, roomId, function (list) {
            showList(list, '#userlist', function (id) {
            });
        });
    };

    var showList = function (list, elementId, callback) {
        var element = $(elementId);
        element.empty();
        for (var i = 0; i < list.length; ++i) {
            var m = $('<option data="' + list[i].id + '">' + list[i].id + '/' + list[i].name + '</option>');
            element.append(m);
        }
        element.change(function () {
            callback($(':selected', this).attr('data'));
        });
    };


    var showBlocker = function (value, time) {
        value ? $('#blocker').fadeIn(time || 200) : $('#blocker').fadeOut(time || 200);
    };

    var log = function () {
        var args = Array.prototype.slice.call(arguments);
        var l = $('#log');
        l.append(args.join(' ') + '<br>');
        l.scrollTop(l.height());

    };

    startup();

})();

