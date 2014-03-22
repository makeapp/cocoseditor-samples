//
// CleanerScoreScene class
//
var StartLayer = function () {
    cc.log("StartLayer")
    this.LoadingLayer = this.LoadingLayer || {};
    this.passTime = 0;
    this.goStart = false;
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

    this.rootNode.schedule(function (dt) {
        this.controller.onUpdate(dt);
    });
};

StartLayer.prototype.onEnter = function () {
    this.LoadingLayer = cc.BuilderReader.loadAsNodeFrom("", "LoadingLayer", this);
    this.LoadingLayer.setPosition(cc.p(0, 0));
    this.LoadingLayer.setZOrder(200);
    this.rootNode.addChild(this.LoadingLayer);
    //  cc.Director.getInstance().pause();
    /*this.LoadingLayer.scheduleOnce(this.removeLoading, 1);*/
    this.goStart = true;
    this.startTime = this.passTime;

}

StartLayer.prototype.removeLoading = function () {
    // if (this.LoadingLayer) {
    cc.log("removeLoading");
    // cc.Director.getInstance().resume();
    this.LoadingLayer.removeFromParent();
}

StartLayer.prototype.onUpdate = function (dt) {
    this.passTime += dt;
    if (this.passTime - this.startTime > 3 && this.goStart) {
        this.removeLoading();
        this.goStart = false;
    }
}

StartLayer.prototype.onPlayClicked = function () {
    cc.BuilderReader.runScene("", "GameSelectLayer");
}

StartLayer.prototype.onExit = function () {

}
