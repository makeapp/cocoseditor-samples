if (sys.platform == 'browser') {
    var require = function (file) {
        var d = document;
        var s = d.createElement('script');
        s.src = file;
        d.body.appendChild(s);
    }
} else {
    require("jsb.js");
}

cc.debug = function (msg) {
    cc.log(msg);
}

cc.BuilderReader.replaceScene = function (path, ccbName) {
    var scene = cc.BuilderReader.loadAsSceneFrom(path, ccbName);
    cc.Director.getInstance().replaceScene(scene);
    return scene;
}

cc.BuilderReader.loadAsScene = function (file, owner, parentSize) {
    var node = cc.BuilderReader.load(file, owner, parentSize);
    var scene = cc.Scene.create();
    scene.addChild(node);
    return scene;
};

cc.BuilderReader.loadAsSceneFrom = function (path, ccbName) {
    cc.BuilderReader.setResourcePath(path + "/");
    return cc.BuilderReader.loadAsScene(path + "/" + ccbName);
}

cc.BuilderReader.loadAsNodeFrom = function (path, ccbName, owner) {
    cc.BuilderReader.setResourcePath(path + "/");
    return cc.BuilderReader.load(path + "/" + ccbName, owner);
}

cc.BuilderReader.runScene = function (module, name) {
    var director = cc.Director.getInstance();
    var scene = cc.BuilderReader.loadAsSceneFrom(module, name);
    var runningScene = director.getRunningScene();
    if (runningScene === null) {
        cc.log("runWithScene");
        director.runWithScene(scene);
    }
    else {
        cc.log("replaceScene");
        director.replaceScene(scene);
    }
}

Array.prototype.contains = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            return true;
        }
    }
    return false;
}

var ccb_resources = [
    {type: 'image', src: "res/HelloWorld.png"},
    {type: 'image', src: "res/CloseNormal.png"},
    {type: 'image', src: "res/CloseSelected.png"}
];

/*var score = sys.localStorage.getItem("snow_money");
if (score < 0) {
    sys.localStorage.setItem("snow_money", 1000);
}*/

sys.localStorage.setItem("snow_money_num", 1000);

require("CocosEditor.js");
require("MainLayer.js");
require("StartLayer.js");
require("GameSelectLayer.js");
require("GamePropsLayer.js");

if (sys.platform == 'browser') {

    var Cocos2dXApplication = cc.Application.extend({
        config: document['ccConfig'],
        ctor: function () {
            this._super();
            cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
            cc.initDebugSetting();
            cc.setup(this.config['tag']);
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        },
        applicationDidFinishLaunching: function () {
            var director = cc.Director.getInstance();
            // director->enableRetinaDisplay(true);
            // director.setDisplayStats(this.config['showFPS']);
            // set FPS. the default value is 1.0/60 if you don't call this
            director.setAnimationInterval(1.0 / this.config['frameRate']);
            var glView = director.getOpenGLView();
            glView.setDesignResolutionSize(1280, 720, cc.RESOLUTION_POLICY.SHOW_ALL);
            cc.Loader.preload(ccb_resources, function () {
                cc.BuilderReader.runScene("", "StartLayer");
            }, this);
            return true;
        }
    });
    var myApp = new Cocos2dXApplication();
} else {
    cc.BuilderReader.runScene("", "StartLayer");
}