this.gordonexample = this.gordonexample || {};

(function () {
    function Player(user, isRemotePlayer) {
        this.user = user;
        this.dataObject = user.dataObject;

        this._nextUpdateTime = 0;

        this.isRemotePlayer = isRemotePlayer;

        this._mouseX = 0;
        this._mouseY = 0;
        var that = this;
        if (!isRemotePlayer) {
            $(window).mousemove(function (event) {
                that._mouseX = event.pageX;
                that._mouseY = event.pageY;
            });
        }
        else {
            this.markUp = $('#player').clone().appendTo('body');
            this.markUp.show();
            $('span', this.markUp).text(user.name);

            var x = this.dataObject.getInt16(Player.KEY_X_POS);
            var y = this.dataObject.getInt16(Player.KEY_Y_POS);
            this.setPos(x, y);

            this.dataObject.on(gordon.DataObject.UPDATE, this.onUpdate.bind(this));
        }
    }

    var p = Player.prototype;
    p.setPos = function (x, y) {
        this.markUp.css('left', x);
        this.markUp.css('top', y);
    };

    p.loop = function (time) {
        var t = Date.now();
        if (t > this._nextUpdateTime) {

            var dataX = this.dataObject.getInt16(Player.KEY_X_POS);
            var dataY = this.dataObject.getInt16(Player.KEY_Y_POS);

            if (dataX != this._mouseX) {
                this.dataObject.setInt16(Player.KEY_X_POS, this._mouseX);
            }
            if (dataY != this._mouseY) {
                this.dataObject.setInt16(Player.KEY_Y_POS, this._mouseY);
            }
            this.dataObject.sendUpdates();
//
            this._nextUpdateTime = t + 150;
        }

    };

    p.dispose = function () {
        this.markUp.remove();
    };

    p.onUpdate = function (updatedKeys) {
        var x = this.dataObject.getInt16(Player.KEY_X_POS);
        var y = this.dataObject.getInt16(Player.KEY_Y_POS);
        TweenMax.to(this.markUp, 0.2, {top: y, left: x, ease: Linear.easeNone});
    };

    Player.KEY_X_POS = 0;
    Player.KEY_Y_POS = 1;

    gordonexample.Player = Player;

}());
