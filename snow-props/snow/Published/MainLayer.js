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

MainLayer.prototype.onEnter = function () {
    var flowerParticle = cc.ParticleSystem.create("res/particles/flower.plist");
    flowerParticle.setAnchorPoint(cc.p(0.5, 0.5));
    flowerParticle.setPosition(cc.p(60, 160));
    flowerParticle.setPositionType(1);
    this.monster.addChild(flowerParticle);

    cc.AudioEngine.getInstance().playMusic("res/sounds/bg_music.mp3", true);
}

MainLayer.prototype.monsterMove = function (x, y) {
    this.monster.stopAllActions();
    cc.AnimationCache.getInstance().addAnimations("res/snow_frame.plist");//添加帧动画文件
    var action0 = cc.Sequence.create(cc.MoveTo.create(5, cc.p(x, y)));  //向前移动
    var actionFrame = cc.Animate.create(cc.AnimationCache.getInstance().getAnimation("monster"));   //获取帧动画
    var action1 = cc.Repeat.create(actionFrame, 90000);
    var action2 = cc.Spawn.create(action0, action1); //同步动画
    this.monster.runAction(action2);
}

MainLayer.prototype.createParticle = function (name, x, y) {
    var particle = cc.ParticleSystem.create("res/particles/" + name + ".plist");
    particle.setAnchorPoint(cc.p(0.5, 0.5));
    particle.setPosition(cc.p(x, y));
    particle.setPositionType(1);
    particle.setDuration(3);
    this.rootNode.addChild(particle);
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

MainLayer.prototype.onRenewClicked = function () {  //返回到开始界面
    cc.Director.getInstance().resume();
    cc.log("onRenewClicked");
    cc.BuilderReader.runScene("", "StartLayer");
}

MainLayer.prototype.onSelectClicked = function () {  //选关
    cc.Director.getInstance().resume();
    cc.log("onListClicked");
    cc.BuilderReader.runScene("", "GameSelectLayer");
}

MainLayer.prototype.onReplayClicked = function () {  //新游戏
    cc.Director.getInstance().resume();
    cc.log("onReplayClicked");
    cc.BuilderReader.runScene("", "MainLayer");
}

/*MainLayer.prototype.onReturnClicked = function () {  //返回游戏
 cc.log("onReturnClicked");
 if (this.paused) {
 if (this.pausedLayer) {
 this.pausedLayer.removeFromParent();
 this.pausedLayer = null;
 }
 cc.Director.getInstance().resume();
 this.paused = false;
 }
 }*/

MainLayer.prototype.onPauseClicked = function () {   //点击暂停游戏
    this.pausedLayer = cc.BuilderReader.loadAsNodeFrom("", "PauseLayer", this);
    this.pausedLayer.setPosition(cc.p(0, 0));
    this.pausedLayer.setZOrder(200);
    this.rootNode.addChild(this.pausedLayer);
    this.paused = true;
    cc.AudioEngine.getInstance().stopMusic();
    cc.Director.getInstance().pause();
}

MainLayer.prototype.onTouchesBegan = function (touches, event) {
    var loc = touches[0].getLocation();
}

MainLayer.prototype.onTouchesMoved = function (touches, event) {
    cc.log("onTouchesMoved");
}

MainLayer.prototype.onTouchesEnded = function (touches, event) {
    cc.log("onTouchesEnded");
    var loc = touches[0].getLocation();
    cc.AudioEngine.getInstance().playEffect("res/sounds/bomb.mp3", false);
    this.monsterMove(loc.x, loc.y);
    this.createParticle("around", loc.x, loc.y);
}



