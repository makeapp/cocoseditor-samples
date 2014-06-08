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

    /* this.rootNode.schedule(function (dt) {
     this.controller.onUpdate(dt);
     }, 5);*/

    this.rootNode.onTouchesBegan = function (touches, event) {
        this.controller.onTouchesBegan(touches, event);
        return true;
    };

    this.rootNode.onTouchesMoved = function (touches, event) {
        this.controller.onTouchesMoved(touches, event);
        return true;
    };
    this.rootNode.onTouchesEnded = function (touches, event) {
        this.controller.onTouchesEnded(touches, event);
        return true;
    };
    this.rootNode.setTouchEnabled(true);

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

    this.playSprite = this.playSprite || {};
    this.playLabel = this.playLabel || {};

};

StartLayer.prototype.removeLoading = function () {
    // if (this.LoadingLayer) {
    cc.log("removeLoading");
    // cc.Director.getInstance().resume();
    this.LoadingLayer.removeFromParent();
}

StartLayer.prototype.onUpdate = function (dt) {
    this.passTime += dt;
    if (this.passTime - this.startTime > 1 && this.goStart) {
        this.removeLoading();
        this.goStart = false;
    }
    // cc.log("onUpdate");
}

StartLayer.prototype.onPlayClicked = function () {
    // cc.BuilderReader.runScene("", "GameSelectLayer");
    cc.Toast.create(this.rootNode, "我是MenuItem", 1);
}

StartLayer.prototype.onButtonPlayClicked = function () {
    // cc.BuilderReader.runScene("", "GameSelectLayer");
    cc.Toast.create(this.rootNode, "我是Button", 1);


}

/*StartLayer.prototype.onClose = function () {
 cc.BuilderReader.runScene("", "GameSelectLayer");
 }*/

StartLayer.prototype.onExit = function () {

};

StartLayer.prototype.onTouchesBegan = function (touches, event) {
    this.pBegan = touches[0].getLocation();
    //sprite button
    var that = this;
    if (cc.rectContainsPoint(this.playSprite.getBoundingBox(), this.pBegan)) {
        this.playSprite.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 1.1),
            cc.CallFunc.create(function () {
                cc.Toast.create(that.rootNode, "我是sprite button", 1);
            })
        ));
    }

    //label button
    var playLabelRect = cc.rect(this.playLabel.getPosition().x - 50, this.playLabel.getPosition().y - 50, 50 * 2, 50 * 2);
    if (cc.rectContainsPoint(playLabelRect, this.pBegan)) {
        this.playLabel.runAction(cc.Sequence.create(cc.ScaleTo.create(0.1, 1.1),
            cc.CallFunc.create(function () {
                cc.Toast.create(that.rootNode, "我是label button", 1);
            })
        ));
    }

}

StartLayer.prototype.onTouchesMoved = function (touches, event) {
    cc.log("onTouchesMoved");
}

StartLayer.prototype.onTouchesEnded = function (touches, event) {
    cc.log("onTouchesEnded");
}
