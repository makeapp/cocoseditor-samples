//
// CleanerScoreScene class
//

var MainLayer = function () {
    cc.log("MainLayer")
    this.scoreLabel = this.scoreLabel || {};
    this.monster = this.monster || {};
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
    cc.AnimationCache.getInstance().addAnimations("Resources/snow_frame.plist");//添加帧动画文件
    var action0 = cc.Sequence.create(cc.MoveTo.create(30, cc.p(360, 200)));  //向前移动
    var actionFrame = cc.Animate.create(cc.AnimationCache.getInstance().getAnimation("monster"));   //获取帧动画
    var action1 = cc.Repeat.create(actionFrame, 90000);
    var action2 = cc.Spawn.create(action0, action1); //同步动画
    this.monster.runAction(action2);

    var flowerParticle = cc.ParticleSystem.create("Resources/particles/flower.plist");
    flowerParticle.setAnchorPoint(cc.p(0.5, 0.5));
    flowerParticle.setPosition(cc.p(60, 160));
    flowerParticle.setPositionType(1);
    this.monster.addChild(flowerParticle);

    var piperParticle = cc.ParticleSystem.create("Resources/particles/pipe.plist");
    piperParticle.setAnchorPoint(cc.p(0.5, 0.5));
    piperParticle.setPosition(cc.p(10, 800));
    piperParticle.setPositionType(1);
    this.rootNode.addChild(piperParticle);
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

cc.Animate.createWithName = function (name) {
    return cc.Animate.create(cc.AnimationCache.getInstance().getAnimation(name));
}

