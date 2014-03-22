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

cc.BuilderReader.replaceScene = function (path, ccbName) {   //场景替换
    var scene = cc.BuilderReader.loadAsSceneFrom(path, ccbName);
    cc.Director.getInstance().replaceScene(scene);
    return scene;
}

cc.BuilderReader.loadAsScene = function (file, owner, parentSize) {  //从owner获取场景
    var node = cc.BuilderReader.load(file, owner, parentSize);
    var scene = cc.Scene.create();
    scene.addChild(node);
    return scene;
};

cc.BuilderReader.loadAsSceneFrom = function (path, ccbName) {  //从ccb获取场景
    cc.BuilderReader.setResourcePath(path + "/");
    return cc.BuilderReader.loadAsScene(path + "/" + ccbName);
}

cc.BuilderReader.loadAsNodeFrom = function (path, ccbName, owner) {
    cc.BuilderReader.setResourcePath(path + "/");
    return cc.BuilderReader.load(path + "/" + ccbName, owner);
}

cc.BuilderReader.runScene = function (module, name) {       //运行场景
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

var ccb_resources = [
    {type: 'image', src: "Resources/HelloWorld.png"},
    {type: 'image', src: "Resources/CloseNormal.png"},
    {type: 'image', src: "Resources/CloseSelected.png"}
];

require("MainLayer.js");   //包括哪些场景都需要require

if (sys.platform == 'browser') {   //如果平台是浏览器

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
            var glView= director.getOpenGLView();
            glView.setDesignResolutionSize(1280,720,cc.RESOLUTION_POLICY.SHOW_ALL);
            cc.Loader.preload(ccb_resources, function () {
                cc.BuilderReader.runScene("", "MainLayer");
            }, this);
            return true;
        }
    });
    var myApp = new Cocos2dXApplication();
} else {       //如果是android ios window32等
    cc.BuilderReader.runScene("", "MainLayer");   //直接进入主场景
}