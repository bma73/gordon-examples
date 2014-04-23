var gordon = require('gordon-server');
gordon.configure(__dirname + '/config.json');

/*
    This resets the default id settings count (500)
    and limits the number of max users for this server instance to 100.
 */
gordon.setMaxUsers(100, false);
gordon.createTCPServer(9091);
gordon.createWebSocketServer(9092);

require('./01-basics')(gordon);
require('./02-chatrooms')(gordon);
require('./03-dataobjects')(gordon);
require('./04-gamelogic1')(gordon);
require('./05-gamelogic2')(gordon);
require('./06-logicmodifiers')(gordon);
require('./07-querystats')(gordon);
require('./08-pathfinding')(gordon);
