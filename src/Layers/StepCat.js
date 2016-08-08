(function(){
    var gameRes = {
        UIFrames:'res/stepCat.plist',
        UIImg:'res/stepCat.png',
        spriteFrames:'res/stepCatSprite.plist',
        spriteImg:'res/stepCatSprite.png',
        bg:'res/stepCatBg.jpg'
    };
    var helpImg = "#jumpCatHelp.png";

    var cPics = ['#cat_01.png','#cat_02.png','#cat_03.png',
        '#cat_04.png','#cat_05.png','#cat_06.png',
        '#cat_07.png','#cat_08.png','#cat_09.png',
        '#cat_10.png','#cat_11.png','#cat_12.png',
        '#cat_13.png','#cat_14.png','#cat_15.png',
        '#cat_16.png','#cat_17.png','#cat_18.png',
        '#cat_19.png','#cat_20.png','#cat_21.png',
        '#cat_22.png','#cat_23.png','#cat_24.png',
        '#cat_25.png','#cat_26.png','#cat_27.png',
        '#cat_28.png','#cat_29.png','#cat_30.png',
        '#cat_31.png','#cat_32.png','#cat_33.png',
        '#cat_34.png','#cat_35.png','#cat_36.png',
        '#cat_37.png','#cat_38.png','#cat_39.png',
        '#cat_40.png','#cat_41.png','#cat_42.png',
        '#cat_43.png','#cat_44.png','#cat_45.png',
        '#cat_46.png','#cat_47.png','#cat_48.png',
        '#cat_49.png','#cat_50.png','#cat_51.png',
        '#cat_52.png','#cat_53.png','#cat_54.png',
        '#cat_55.png','#cat_56.png','#cat_57.png',
        '#cat_58.png','#cat_59.png','#cat_60.png',
        '#cat_61.png','#cat_62.png','#cat_63.png'];

    var fallJumpStart = 3;
    var JumpEnd = 9;
    var successJumpEnd = 13;


    var controlBtns = [['#smallStep.png','#smallStepOn.png'],['#bigStep.png','#bigStepOn.png']];

    var itemsTop = ['#bubble1.png','#bubble2.png'];
    var itemsBottom = ['#bubble1.png','#bubble2.png','#bubble3.png'];

    var bgItems = ['#bgBig2.png','#bgBig3.png','bgBig4.png'];

    var cloudPics = ['#cloud1.png','#cloud2.png','#cloud3.png','#cloud4.png'];

    var bgPic = gameRes.bg;

    var objectPics = [['#object1.png','#object2.png'],
        ['#object3.png','#object4.png'],
        ['#object5.png','#object6.png'],
        ['#object7.png','#object8.png'],
        ['#object9.png','#object10.png'],
        ['#object11.png','#object12.png']];

    var wavesPics = ['#waves1.png','#waves2.png','#waves3.png',
        '#waves4.png','#waves5.png','#waves6.png',
        '#waves7.png','#waves8.png','#waves9.png',
        '#waves10.png','#waves11.png','#waves12.png',
        '#waves13.png','#waves14.png','#waves15.png',
        '#waves16.png','#waves17.png','#waves18.png',
        '#waves19.png','#waves20.png','#waves21.png',
        '#waves22.png','#waves23.png','#waves24.png',
        '#waves25.png','#waves26.png','#waves27.png',
        '#waves28.png','#waves29.png'];

    var clockPic = '#clock.png';


    var motionDuration = 0.18;
    var fallDelay = 0.3;

    var Charactor = cc.Sprite.extend({
        _isMoving: false,
        _canControl: true,
        _movement: null,
        _posY:0,
        ctor:function(type) {
            this._super(cPics[0]);
            this.anchorY = 0;
            this.scale = 0.6;//problem
        },
        _jump: function(success){
            this.stopAllActions();
            var i= 0, motion = new cc.Animation(), callback, openControl;
            this._isMoving = true;
            this._canControl = false;
            this.y = this._posY;

            if(success){
                for(i = 0; i<JumpEnd; i++){
                    motion.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[i].replace('#','')));
                }
                callback = cc.callFunc(this._jumpOn,this);
            }else{
                for(i = successJumpEnd; i<cPics.length; i++){
                    motion.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[i].replace('#','')));
                }
                callback = cc.callFunc(this._standOn,this);
            }
            motion.setDelayPerUnit(1/32);
            this._movement = cc.animate(motion).repeat(1);


            openControl = cc.callFunc(this._openControl,this);
            this.runAction(cc.spawn(cc.sequence(cc.delayTime(motionDuration*0.6),openControl),cc.sequence(this._movement,callback)));
            motion.retain();
        },
        _openControl: function(){
            this._canControl = true;
        },

        _jumpOn: function(){
            this.stopAllActions();
            this._isMoving = false;
            var animate1 = cc.moveBy(motionDuration/2,0,8.4),
                animate2 = cc.moveBy(motionDuration/2,0,-8.4),
                i= 0, motion = new cc.Animation();

            for(i = JumpEnd; i<successJumpEnd; i++){
                motion.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[i].replace('#','')));
            }
            motion.setDelayPerUnit(1/32);
            this._movement = cc.animate(motion).repeat(1);

            animate1.easing(cc.easeInOut(5));
            animate2.easing(cc.easeInOut(5));

            this.runAction(cc.spawn(cc.sequence(animate1,animate2),this._movement));

            this.parent.parent._successCallback();
        },
        _standOn: function(){
            this._canControl = false;
            this.parent.parent._failCallback();

            var callback,changePos;
            var i= fallJumpStart, motion = new cc.Animation(),movement;
            for(; i<JumpEnd; i++){
                motion.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[i].replace('#','')));
            }
            motion.setDelayPerUnit(1/32);
            movement = cc.animate(motion).repeat(1);
            callback = cc.callFunc(this._fallOver,this);
            this.runAction(cc.sequence(cc.delayTime(fallDelay),movement,callback));
            motion.retain();
        },
        _fallOver: function(){
            this._isMoving = false;
            this._canControl = true;
            this._jumpOn();
        },

        _restart: function(){
            this.stopAllActions();
            this._isMoving = false;
            this._canControl = true;
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[0].replace('#','')));
            this.y = this._posY;
        },
        _pause:function(){
            this.pause();
        },
        _resume:function(){
            this.resume();
        }
    });

    var StandObj = cc.Sprite.extend({
        _type:0,
        _num:0,
        _step:133,
        _hasClock:false,
        _item: null,
        _clock: null,
        _waves: null,

        _outCallback:null,
        _target:null,

        ctor: function(type,num,hasClock,outCallback,target){
            this._type = type;
            this._num = num;
            this._hasClock = hasClock;

            this._super();
            this.scale = 0.6;//problem
            this._item = new cc.Sprite(objectPics[this._type][this._num%2]);
            this._item.x = 0;
            this._item.y = 0;
            this.addChild(this._item,2);

            this._outCallback = outCallback;
            this._target = target;

            this._checkState();
        },
        _checkState: function(){
            if(this._hasClock){
                this._addClock();
            }
        },
        _addClock: function(){
            this._clock = new Clock();
            this._clock.x = this.width/2;
            this._clock.y = this.height/2 + 140;
            this.addChild(this._clock,3);
        },
        _removeClock: function(){
            if(this._clock){
                this.removeChild(this._clock,true);
                this._clock = null;
            }
        },
        _jumpOn: function(){
            var animate1 = cc.moveBy(motionDuration/2,0,8.4),
                animate2 = cc.moveBy(motionDuration/2,0,-8.4);
            animate1.easing(cc.easeInOut(5));
            animate2.easing(cc.easeInOut(5));

            this._wavesMotion();
            this._item.runAction(cc.sequence(animate1,animate2));

        },
        _wavesMotion: function(){
            if(!this._waves){
                this._waves = new cc.Sprite(wavesPics[0]);
                this._waves.x = 0;
                this._waves.y = 210;
                this.addChild(this._waves);
            }
            this._waves.stopAllActions();
            var motion = new cc.Animation(),movement,i=10;
            for(; i<wavesPics.length; i++){
                motion.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(wavesPics[i].replace('#','')));
            }
            motion.setDelayPerUnit(1/32);
            movement = cc.animate(motion).repeat(1);
            this._waves.runAction(movement);
            motion.retain();
        },
        _move: function(num){
            var animate = cc.moveBy(motionDuration,-this._step*num,0);
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

    var BgItem = cc.Sprite.extend({
        _outCallback: null,
        _step:0,
        _num:0,
        _target:null,
        ctor: function(sprite,step,num,outCallback,target){
            this._super(sprite);
            this._step = step;
            this._num = num;

            this.scale = 0.6;//problem

            this.anchorX = 0;

            this._outCallback = outCallback;
            this._target = target;
        },
        _move: function(num){
            var animate = cc.moveBy(motionDuration,-this._step*num,0);
            animate.easing(cc.easeIn(2));
            var callback = cc.callFunc(this._checkPos,this);
            this.runAction(cc.sequence(animate,callback));
        },
        _checkPos: function(){
            if(this.x<-(1-this.anchorX)*this.width*this.scale){
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
            this._super(controlBtns[this._code-1][0]);

            this.scale = 0.6;//problem
        },
        _touchStart: function(){
            this._callback.call(this._target,this._code);
        },
        _touchOver: function(){
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(controlBtns[this._code-1][1].replace('#','')));
        },
        _touchOut: function(){
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(controlBtns[this._code-1][0].replace('#','')));
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

            this._btnLeft = new JumpBtn(1,this._jump,this);
            this._btnLeft.anchorX = 0;
            this._btnLeft.anchorY = 0;
            this._btnLeft.x = 15;
            this._btnLeft.y = 15;
            this.addChild(this._btnLeft);
            cc.eventManager.addListener(jumpMenuEvents.clone(), this._btnLeft);

            this._btnRight = new JumpBtn(2,this._jump,this);
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

        _charactorPos:0,

        _jumpController: null,

        _clickStore: 0,

        _standObjs: [],
        _standObjsPos: 0,

        _bgsSprites: [bgItems,itemsTop, itemsBottom],

        _bgs1: [],
        _bgs2: [],
        _bgs3: [],

        _map: [],
        _mapStyleSpacer: 40,
        _mapTypes: 6,
        _clockSpacer:[6,8,10,12,20,40],
        _clockPoints: {},
        _lastClockPoint:0,


        _bgs1Num:0,
        _bgs2Num:0,
        _bgs3Num:0,

        _bgs1StartX:-40,
        _bgs2StartX:30,
        _bgs3StartX:400,

        _bgs1StartY:500,
        _bgs2StartY:340,
        _bgs3StartY:140,

        _standObjStartY: 200,
        _charactorStartBottom: 180,

        _bgs1Step:10,
        _bgs2Step:60,
        _bgs3Step:200,


        _bg1Space:0,
        _bg2Space:600,
        _bg3Space:1000,


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
            this._map = [];

            this._standObjs= [];
            this._standObjsPos = 0;
            this._bgs1= [];
            this._bgs2= [];
            this._bgs3= [];

            this._bgs1Num= 0;
            this._bgs2Num= 0;
            this._bgs3Num= 0;


            this._charactorPos = 0;

            this._clickStore = 0;

            this._getClockPoints();

            this._setBgObjs();



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
            this._charactor.x = cc.winSize.width/2;
            this._charactor.y = this._charactorStartBottom;
            this._charactor._posY = this._charactorStartBottom;
            this._bakeLayer.addChild(this._charactor,5);

        },
        _setBgObjs: function(num){
            num = num && [num] || [1,2,3];
            var i = 0, k, left,group,sprite;
            for(; i < num.length; i++){
                k = num[i];
                group = this['_bgs'+k];
                do{
                    left = group[group.length-1] && (group[group.length-1].x + group[group.length-1].width*group[group.length-1].scale + this['_bg'+k+'Space']) || this['_bgs'+k+'StartX'];
                    if(left<cc.winSize.width+133){
                        sprite = this._bgsSprites[k-1][this['_bgs'+k+'Num']];
                        this['_bgs'+k+'Num']++;
                        if(this['_bgs'+k+'Num']>=this._bgsSprites[k-1].length){
                            this['_bgs'+k+'Num'] = 0;
                        }
                        var bgItem = new BgItem(sprite,this['_bgs'+k+'Step'],k,this._bgObjOutHandler,this);
                        bgItem.x = left;
                        bgItem.y = this['_bgs'+k+'StartY'];
                        this._bakeLayer.addChild(bgItem,2);
                        group.push(bgItem);
                    }
                }while(left<cc.winSize.width);

            }

        },
        _bgObjOutHandler: function(obj){
            var i= 0,num = obj._num;
            for(;i<this['_bgs'+num].length;i++){
                if(this['_bgs'+num][i] === obj){
                    this['_bgs'+num].splice(i,1);
                    break;
                }
            }
            obj.removeFromParent(true);
        },
        _getClockPoints: function(){
            this._clockPoints = {};
            this._lastClockPoint = 0;
            var total = (this._clockSpacer.length - 1)*this._mapStyleSpacer,
                i, k = 0;
            for(i = this._clockSpacer[k]; i<total; i+= this._clockSpacer[k]){
                if(i<(k+1)*this._mapStyleSpacer){
                    this._clockPoints[i] = true;
                    this._lastClockPoint = i;
                }else{
                    i -= this._clockSpacer[k];
                    k++;
                }
            }
            console.log(this._clockPoints);
        },
        _setMap: function(){
            var value,addedMaps = [],length;
            while(this._map.length<this._charactorPos+10){
                length = this._map.length;
                if(this._clockPoints[length] || length > this._lastClockPoint && (length - this._lastClockPoint)%this._clockSpacer[this._clockSpacer.length - 1] == 0){
                    value = 2;
                }else{
                    value = this._map[length-1]?Math.round(Math.random()):1;
                }
                this._map.push(value);
                addedMaps.push(value);
            }
            this._drawMap(addedMaps);
        },
        _drawMap: function(addedMaps){
            var i= 0,pos,posX,type,standObj,num,hasClock;
            for(; i< addedMaps.length; i++){
                if(addedMaps[i]>0){
                    pos = this._map.length - addedMaps.length + i;
                    type = Math.floor(pos/this._mapStyleSpacer);
                    if(type > this._mapTypes-1){
                        type = this._mapTypes-1;
                    }
                    num = pos%2;
                    hasClock = addedMaps[i]>1;
                    standObj = new StandObj(type,num,hasClock,this._standObjOutHandler,this);
                    posX = (pos - this._charactorPos)*standObj._step + cc.winSize.width/2;
                    standObj.y = this._standObjStartY;
                    standObj.x = posX;
                    this._standObjs.push(standObj);
                    this._bakeLayer.addChild(standObj,4);
                }else{
                    this._standObjs.push(null);
                }
            }
        },
        _standObjOutHandler: function(obj){
            var i = 0;
            for(; i<this._standObjs.length; i++){
                if(!this._standObjs[i]){
                    this._standObjs.splice(i,1);
                }else if(this._standObjs[i] === obj){
                    this._standObjs.splice(i,1);
                    break;
                }
            }
            obj.removeFromParent(true);
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
            var targetPos = this._charactorPos+ d,
                success = !!this._map[targetPos],
                score = d;
            if(success){
                this._charactorPos = targetPos;
            }else{
                this._charactorPos = targetPos - 1;//默认上一个为可站立的区域，简化计算
                score -= 1;
            }
            this._charactor._jump(success);
            if(score){
                this.root._addScore(score);
            }

            var i = 0;
            for(; i < this._standObjs.length; i++){
                if(this._standObjs[i]){
                    this._standObjs[i]._move(d);
                }
            }
            for(i = 0 ; i < this._bgs1.length; i++){
                this._bgs1[i]._move(d);
            }
            for(i = 0 ; i < this._bgs2.length; i++){
                this._bgs2[i]._move(d);
            }
            for(i = 0 ; i < this._bgs3.length; i++){
                this._bgs3[i]._move(d);
            }
        },

        _successCallback: function(){
            var standObj = this._standObjs[this._charactorPos - this._standObjsPos];
            standObj._jumpOn();
            if(this._map[this._charactorPos] > 1){
                this._map[this._charactorPos] = 1;
                standObj._removeClock();
                this._addTime();
            }
            this._setMap();
            this._clearStandObj();
            this._setBgObjs();
            this._checkClickStore();
        },
        _clearStandObj: function(){
            var clearObjs = [],i = 0;
            if(this._standObjs.length>20){
                clearObjs = this._standObjs.splice(0,this._standObjs.length-20);
            }

            this._standObjsPos += clearObjs.length;
            for(; i<clearObjs.length; i++){
                if(clearObjs[i]){
                    clearObjs[i].removeFromParent(true);
                }
            }
        },
        _failCallback: function(){
            var i = 0;
            this._clearClickStore();
            for(; i < this._standObjs.length; i++){
                if(this._standObjs[i]){
                    this._standObjs[i]._move(-1);
                }
            }
            for(i = 0 ; i < this._bgs1.length; i++){
                this._bgs1[i]._move(-1);
            }
            for(i = 0 ; i < this._bgs2.length; i++){
                this._bgs2[i]._move(-1);
            }
            for(i = 0 ; i < this._bgs3.length; i++){
                this._bgs3[i]._move(-1);
            }
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

        _addTime : function(){
            this.root._addTime();
        },


        _restart: function(){
            var i = 0;
            for(; i < this._standObjs.length; i++){
                if(this._standObjs[i]){
                    this._standObjs[i].removeFromParent(true);
                }
            }
            for(i = 0 ; i < this._bgs1.length; i++){
                this._bgs1[i].removeFromParent(true);
            }
            for(i = 0 ; i < this._bgs2.length; i++){
                this._bgs2[i].removeFromParent(true);
            }
            for(i = 0 ; i < this._bgs3.length; i++){
                this._bgs3[i].removeFromParent(true);
            }

            this._charactor._restart();
            this._start();
        },
        _pause:function(){
            var i = 0;
            this.pause();
            this._charactor._pause();
            for(; i < this._standObjs.length; i++){
                if(this._standObjs[i]){
                    this._standObjs[i]._pause();
                }
            }
            for(i = 0 ; i < this._bgs1.length; i++){
                this._bgs1[i]._pause();
            }
            for(i = 0 ; i < this._bgs2.length; i++){
                this._bgs2[i]._pause();
            }
            for(i = 0 ; i < this._bgs3.length; i++){
                this._bgs3[i]._pause();
            }
            this._jumpController._pause();
        },
        _resume:function(){
            var i = 0;
            this.resume();
            this._charactor._resume();
            for(; i < this._standObjs.length; i++){
                if(this._standObjs[i]){
                    this._standObjs[i]._resume();
                }
            }
            for(i = 0 ; i < this._bgs1.length; i++){
                this._bgs1[i]._resume();
            }
            for(i = 0 ; i < this._bgs2.length; i++){
                this._bgs2[i]._resume();
            }
            for(i = 0 ; i < this._bgs3.length; i++){
                this._bgs3[i]._resume();
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
        rewardTime: 2,              //奖励时间
        totalTime: 20,              //总时间
        sufficientTime: 20,         //安全时间
        urgentTime: 5,              //危险时间
        clockTime: 5,               //使用时钟加几秒
        levels:[50,100,150,200,250],    //各星级需要多少分
        gameName:'StepCat',         //游戏唯一标示
        helpPic:helpImg
    };
    GameLayer.menu = {
        name:'跳跳貓2',
        pic:'#menu_jumpCat.png'
    };
    GameList[GameLayer.parameters.gameName] = GameLayer;
})();