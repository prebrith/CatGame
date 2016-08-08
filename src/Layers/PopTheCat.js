(function(){
    var gameRes = {
        UIFrames:'res/popTheCat.plist',
        UIImg:'res/popTheCat.png',
        itemBoomFrames:'res/itemBoom.plist',
        itemBoomImg:'res/itemBoom.png',
        bg:'res/popTheCatBg.jpg'
    };
    var bgImg = gameRes.bg;
    var helpImg = "#fruitCatHelp.png";
    var cPics = [
        '#enemy_1.png','#enemy_2.png','#enemy_3.png',
        '#enemy_4.png','#enemy_5.png','#enemy_6.png',
        '#enemy_7.png'
    ];
    var objs = [
        '#home_1.png','#home_2.png','#home_3.png',
        '#home_4.png','#home_5.png','#home_6.png',
        '#home_7.png','#home_8.png','#home_9.png',
        '#home_10.png','#home_11.png','#home_12.png'
    ];

    var itemBoom = [
        "#itemBoom01.png","#itemBoom02.png","#itemBoom03.png",
        "#itemBoom04.png","#itemBoom05.png","#itemBoom06.png",
        "#itemBoom07.png","#itemBoom08.png","#itemBoom09.png",
        "#itemBoom10.png","#itemBoom11.png","#itemBoom12.png",
        "#itemBoom13.png","#itemBoom14.png","#itemBoom15.png",
        "#itemBoom16.png","#itemBoom17.png"
    ];

    var windows = [
        '#window_0.png','#window_1.png','#window_2.png',
        '#window_3.png','#window_4.png','#window_5.png',
        '#window_6.png','#window_7.png'
    ];
    var windowInside = '#windowInside.png';
    var windowShadow = '#windowShadow.png';
    var wrongIcon = '#wrong.png';

    var map = [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ];

    var levels = [
        {
            type:0,
            width:2,
            height:2,
            enemy:1,
            obj:1
        },{
            type:0,
            width:2,
            height:2,
            enemy:1,
            obj:2
        },{
            type:0,
            width:2,
            height:2,
            enemy:2,
            obj:1
        },{
            type:0,
            width:2,
            height:2,
            enemy:3,
            obj:0
        },{
            type:0,
            width:4,
            height:2,
            enemy:2,
            obj:2
        },{
            type:0,
            width:4,
            height:2,
            enemy:4,
            obj:1
        },{
            type:0,
            width:4,
            height:2,
            enemy:6,
            obj:0
        },{
            type:0,
            width:4,
            height:4,
            enemy:5,
            obj:3
        },{
            type:0,
            width:4,
            height:4,
            enemy:5,
            obj:5
        },{
            type:0,
            width:4,
            height:4,
            enemy:2,
            obj:3
        },{
            type:0,
            width:6,
            height:4,
            enemy:4,
            obj:2
        },{
            type:0,
            width:6,
            height:4,
            enemy:10,
            obj:2
        },{
            type:1,
            width:2,
            height:2,
            enemy:1,
            obj:2
        },{
            type:1,
            width:2,
            height:2,
            enemy:1,
            obj:1
        },{
            type:1,
            width:4,
            height:2,
            enemy:2,
            obj:1
        },{
            type:2,
            width:2,
            height:2,
            enemy:3,
            obj:1
        },{
            type:2,
            width:2,
            height:2,
            enemy:2,
            obj:0
        },{
            type:2,
            width:4,
            height:2,
            enemy:3,
            obj:1
        },{
            type:2,
            width:4,
            height:2,
            enemy:5,
            obj:1
        },{
            type:2,
            width:4,
            height:2,
            enemy:6,
            obj:0
        },{
            type:2,
            width:4,
            height:4,
            enemy:5,
            obj:3
        },{
            type:2,
            width:4,
            height:4,
            enemy:10,
            obj:2
        },{
            type:2,
            width:4,
            height:4,
            enemy:5,
            obj:5
        },{
            type:2,
            width:4,
            height:4,
            enemy:5,
            obj:5
        },{
            type:2,
            width:4,
            height:4,
            enemy:12,
            obj:2
        },{
            type:2,
            width:4,
            height:4,
            enemy:2,
            obj:3
        },{
            type:2,
            width:6,
            height:4,
            enemy:4,
            obj:2
        },{
            type:2,
            width:6,
            height:4,
            enemy:7,
            obj:4
        },{
            type:2,
            width:6,
            height:4,
            enemy:10,
            obj:2
        },{
            type:2,
            width:6,
            height:4,
            enemy:8,
            obj:6
        },{
            type:1,
            width:4,
            height:2,
            enemy:2,
            obj:1
        },{
            type:1,
            width:4,
            height:2,
            enemy:2,
            obj:0
        },{
            type:1,
            width:4,
            height:4,
            enemy:2,
            obj:3
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:5
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:4
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:6
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:3
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:11
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:5
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:4
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:6
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:3
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:7
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:3
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:4
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:2
        },{
            type:3,
            width:6,
            height:4,
            enemy:1,
            obj:3
        },{
            type:1,
            width:4,
            height:4,
            enemy:2,
            obj:2
        },{
            type:1,
            width:4,
            height:4,
            enemy:2,
            obj:5
        },{
            type:1,
            width:4,
            height:4,
            enemy:2,
            obj:2
        },{
            type:4,
            width:2,
            height:2,
            enemy:3,
            obj:1
        },{
            type:4,
            width:2,
            height:2,
            enemy:2,
            obj:0
        },{
            type:4,
            width:4,
            height:2,
            enemy:3,
            obj:1
        },{
            type:4,
            width:4,
            height:2,
            enemy:5,
            obj:1
        },{
            type:4,
            width:4,
            height:2,
            enemy:6,
            obj:0
        },{
            type:4,
            width:4,
            height:4,
            enemy:5,
            obj:3
        },{
            type:4,
            width:4,
            height:4,
            enemy:10,
            obj:2
        },{
            type:4,
            width:4,
            height:4,
            enemy:5,
            obj:5
        },{
            type:4,
            width:4,
            height:4,
            enemy:3,
            obj:2
        },{
            type:4,
            width:4,
            height:4,
            enemy:2,
            obj:3
        },{
            type:4,
            width:6,
            height:4,
            enemy:4,
            obj:2
        }
    ];
    var repeatLevels = [
        {
            type:4,
            width:6,
            height:4,
            enemy:8,
            obj:4
        },{
            type:4,
            width:6,
            height:4,
            enemy:10,
            obj:2
        }
    ];

    var windowEvent = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function(touch,event){
            var target = event.getCurrentTarget();  // 获取事件所绑定的 target
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();

            var rect = cc.rect(0, 0, s.width, s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                target._touchStart();
            }
            return false;
        }
    });
    var Window = cc.Sprite.extend({
        _type:0,        //0为关闭，1为敌人，2为家具
        _cls:0,
        _window: null,
        _bg: null,
        _content:null,
        _movement: null,
        ctor: function(){
            this._super();
            this._bg = new cc.Sprite(windowInside);
            this._bg.x = 0;
            this._bg.y = 0;
            this.addChild(this._bg,1);

            this._window = new cc.Sprite(windows[0]);
            this._window.x = 0;
            this._window.y = 0;
            this.addChild(this._window,3);


            cc.eventManager.addListener(windowEvent.clone(), this);
        },
        _touchStart: function(){

        },
        _openEnemy: function(cls){
            this._type = 1;
            this._cls = cls;
            this._content = new cc.Sprite(cPics[this._cls]);
            this._content.x = 0;
            this._content.y = 0;
            this.addChild(this._content,2);
            this._open();
        },
        _openObj: function(cls){
            this._type = 2;
            this._cls = cls;
            this._content = new cc.Sprite(objs[this._cls]);
            this._content.x = 0;
            this._content.y = 0;
            this.addChild(this._content,2);
            this._open();
        },
        _open: function(){
            var i = 0, moveAnimation;
            moveAnimation = new cc.Animation();
            for(; i<windows.length;i++){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(windows[i].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/20);
            this._movement = cc.animate(moveAnimation).repeat(1);
            this._window.runAction(this._movement);
            moveAnimation.retain();
        },

        _close: function(){
            if(this._type){
                this._type = 0;
                this.removeChild(this._content,true);
                this._content = null;
            }

            var i = windows.length - 1, moveAnimation;
            moveAnimation = new cc.Animation();
            for(; i>=0;i--){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(windows[i].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/20);
            this._movement = cc.animate(moveAnimation).repeat(1);
            this._window.runAction(this._movement);
            moveAnimation.retain();
        }

    });

    var Tip = cc.Sprite.extend({
        ctor: function(){
            this._super(wrongIcon);
            this._animate();
        },
        _animate: function(){
            var fadeOut = cc.fadeOut(0.6),
                callback = cc.callFunc(this._end,this);
            this.runAction(cc.sequence(cc.delayTime(1),fadeOut,callback));
        },
        _end: function(){
            this.removeFromParent(true);
        }
    });

    var Boom = cc.Sprite.extend({
        ctor: function(){
            this._super(itemBoom[0]);
            this._animate();
        },
        _animate: function(){
            var i = 0, moveAnimation,animation,
                callback = cc.callFunc(this._end,this);
            moveAnimation = new cc.Animation();
            for(; i<itemBoom.length;i++){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(itemBoom[i].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/20);
            animation = cc.animate(moveAnimation).repeat(1);
            this.runAction(cc.sequence(animation,callback));
        },
        _end: function(){
            this.removeFromParent(true);
        }
    });





    var GameLayer = cc.GameLayer.extend({
        _frameCount:0,
        _fruitGroup:[],
        _bakeLayer: null,
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
        rewardTime: 1,              //奖励时间
        totalTime: 20,              //总时间
        sufficientTime: 20,         //安全时间
        urgentTime: 5,              //危险时间
        clockTime: 5,               //使用时钟加几秒
        levels:[20,30,40,60,80],    //各星级需要多少分
        gameName:'PopTheCat',        //游戏唯一标示
        helpPic:helpImg
    };
    GameLayer.menu = {
        name:'吃果果',
        pic:'#menu_fruitCat.png'
    };
    GameList[GameLayer.parameters.gameName] = GameLayer;
})();