(function(){
    var gameRes = {
        UIFrames:'res/treatTheCatUI.plist',
        UIImg:'res/treatTheCatUI.png',
        spriteFrames:'res/treatTheCatSprite.plist',
        spriteImg:'res/treatTheCatSprite.png',
        bg:'res/treatTheCatBg.jpg',
        logs:'res/TreatTheCatLogs.png',


        audio_jumpWood:'res/audio/jumpWood.m4a',
        audio_wrongLog:'res/audio/wrongLog.m4a'
    };
    var helpImg = "#treatTheCatHelp.png";

    var foods = ['#food1.png','#food2.png','#food3.png',
        '#food4.png','#food5.png','#food6.png',
        '#food7.png','#food8.png'];

    var wrongImg = '#wrong.png';

    var cPics = ['#cat_01.png','#cat_02.png','#cat_03.png',
        '#cat_04.png','#cat_05.png','#cat_06.png',
        '#cat_07.png','#cat_08.png','#cat_09.png',
        '#cat_10.png','#cat_11.png','#cat_12.png'];


    var map = [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
    ];

    var spacer = {
        x:206,
        y:208
    };

    var mapAreas;
    var getMapAreas = function(){
        var x, y, i, j, areas = [],area;
        for(i = 0; i<map.length; i++){
            area = [];
            for(j = 0; j<map[i].length; j++){
                if(map[i][j]){
                    x = cc.winSize.width/2 - ((map[i].length - 1)/2 - j)*spacer.x;
                    y = cc.winSize.height/2 + ((map.length - 1)/2 - i)*spacer.y;
                    area.push({
                        x:x,
                        y:y
                    });
                }else{
                    area.push(null);
                }
            }
            areas.push(area);
        }
        return areas;
    };

    var bgPic = gameRes.bg;
    var logBg = gameRes.logs;



    var motionDuration = 0.12;

    var Charactor = cc.Sprite.extend({
        _isMoving: false,
        _canControl: true,
        _movement: null,
        ctor:function(type) {
            this._super(cPics[0]);
            this.anchorY = 0;
        },
        _jump: function(x,y){
            this.stopAllActions();
            var i= 0, motion = new cc.Animation(), action, callback, openControl;
            this._isMoving = true;
            this._canControl = false;
            for(; i<cPics.length; i++){
                motion.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPics[i].replace('#','')));
            }
            motion.setDelayPerUnit(1/60);
            this._movement = cc.animate(motion).repeat(1);
            action = cc.moveTo(motionDuration,cc.p(x,y));
            callback = cc.callFunc(this._checkPos,this);
            openControl = cc.callFunc(this._openControl,this);
            this.runAction(cc.spawn(cc.sequence(cc.delayTime(motionDuration*0.6),openControl),cc.sequence(action,callback),this._movement));
            motion.retain();
        },
        _openControl: function(){
            this._canControl = true;
        },
        _checkPos: function(){
            playEffect(GameLayer.res.audio_jumpWood);
            this._isMoving = false;
            this.parent.parent._checkPos();
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


    var jumpEvents = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function(touch,event){
            var target = event.getCurrentTarget();  // 获取事件所绑定的 target
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var i = 0;
            for(; i<target._btns.length; i++){
                var rect = cc.rect(target._btns[i].x, target._btns[i].y, target._btns[i].width, target._btns[i].height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    target._touchStart(i);
                    break;
                }
            }
            return false;
        }
    });


    var LogControl = cc.Layer.extend({
        _bg:null,
        _btns:[],
        _callback: null,
        _target:null,
        ctor: function(callback,target){
            this._super();
            this._callback = callback;
            this._target = target;
            this._bg = new cc.Sprite(logBg);
            this._bg.x = cc.winSize.width/2;
            this._bg.y = cc.winSize.height/2;
            this.addChild(this._bg);

            this._addBtns();
        },
        _addBtns: function(){
            var btnWidth = Math.floor(spacer.x/4)* 3,
                btnHeight = Math.floor(spacer.y/4)* 3,
                btn = null, i,j;
            for(i = 0; i<mapAreas.length; i++){
                for(j = 0; j<mapAreas[i].length; j++){
                    if(mapAreas[i][j]){
                        btn = {
                            pos:[i,j],
                            x:mapAreas[i][j].x - btnWidth/2,
                            y:mapAreas[i][j].y - btnHeight/2,
                            width:btnWidth,
                            height:btnHeight
                        };
                        this._btns.push(btn);
                    }
                }
            }
            cc.eventManager.addListener(jumpEvents, this);

        },
        _touchStart: function(num){
            if(this.disabled) return;
            this._callback.call(this._target,this._btns[num].pos[0],this._btns[num].pos[1]);
        },
        _pause: function(){
            this.disabled = true;
        },
        _resume: function(){
            this.disabled = false;
        }
    });

    var Wrong = cc.Sprite.extend({
        ctor: function(){
            this._super(wrongImg);
            this._setAnimate();
        },
        _setAnimate: function(){
            var fadeOut = cc.fadeOut(0.6),
                callback = cc.callFunc(this._destory,this);

            this.runAction(cc.sequence(fadeOut,callback));

        },
        _destory: function(){
            this.removeFromParent(true);
        }
    });

    var Food = cc.Sprite.extend({
        _type:0,
        _pos:[0,0],
        ctor: function(type,pos){
            this._type = type;
            this._pos = pos;
            this._super(foods[this._type]);
        },
        _eqPos: function(pos){
            return this._pos[0] == pos[0] && this._pos[1] == pos[1]
        }
    });


    var GameLayer = cc.GameLayer.extend({
        _charactor: null,
        _frameCount:0,
        _bakeLayer: null,

        _logControl:null,

        _charactorPos:[0,0],

        _foods:[],
        _foodLength:3,

        _eatFoods:0,
        _foodLevel:0,

        _clickStore:null,

        ctor: function(){
            this._super();
        },
        init: function (root) {
            this._super();
            cc.spriteFrameCache.addSpriteFrames(GameLayer.res.spriteFrames);
            cc.spriteFrameCache.addSpriteFrames(GameLayer.res.UIFrames);

            mapAreas = getMapAreas();

            this.root = root;

            this._bakeLayer = new cc.Layer();
            this.addChild(this._bakeLayer);

            this._setBg();

            this._setControl();

            this.scheduleUpdate();

            this._start();

        },
        _start: function(){
            this._clickStore = null;
            this._charactorPos = [0,0];

            this._foods = [];
            this._eatFoods = 0;
            this._foodLevel = 0;

            this._charactor.x = mapAreas[this._charactorPos[0]][this._charactorPos[1]].x;
            this._charactor.y = mapAreas[this._charactorPos[0]][this._charactorPos[1]].y-30;

            this._setFoods();
        },
        _setBg: function(){
            var bg = new cc.Sprite(bgPic);
            bg.x = cc.winSize.width/2;
            bg.y = cc.winSize.height/2;
            this._bakeLayer.addChild(bg);
        },
        _setControl: function(){
            this._logControl = new LogControl(this._jumpControl,this);
            this._logControl.x = 0;
            this._logControl.y = -40;
            this._bakeLayer.addChild(this._logControl,2);

            this._charactor = new Charactor();
            this._charactor.x = mapAreas[this._charactorPos[0]][this._charactorPos[1]].x;
            this._charactor.y = mapAreas[this._charactorPos[0]][this._charactorPos[1]].y-30;
            this._bakeLayer.addChild(this._charactor,5);
        },
        _setFoods: function(){
            var k = 0, i, j, testRepeat = {}, food;
            testRepeat[this._charactorPos[0]+'_'+this._charactorPos[1]] = true;
            for(; k<this._foodLength; k++){
                do{
                    i = Math.floor(Math.random() * map.length);
                    j = Math.floor(Math.random() * map[i].length);
                }while(testRepeat[i+'_'+j]);
                testRepeat[i+'_'+j] = true;
                food = new Food(this._foodLevel,[i,j]);
                food.x = mapAreas[i][j].x;
                food.y = mapAreas[i][j].y+20;
                this._bakeLayer.addChild(food,3);
                this._foods.push(food);
            }
        },
        _jumpControl: function(i,j){
            this.root._start();
            if(!this._clickStore && !this._charactor._isMoving){
                this._jump(i,j);
            }else if(this._charactor._canControl){
                this._clickStore = [i,j];
            }
        },
        _jump: function(i,j){
            var posX = mapAreas[i][j].x,
                posY = mapAreas[i][j].y-30,
                moveX = i - this._charactorPos[0],
                moveY = j - this._charactorPos[1];
            if(Math.abs(moveX)<2 && Math.abs(moveY)<2){
                this._charactorPos = [i,j];
                this._charactor._jump(posX,posY);
            }else{
                var wrong = new Wrong();
                wrong.x = posX;
                wrong.y = posY-20;
                this._bakeLayer.addChild(wrong,4);
                playEffect(GameLayer.res.audio_wrongLog);
            }

        },
        _checkPos: function(){
            var i = 0,flag = false;
            for(; i<this._foods.length; i++){
                if(this._foods[i]._eqPos(this._charactorPos)){
                    flag = true;
                    this._foods[i].removeFromParent(true);
                    this._foods.splice(i,1);
                    break;
                }
            }
            if(flag){
                this._eatFoods++;
                this.root._addScore(1);
                if(this._eatFoods >= this._foodLength){
                    this._finishLevel();
                }
            }

            this._checkClickStore();
        },
        _finishLevel: function(){
            this._eatFoods = 0;
            this._foodLevel++;
            if(this._foodLevel>=foods.length){
                this._foodLevel = 0;
            }
            this.root._addTime();
            this._setFoods();
        },
        _checkClickStore: function(){
            if(this._clickStore){
                this._jump(this._clickStore[0],this._clickStore[1]);
                this._clickStore = null;
            }
        },
        _restart: function(){
            var i = 0;
            for(; i < this._foods.length; i++){
                this._foods[i].removeFromParent(true);
            }

            this._charactor._restart();
            this._start();
        },
        _pause:function(){
            var i = 0;
            this.pause();
            this._charactor._pause();
            this._logControl._pause();
        },
        _resume:function(){
            var i = 0;
            this.resume();
            this._charactor._resume();
            this._logControl._resume();
        },
        onExit: function(){
            cc.spriteFrameCache.removeSpriteFramesFromFile(GameLayer.res.spriteFrames);
            cc.spriteFrameCache.removeSpriteFramesFromFile(GameLayer.res.UIFrames);
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
        levels:[20,40,60,100,150],    //各星级需要多少分
        gameName:'TreatTheCat',         //游戏唯一标示
        helpPic:helpImg
    };
    GameLayer.menu = {
        name:'小饞貓',
        pic:'#menu_treatTheCat.png'
    };
    GameList[GameLayer.parameters.gameName] = GameLayer;
})();