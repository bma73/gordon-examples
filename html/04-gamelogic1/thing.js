this.gordonexample = this.gordonexample || {};

(function () {
    function Thing(dataObject) {
        this.dataObject = dataObject;
        this.markUp = $('#thing').clone().appendTo('body');
        this.markUp.show();

        this.width = this.markUp.width();
        this.height = this.markUp.height();
        this.active = false;

        this.dataObject.on(gordon.DataObject.UPDATE, this.onUpdate.bind(this));

        var x = this.dataObject.getInt16(Thing.KEY_X_POS);
        var y = this.dataObject.getInt16(Thing.KEY_Y_POS);
        this.setPos(x, y);
        this.activate(Boolean(this.dataObject.getInt8(Thing.KEY_ACTIVE)));

        console.log("new thing", x,y, this.markup);
    }

    var p = Thing.prototype;

    p.setPos = function (x, y) {
        this.markUp.css('left', x - this.width * 0.5);
        this.markUp.css('top', y - this.height * 0.5);
    };

    p.activate = function(value){
        this.active = value;
        if (this.active){
            this.markUp.removeClass('transparent');
        }
        else{
            this.markUp.addClass('transparent');
        }
    };

    p.dispose = function () {
        this.markUp.remove();
    };

    p.onUpdate = function (updatedKeys) {
        this.activate(Boolean(this.dataObject.getInt8(Thing.KEY_ACTIVE)));
    };

    Thing.KEY_TYPE = 0;
    Thing.KEY_ACTIVE = 1;
    Thing.KEY_X_POS = 2;
    Thing.KEY_Y_POS = 3;

    gordonexample.Thing = Thing;

}());
