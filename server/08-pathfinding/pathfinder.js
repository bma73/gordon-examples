var astar = require('astar-andrea');
var grid = require('./grid');


process.on('message', function (m) {
    var time = Date.now();
//    console.log('[pathfinder] calculate waypoints:', m.start, '->', m.end);
    m.path = astar(grid, m.start, m.end, 'Diagonal');
//    console.log('[pathfinder] done.', Date.now() - time, 'ms.');
    process.send(m);
});