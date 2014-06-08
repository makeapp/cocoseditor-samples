//
// CleanerScoreScene class
//

var MainLayer = function () {
    cc.log("MainLayer")
    this.scoreLabel = this.scoreLabel || {};
    this.monster = this.monster || {};
    this.score = 123;

    this.currentTime = 0;
    this.lastSnowBall = 0;
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
    this.newSnowBall();
}

MainLayer.prototype.monsterMove = function (x, y) {
    this.monster.stopAllActions();
    cc.AnimationCache.getInstance().addAnimations("res/snow_frame.plist");//添加帧动画文件
    var action0 = cc.Sequence.create(cc.MoveTo.create(2, cc.p(x, y)));  //向前移动
    var actionFrame = cc.Animate.create(cc.AnimationCache.getInstance().getAnimation("monster"));   //获取帧动画
    var action1 = cc.Repeat.create(actionFrame, 90000);
    var action2 = cc.Spawn.create(action0, action1); //同步动画
    this.monster.runAction(action2);
};

MainLayer.prototype.createParticle = function (name, x, y) {
    var particle = cc.ParticleSystem.create("res/particles/" + name + ".plist");
    particle.setAnchorPoint(cc.p(0.5, 0.5));
    particle.setPosition(cc.p(x, y));
    particle.setPositionType(1);
    particle.setDuration(0.2);
    this.rootNode.addChild(particle);
}

MainLayer.prototype.newSnowBall = function () {
    var snowBall = cc.Sprite.createWithSpriteFrameName("m_snowball_roll_2.png");
    snowBall.setPosition(cc.p(360, 200));
    snowBall.setZOrder(100);
    snowBall.setAnchorPoint(cc.p(0.5, 0.5));
    snowBall.setTag(-100);
    snowBall.newTime = this.currentTime;
    snowBall.speedX = (this.monster.getPosition().x - snowBall.getPosition().x) / 8;
    snowBall.speedY = (this.monster.getPosition().y - snowBall.getPosition().y) / 8;
    this.rootNode.addChild(snowBall);
}


MainLayer.prototype.onUpdate = function (dt) {
    this.currentTime += dt;
    this.score += dt;
    this.scoreLabel.setString(Math.floor(this.score));

    if (this.currentTime - this.lastSnowBall > 2) {
        this.newSnowBall();
        this.lastSnowBall = this.currentTime;
    }

    for (var i = 0; i < this.rootNode.getChildrenCount(); i++) {
        var child = this.rootNode.getChildren()[i];
        if (child.getTag() == -100) {
            //  cc.log("ball");
            var monsterX = this.monster.getPosition().x;
            var monsterY = this.monster.getPosition().y;
            var childX = child.getPositionX();
            var childY = child.getPositionY();

            /*var followX = childX + (this.currentTime - child.newTime) * (monsterX - childX) / 5;
             var followY = childY + (this.currentTime - child.newTime) * (monsterY - childY) / 5;*/

            var followX = childX + (this.currentTime - child.newTime) * child.speedX;
            var followY = childY + (this.currentTime - child.newTime) * child.speedY;

            child.setPosition(cc.p(followX, followY));
            if (child && child.getPositionY() > 1500) {
                child.removeFromParent(true);
                continue;
            }

            //碰撞一 普通
            /*if (cc.rectIntersectsRect(child.getBoundingBox(), this.monster.getBoundingBox())) {
             this.createParticle("around", monsterX, monsterY);
             cc.AudioEngine.getInstance().playEffect("res/sounds/bomb.mp3", false);
             child.removeFromParent(true);
             }*/

            //碰撞二 缩小矩形范围  更精准；
            /*if (cc.rectIntersectsRect(cc.rectCreate(child.getPosition(), [10, 10]), cc.rectCreate(this.monster.getPosition(), [20, 20]))) {
             this.createParticle("around", monsterX, monsterY);
             cc.AudioEngine.getInstance().playEffect("res/sounds/bomb.mp3", false);
             child.removeFromParent(true);
             }*/

            //碰撞三 扩大碰撞区域 200dp就发生了碰撞
            /*if (cc.rectIntersectsRect(cc.rectCreate(child.getPosition(), [10, 10]), cc.rectCreate(this.monster.getPosition(), [200, 200]))) {
                this.createParticle("around", monsterX, monsterY);
                cc.AudioEngine.getInstance().playEffect("res/sounds/bomb.mp3", false);
                child.removeFromParent(true);
            }*/

            //碰撞四 两个精灵中心距离小于40时
            var distance = cc.pDistance(child.getPosition(), this.monster.getPosition());
            if (distance < 40) {
                this.createParticle("around", monsterX, monsterY);
                cc.AudioEngine.getInstance().playEffect("res/sounds/bomb.mp3", false);
                child.removeFromParent(true);
            }

        }
    }
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
    // cc.log("onTouchesMoved");
}

MainLayer.prototype.onTouchesEnded = function (touches, event) {
    //  cc.log("onTouchesEnded");
    var loc = touches[0].getLocation();
    // cc.AudioEngine.getInstance().playEffect("res/sounds/bomb.mp3", false);
    this.monsterMove(loc.x, loc.y);
    // this.createParticle("around", loc.x, loc.y);
}



