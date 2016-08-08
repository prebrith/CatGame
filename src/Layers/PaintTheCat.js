(function(){
    var gameRes = {
        spriteFrames:'res/paintTheCat.plist',
        spriteImg:'res/paintTheCat.png',
        bg:'res/paintTheCatBg.jpg',
        audio_splat_1:'res/audio/splat_1.m4a',
        audio_splat_2:'res/audio/splat_2.m4a'
    };
    var bgImg = gameRes.bg;
    var helpImg = "#paintTheCatHelp.png";
    var cPics1 = ["#cat1_1.png","#cat1_2.png","#cat1_3.png",
            "#cat1_4.png","#cat1_5.png","#cat1_6.png",
            "#cat1_7.png","#cat1_8.png","#cat1_9.png",
            "#cat1_10.png","#cat1_11.png","#cat1_12.png"],
        cPics2 = ["#cat2_1.png","#cat2_2.png","#cat2_3.png",
            "#cat2_4.png","#cat2_5.png","#cat2_6.png",
            "#cat2_7.png","#cat2_8.png","#cat2_9.png",
            "#cat2_10.png","#cat2_11.png","#cat2_12.png"],
        cPics3 = ["#cat3_1.png","#cat3_2.png","#cat3_3.png",
            "#cat3_4.png","#cat3_5.png","#cat3_6.png",
            "#cat3_7.png","#cat3_8.png","#cat3_9.png",
            "#cat3_10.png","#cat3_11.png","#cat3_12.png"],
        cPics4 = ["#cat4_1.png","#cat4_2.png","#cat4_3.png",
            "#cat4_4.png","#cat4_5.png","#cat4_6.png",
            "#cat4_7.png","#cat4_8.png","#cat4_9.png",
            "#cat4_10.png","#cat4_11.png","#cat4_12.png"],
        cPicsGroup = [cPics1,cPics2,cPics3,cPics4];
    var paints = ["#paint_1.png","#paint_2.png","#paint_3.png","#paint_4.png"];

    var gameMaps = [
        [
            [1,1,1,1,1,1,1,1]   //0
        ],
        [
            [1,1],              //1
            [1,1]
        ],
        [
            [1,1,1],            //2
            [1,1,1]
        ],
        [
            [1,1,1,1],          //3
            [1,1,1,1]
        ],
        [
            [1,1,1,1,1],        //4
            [1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1],      //5
            [1,1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1,1],    //6
            [1,1,1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1,1,1],  //7
            [1,1,1,1,1,1,1,1]
        ],
        [
            [1,1,1],            //8
            [1,1,1],
            [1,1,1]
        ],
        [
            [1,1,1,1,1],        //9
            [1,1,1,1,1],
            [1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1],      //10
            [1,1,1,1,1,1],
            [1,1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1,1],    //11
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1,1,1],  //12
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ],
        [
            [1,1],              //13
            [1,1],
            [1,1],
            [1,1]
        ],
        [
            [1,1,1,1],          //14
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1]
        ],
        [
            [1,1,1,1,1],        //15
            [1,1,1,1,1],
            [1,1,1,1,1],
            [1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1],      //16
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1,1],    //17
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1]
        ],
        [
            [1,1,1,1,1,1,1,1],  //18
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ]
    ];
    var gameLevels = [1,2,3,13,0,3,13,8,0,4,11,5,6,9,13,14,7,10,2,3,13,0,3,15,14,11,12,16,14,17,2,3,13];
    var repeatLevels = [18];

    var charactorSize = {
        width:138,
        height:120
    };



    var charactorEvents = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //swallowTouches: true,
        onTouchBegan: function(touch,event){
            var target = event.getCurrentTarget();  // 获取事件所绑定的 target
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s1 = target.getContentSize();
            var s2 = {
                width:charactorSize.width/target.scale,
                height:charactorSize.height/target.scale
            };

            var rect = cc.rect((s1.width - s2.width)/2, (s1.height - s2.height)/2, s2.width, s2.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                target._clickHandler();
            }
            return true;
            //return false
        }
    });

    var Charactor = cc.Sprite.extend({
        _type:0,
        _isMoving:false,
        _movement:null,
        _group:-1,
        ctor:function(type) {
            this._super(cPicsGroup[type][0]);
            this._type = type;
            //this._setColor();
        },
        _movementStart: function(){
            this.stopAction(this._movement);
            var i = 0, moveAnimation;
            moveAnimation = new cc.Animation();
            for(; i<cPicsGroup[this._type].length;i++){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPicsGroup[this._type][i].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/25);
            this._movement = cc.animate(moveAnimation).repeat(1);
            this.runAction(this._movement);
            moveAnimation.retain();
        },
        _clickHandler: function(){
            this._group = this._group?0:1;
            this._type = this.parent.parent._changeColor(this._group,this.x,this.y);
            if(this._type !== false){
                this.stopAction(this._movement);
                var moveAnimation = new cc.Animation();
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cPicsGroup[this._type][0].replace('#','')));
                moveAnimation.setDelayPerUnit(1/25);
                this._movement = cc.animate(moveAnimation).repeat(1);
                this.runAction(this._movement);
                moveAnimation.retain();

            }
        },
        onEnter: function(){
            this._super();
            this._enterAnimate();
        },
        _enterAnimate: function(){
            this.scale = 0;
            var enterAnimation = cc.scaleTo(0.3,1);
            enterAnimation.easing(cc.easeBackOut(5));
            this.runAction(enterAnimation);
        },
        _pause:function(){
            this.pause();
            this.disabled = true;
        },
        _resume:function(){
            this.resume();
            this.disabled = false;
        }
    });

    var Paint = cc.Sprite.extend({
        _type:0,
        ctor:function(type) {
            this._type = type;
            this._super(paints[this._type]);
            this.rotation = Math.floor(Math.random()*360);
            playEffect([GameLayer.res.audio_splat_1,GameLayer.res.audio_splat_2]);
        },
        onEnter: function(){
            this._super();
            this._setAnimate();
        },
        _setAnimate: function(){
            var scaleAnimation = cc.scaleTo(0.2,1),
                fadeOutAnimation = cc.fadeOut(0.5),
                callback = cc.callFunc(this._ended,this);
            this.scale = 0;
            scaleAnimation.easing(cc.easeOut(5));
            this.runAction(cc.sequence(cc.spawn(scaleAnimation,fadeOutAnimation),callback));
        },
        _ended: function(){
            this.setVisible(false);
            this.removeFromParent(true);
        }

    });



    var GameLayer = cc.GameLayer.extend({
        _level:0,
        _groupLength0:0,
        _groupLength1:0,
        _groupScore0:0,
        _groupScore1:0,
        _offsetY:-40,
        _frameCount:0,
        _charactorGroup:[],
        _types:[0,0],
        _bakeLayer: null,
        _map:null,
        ctor: function(){
            this._super();
        },
        init: function (root) {
            this._super();


            cc.spriteFrameCache.addSpriteFrames(GameLayer.res.spriteFrames);

            this.root = root;
            this._level = 0;

            this._bakeLayer = new cc.Layer();
            this._bakeLayer.y = this._offsetY;
            this.addChild(this._bakeLayer);

            this._setBg();

            this._setLevel();
            this.scheduleUpdate();
        },
        _setBg: function(){
            var bg = new cc.Sprite(bgImg);
            bg.x = cc.winSize.width/2;
            bg.y = cc.winSize.height/2;
            this._bakeLayer.addChild(bg);
        },
        _setLevel: function(){
            var repeat = false,levelNum = (this._level >= gameLevels.length)?
            (repeat = true) &&
            (this._level-gameLevels.length)%repeatLevels.length:this._level;
            this._map = repeat?gameMaps[repeatLevels[levelNum]]:gameMaps[gameLevels[levelNum]];
            this._setMap();
        },
        _setMap: function(){
            var k = this._map.length,
                l = 0,
                i= 0,
                j= 0,
                x= 0, y= 0,
                charactor = null,
                group = 0,
                totalLength = 0,
                groupLength0 = this._groupLength0 = 0,
                groupLength1 = this._groupLength1 = 0;

            this._charactorGroup = [];
            this._types[0] = Math.floor(Math.random()*cPicsGroup.length);
            do{
                this._types[1] = Math.floor(Math.random()*cPicsGroup.length);
            }while(this._types[1] == this._types[0]);

            for(i=0; i<k; i++){
                totalLength += this._map[i].length;
            }
            groupLength0 = this._groupLength0 = Math.floor((Math.random()+0.5)*totalLength/2);
            groupLength1 = this._groupLength1 = totalLength - groupLength0;

            for(i=0; i< k; i++){
                l = this._map[i].length;
                y = cc.winSize.height/2 + (i - k/2 + 0.5)*charactorSize.height;
                for(j=0;j<l; j++){
                    x = cc.winSize.width/2 + (j - l/2 + 0.5)*charactorSize.width;
                    if(this._map[i][j]>0){
                        group = Math.random()>groupLength0/(groupLength0+groupLength1)?(groupLength1--||true) && 1:(groupLength0--||true) && 0;
                        charactor = new Charactor(this._types[group]);
                        charactor._group = group;
                        charactor.x = x;
                        charactor.y = y;
                        cc.eventManager.addListener(charactorEvents.clone(), charactor);
                        this._bakeLayer.addChild(charactor,1);
                        this._charactorGroup.push(charactor);
                    }
                }
            }
            //this._bakeLayer.bake();

        },
        _runCharactorMovement: function(){
            var movementNum = Math.floor(Math.random()*this._charactorGroup.length);
            this._charactorGroup[movementNum]._movementStart();
        },
        _changeColor: function(group, x, y){
            this.root._start();
            if(group == 1){
                this._groupLength0--;
                this._groupLength1++;
                this._groupScore0--;
                this._groupScore1++;
            }else{
                this._groupLength0++;
                this._groupLength1--;
                this._groupScore1--;
                this._groupScore0++;
            }
            var type = this._types[group],paint = null;

            if(!this._groupLength0 || !this._groupLength1){
                this._finishLevel(false);
                return false;
            }else{
                paint = new Paint(type);
                paint.x = x;
                paint.y = y;
                this._bakeLayer.addChild(paint,2);
                return type;
            }
        },
        _finishLevel: function(isOver){
            var i = 0,reward = null;
            isOver = isOver || false;
            for(;i<this._charactorGroup.length;i++){
                cc.eventManager.removeListener(this._charactorGroup[i]);
                this._charactorGroup[i].setVisible(false);
                this._charactorGroup[i].removeFromParent(true);
            }
            if(!isOver){
                this.root._addTime();
                this.root._addScore(this._getNowScore());

                this._level++;
            }else{
                this._level = 0;
            }
            this._setLevel();
        },
        _gameOver: function(){
            this.root._addScore(this._getNowScore());
        },
        _restart: function(){
            this._finishLevel(true);
        },
        _getNowScore: function(){
            var score =  -Math.min(this._groupScore0,this._groupScore1);
            this._groupScore0 = 0;
            this._groupScore1 = 0;
            return score;
        },
        _pause:function(){
            var i = 0;
            for(;i<this._charactorGroup.length;i++){
                this._charactorGroup[i]._pause();
            }
            this.pause();
        },
        _resume:function(){
            var i = 0;
            for(;i<this._charactorGroup.length;i++){
                this._charactorGroup[i]._resume();
            }
            this.resume();
        },
        onExit: function(){
            cc.spriteFrameCache.removeSpriteFramesFromFile(GameLayer.res.spriteFrames);
        },
        update: function(){
            this._frameCount++;
            if(this._frameCount%40==0){
                this._frameCount = 0;
                //if(Math.floor(Math.random()*100)%2 == 0){
                this._runCharactorMovement();
                //}

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
        levels:[50,80,120,150,200], //各星级需要多少分
        gameName:'PaintTheCat',     //游戏唯一标示
        helpPic:helpImg
    };
    GameLayer.menu = {
        name:'畫貓貓',
        pic:'#menu_paintTheCat.png'
    };
    GameList[GameLayer.parameters.gameName] = GameLayer;
})();