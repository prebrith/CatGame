(function(){
    var starsIcon = ['#star01.png','#star02.png','#star03.png',
        '#star04.png','#star05.png','#star06.png',
        '#star07.png','#star08.png','#star09.png','#star10.png'];
    var bg = res.endBg;
    var scoreBox = '#scoreBox.png';
    var backBtn = ['#backBtn.png','#backBtnOn.png','#backBtnDisabled.png'];
    var replayBtn = ['#replayBtn.png','#replayBtnOn.png','#replayBtnDisabled.png'];
    var shareBtn = ['#shareBtnBg.png','#shareBtnBgOn.png','#shareBtnBgDisabled.png'];

    var Result = window.Result = cc.Scene.extend({
        _totalScore:0,
        _percent:'',
        _levels:null,
        _screenLayer: null,
        _controlLayer:null,
        _resultLayer:null,
        _isInit: false,
        ctor:function(score,percent,levels){
            this._super();
            this._totalScore = score;
            this._percent = percent;
            this._levels = levels;

            this._screenLayer = new cc.Layer();
            this.addChild(this._screenLayer);


            this._resultLayer = new ResultLayer(this._totalScore,this._percent,this._levels);
            this._screenLayer.addChild(this._resultLayer);
            this._resultLayer._init();

            this._controlLayer = new ControlLayer();
            this._screenLayer.addChild(this._controlLayer,2);

        },
        onEnter: function(){
            this._isInit = true;

            if(typeof rotateHandler === 'function') {
                rotateHandler();
            }
            this._super();
        },
        _resize: function(deg,rate,size){
            if(!this._isInit) return;
            this._screenLayer.rotation = deg;
            this._screenLayer.scale = rate;

            this._controlLayer._resize(size);
        }
    });

    var ControlLayer = cc.Layer.extend({
        _backBtn: null,
        _replayBtn: null,
        _shareBtn: null,
        _btnField: null,
        ctor: function(){
            this._super();
            this._backBtn = new cc.MenuItemImage(backBtn[0],backBtn[1],backBtn[2],this._backFn,this);
            this._backBtn.anchorX = 0;
            this._backBtn.anchorY = 0;
            this._backBtn.x = 60;
            this._backBtn.y = 30;

            this._replayBtn = new cc.MenuItemImage(replayBtn[0],replayBtn[1],replayBtn[2],this._replayFn,this);
            this._replayBtn.anchorX = 1;
            this._replayBtn.anchorY = 0;
            this._replayBtn.x = cc.winSize.width - 60;
            this._replayBtn.y = 30;

            this._shareBtn = new cc.MenuBtnLabel(shareBtn[0],shareBtn[1],shareBtn[2],"分享好友",res.font,{},this._shareFn,this);
            this._shareBtn.anchorY = 0;
            this._shareBtn.x = cc.winSize.width/2;
            this._shareBtn.y = 30;

            this._btnField = new cc.Menu(this._backBtn,this._replayBtn,this._shareBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;
            this.addChild(this._btnField);
        },
        _resize: function(size){
            var height = cc.winSize.height,
                width = cc.winSize.width;
            if(width/height>=size.width/size.height){
                width = height*size.width/size.height;
            }else{
                height = width*size.height/size.width;
            }
            this._backBtn.x = (cc.winSize.width - width)/2 + 60;
            this._backBtn.y = (cc.winSize.height - height)/2 + 30;
            this._replayBtn.x = (cc.winSize.width + width)/2 - 60;
            this._replayBtn.y = (cc.winSize.height - height)/2 + 30;
            this._shareBtn.y = (cc.winSize.height - height)/2 + 30;
        },
        _backFn: function(){
            runStart(true);
        },
        _replayFn: function(){
            returnGame();
        },
        _shareFn: function(){
            gotoLink('shareURL',GameList[runningGame].menu.name,this.parent.parent._totalScore,this.parent.parent._percent,'../#gameName='+runningGame);
        }

    });

    var ResultLayer = cc.Layer.extend({
        _bg:null,
        _title: null,
        _scoreLabel: null,
        _totalScore: 0,
        _score:0,
        _percent:'',
        _starField: null,
        _stars:0,
        _info:null,
        _levels:null,
        _counterSound:null,
        ctor: function(score,percent,levels){
            this._super();
            this._totalScore = score;
            this._percent = percent;
            this._levels = levels;



            this._bg = new cc.Sprite(bg);
            this._bg.x = cc.winSize.width/2;
            this._bg.y = cc.winSize.height/2;
            this.addChild(this._bg);

            //this._title = new cc.LabelTTF("游戏结束，本次得分：","arial",20);
            this._title = new cc.LabelBMFont("遊戲結束，本次得分：",res.font);
            this._title.x = cc.winSize.width/2;
            this._title.y = cc.winSize.height/2 + 260;
            this.addChild(this._title);

            this._scoreLabel = new cc.LabelBMFont(this._score + '',res.scoreFont);
            this._scoreLabel.x = cc.winSize.width/2;
            this._scoreLabel.y = cc.winSize.height/2 + 140;
            this.addChild(this._scoreLabel);

            this._starField = new StarField(this._totalScore,this._levels);
            this._starField.x = 0;
            this._starField.y = 0;
            this.addChild(this._starField);

            this._info = new cc.LabelBMFont("妳超過了"+this._percent+"的玩家",res.font);
            this._info.scale = 0;
            this._info.x = cc.winSize.width/2;
            this._info.y = cc.winSize.height/2 - 90;
            this.addChild(this._info);

        },
        _init: function(){
            this.scheduleUpdate();
            this._counterSound = playEffect(res.audio_counter,true);
        },
        update: function(){
            if(this._score<this._totalScore){
                this._score+=Math.ceil((this._totalScore-this._score)/50);
                this._scoreLabel.setString(this._score + '');
            }else{
                this.unscheduleUpdate();
                this._active();
            }

        },
        _active: function(){
            stopEffect(this._counterSound);
            playEffect(res.audio_counterLast);
            var motion1 = cc.scaleTo(0.2,1.4);
            motion1.easing(cc.easeIn(5));
            var motion2 = cc.scaleTo(0.4,1);
            motion2.easing(cc.easeOut(5));
            var callback = cc.callFunc(this._showStars,this);
            this._scoreLabel.runAction(cc.sequence(motion1,motion2,callback));
        },
        _showStars: function(){
            this._stars = this._starField._showStars();
            var delay = this._stars*0.3;
            var motion = cc.scaleTo(0.6,1);
            motion.easing(cc.easeBackOut(10));
            var callback = cc.callFunc(this._playClaps,this);
            this._info.runAction(cc.sequence(cc.delayTime(delay),callback,motion));
        },
        _playClaps: function(){
            if(this._stars>=0){
                playEffect(([res.audio_claps1,res.audio_claps2,res.audio_claps3,res.audio_claps4,res.audio_claps5])[this._stars]);
            }
        }

    });

    var StarField = cc.Layer.extend({
        _stars:null,
        _totalScore: 0,
        _levels:null,
        ctor: function(score,levels){
            this._super();
            this._stars = [];
            this._totalScore = score;
            this._levels = levels;
            this._addStars();
        },
        _addStars: function(){
            var i = 0,star,length = this._levels.length;
            for(; i<length; i++){
                star = new Star(this._levels[i]);
                star.x = cc.winSize.width/2 + (i - (length-1)/2)*80;
                star.y = cc.winSize.height/2 + 40;
                this.addChild(star);
                this._stars.push(star);
            }
        },
        _showStars: function(){
            var k = 0,score = this._totalScore,delay;
            while(score>=this._levels[k] && k<this._levels.length){
                delay = k*0.3;
                this._stars[k]._active(delay);
                k++;
            }
            return k-1;
        }
    });

    var Star = cc.Sprite.extend({
        _star:null,
        _score:0,
        _scoreField:null,
        _scoreBg:null,
        ctor: function(score){
            this._super();
            this._score = score;

            this._star = new cc.Sprite(starsIcon[0]);
            this._star.x = 0;
            this._star.y = 0;
            this.addChild(this._star);

            this._scoreField = new cc.LabelBMFont(this._score,res.font);
            this._scoreField.scale = 0.6;//problem
            this._scoreField.x = 0;
            this._scoreField.y = -50;

            this._scoreBg = new cc.Sprite(scoreBox);
            this._scoreBg.x = 0;
            this._scoreBg.y = -50;



            this.addChild(this._scoreBg);
            this.addChild(this._scoreField);
        },
        _active: function(delay){
            var animation = new cc.Animation(),i=0;
            for(; i<starsIcon.length;i++){
                animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(starsIcon[i].replace('#','')));
            }
            animation.setDelayPerUnit(1/15);
            var sound = cc.callFunc(this._sound,this);
            var action = cc.sequence(cc.delayTime(delay),sound,cc.animate(animation).repeat(1));
            this._star.runAction(action);
        },
        _sound: function(){
            playEffect(res.audio_starGain);
        }
    });

})();