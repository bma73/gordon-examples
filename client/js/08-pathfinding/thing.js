this.gordonexample = this.gordonexample || {};

(function () {
    function Thing(gordonClient, dataObject, stage) {
        this.gordonClient = gordonClient;
        this.dataObject = dataObject;
        this.component = new createjs.Bitmap(gordonexample.images.thing);
        this.tileSize = gordonexample.tileSize;
        this.waypoints = [];
        this.stage = stage;

        this.dataObject.on(gordon.DataObject.UPDATE, this.onUpdate.bind(this));
        this.dataObject.on(gordon.DataObject.DISPOSE, this.dispose.bind(this));

        var x = this.dataObject.getInt8(Thing.KEY_X_POS);
        var y = this.dataObject.getInt8(Thing.KEY_Y_POS);
        this.moveDuration = this.dataObject.getUint16(Thing.KEY_MOVE_DURATION) * 0.001;

        this.component.x = x * this.tileSize;
        this.component.y = y * this.tileSize;
        this.stage.addChild(this.component);
    }

    var p = Thing.prototype;


    p.moveToNextWaypoint = function() {
        if (this.waypoints.length == 0) return;
        if (TweenMax.isTweening(this.component)) return;
        var waypoint = this.waypoints.shift();
        TweenMax.to(this.component, this.moveDuration - this.gordonClient.getCurrentPing() * 0.001,
                    {x: waypoint[0], y: waypoint[1], ease: Linear.easeNone, onComplete:this.moveToNextWaypoint.bind(this)});
    };

    p.onUpdate = function (updatedKeys) {
        //new waypoint from the server
        var x = this.dataObject.getInt8(Thing.KEY_X_POS) * this.tileSize;
        var y = this.dataObject.getInt8(Thing.KEY_Y_POS) * this.tileSize;
        this.waypoints.push([x, y]);
        this.moveToNextWaypoint();
    };

    p.dispose = function () {
        this.stage.removeChild(this.component);
        TweenMax.killTweensOf(this.component);
    };


    Thing.KEY_TYPE = 0;
    Thing.KEY_X_POS = 1;
    Thing.KEY_Y_POS = 2;
    Thing.KEY_MOVE_DURATION = 3;

    gordonexample.Thing = Thing;

}());
