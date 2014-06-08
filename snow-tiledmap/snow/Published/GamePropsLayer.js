//
// CleanerScoreScene class
//
PROPS_LIST = [
    {name: "props1", fee: 0.9, desc: "道具1", image: "m_skill1.png"},
    {name: "props2", fee: 1.9, desc: "道具2", image: "m_skill2.png"},
    {name: "props3", fee: 2.9, desc: "道具3", image: "m_skill3.png"},
    {name: "props4", fee: 3.9, desc: "道具4", image: "m_skill1.png"},
    {name: "props5", fee: 4.9, desc: "道具5", image: "m_skill2.png"},
    {name: "props6", fee: 5.9, desc: "道具6", image: "m_skill3.png"}
];

PROPS_SELECT = [];


cc.SpriteFrameCache.getInstance().addSpriteFrames("res/snow_packer.plist");
cc.SpriteFrameCache.getInstance().addSpriteFrames("res/snow_packer_new.plist");

var GamePropsLayer = function () {
    cc.log("GamePropsLayer");


    PROPS_SELECT = [];
    this.listTop = this.listTop || {};
};

GamePropsLayer.prototype.onDidLoadFromCCB = function () {
    if (sys.platform == 'browser') {
        this.onEnter();
    }
    else {
        this.rootNode.onEnter = function () {
            this.controller.onEnter();
        };
    }

    this.rootNode.onExit = function () {
        // this.controller.onExit();
    };
};

GamePropsLayer.prototype.onEnter = function () {
    var layer = GamePropsLayerTableLayer.create(PROPS_LIST);
    layer.setAnchorPoint(cc.p(0, 0));
    layer.setRootNode(this.rootNode);
    this.listTop.addChild(layer);
};


GamePropsLayer.prototype.onStartClicked = function () {
    cc.log("onStartClicked");
    cc.BuilderReader.runScene("", "MainLayer");
};


var GamePropsLayerTableLayer = cc.Layer.extend({

    init: function () {
        if (!this._super()) {
            return false;
        }
        var winSize = cc.Director.getInstance().getWinSize();

        this.tableView = cc.TableView.create(this, cc.size(620, 550));
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.tableView.setPosition(cc.p(20, 20));
        this.tableView.setDelegate(this);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(this.tableView);
        this.tableView.reloadData();
        return true;
    },

    setPropList: function (propsList) {
        this.propsList = propsList;
        cc.log("this.propList=" + this.propsList);
    },

    setRootNode: function (node) {
        this.tableView.rootNode = node;
    },

    scrollViewDidScroll: function (view) {
    },
    scrollViewDidZoom: function (view) {
    },

    tableCellTouched: function (table, cell) {

        if (!cell.bgSprite.selected) {
            if (PROPS_SELECT.length < 3) {
                cell.bgSprite.initWithSpriteFrameName("s_bg_prop_select.png");
                cell.bgSprite.selected = true;
                PROPS_SELECT.push(cell.props.name);
            }
            else {
                cc.log("can over 3");
                var label = cc.LabelTTF.create("选择道具不能超过3个", "Arial", 35);
                label.setPosition(280, 280);
                label.setColor(cc.c3b(0, 0, 0));
                label.setZOrder(10000);
                this.addChild(label);
                label.runAction(cc.Sequence.create(cc.DelayTime.create(2), cc.CleanUp.create(label)));
            }
        }
        else {
            cell.bgSprite.initWithSpriteFrameName("s_bg_prop_normal.png");
            cell.bgSprite.selected = false;
            for (var i = 0; i < PROPS_SELECT.length; i++) {
                if (PROPS_SELECT[i] == cell.props.name) {
                    PROPS_SELECT.splice(i, 1);
                    break;
                }
            }
        }
    },

    cellSizeForTable: function (table) {
        return cc.size(481, 125);
    },

    tableCellAtIndex: function (table, idx) {
        cc.log("tableCellAtIndex");
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new cc.TableViewCell();
            var node = cc.BuilderReader.loadAsNodeFrom("", "GamePropsItemSprite", cell);
            node.setAnchorPoint(cc.p(0, 0));
            node.setPosition(cc.p(0, 0));
            cell.addChild(node);
            cc.log("cell add node");
        }
        cell.bgSprite.selected = false;
        cell.bgSprite.initWithSpriteFrameName("s_bg_prop_normal.png");
        cc.log("idx==" + idx)
        var props = this.propsList[idx];
        cc.log("props==" + props.name);
        if (PROPS_SELECT.contains(props.name)) {
            cell.bgSprite.selected = true;
            cell.bgSprite.initWithSpriteFrameName("s_bg_prop_select.png");
        }
        cell.cellName.setString(props.desc);
        cell.cellGold.setString(props.fee + "￥");
        cell.cellIcon.initWithSpriteFrameName(props.image);
        cell.props = props;
        return cell;
    },

    numberOfCellsInTableView: function (table) {
        if (this.propsList) {
            return this.propsList.length;
        }
        return 0;
    }
});

GamePropsLayerTableLayer.create = function (propsList) {
    var retObj = new GamePropsLayerTableLayer();
    retObj.setPropList(propsList);
    if (retObj && retObj.init()) {
        return retObj;
    }
    return null;
};

