this.gordonexample = this.gordonexample || {};

(function () {
    function Thing(dataObject, clickCallback) {
        this._clickCallback = clickCallback;
        this.dataObject = dataObject;
        this.markUp = $('#thing').clone().appendTo('body');
        this.markUp.show();

        this.markUp.click(this.onClick.bind(this));

        this.width = this.markUp.width();
        this.height = this.markUp.height();
        this.active = false;

        this.dataObject.on(gordon.DataObject.UPDATE, this.onUpdate.bind(this));
        this.dataObject.on(gordon.DataObject.DISPOSE, this.dispose.bind(this));

        var x = this.dataObject.getInt16(Thing.KEY_X_POS);
        var y = this.dataObject.getInt16(Thing.KEY_Y_POS);
        var color = this.dataObject.getInt32(Thing.KEY_COLOR);

        var that = this;
        setTimeout(function () {
            that.markUp.css('background-color', '#' + color.toString(16));
        }, 200);

        this.markUp.css('background-color', '#FFFF80');
        this.setPos(x, y);
        this.activate(Boolean(this.dataObject.getInt8(Thing.KEY_ACTIVE)));
    }

    var p = Thing.prototype;

    p.setPos = function (x, y) {
        this.markUp.css('left', x - this.width * 0.5);
        this.markUp.css('top', y - this.height * 0.5);
    };

    p.activate = function (value) {
        this.active = value;
        if (this.active) {
            this.markUp.removeClass('transparent');
        }
        else {
            this.markUp.addClass('transparent');
        }
    };

    p.dispose = function () {
        this.markUp.remove();
        this._main = null;
    };

    p.onUpdate = function (updatedKeys) {
        this.activate(Boolean(this.dataObject.getInt8(Thing.KEY_ACTIVE)));
    };

    p.onClick = function () {
        this._clickCallback(this);
    };

    Thing.KEY_TYPE = 0;
    Thing.KEY_ACTIVE = 1;
    Thing.KEY_X_POS = 2;
    Thing.KEY_Y_POS = 3;
    Thing.KEY_COLOR = 4;

    gordonexample.Thing = Thing;

}());
