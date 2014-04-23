this.gordonexample = this.gordonexample || {};

$(document).ready(function () {

    (function () {

        var g = new gordon.Client({pingInterval: 1000});
        var grid;
        var tileSize = gordonexample.tileSize = 40;
        var canvas = document.getElementById('canvas');
        var stage = new createjs.Stage(canvas);

        //create a timer running with 30 fps to update the stage
        var timer = new gordon.Timer(1000 / 30);
        var update = {
            loop: function (delta, time) {
                stage.update();
            }
        };
        timer.addObject(update);

        //store the images
        gordonexample.images = {
            wall: document.getElementById('wall'),
            thing: document.getElementById('thing')
        };

        function startup() {

            showBlocker(true);
            log('Connecting...');

            //connect
            g.connect('ws://127.0.0.1:9092', function (err) {
                if (err) {
                    log('Connection error. Code:', err.id);
                    return;
                }

                var name = 'Gordon' + Math.round(Math.random() * 1000);

                log('Connected.');
                log('<strong>Joining as', name, '</strong>');

                //join
                g.join('example08', 'room1', name, null, function (err, user) {
                    showBlocker(false);
                    if (err) {
                        log('Join error. Code:', err.id);
                        return;
                    }
                    log('Joined. User id:', user.id);
                });
            });


            //listen to the custom message event
            //the server will send an "init message" with the grid data used
            //right before the join, so that the client can draw the map
            g.on(gordon.Event.CUSTOM_MESSAGE, function (view) {
                var code = view.getInt8(0);
                switch (code) {
                    //init message
                    case 1:
                        var gridString = gordon.Util.bufferToUtf8String(view.buffer, 1);
                        grid = JSON.parse(gridString);
                        drawLevel();
                        break;
                }
            });

            //Create the things
            //The dataObjects will be sent right after the join has succeeded.
            g.on(gordon.Event.NEW_DATA_OBJECT, function (dataObject) {
                var type = dataObject.getInt8(gordonexample.Thing.KEY_TYPE);
                if (type == 1) {
                    new gordonexample.Thing(g, dataObject, stage);
                }
            });
        }

        function drawLevel() {
            var wallImage = gordonexample.images.wall;
            for (var y = 0; y < grid.length; ++y) {
                var row = grid[y];
                for (var x = 0; x < row.length; ++x) {
                    var tile = row[x];
                    if (tile == 1) {
                        var wall = new createjs.Bitmap(wallImage);
                        stage.addChild(wall);
                        wall.x = x * tileSize;
                        wall.y = y * tileSize;
                    }
                }
            }
        }


        function showBlocker(value, time) {
            value ? $('#blocker').fadeIn(time || 200) : $('#blocker').fadeOut(time || 200);
        }

        function log() {
            var args = Array.prototype.slice.call(arguments);
            var l = $('#log');
            l.append(args.join(' ') + '<br>');
            l.scrollTop(l.height());
        }

        startup();

    })();

});

