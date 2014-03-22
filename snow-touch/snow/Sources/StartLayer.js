//
// CleanerScoreScene class
//
var StartLayer = function () {
    cc.log("StartLayer")
};

StartLayer.prototype.onDidLoadFromCCB = function () {
//    this.rootNode.onUpdate = function (dt)
//    {
//        this.controller.onUpdate();
//    };
//    this.rootNode.schedule(this.rootNode.onUpdate);

    if (sys.platform == 'browser') {
        this.onEnter();
    }
    else {
        this.rootNode.onEnter = function () {
            this.controller.onEnter();
        };
    }

    this.rootNode.onExit = function () {
        this.controller.onExit();
    };
};

StartLayer.prototype.onEnter = function () {
}

StartLayer.prototype.onUpdate = function () {

}

StartLayer.prototype.onPlayClicked = function () {
    cc.BuilderReader.runScene("", "MainLayer");
}

StartLayer.prototype.onExit = function () {

}
