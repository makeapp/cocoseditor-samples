GAME_LEVEL = 0;
var GameSelectLayer = function () {
    cc.log("GameSelectLayer");
    this.levelScrollPanel = this.levelScrollPanel || {};
    this.pageIndex = 0;
    this.pageMax = 4;
    this.dotNode = this.dotNode || {};
    this.start = false;

};

GameSelectLayer.prototype.onDidLoadFromCCB = function () {
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

GameSelectLayer.prototype.onEnter = function () {
    this.maxColumns = 3;
    this.columnSize = 177;
    this.maxRows = 5;
    this.rowSize = 104;
    cc.log("GameSelectLayer");

    this.itemDatas = [];
    var itemName = "";
    var levelPan = cc.Layer.create();
    var currentLevel = sys.localStorage.getItem("pb_level");
    if (currentLevel == null) {
        currentLevel = 0;
    }

    sys.localStorage.setItem("pb_level_score_1", "S");
    currentLevel = 3;

    for (var i = 0; i < 50; i++) {
        var xIndex = Math.floor(i % 3) + Math.floor(i / 15) * 3;
        var yIndex = Math.floor(i / 3 % 5);
        var levelScore = "A"
        if (i < currentLevel) {
            levelScore = sys.localStorage.getItem("pb_level_score_" + i);
            if (levelScore == null || levelScore == '') {
                levelScore = "A";
            }
            if ("S" == levelScore) {
                itemName = "GameSelectItemScoreS";
            }
            else {
                itemName = "GameSelectItemScore";
            }
        }
        else if (i == currentLevel) {
            itemName = "GameSelectItemLevel";
        }
        else {
            itemName = "GameSelectItemLocked";
        }
        var itemData = {
            xIndex: xIndex,
            yIndex: yIndex,
            index: i,
            type: itemName,
            onItemAction: function () {
                cc.log("onItemAction");
                var action = cc.ScaleBy.create(0.5, 0.8);
                this.rootNode.runAction(cc.Sequence.create(
                    action, action.reverse(), cc.DelayTime.create(2)
                    //  cc.CallFunc.create(this.onItemClicked())
                ));
            },
            onItemClicked: function () {
                cc.log("onItemClicked");
                GAME_LEVEL = (this.index + 1);
                cc.log("index==" + GAME_LEVEL);
                // require("MainLayer.js");
                //cc.BuilderReader.runScene("", "MainLayer");
                cc.BuilderReader.runScene("", "GamePropsLayer");
            },
            onLockOpened: function () {
            }
        };
        var item = cc.BuilderReader.loadAsNodeFrom("", "GameSelectItemSprite", itemData);
        if (item == null) {
            continue;
        }
        item.setPosition(cc.p(this.columnSize * xIndex, this.rowSize * (4 - yIndex)));
        item.setZOrder(11);
        itemData.rootNode = item;
        itemData.controller = this;
        this.itemDatas.push(itemData);
        itemData.levelNum.setString("" + (i + 1));
        levelPan.addChild(item);
    }
    levelPan.setContentSize(cc.size(this.columnSize * 12, this.rowSize * 5));
    this.levelScrollPanel.setTouchEnabled(false);
    this.levelScrollPanel.setBounceable(true);
    this.levelScrollPanel.setContainer(levelPan);
    this.levelScrollPanel.setTouchPriority(-99999);

    this.pageDots(0);
}

GameSelectLayer.prototype.onUpdate = function () {

}

GameSelectLayer.prototype.onExit = function () {

}

GameSelectLayer.prototype.onTouchesBegan = function (touches, event) {
    cc.log("onTouchesBegan");
    this.beganPosition = touches[0].getLocation();
}

GameSelectLayer.prototype.onTouchesMoved = function (touches, event) {
    this.movePosition = touches[0].getLocation();
}

GameSelectLayer.prototype.onTouchesEnded = function (touches, event) {
    cc.log("onTouchesEnded");
    var loc = touches[0].getLocation();
    var distanceX = this.beganPosition.x - loc.x;

    var x = this.levelScrollPanel.getContentOffset().x;
    var y = this.levelScrollPanel.getContentOffset().y;
    this.levelScrollPanel.unscheduleAllCallbacks();

    if (distanceX > 50) {
        if (this.pageIndex < 4) {
            this.pageIndex += 1;
        }
        this.pageDots(this.pageIndex);
    }
    else if (distanceX < -50) {
        if (this.pageIndex > 0) {
            this.pageIndex -= 1;
        }
        this.pageDots(this.pageIndex);
    }
    else {
        this.onItemClicked(loc);
    }
    this.levelScrollPanel.setContentOffsetInDuration(cc.p(-this.columnSize * 3 * this.pageIndex, y), 0.5);
}

GameSelectLayer.prototype.onItemClicked = function (location) {
    var x = location.x;
    var y = location.y;

    if (!isInScroll(location)) {
        cc.log("out");
        return;
    }

    var scrollPanelRect = this.levelScrollPanel.getBoundingBox();
    var xIndex = Math.floor((x - 110) / this.columnSize) + this.pageIndex * 3;
    var yIndex = 4 - Math.floor((y - 385) / this.rowSize);
    cc.log("scrollX==" + scrollPanelRect.x + ",scrollY==" + scrollPanelRect.y);
    cc.log("xIndex==" + xIndex + ",yIndex==" + yIndex);

    for (var i = 0; i < this.itemDatas.length; i++) {
        if (this.itemDatas[i].xIndex == xIndex && this.itemDatas[i].yIndex == yIndex) {
            cc.log("click i=" + i);
            this.itemDatas[i].onItemClicked();
            break;
        }
    }
}

GameSelectLayer.prototype.pageDots = function (position) {
    this.dotNode.removeAllChildren();
    for (var i = 0; i < 4; i++) {
        var dots = ["s_point.png", "s_point_s.png"];
        var type = 0;
        if (position == i) {
            type = 1;
        }
        var dotSprite = cc.Sprite.createWithSpriteFrameName(dots[type]);
        dotSprite.setAnchorPoint(cc.p(0, 1));
        dotSprite.setPosition(cc.p(30 * i, 60));
        dotSprite.setZOrder(100);
        this.dotNode.addChild(dotSprite);
    }
}

function isInScroll(location) {
    var x = location.x;
    var y = location.y;
    if (x > 110 && x < (110 + 510) && y > 385 && y < (385 + 500)) {
        return true;
    }
    return false
}

