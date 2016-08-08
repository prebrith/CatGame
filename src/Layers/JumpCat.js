(function(){
    var gameRes = {
        UIFrames:'res/jumpCat.plist',
        UIImg:'res/jumpCat.png',
        spriteFrames:'res/jumpCatSprite.plist',
        spriteImg:'res/jumpCatSprite.png',
        bg:'res/jumpCatBg.jpg',
        audio_jumpWood:'res/audio/jumpWood.m4a',
        audio_wrongWood:'res/audio/wrongWood.m4a'
    };
    var helpImg = "#jumpCatHelp.png";

    var cPics = ['#cat_01.png','#cat_02.png','#cat_03.png',
        '#cat_04.png','#cat_05.png','#cat_06.png',
        '#cat_07.png','#cat_08.png','#cat_09.png',
        '#cat_10.png','#cat_11.png','#cat_12.png'];

    var fallJumpStart = 3;


    var controlBtns = [['#left.png','#leftOn.png'],['#right.png','#rightOn.png']];

    var plantLeft = ['#tree1.png','#tree2.png','#tree3.png'];
    var plantRight = ['#tree4.png','#tree5.png','#tree6.png'];

    var floorPic = "#frogJumpBottom.png";
    var bgPic = gameRes.bg;

    var stickPics = ['#stick0.png','#stick1.png','#stick2.png','#stick3.png'];
    var cloudPics = ['#cloud1.png','#cloud2.png','#cloud3.png','#cloud4.png'];

    var clockPic = '#clock.png';

    var gameMaps = [
        [
            [0,1,0,1],
            [0,1,1],
            [0,0,2,1],
            [0,0,1],
            [0,1,0,1],
            [1,1,1],
            [0,1,1,0],
            [0,1,0],
            [0,1,0,0],
            [1,1,1]
        ],
        [
            [0,1,1,0],
            [0,1,0],
            [0,1,0,0],
            [0,1,0],
            [0,0,1,0],
            [0,1,1],
            [0,0,2,1],
            [0,1,1],
            [0,1,1,0],
            [1,1,1]
        ],
        [
            [0,1,1,0],
            [1,1,0],
            [0,1,0,0],
            [1,0,0],
            [2,1,0,0],
            [1,0,0],
            [1,0,0,0],
            [1,0,0],
            [0,1,0,0],
            [1,1,1]
        ],
        [
            [1,0,1,1],
            [1,1,1],
            [0,1,1,0],
            [0,1,1],
            [0,1,0,1],
            [0,1,1],
            [0,1,1,0],
            [0,2,0],
            [0,1,0,0],
            [1,1,1]
        ],
        [
            [0,1,1,0],
            [0,1,0],
            [0,1,0,0],
            [1,0,0],
            [1,2,0,0],
            [1,0,0],
            [1,0,0,0],
            [1,0,0],
            [1,0,0,0],
            [1,1,1]
        ]
    ];
    var mapStart = [0,1,0];
    var defaultMap = 0;

    var motionDuration = 0.18;
    var fallDelay = 0.3;

    var Charactor = cc.Sprite.extend({
        _isMoving: false,
        _canControl: true,
        _movement: null,
        ctor:function(type) {
            this._super(cPics[0]);
            this.anchorY = 0;
        },
        _jump: function(x){
            this.stopAllActions();
            var i= 0, motion = new cc.Animation(), action, callback, openControl;
            this._isMoving = true;
            this._canControl = false;
            for(; i<cPics.length; i++){
                motion.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[i].replace('#','')));
            }
            motion.setDelayPerUnit(1/32);
            this._movement = cc.animate(motion).repeat(1);
            action = cc.moveTo(motionDuration,cc.p(x,this.y));
            callback = cc.callFunc(this._checkStick,this);
            openControl = cc.callFunc(this._openControl,this);
            this.runAction(cc.spawn(cc.sequence(cc.delayTime(motionDuration*0.6),openControl),cc.sequence(action,callback),this._movement));
            motion.retain();
        },
        _openControl: function(){
            this._canControl = true;
        },
        _checkStick: function(){
            var canStand = this.parent.parent._checkStick();
            if(!canStand){
                playEffect(GameLayer.res.audio_wrongWood);
                this._fall();
                this._canControl = false;
                this.parent.parent._clearClickStore();
            }else{
                playEffect(GameLayer.res.audio_jumpWood);
                this._isMoving = false;
                this.parent.parent._checkClickStore();
            }
        },
        _fall: function(){
            var animate = cc.moveBy(motionDuration*1.5,0,-cc.winSize.height/2);
            animate.easing(cc.easeIn(2));
            var callback = cc.callFunc(this._standStick,this);
            this.runAction(cc.sequence(animate,callback));
        },
        _standStick: function(){
            var callback,changePos;
            var i= fallJumpStart, motion = new cc.Animation(),movement;
            for(; i<cPics.length; i++){
                motion.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[i].replace('#','')));
            }
            motion.setDelayPerUnit(1/32);
            movement = cc.animate(motion).repeat(1);
            callback = cc.callFunc(this._fallOver,this);
            changePos = cc.callFunc(this._changePos,this);
            this.runAction(cc.sequence(cc.delayTime(fallDelay),changePos,movement,callback));
            motion.retain();
        },
        _changePos: function(){
            this.x = this.parent.parent._getStandStick();
            this.y = this.parent.parent._charactorStartBottom;
        },
        _fallOver: function(){
            this._isMoving = false;
            this._canControl = true;
            this.parent.parent._checkClickStore();
        },
        _restart: function(){
            this.stopAllActions();
            this._isMoving = false;
            this._canControl = true;
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[0].replace('#','')))
        },
        _pause:function(){
            this.pause();
        },
        _resume:function(){
            this.resume();
        }
    });

    var Stick = cc.Sprite.extend({
        _type:0,
        _state:0,
        _clock: null,
        ctor: function(type,state){
            this._type = type;
            this._state = state;
            cc.Sprite.prototype.ctor.call(this,stickPics[this._type]);

            this._checkState();
        },
        _checkState: function(){
            switch (this._state){
                case 0:
                    this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(stickPics[0].replace('#','')));
                    break;

                case 2:
                    this._addClock();
                    break;
            }
        },
        _addClock: function(){
            this._clock = new Clock();
            this._clock.x = this.width/2;
            this._clock.y = this.height/2 + 100;
            this.addChild(this._clock);
        },
        _removeClock: function(){
            if(this._clock){
                this.removeChild(this._clock,true);
                this._clock = null;
            }
        },
        _move: function(){
            var animate = cc.moveBy(motionDuration,0,-cc.winSize.height/3);
            this.runAction(animate);
        },
        _fall: function(){
            var animate = cc.moveBy(motionDuration*1.5,0,-cc.winSize.height/2);
            animate.easing(cc.easeIn(2));
            this.runAction(animate);
        },
        _pause: function(){
            this.pause();
        },
        _resume: function(){
            this.resume();
        }

    });

    var Clock = cc.Sprite.extend({
        ctor: function(){
            this._super(clockPic);
        }

    });

    var Floor = Stick.extend({
        ctor: function(){
            this._state = 1;
            cc.Sprite.prototype.ctor.call(this,floorPic);
            this.anchorY = 0;
            this.y = 0;
            this.x = cc.winSize.width/2;
        }
    });

    var BgItem = cc.Sprite.extend({
        _outCallback: null,
        _target:null,
        ctor: function(sprite,posX,posY,outCallback,target){
            this._super(sprite);
            this.x = posX;
            this.y = posY;


            this._outCallback = outCallback;
            this._target = target;
        },
        _move: function(){
            var animate = cc.moveBy(motionDuration,0,-cc.winSize.height/12);
            animate.easing(cc.easeIn(2));
            var callback = cc.callFunc(this._checkPos,this);
            this.runAction(cc.sequence(animate,callback));
        },
        _checkPos: function(){
            if(this.y<-(1-this.anchorY)*this.height*this.scale){
                this._outCallback.call(this._target,this);
            }
        },
        _pause: function(){
            this.pause();
        },
        _resume: function(){
            this.resume();
        }
    });




    var jumpMenuEvents = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function(touch,event){
            var target = event.getCurrentTarget();  // 获取事件所绑定的 target
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();

            var rect = cc.rect(0, 0, s.width, s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                target._touchStart();
                target._touchOver();
            }
            return true;
        },
        onTouchMoved: function(touch,event){
            var target = event.getCurrentTarget();  // 获取事件所绑定的 target
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();

            var rect = cc.rect(0, 0, s.width, s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                target._touchOver();
            }else{
                target._touchOut();
            }
        },
        onTouchEnded: function(touch,event){
            var target = event.getCurrentTarget();
            target._touchOut();
        }
    });


    var JumpBtn = cc.Sprite.extend({
        _code:0,
        _callback:null,
        _target:null,
        ctor: function(code,callback,target){
            this._code = code;
            this._callback = callback;
            this._target = target;
            this._super(controlBtns[(this._code+1)/2][0]);
        },
        _touchStart: function(){
            this._callback.call(this._target,this._code);
        },
        _touchOver: function(){
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(controlBtns[(this._code+1)/2][1].replace('#','')));
        },
        _touchOut: function(){
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(controlBtns[(this._code+1)/2][0].replace('#','')));
        },
        _pause: function(){
            this._touchOut();
            this.pause();
            this.disabled = true;
        },
        _resume:function(){
            this.resume();
            this.disabled = false;
        }

    });


    var JumpController = cc.Layer.extend({
        _btnLeft:null,
        _btnRight:null,
        ctor: function(){
            this._super();

            this._btnLeft = new JumpBtn(-1,this._jump,this);
            this._btnLeft.anchorX = 0;
            this._btnLeft.anchorY = 0;
            this._btnLeft.x = 15;
            this._btnLeft.y = 15;
            this.addChild(this._btnLeft);
            cc.eventManager.addListener(jumpMenuEvents.clone(), this._btnLeft);

            this._btnRight = new JumpBtn(1,this._jump,this);
            this._btnRight.anchorX = 1;
            this._btnRight.anchorY = 0;
            this._btnRight.x = cc.winSize.width - 15;
            this._btnRight.y = 15;
            this.addChild(this._btnRight);
            cc.eventManager.addListener(jumpMenuEvents.clone(), this._btnRight);

        },
        _jump: function(code){
            this.parent.parent._jumpControl(code);
        },
        _pause: function(){
            this._btnLeft._pause();
            this._btnRight._pause();
        },
        _resume: function(){
            this._btnLeft._resume();
            this._btnRight._resume();
        },
        _resize: function(size){
            var height = cc.winSize.height,
                width = cc.winSize.width;
            if(width/height>=size.width/size.height){
                width = height*size.width/size.height;
            }else{
                height = width*size.height/size.width;
            }
            this._btnLeft.x = (cc.winSize.width - width)/2 + 15;
            this._btnLeft.y = (cc.winSize.height - height)/2 + 15;

            this._btnRight.x = (cc.winSize.width + width)/2 - 15;
            this._btnRight.y = (cc.winSize.height - height)/2 + 15;
        }
    });

    var GameLayer = cc.GameLayer.extend({
        _level: 0,
        _charactor: null,
        _frameCount:0,
        _bakeLayer: null,

        _charactorPos:1,

        _jumpController: null,

        _drawStart: false,

        _clickStore: 0,

        _sticks: [],

        _leftBgs: [],
        _rightBgs: [],
        _cloudBgs: [],

        _map: [],
        _nowMap: [mapStart],


        _leftBgNum:0,
        _rightBgNum:0,
        _cloudBgNum:0,

        _leftStartBottom:140,
        _rightStartBottom:-60,
        _cloudStartBottom:220,

        _stickStartBottom:110,
        _charactorStartBottom:105,

        _stickSpace:220,

        _bgHeight: 800,

        ctor: function(){
            this._super();
        },
        init: function (root) {
            this._super();
            cc.spriteFrameCache.addSpriteFrames(GameLayer.res.UIFrames);
            cc.spriteFrameCache.addSpriteFrames(GameLayer.res.spriteFrames);

            this.root = root;

            this._bakeLayer = new cc.Layer();
            this.addChild(this._bakeLayer);

            this._setBg();

            this._setControl();

            this.scheduleUpdate();

            this._start();
        },
        _start: function(){
            this._level = 0;
            this._frameCount = 0;
            this._map = [mapStart].concat(gameMaps[defaultMap]);

            this._nowMap= [];

            this._sticks= [];
            this._leftBgs= [];
            this._rightBgs= [];
            this._cloudBgs= [];
            this._leftBgNum = 0;
            this._rightBgNum = 0;
            this._cloudBgNum = 0;

            this._charactorPos = 1;

            this._clickStore = 0;

            this._drawStart = false;

            this._setClouds();
            this._setLeftBgs();
            this._setRightBgs();


            this._charactor.x = cc.winSize.width/2;
            this._charactor.y = this._charactorStartBottom;

            this._setMap();

        },
        _resize: function(size){
            this._jumpController._resize(size);

        },
        _setControl: function(){
            this._jumpController = new JumpController();
            this._bakeLayer.addChild(this._jumpController,6);
        },
        _setBg: function(){

            var bg = new cc.Sprite(bgPic);
            bg.anchorX = 1;
            bg.anchorY = 0;
            bg.x = cc.winSize.width;
            bg.y = 0;
            this._bakeLayer.addChild(bg);

            this._charactor = new Charactor();
            this._bakeLayer.addChild(this._charactor,5);



        },
        _setMap: function(){
            var addedMaps = [];
            while(this._nowMap.length<4){
                if(!this._map.length){
                    this._map = gameMaps[Math.floor(Math.random()*gameMaps.length)].concat();
                }
                addedMaps.push(this._map.shift());
                this._nowMap.push(addedMaps[addedMaps.length-1]);
            }
            this._drawMap(addedMaps);
        },
        _drawMap: function(addedMaps){
            var i= 0,posY;
            for(; i< addedMaps.length; i++){
                posY = (4 - addedMaps.length + i)*cc.winSize.height/3 + this._stickStartBottom;
                this._drawSticks(addedMaps[i],posY,this._level - this._nowMap.length + i + 5);
            }
        },
        _drawSticks: function(map,posY,level){
            var posX,i= 0,type,stick;
            if(!this._drawStart){
                this._drawStart = true;
                stick = new Floor();
                this._sticks.push(stick);
                this._bakeLayer.addChild(stick,4);
            }else{
                for(; i < map.length; i++){
                    posX = cc.winSize.width/2 - (map.length/2 - 0.5 - i)*this._stickSpace;
                    type = Math.min(Math.floor(this._level/50)+1,3);
                    stick = new Stick(type,map[i]);
                    stick.x = posX;
                    stick.y = posY;
                    this._sticks.push(stick);
                    this._bakeLayer.addChild(stick,4);
                }
            }
        },
        _clearMap: function(){
            var map = this._nowMap.shift(),length = map.length;
            if(this._level == 1) length = 1;
            var sticks = this._sticks.splice(0,length);
            var i = 0;
            for(; i< sticks.length; i++){
                sticks[i].removeFromParent(true);
            }
        },
        _jumpControl: function(d){
            this.root._start();
            if(!this._clickStore && !this._charactor._isMoving){
                this._jump(d);
            }else if(this._charactor._canControl){
                this._clickStore = d;
            }
        },
        _jump: function(d){
            d = (d - this._nowMap[0].length + this._nowMap[1].length)/2;
            var targetPos = this._charactorPos + d;
            if(targetPos<0 || targetPos>this._nowMap[1].length-1) return false;
            var count = this._nowMap[0].length + targetPos;
            if(!this._level){
                count = targetPos+1;
            }
            var posX = this._sticks[count].x;
            this._charactorPos = targetPos;
            this._charactor._jump(posX);
            this._level++;
            this.root._addScore(1);

            var i = 0;
            for(; i < this._sticks.length; i++){
                this._sticks[i]._move();
            }
            for(i = 0 ; i < this._leftBgs.length; i++){
                this._leftBgs[i]._move();
            }
            for(i = 0 ; i < this._rightBgs.length; i++){
                this._rightBgs[i]._move();
            }
            for(i = 0 ; i < this._cloudBgs.length; i++){
                this._cloudBgs[i]._move();
            }
        },
        _checkStick: function(){
            this._clearMap();

            var stick = this._sticks[this._charactorPos],flag = false;
            switch (stick._state){
                case 0:
                    flag = false;
                    stick._fall();
                    break;
                case 1:
                    flag = true;
                    break;
                case 2:
                    flag = true;
                    stick._removeClock();
                    this._addTime();
                    break;

            }
            this._setMap();
            return flag;
        },
        _clearClickStore: function(){
            this._clickStore = 0;
        },
        _checkClickStore: function(){
            if(this._clickStore){
                this._jump(this._clickStore);
                this._clickStore = 0;
            }
        },
        _getStandStick: function(){
            var i = 0,key = -1,key2 = 0;
            for(; i< this._nowMap[0].length; i++){
                if(this._nowMap[0][i] == 1){
                    key = i;
                    break;
                }else if(this._nowMap[0][i] > 1){
                    key2 = i;
                }
            }
            if(key<0){
                key = key2;
                this._charactorPos = key;

                if(this._sticks[this._charactorPos]._state>1){
                    this._sticks[this._charactorPos]._removeClock();
                }
            }else{
                this._charactorPos = key;
            }
            return this._sticks[key].x;
        },
        _setClouds: function(){
            while(this._cloudBgs.length<5){
                this._addCloud();
            }
        },
        _addCloud: function(){
            var startPos = this._cloudBgs[0] &&  this._cloudBgs[0].y || this._cloudStartBottom;
            var posX = (this._cloudBgNum%2)? (Math.random()*0.4 + 0.05)*cc.winSize.width :
            (Math.random()*0.4 + 0.55)*cc.winSize.width;
            var posY = this._cloudBgs.length*cc.winSize.height/4 + startPos;
            var sprite = cloudPics[this._cloudBgNum%4];

            var cloud = new BgItem(sprite,posX,posY,this._clearCloud,this);
            this._cloudBgs.push(cloud);
            this._cloudBgNum++;
            if(this._cloudBgNum == 400){
                this._cloudBgNum = 0;
            }
            this._bakeLayer.addChild(cloud,2);
        },
        _clearCloud: function(cloud){
            this._cloudBgs.shift();
            cloud.removeFromParent(true);
            this._setClouds();
        },
        _setLeftBgs: function(){
            while(this._leftBgs.length<2){
                this._addLeftBg();
            }
        },
        _addLeftBg: function(){
            var lastBg = this._leftBgs[this._leftBgs.length-1];
            var posY = (lastBg &&  lastBg.y || this._leftStartBottom)+this._bgHeight;
            var posX = 0;
            var sprite = plantLeft[this._leftBgNum%3];

            var leftBg = new BgItem(sprite,posX,posY,this._clearLeftBg,this);
            leftBg.anchorX = 0;
            this._leftBgs.push(leftBg);
            this._leftBgNum++;
            if(this._leftBgNum == 300){
                this._leftBgNum = 0;
            }
            this._bakeLayer.addChild(leftBg,3);
        },
        _clearLeftBg: function(leftBg){
            this._leftBgs.shift();
            leftBg.removeFromParent(true);
            this._setLeftBgs();
        },
        _setRightBgs: function(){
            while(this._rightBgs.length<2){
                this._addRightBg();
            }
        },
        _addRightBg: function(){
            var lastBg = this._rightBgs[this._rightBgs.length-1];
            var posY = (lastBg && lastBg.y || this._rightStartBottom)+this._bgHeight;
            var posX = cc.winSize.width;
            var sprite = plantRight[this._rightBgNum%3];

            var rightBg = new BgItem(sprite,posX,posY,this._clearRightBg,this);
            rightBg.anchorX = 1;
            this._rightBgs.push(rightBg);
            this._rightBgNum++;
            if(this._rightBgNum == 300){
                this._rightBgNum = 0;
            }
            this._bakeLayer.addChild(rightBg,3);
        },
        _clearRightBg: function(rightBg){
            this._rightBgs.shift();
            rightBg.removeFromParent(true);
            this._setRightBgs();
        },
        _addTime : function(){
            this.root._addTime();
        },
        _restart: function(){
            var i = 0;
            for(; i < this._sticks.length; i++){
                this._sticks[i].removeFromParent(true);
            }
            for(i = 0 ; i < this._leftBgs.length; i++){
                this._leftBgs[i].removeFromParent(true);
            }
            for(i = 0 ; i < this._rightBgs.length; i++){
                this._rightBgs[i].removeFromParent(true);
            }
            for(i = 0 ; i < this._cloudBgs.length; i++){
                this._cloudBgs[i].removeFromParent(true);
            }

            this._charactor._restart();
            this._start();
        },
        _pause:function(){
            var i = 0;
            this.pause();
            this._charactor._pause();
            for(; i < this._sticks.length; i++){
                this._sticks[i]._pause();
            }
            for(i = 0 ; i < this._leftBgs.length; i++){
                this._leftBgs[i]._pause();
            }
            for(i = 0 ; i < this._rightBgs.length; i++){
                this._rightBgs[i]._pause();
            }
            for(i = 0 ; i < this._cloudBgs.length; i++){
                this._cloudBgs[i]._pause();
            }
            this._jumpController._pause();
        },
        _resume:function(){
            var i = 0;
            this.resume();
            this._charactor._resume();
            for(; i < this._sticks.length; i++){
                this._sticks[i]._resume();
            }
            for(i = 0 ; i < this._leftBgs.length; i++){
                this._leftBgs[i]._resume();
            }
            for(i = 0 ; i < this._rightBgs.length; i++){
                this._rightBgs[i]._resume();
            }
            for(i = 0 ; i < this._cloudBgs.length; i++){
                this._cloudBgs[i]._resume();
            }
            this._jumpController._resume();
        },
        onExit: function(){
            cc.spriteFrameCache.removeSpriteFramesFromFile(GameLayer.res.UIFrames);
            cc.spriteFrameCache.removeSpriteFramesFromFile(GameLayer.res.spriteFrames);
        },
        update: function(){
            this._frameCount++;
            if(this._frameCount>=400){
                this._frameCount = 0;
            }
        }
    });
    GameLayer.res = gameRes;
    GameLayer.parameters = {
        rewardTime: 1.5,              //奖励时间
        totalTime: 20,              //总时间
        sufficientTime: 20,         //安全时间
        urgentTime: 5,              //危险时间
        clockTime: 5,               //使用时钟加几秒
        levels:[20,40,60,100,150],    //各星级需要多少分
        gameName:'JumpCat',         //游戏唯一标示
        helpPic:helpImg
    };
    GameLayer.menu = {
        name:'跳跳貓',
        pic:'#menu_jumpCat.png'
    };
    GameList[GameLayer.parameters.gameName] = GameLayer;
})();