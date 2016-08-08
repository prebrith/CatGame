(function(){
    var gameRes = {
        UIFrames:'res/fruitCatUI.plist',
        UIImg:'res/fruitCatUI.png',
        charactorFrames:'res/fruitCatSprite.plist',
        charactorImg:'res/fruitCatSprite.png',
        bg:'res/fruitCatBg.jpg',
        itemBoomFrames:'res/itemBoom.plist',
        itemBoomImg:'res/itemBoom.png',

        audio_eat1:'res/audio/eat1.m4a',
        audio_eat2:'res/audio/eat2.m4a',
        audio_eat3:'res/audio/eat3.m4a',
        audio_eat4:'res/audio/eat4.m4a',
        audio_chewinng1:'res/audio/chewinng1.mp3',
    };
    var bgImg = gameRes.bg;
    var helpImg = "#fruitCatHelp.png";
    var cStartPics = ["#catEat01.png","#catEat02.png","#catEat03.png",
        "#catEat04.png","#catEat05.png","#catEat06.png",
        "#catEat07.png","#catEat08.png","#catEat09.png",
        "#catEat10.png"];

    var cRepeatPics = ["#catEat11.png","#catEat12.png",
        "#catEat13.png","#catEat14.png","#catEat15.png",
        "#catEat16.png","#catEat17.png","#catEat18.png",
        "#catEat19.png","#catEat20.png"];

    var cEndPics = ["#catEat21.png","#catEat22.png",
        "#catEat23.png","#catEat24.png","#catEat25.png"];

    var cPics = (function(){
        var i = 0,j = 0,group=[];
        for(i = 0; i<cStartPics.length; i++){
            group.push(cStartPics[i]);
        }
        for(j = 0; j<4; j++){
            for(i = 0; i<cRepeatPics.length; i++){
                group.push(cRepeatPics[i]);
            }
        }
        for(i = 0; i<cEndPics.length; i++){
            group.push(cEndPics[i]);
        }

        for(i = 5; i>=0; i--){
            group.push(cStartPics[i]);
        }
        return group;

    })();



    var openMouthFrame = 9;

    var fruitTable = "#fruitBar.png";

    var fruits = ["#fruit01.png","#fruit02.png","#fruit03.png","#fruit04.png","#fruit05.png"];
    var fruitBtns = [["#fruitBtn01.png","#fruitBtnOn01.png"],
        ["#fruitBtn02.png","#fruitBtnOn02.png"],
        ["#fruitBtn03.png","#fruitBtnOn03.png"],
        ["#fruitBtn04.png","#fruitBtnOn04.png"],
        ["#fruitBtn05.png","#fruitBtnOn05.png"]];

    var itemBoom = ["#itemBoom01.png","#itemBoom02.png","#itemBoom03.png",
        "#itemBoom04.png","#itemBoom05.png","#itemBoom06.png",
        "#itemBoom07.png","#itemBoom08.png","#itemBoom09.png",
        "#itemBoom10.png","#itemBoom11.png","#itemBoom12.png",
        "#itemBoom13.png","#itemBoom14.png","#itemBoom15.png",
        "#itemBoom16.png","#itemBoom17.png"];


    var Charactor = cc.Sprite.extend({
        _timePoints:[],
        _isMoving:false,
        _movement:null,
        _soundPlaying:false,
        _sound:null,
        _group:-1,
        ctor:function(type) {
            this._timePoints = [];
            this._super(cPics[0]);
            this.scheduleUpdate();
        },
        _movementStart: function(){
            if(this._movement) this.stopAction(this._movement);
            var i = 0, moveAnimation, startCounts, key;
            startCounts = this._checkPoints();
            moveAnimation = new cc.Animation();
            for(; i<cPics.length;i++){
                key = startCounts[i] || i;
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[key].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/40);
            this._movement = cc.animate(moveAnimation).repeat(1);
            this.runAction(this._movement);
            moveAnimation.retain();
        },
        update: function(){
            var nowTime = new Date().getTime() - this._timePoints[this._timePoints.length-1];
            if(
                nowTime > 25*(openMouthFrame+8) &&
                nowTime < 25*(cPics.length - 4)
            ){
                if(!this._soundPlaying){
                    this._sound = playEffect(GameLayer.res.audio_chewinng1,true);
                    this._soundPlaying = true;
                }
            }else {
                if( this._soundPlaying){
                    stopEffect(this._sound);
                    this._soundPlaying = false;
                }

            }
        },
        _restart: function(){
            if(this._movement) this.stopAction(this._movement);
            this._movement = null;
            this._timePoints = [];
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[0].replace('#','')))
        },
        _checkPoints: function(){
            var timePoint = new Date().getTime(), i = 0, j, startCounts = [], key, count0;
            if(this._timePoints.length &&
                timePoint - this._timePoints[this._timePoints.length-1]<25*openMouthFrame)
            {
                this._timePoints.push(timePoint);
            }else{
                this._timePoints = [timePoint];
            }
            for(;i < this._timePoints.length; i++){
                key = Math.round((this._timePoints[i] - timePoint)/40) + openMouthFrame;
                count0 = startCounts[startCounts.length-1] || -1;
                for(j = 0; j<key - startCounts.length; j++){
                    if(count0>-1 && j<(key - startCounts.length)/2){
                        startCounts.push(count0+j+1);
                    }else{
                        startCounts.push(openMouthFrame-key+j);
                    }
                }
            }
            return startCounts;
        },
        _pause:function(){
            this.pause();
        },
        _resume:function(){
            this.resume();
        }
    });


    var Fruit = cc.Sprite.extend({
        _type:0,
        ctor: function(type){
            this._type = type;
            this._super(fruits[this._type]);
        },
        _moveTo: function(posX){
            var motion = cc.moveTo(0.4,cc.p(posX,this.y));
            motion.easing(cc.easeInOut(5));
            this.stopAllActions();
            this.runAction(motion);
        },
        _beEat: function(){
            var bezier = [cc.p(474, 552), cc.p(374, 430), cc.p(352, 326)];
            var motion = cc.bezierTo(0.3,bezier);
            motion.easing(cc.easeIn(5));
            var callback = cc.callFunc(this._beEatHandler,this);
            this.stopAllActions();
            this.runAction(cc.sequence(motion,callback));
        },
        _beEatHandler: function(){
            this.parent.parent._checkCombo();

            playEffect([GameLayer.res.audio_eat1,
                GameLayer.res.audio_eat2,
                GameLayer.res.audio_eat3,
                GameLayer.res.audio_eat4]);

            this._destory();
        },
        _boom: function(){
            var motion = cc.fadeTo(0.3,0);
            var callback = cc.callFunc(this._destory,this);
            this.stopAllActions();
            this.runAction(motion,callback);
        },
        _pause: function(){
            this.pause();
        },
        _resume: function(){
            this.resume();
        },
        _destory: function(){
            this.setVisible(false);
            this.removeFromParent(true);
        }
    });


    var fruitMenuEvents = cc.EventListener.create({
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

    var FruitController = cc.Layer.extend({
        _btns:null,
        _typeLength:5,
        _spacer: 224,
        _posY: 80,
        ctor: function(){
            this._super();
            var i = 0, btn;
            this._btns = [];
            for(; i<this._typeLength; i++){
                btn = new FruitMenuItem(i,this._clickFruit,this);
                btn.x = cc.winSize.width/2 + (i - (this._typeLength-1)/2)*this._spacer;
                btn.y = this._posY;
                this.addChild(btn);
                cc.eventManager.addListener(fruitMenuEvents.clone(), btn);
                this._btns.push(btn);
            }
        },
        _clickFruit: function(type){
            this.parent.parent._checkClickType(type);
        },
        _pause: function(){
            var i = 0;
            for(; i<this._typeLength; i++){
                this._btns[i]._pause();
            }
        },
        _resume: function(){
            var i = 0;
            for(; i<this._typeLength; i++){
                this._btns[i]._resume();
            }
        }
    });


    var FruitMenuItem = cc.Sprite.extend({
        _type:0,
        _callback:null,
        _target:null,
        ctor: function(type,callback,target){
            this._type = type;
            this._callback = callback;
            this._target = target;
            this._super(fruitBtns[this._type][0]);
        },
        _touchStart: function(){
            this._callback.call(this._target,this._type);
        },
        _touchOver: function(){
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(fruitBtns[this._type][1].replace('#','')));
        },
        _touchOut: function(){
            this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(fruitBtns[this._type][0].replace('#','')));
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


    var Boom = cc.Sprite.extend({
        _num:1,
        _baseText:'-{num}秒',
        _font:null,
        ctor: function(num){
            this._super(itemBoom[0]);
            this._num = num;
            this._setText();
            this._setAnimate();
        },
        _setText: function(){
            var text = this._baseText.replace('{num}',this._num);
            this._font = new cc.LabelBMFont(text,res.font);
            this._font.x = this._getWidth()/2;
            this._font.y = this._getHeight()/2-20;
            this._font.setColor(cc.color(243,70,18));
            this.addChild(this._font,2);
        },
        _setAnimate: function(){
            var i = 0, moveAnimation;
            moveAnimation = new cc.Animation();
            for(; i<itemBoom.length;i++){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(itemBoom[i].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/20);
            this._movement = cc.animate(moveAnimation).repeat(1);
            this.runAction(this._movement);
            moveAnimation.retain();

            var fontAnimation1 = cc.fadeTo(0.3,1),
                fontAnimation2 = cc.fadeOut(0.3),
                fontAnimation3 = cc.moveBy(0.6,0,120),
                callback = cc.callFunc(this._ended,this);
            fontAnimation3.easing(cc.easeOut(5));

            this._font.runAction(cc.spawn(cc.sequence(fontAnimation3,cc.delayTime(0.1),fontAnimation2,callback)));
        },
        _ended: function(){
            this.setVisible(false);
            this.removeFromParent(true);
        }
    });

    var GameLayer = cc.GameLayer.extend({
        _charactor: null,
        _frameCount:0,
        _fruitGroup:[],
        _fruitLength:15,
        _fruitTable:null,
        _fruitSpace:160,
        _fruitController:null,
        _bakeLayer: null,
        _oldType:-1,
        _combo: 0,
        ctor: function(){
            this._super();
        },
        init: function (root) {
            this._super();

            cc.spriteFrameCache.addSpriteFrames(GameLayer.res.UIFrames);
            cc.spriteFrameCache.addSpriteFrames(GameLayer.res.charactorFrames);
            cc.spriteFrameCache.addSpriteFrames(GameLayer.res.itemBoomFrames);

            this.root = root;
            this._fruitGroup = [];

            this._bakeLayer = new cc.Layer();
            this.addChild(this._bakeLayer);

            this._fruitTable = new cc.Sprite(fruitTable);
            this._fruitTable.x = cc.winSize.width/2+260;
            this._fruitTable.y = cc.winSize.height/2+70;
            this._bakeLayer.addChild(this._fruitTable,2);

            this._setBg();

            this._charactor = new Charactor();
            this._charactor.x = cc.winSize.width/2 - 328;
            this._charactor.y = cc.winSize.height/2 - 64;
            this._bakeLayer.addChild(this._charactor,2);

            this._fruitController = new FruitController();
            this._fruitController.x = 0;
            this._fruitController.y = 0;
            this._bakeLayer.addChild(this._fruitController,3);

            this._setFruits();

            this.scheduleUpdate();
        },
        _setFruits: function(){
            var i = this._fruitGroup.length,nowType,fruit;
            for(; i< this._fruitLength; i++){
                do{
                    nowType = Math.floor(Math.random()*fruits.length);
                }while(nowType == this._oldType);
                fruit = new Fruit(nowType);
                fruit.x = cc.winSize.width/2 - 72 + i*this._fruitSpace;
                fruit.y = cc.winSize.height/2 + 188;
                this._bakeLayer.addChild(fruit,3);
                this._fruitGroup.push(fruit);
                this._oldType = nowType;
            }

        },
        _resetFruits: function(){
            var i = 0;
            for(; i< this._fruitGroup.length; i++){
                this._fruitGroup[i]._destory();
            }
            this._oldType = -1;
            this._fruitGroup = [];
            this._setFruits();
        },
        _setBg: function(){
            var bg = new cc.Sprite(bgImg);
            bg.x = cc.winSize.width/2;
            bg.y = cc.winSize.height/2;
            this._bakeLayer.addChild(bg);
        },
        _runCharactorMovement: function(){
            this._charactor._movementStart();
        },
        _resize: function(size){
            var height = cc.winSize.height,
                width = cc.winSize.width;
            if(width/height>=size.width/size.height){
                width = height*size.width/size.height;
            }else{
                height = width*size.height/size.width;
            }

            this._fruitController.y = (cc.winSize.height - height)/2;

        },
        _addTime : function(){
            this.root._addTime();
        },
        _reduceTime: function(){
            this.root._addTime(-1);
        },
        _checkClickType: function(type){
            if(!this._fruitGroup.length) return;
            this.root._start();
            if(this._fruitGroup[0]._type == type){
                this._eatFruit();
            }else{
                this._boomFruit();
            }
        },
        _eatFruit: function(){
            this._runCharactorMovement();
            var fruit = this._fruitGroup.shift();
            fruit._beEat();
            this._popFruit();

            this.root._addScore(1);
        },
        _checkCombo: function(){
            this._combo++;
            if(this._combo>=10){
                this._combo = 0;
                this._addTime();
            }
        },
        _boomFruit: function(){
            var fruit = this._fruitGroup.shift();
            fruit._boom();

            var boom = new Boom(1);
            boom.x = fruit.x;
            boom.y = fruit.y;
            this._bakeLayer.addChild(boom,4);

            this._popFruit();

            this._reduceTime();
            this._combo = 0;
        },
        _popFruit: function(){
            var i = 0;
            for(; i< this._fruitGroup.length; i++){
                this._fruitGroup[i]._moveTo(cc.winSize.width/2 - 72 + i*this._fruitSpace);
            }
            this._setFruits();
        },
        _restart: function(){
            this._combo = 0;
            this._resetFruits();
            this._charactor._restart();
        },
        _pause:function(){
            this.pause();
            this._charactor._pause();
            var i = 0;
            for(; i< this._fruitGroup.length; i++){
                this._fruitGroup[i]._pause();
            }
            this._fruitController._pause();
        },
        _resume:function(){
            this.resume();
            this._charactor._resume();
            var i = 0;
            for(; i< this._fruitGroup.length; i++){
                this._fruitGroup[i]._resume();
            }
            this._fruitController._resume();
        },
        onExit: function(){
            cc.spriteFrameCache.removeSpriteFramesFromFile(GameLayer.res.UIFrames);
            cc.spriteFrameCache.removeSpriteFramesFromFile(GameLayer.res.charactorFrames);
            cc.spriteFrameCache.removeSpriteFramesFromFile(GameLayer.res.itemBoomFrames);
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
        rewardTime: 3,              //奖励时间
        totalTime: 20,              //总时间
        sufficientTime: 20,         //安全时间
        urgentTime: 5,              //危险时间
        clockTime: 5,               //使用时钟加几秒
        levels:[20,30,40,60,80],    //各星级需要多少分
        gameName:'FruitCat',        //游戏唯一标示
        helpPic:helpImg
    };
    GameLayer.menu = {
        name:'吃果果',
        pic:'#menu_fruitCat.png'
    };
    GameList[GameLayer.parameters.gameName] = GameLayer;
})();