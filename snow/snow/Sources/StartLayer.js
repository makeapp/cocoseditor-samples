var StartLayer = function () {
    cc.log("StartLayer");
    this.play = this.play || {};
};

StartLayer.prototype.onDidLoadFromCCB = function () {
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
    cc.log("onEnter");
}

StartLayer.prototype.onUpdate = function () {

}

StartLayer.prototype.onPlayClick = function () {
    cc.log("onExitClicked");
    this.play.runAction(cc.Sequence.create(cc.ScaleTo.create(0.5, 1.2), cc.ScaleTo.create(0.5, 1)));
    this.rootNode.scheduleOnce(1, function () {
        cc.BuilderReader.runScene("", "MainLayer");
    });

}


StartLayer.prototype.onExit = function () {
    cc.log("onExit");
}

