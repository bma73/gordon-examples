
![Gordon Server Logo][1]
Gordon Examples
=============
The included examples show some basic strategies to get started with Gordon.

----------

### Install

With [npm](http://npmjs.org) do:
```
npm install gordon-examples
```
See also [gordon-client][2] and [gordon-server][3].

----------
###Examples
####01 - Basics
This example just shows how to connect to the server and join a session and a room.
####02 - Chat Rooms
There are three chat rooms the users can join in and change to. Users can post chat messages.
####03 - DataObjects
This examples shows how to mimic 'fake clients' using their DataObjects.
####04 - Game Logic 1
The server creates some 'things' which change their states periodically by updating and broadcasting the DataObject values.
####05 - Game Logic 2
The server creates some 'things' which change their states periodically by updating and broadcasting the DataObject values.
There are three different rooms the users can change to. Every rooms has its own things inside...
Users can click the things to remove them by sending a custom message.
####06 - Logic Modifiers
Using 'logic modifiers' the standard protocol flow, like user ``joins`` or ``change room requests`` can be influenced or even canceled.
####07 - Query Stats
This example shows how to get some infos about the current sessions, rooms and users.
####08 - Pathfinding
The server controls some bots moving on grid. An additional process is spawned to calculate paths from a start to an end point using an A* algorithm.


----------

###Usage
####Server
The according server examples can be found in the ``server`` folder.
To start the server change to the ``server`` folder and run node.
```sh
cd server
node app.js
```

####Client
The HTML5 version is located at ``client/js``.<br>
The Adobe Flash/Air version is located at ``client/as3``.
The AS3 version provides a FlashDevelop project.




  [1]: https://cloud.githubusercontent.com/assets/7307652/2774582/445a43cc-caba-11e3-92f2-a2bc7600b52b.png
  [2]: https://github.com/bma73/gordon-client
  [3]: https://github.com/bma73/gordon-server