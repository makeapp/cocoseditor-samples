//
// CleanerScoreScene class
//
var MainLayer = function () {
    cc.log("MainLayer")
    this.scoreLabel = this.scoreLabel || {};
    this.score = 123;
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

    this.rootNode.schedule(function (dt) {
        this.controller.onUpdate(dt);
    });

    this.rootNode.onExit = function () {
        this.controller.onExit();
    };
};

MainLayer.prototype.onEnter = function () {
}

MainLayer.prototype.onUpdate = function (dt) {
    this.score += dt;
    this.scoreLabel.setString(Math.floor(this.score));
}

MainLayer.prototype.onExitClicked = function () {
    cc.log("onExitClicked");
}


MainLayer.prototype.onExit = function () {
    cc.log("onExit");
}

