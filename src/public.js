cc.MenuBtn = cc.MenuItem.extend({
    _bg: null,
    _text: null,
    ctor: function(text,bg,callback,target){
        cc.MenuItem.prototype.ctor.call(this);
        this.initWithCallback(callback, target);

        this._bg = new cc.Sprite(bg);
        this.addChild(this._bg);

        this._text = new cc.LabelBMFont(text,res.font);
        this.addChild(this._text);

        this.width = this._bg.width;
        this.height = this._bg.height;
        this._bg.x = this.width/2;
        this._bg.y = this.height/2;
        this._text.x = this.width/2;
        this._text.y = this.height/2;
    },
    _changeText: function(text){
        this._text.setString(text);
    }
});


cc.MenuBtnLabel = cc.MenuItemSprite.extend({
    _text:null,
    ctor: function (normalImage, selectedImage, three, four, five, six, seven, eight) {
        var normalSprite = null,
            selectedSprite = null,
            disabledSprite = null,
            callback = null,
            text = null,
            font = null,
            offset = null,
            target = null;
        if (normalImage === undefined || normalImage === null) {
            cc.MenuItemSprite.prototype.ctor.call(this);
        }
        else {
            normalSprite = new cc.Sprite(normalImage);
            selectedImage &&
            (selectedSprite = new cc.Sprite(selectedImage));
            if (seven === undefined) {
                callback = six;
                text = three;
                font = four;
                offset = five;
            }
            else if (eight === undefined) {
                callback = six;
                target = seven;
                text = three;
                font = four;
                offset = five;
            }
            else if (five) {
                disabledSprite = new cc.Sprite(three);
                callback = seven;
                target = eight;
                text = four;
                font = five;
                offset = six;
            }
            cc.MenuItemSprite.prototype.ctor.call(this, normalSprite, selectedSprite, disabledSprite, callback, target);
            this._addText(text,font,offset);
        }
    },
    _addText: function(text, font, offset){
        this._text = new cc.LabelBMFont(text,font);
        this._text.scale = offset.scale || 1;
        this._text.x = this._getWidth()/2 + (offset.x || 0);
        this._text.y = this._getHeight()/2 + (offset.y || 0);
        this.addChild(this._text);
    },
    _changeText: function(text){
        this._text.setString(text);
    },
    setNormalSpriteFrame: function (frame) {
        this.setNormalImage(new cc.Sprite(frame));
    },
    setSelectedSpriteFrame: function (frame) {
        this.setSelectedImage(new cc.Sprite(frame));
    },
    setDisabledSpriteFrame: function (frame) {
        this.setDisabledImage(new cc.Sprite(frame));
    }
});

var LoaderScene = cc.Scene.extend({
    _isInit: false,
    _interval : null,
    _label : null,
    _loadLabel:null,
    _screenLayer:null,
    _className:"LoaderScene",
    numberSprites: [],

    init : function(){
        var self = this;

        // bg
        this._screenLayer = new cc.Layer();
        self.addChild(this._screenLayer, 0);

        var bg = new cc.Sprite('res/bg.jpg');
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this._screenLayer.addChild(bg);

        this._loadLabel = new cc.LabelTTF('0%','arial',40);
        this._loadLabel.setFontFillColor(cc.color.BLACK);
        this._loadLabel.x = cc.winSize.width/2;
        this._loadLabel.y = cc.winSize.height/2 - 200;
        this._screenLayer.addChild(this._loadLabel);

        this._isInit = true;


        //you codes

        return true;
    },
    _resize: function(deg,rate,size){
        if(!this._isInit) return;
        this._screenLayer.rotation = deg;
        this._screenLayer.scale = rate;
    },
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);

        if(typeof rotateHandler === 'function') {
            rotateHandler();
        }
        var loader = (this.loadType == 'resource') ? this._startLoading : this._startAjax;
        this.schedule(loader, 0.3);
    },
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        //you codes
    },

    initWithResources: function (resources, cb) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.loadType = 'resource';
    },
    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res, self._loadProgress.bind(self), function () {
            if (self.cb) self.cb();
        });
    },
    initAjax: function(ajaxSetting){
        this.ajaxSetting = ajaxSetting;
        this.loadType = 'ajax';
    },
    _startAjax: function(){
        var self = this,
            preNum = 0;
        self.unschedule(self._startAjax);
        if(!this.ajaxSetting.progress){
            this.ajaxSetting.progress = function(n){
                n = n.toFixed(2);
                if(preNum === n) return;
                preNum = n;
                self._loadProgress(null, 1, n);
            };
        }
        Utils.ajax(this.ajaxSetting);
    },
    _loadProgress: function(result, count, loadedCount){
        var percent = (loadedCount / count * 100) | 0;
        percent = Math.min(percent, 100);
        this._loadLabel.setString(percent+'%');
    }
});

LoaderScene.preload = function(resources, cb){
    var _cc = cc;
    if(!_cc.loaderScene) {
        _cc.loaderScene = new LoaderScene();
        _cc.loaderScene.init();
    }
    _cc.loaderScene.initWithResources(resources, cb);
    cc.director.runScene(_cc.loaderScene);
    return _cc.loaderScene;
};

LoaderScene.ajaxLoad = function(ajaxSetting){
    var _cc = cc;
    if(!_cc.loaderScene) {
        _cc.loaderScene = new LoaderScene();
        _cc.loaderScene.init();
    }
    _cc.loaderScene.initAjax(ajaxSetting);
    cc.director.runScene(_cc.loaderScene);
    return _cc.loaderScene;
};

cc.GameLayer = cc.Layer.extend({
    root: null,
    init: function(root){
        this._super();
        this.root = root;
    },
    _restart: function(){},
    _pause: function(){
        this.pause();
    },
    _resume: function(){
        this.resume();
    },
    _gameOver: function(){},
    _resize: function(){}

});

ccui.TurnedPageView = ccui.PageView.extend({
    interceptTouchEvent: function (eventType, sender, touch) {
        if(!this._touchEnabled){
            ccui.Layout.prototype.interceptTouchEvent.call(this, eventType, sender, touch);
            return;
        }
        var touchPoint = touch.getLocation(),
            x = pageIsturned?-touchPoint.y:touchPoint.x,
            y = pageIsturned?-touchPoint.x:touchPoint.y;

        switch (eventType) {
            case ccui.Widget.TOUCH_BEGAN:
                this._touchBeganPosition.x = x;
                this._touchBeganPosition.y = y;
                this._isInterceptTouch = true;
                break;
            case ccui.Widget.TOUCH_MOVED:
                this._touchMovePosition.x = x;
                this._touchMovePosition.y = y;
                var offset = 0;
                offset = Math.abs(sender.getTouchBeganPosition().x - x);
                if (offset > this._childFocusCancelOffset) {
                    sender.setHighlighted(false);
                    this._handleMoveLogic(touch);
                }
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                this._touchEndPosition.x = x;
                this._touchEndPosition.y = y;
                this._handleReleaseLogic(touch);
                if (sender.isSwallowTouches())
                    this._isInterceptTouch = false;
                break;
        }
    },onTouchBegan: function (touch, event) {
        this._hit = false;
        if (this.isVisible() && this.isEnabled() && this._isAncestorsEnabled() && this._isAncestorsVisible(this) ){
            var touchPoint = touch.getLocation();
            var x = pageIsturned?-touchPoint.y:touchPoint.x,
                y = pageIsturned?-touchPoint.x:touchPoint.y;
            this._touchBeganPosition.x = x;
            this._touchBeganPosition.y = y;
            if(this.isClippingParentContainsPoint(this._touchBeganPosition))
                this._hit = true;
        }
        if (!this._hit) {
            return false;
        }
        this.setHighlighted(true);

        if (this._propagateTouchEvents) {
            this.propagateTouchEvent(ccui.Widget.TOUCH_BEGAN, this, touch);
        }
        this._pushDownEvent();
        return true;
    },_handleMoveLogic: function(touch){
        var x = pageIsturned?-touch.getLocation().y:touch.getLocation().x,
            px = pageIsturned?-touch.getPreviousLocation().y:touch.getPreviousLocation().x;
        var offset = x - px;
        if (offset < 0)
            this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT;
        else if (offset > 0)
            this._touchMoveDirection = ccui.PageView.TOUCH_DIR_RIGHT;
        this._scrollPages(offset);
    }
});
/*
(function(window){
    var document = window.document,
        body = document.body;
    var AP = {
        _audioURL:'',
        _audioPlayer:null,
        _isLoaded: false,
        _playCallback: null,

        _callback: null,
        _target: null,
        _sound: null,
        _loop:0,
        ctor:function(){
            this._audioPlayer = document.createElement('audio');
            this._playCallback = this.playHandler.bind(this);
            body.appendChild(this._audioPlayer);
            this._audioPlayer.style.position = 'absolute';
            this._audioPlayer.style.left = 0;
            this._audioPlayer.style.top = 0;
            this._audioPlayer.style.width = 0;
            this._audioPlayer.style.height = 0;
            this.bindEvents();
        },
        soundsInit: function(URL){
            this._audioURL = URL;
            this._audioPlayer.src = URL;
            this._isLoaded = false;
        },
        bindEvents: function(){
            var that = this;
            this._audioPlayer.addEventListener("canplay", function(){
                this.play();
                if(!that._isLoaded){
                    this.volume = 0;
                }
                that._isLoaded = true;
            },false);
        },
        stop: function(){
            this._audioPlayer.removeEventListener('timeupdate', this._playCallback);
            this._audioPlayer.volume = 0;
        },
        play: function(sound,loop,callback,target){
            if(!sound || !this._isLoaded) return;

            this.stop();
            loop = (typeof loop === 'undefined')?1:loop*1;

            this._callback = callback || function(){};
            this._target = target || this;
            this._loop = loop;
            this._sound = sound;
            this._audioPlayer.addEventListener('timeupdate', this._playCallback);

            if(this._loop > 0){
                this.playFunc();
                this._loop -= 1;
            }else{
                this.stop();
                this._callback.call(this._target);
            }
        },
        playFunc: function(){
            this._audioPlayer.currentTime = this._sound.start;
            this._audioPlayer.volume = 1;
        },
        playHandler: function(){
            console.log(this._audioPlayer.currentTime , this._sound.start , this._sound.length);
            if (this._audioPlayer.currentTime >= this._sound.start + this._sound.length){
                if(this._loop > 0){
                    this.playFunc();
                    this._loop -= 1;
                }else{
                    this.stop();
                    this._callback.call(this._target);
                }
            }
        }

    };
    var AudioPlayer = window.AudioPlayer = AP.ctor;
    AudioPlayer.prototype = AP;
})(window);
*/

(function(window){
    var KG = {
        _key:'',
        _ls: '',
        ctor: function(){
            this._key = '';
            this._ls = '';
        },
        addNum: function(num){
            if(this._ls){
                var oldKey = this._key;
                this._key = this.getNewKey();
                this._ls = this.encode64(parseInt(this.decode64(this._ls,oldKey))+num+'',this._key);
            }else{
                this._key = this.getNewKey();
                this._ls = this.encode64(num+'',this._key);
            }
        },
        getNewKey: function(){
            var keyStr = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=").split('');
            var newKey = '';

            function randomsort(a, b) {
                return Math.random()>.5 ? -1 : 1;
            }
            newKey = keyStr.sort(randomsort).join('');

            return newKey;
        },
        getResult: function(){
            return {
                ls: this._ls,
                key: this._key
            }
        },
        encode64: function(input,key) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    key.charAt(enc1) +
                    key.charAt(enc2) +
                    key.charAt(enc3) +
                    key.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },
        decode64: function(input,key) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {}
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = key.indexOf(input.charAt(i++));
                enc2 = key.indexOf(input.charAt(i++));
                enc3 = key.indexOf(input.charAt(i++));
                enc4 = key.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);
            if(!parseInt(output)) output = '0';

            return output;
        }
    };
    var KeyG = window.KeyG = KG.ctor;
    KeyG.prototype = KG;
})(window);


