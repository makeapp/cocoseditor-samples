//
// CleanerScoreScene class
//
var MainLayer = function () {
    cc.log("MainLayer")
    this.cocos2d = this.cocos2d || {};
};

MainLayer.prototype.onDidLoadFromCCB = function () {
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

MainLayer.prototype.onEnter = function () {
    var action = cc.Sequence.create(cc.ScaleTo.create(1, 0.6), cc.ScaleTo.create(1, 1));
    this.cocos2d.runAction(cc.RepeatForever.create(action));
}

MainLayer.prototype.onUpdate = function () {

}

MainLayer.prototype.onExitClicked = function () {
    cc.log("onExitClicked");
    this.cocos2d.stopAllActions();
}


MainLayer.prototype.onExit = function () {
    cc.log("onExit");
}

