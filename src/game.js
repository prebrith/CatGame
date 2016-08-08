(function(){
    var parameters = {
        rewardTime: 1,              //奖励时间
        totalTime: 20,              //总时间
        sufficientTime: 20,         //安全时间
        urgentTime: 5,              //危险时间
        clockTime: 5,               //使用时钟加几秒
        levels:[0,0,0,0,0],         //各星级需要多少分
        gameName:'',                //游戏唯一标示
        helpPic:''
    };

    var GameScene = window.GameScene = cc.Scene.extend({
        _isStart: false,
        _screenLayer: null,
        _Game:null,
        _gameLayer:null,
        _UILayer:null,
        _isInit: false,
        _kg:null,
        _totalScore:0,
        ctor: function(game){
            this._super();
            this._Game = game;
            this._setParameters(game.parameters);

            this._screenLayer = new cc.Layer();
            this.addChild(this._screenLayer);

            this._gameLayer = new this._Game();
            this._gameLayer.init(this);
            this._screenLayer.addChild(this._gameLayer);

            this._kg = new KeyG();


            this._UILayer = new GameUI();
            this._UILayer.init(this);
            this._screenLayer.addChild(this._UILayer,2);

        },
        onEnter: function(){
            this._super();

            this._restart();

            this._isInit = true;

            if(typeof rotateHandler === 'function') {
                rotateHandler();
            }
        },
        _setParameters: function(pts){
            var i;
            pts = pts || {};
            for(i in pts){
                parameters[i] = pts[i];
            }
        },
        _resize: function(deg,rate,size){
            if(!this._isInit) return;
            this._screenLayer.rotation = deg;
            this._screenLayer.scale = rate;

            this._UILayer._resize(size);
            this._gameLayer._resize(size);
        },
        _start: function(){
            if(this._isStart) return;
            this._isStart = true;
            setServerStart(parameters.gameName);
        },
        _addTime: function(num){
            num = num || parameters.rewardTime;
            if(num>0){
                var reward = new Reward(num);
                reward.x = cc.winSize.width/2;
                reward.y = cc.winSize.height - 80;
                this._screenLayer.addChild(reward);
            }
            this._UILayer._addTime += num*1000;
        },
        _addScore: function(num){
            this._totalScore += num;
            this._kg.addNum(num);
        },
        _gameOver: function(time){
            this._gameLayer._gameOver();
            this._UILayer._loadingFn();
            gameOver(parameters.gameName,this._kg.getResult(),time,this._gameOverCB,this);
        },
        _gameOverCB: function(percent){
            percent = percent || false;
            this._UILayer._loadingOkFn();
            if(percent){
                renewScore(parameters.gameName,this._totalScore);
                this._showResult(percent);
            }else{
                this._UILayer._showLoadingFail();
            }
        },
        _restart: function(){
            this._isStart = false;
            this._totalScore = 0;
            this._kg = new KeyG();
            this._UILayer._restart();
            this._gameLayer._restart();
        },
        _showResult: function(percent){
            var result = new Result(this._totalScore,percent,parameters.levels.concat());
            cc.director.runScene(result);
        },
        _pause: function(){
            this._gameLayer._pause();
        },
        _resume: function(){
            this._gameLayer._resume();
        }
    });
    var timeBar = "#timeBar.png";
    var pauseBtn = ["#pauseBtn.png","#pauseBtnOn.png","#pauseBtnDisabled.png"];
    var helpBtn = ["#helpBtn.png","#helpBtnOn.png","#helpBtnDisabled.png"];
    var closeBtn = ["#closeBtn.png","#closeBtnOn.png","#closeBtnDisabled.png"];
    var otherBtns = ["#UIBtn1.png","#UIBtn2.png","#UIBtn3.png","#UIBtn4.png","#UIBtn5.png"];
    var clockBtn = ["#useClockBtnBg.png","#useClockBtnBgOn.png","#useClockBtnBgDisabled.png"];
    var loadingIcons = ["#loading1.png","#loading2.png","#loading3.png"];
    var boom = ["#boom1.png","#boom2.png","#boom3.png",
        "#boom4.png","#boom5.png","#boom6.png",
        "#boom7.png","#boom8.png","#boom9.png",
        "#boom10.png","#boom11.png","#boom12.png",
        "#boom13.png","#boom14.png","#boom15.png",
        "#boom16.png","#boom17.png"];


    var CountDown = cc.Sprite.extend({
        _time:0,
        _font:null,
        _sufficientTime:0,
        _urgentTime:0,
        _state:0,
        ctor:function(time){
            this._super(timeBar);
            this.anchorX = 0;
            this.anchorY = 1;
            this._time = time;
            this._setText();
        },
        _setText: function(){
            var text = this._getTime();
            this._font = new cc.LabelBMFont(text,res.font);
            this._font.x = this._getWidth()/2+22;
            this._font.y = this._getHeight()/2;
            this.addChild(this._font);
        },
        _setTime: function(time){
            this._time = time;
            this._font.setString(this._getTime(this._time));
            this._checkTimeState();
        },
        _checkTimeState: function(){
            if(this._time>parameters.sufficientTime*1000){
                this._showSufficientTime();
            }else if(this._time<parameters.urgentTime*1000){
                this._showUrgentTime();
            }else{
                this._showNormalTime();
            }
        },
        _showSufficientTime: function(){
            if(this._state === 1) return;
            this._showNormalTime();
            this._state = 1;
            this._font.color = cc.color(0,255,50);
        },
        _showUrgentTime: function(){
            if(this._state === 2) return;
            this._showNormalTime();
            this._state = 2;
            var action1 = cc.tintTo(0.3, 255,0,0),
                action2 = cc.tintTo(0.3, 255,255,255),
                action = cc.sequence(action1,action2).repeatForever();
            this._font.runAction(action);
        },
        _showNormalTime: function(){
            if(this._state === 0) return;
            this._state = 0;
            this._font.stopAllActions();
            this._font.color = cc.color(255,255,255);
        },
        _getTime: function(){
            var time,l1,l2;
            time = Math.floor(this._time/10) + '';
            while(time.length<4){
                time = '0'+time;
            }
            l1 = time.substring(0,time.length-2);
            l2 = time.substring(time.length-2);
            time = l1+'.'+l2;
            return time;
        },
        _pause: function(){
            this._font.pause();
        },
        _resume: function(){
            this._font.resume();
        }
    });


    var Reward = cc.Sprite.extend({
        _num:1,
        _baseText:'+{num}秒',
        _font:null,
        ctor:function(num){
            this._super(boom[0]);
            this._num = num;
            this._setText();
            this._setAnimate();
        },
        _setText: function(){
            var text = this._baseText.replace('{num}',this._num);
            this._font = new cc.LabelBMFont(text,res.font);
            this._font.x = this._getWidth()/2;
            this._font.y = this._getHeight()/2;
            this.addChild(this._font);
        },
        _setAnimate: function(){
            playEffect(res.audio_timePick);
            var i = 0, moveAnimation;
            moveAnimation = new cc.Animation();
            for(; i<boom.length;i++){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(boom[i].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/20);
            this._movement = cc.animate(moveAnimation).repeat(1);
            this.runAction(this._movement);
            moveAnimation.retain();

            this._font.scale = 0;
            var fontAnimation = cc.scaleTo(1,1),//problem
                fadeOutAnimation = cc.fadeOut(0.6),
                callback = cc.callFunc(this._ended,this);
            fontAnimation.easing(cc.easeBackOut(5));
            this._font.runAction(cc.sequence(fontAnimation,fadeOutAnimation,callback));
        },
        _ended: function(){
            this.setVisible(false);
            this.removeFromParent(true);
        }
    });

    var GameUI = cc.Layer.extend({
        root:null,
        _isStart: false,
        _isPause: false,
        _isLoading: false,
        _clockUsed: false,
        _startTime:0,
        _pauseStartTime:0,
        _pauseTime:0,
        _addTime:0,
        _totalTime:0,
        _countDown:null,
        _pauseBtn:null,
        _helpBtn:null,
        _btnField:null,
        _pauseUI:null,
        _gameAboutOverUI:null,
        _loadingUI:null,
        _loadingFail:null,
        _helpUI:null,
        _countDownUI:null,
        init: function(root){
            this._super();

            this.root = root;
            this._totalTime = parameters.totalTime*1000;
            this._addCountDown();
            this._addUIs();
            this._addBtns();
            this.scheduleUpdate();
        },
        _addUIs: function(){

            this._pauseUI = new PauseUI();
            this._pauseUI.x = 0;
            this._pauseUI.y = 0;

            this._helpUI = new HelpUI(parameters.helpPic);
            this._helpUI.x = 0;
            this._helpUI.y = 0;

            this._gameAboutOverUI = new GameAboutOverUI();
            this._gameAboutOverUI.x = 0;
            this._gameAboutOverUI.y = 0;

            this._loadingUI = new LoadingUI();
            this._loadingUI.x = 0;
            this._loadingUI.y = 0;

            this._loadingFail = new cc.LabelBMFont('連接失敗',res.font);
            this._loadingFail.x = cc.winSize.width/2;
            this._loadingFail.y = cc.winSize.height/2;

            this._countDownUI = new CountDownUI();
            this._countDownUI.x = 0;
            this._countDownUI.y = 0;
        },
        _showCountDown: function(callback,target){//和下面那个countdown没关系
            this.addChild(this._countDownUI);
            this._countDownUI._init(callback,target,3);
        },
        _useClock: function(){
            this._clockUsed = true;
            this._resumeFn();
        },
        _addCountDown: function(){
            this._countDown = new CountDown(this._totalTime);

            this._countDown.x = 40;
            this._countDown.y = cc.winSize.height-40;

            this.addChild(this._countDown);
        },
        _addBtns: function(){
            this._pauseBtn = new cc.MenuItemImage(pauseBtn[0],pauseBtn[1],pauseBtn[2],this._pauseFn,this);
            this._pauseBtn.anchorX = 1;
            this._pauseBtn.anchorY = 1;
            this._pauseBtn.x = cc.winSize.width-40;
            this._pauseBtn.y = cc.winSize.height-40;

            this._helpBtn = new cc.MenuItemImage(helpBtn[0],helpBtn[1],helpBtn[2],this._helpFn,this);
            this._helpBtn.anchorX = 1;
            this._helpBtn.anchorY = 1;
            this._helpBtn.x = cc.winSize.width-140;
            this._helpBtn.y = cc.winSize.height-40;

            this._btnField = new cc.Menu(this._pauseBtn,this._helpBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;
            this.addChild(this._btnField);
        },

        _timeCount: function(){
            var nowTime = new Date().getTime(),time;
            if(!this._isStart){
                this._isStart = true;
                this._startTime = nowTime;
            }
            time = this._totalTime - (nowTime - this._pauseTime - this._addTime - this._startTime);
            if(time<0){
                time = 0;
                this._countDown._setTime(time);
                this._gameAboutOverFn();
            }else{
                this._countDown._setTime(time);
            }
        },
        _showTime:function(time){
            this._countDown._setTime(time);
        },
        _pauseFn: function(){
            if(this._isPause) return;
            this._isPause = true;
            this.root._pause();
            this.pause();
            this._countDown._pause();
            this._pauseStartTime = new Date().getTime();
            this._btnField.setEnabled(false);

            this.addChild(this._pauseUI,5);

            stopEffect();
            playEffect(res.audio_tap);
        },
        _helpFn: function(){
            if(this._isPause) return;
            this._isPause = true;
            this.root._pause();
            this.pause();
            this._countDown._pause();
            this._pauseStartTime = new Date().getTime();
            this._btnField.setEnabled(false);

            this.addChild(this._helpUI,5);
            stopEffect();

            playEffect(res.audio_tap);
        },
        _resumeFn: function(){
            if(!this._isPause) return;
            this._isPause = false;
            this.root._resume();
            this.resume();
            this._countDown._resume();
            if(this._isStart){
                this._pauseTime += new Date().getTime() - this._pauseStartTime;
            }
            this._btnField.setEnabled(true);
            this.removeChild(this._pauseUI);
            this.removeChild(this._helpUI);
            this.removeChild(this._gameAboutOverUI);
        },
        _restartFn: function(){
            this.root._restart();
        },
        _gameAboutOverFn: function(){
            if(this._isPause) return;
            this._isPause = true;
            this.root._pause();
            this.pause();
            this._countDown._pause();
            this._pauseStartTime = new Date().getTime();
            this._btnField.setEnabled(false);

            this.addChild(this._gameAboutOverUI,5);
            this._gameAboutOverUI._init();
            stopEffect();

            playEffect(res.audio_timerStop);
        },
        _gameOver: function(){
            this._pauseTime += new Date().getTime() - this._pauseStartTime;
            var time = this._pauseTime + this._addTime + parameters.totalTime*1000;
            this.root._gameOver(time);
        },
        _loadingFn: function() {
            if (this._isLoading) return;
            this._isLoading = true;

            if (!this._isPause) {
                this.root._pause();
                this.pause();
                this._countDown._pause();
                this._pauseStartTime = new Date().getTime();
                this._btnField.setEnabled(false);
                this._isPause = true;
            }

            this.addChild(this._loadingUI,6);
            this._loadingUI._init();
        },
        _loadingOkFn: function(){
            if(!this._isLoading) return;
            this._isLoading = false;

            this._loadingUI._remove();
        },
        _showLoadingFail: function(){
            this._loadingFail.scale = 0;
            this.addChild(this._loadingFail,7);
            var animate = cc.scaleTo(0.5,1);
            animate.easing(cc.easeBackOut(10));
            var callback = cc.callFunc(this._hideLoadingFail,this);
            var motion = cc.sequence(animate,cc.delayTime(0.5),callback);
            this._loadingFail.runAction(motion);
        },
        _hideLoadingFail: function(){
            this.removeChild(this._loadingFail);
        },
        _restart: function(){
            this._addTime = 0;
            this._pauseTime = 0;
            this._isStart = false;
            this._clockUsed = false;
            this._countDown._setTime(this._totalTime);
            this._resumeFn();
        },
        _resize: function(size){
            var height = cc.winSize.height,
                width = cc.winSize.width;
            if(width/height>=size.width/size.height){
                width = height*size.width/size.height;
            }else{
                height = width*size.height/size.width;
            }

            this._countDown.x = (cc.winSize.width - width)/2 + 40;
            this._countDown.y = (cc.winSize.height + height)/2 - 40;

            this._pauseBtn.x = (cc.winSize.width + width)/2 - 40;
            this._pauseBtn.y = (cc.winSize.height + height)/2 - 40;

            this._helpBtn.x = (cc.winSize.width + width)/2 - 140;
            this._helpBtn.y = (cc.winSize.height + height)/2 - 40;


        },
        update: function(){
            if(this.root._isStart){
                this._timeCount();
            }
        }
    });

    var CountDownUI = cc.Layer.extend({
        _bg:null,
        _startTime:3,
        _time:0,
        _text:null,
        _callback:null,
        _target:null,

        ctor: function(){
            this._super();


            this._bg = new cc.LayerColor(cc.color(0,0,0,200));
            this._bg.x =0;
            this._bg.y =0;
            this.addChild(this._bg);


            this._text = new cc.LabelBMFont(this._time,res.scoreFont);
            this._text.x = cc.winSize.width/2;
            this._text.y = cc.winSize.height/2;
            this.addChild(this._text);

        },
        _init: function(callback,target,time){

            this._startTime = time || this._startTime;
            this._time = this._startTime;
            this._callback = callback;
            this._target = target;


            this._startCountDown();
        },
        _startCountDown: function(){
            if(this._time>0){
                this._text.setString(this._time);

                this._text.alpha = 0;
                this._text.scale = 4;

                var animate = cc.scaleTo(0.5,1);
                animate.easing(cc.easeOut(5));
                var callback = cc.callFunc(this._startCountDown,this);
                var motion = cc.sequence(animate,cc.delayTime(0.5),callback);

                this._text.runAction(motion);
                this._time--;
            }else{
                this._callback.call(this._target);
                this.removeFromParent();
            }
        }
    });

    var GameAboutOverUI = cc.Layer.extend({
        _bg:null,
        _tip:null,
        _btnField:null,
        _controlLayer:null,
        _clockBtn:null,
        _endBtn:null,
        _count:null,
        _info:null,

        ctor: function(){
            this._super();

            this._addChilds();

        },

        _init: function(){
            this.root = this.parent.root;
            this._addTip();
        },

        _addChilds: function(){

            this._bg = new cc.LayerColor(cc.color(0,0,0,200));
            this._bg.x =0;
            this._bg.y =0;
            this.addChild(this._bg);

            this._tip = new cc.LabelBMFont("時間結束！",res.font);
            this._tip.x = cc.winSize.width/2;
            this._tip.y = cc.winSize.height/2;
            this.addChild(this._tip);

            this._clockBtn = new cc.MenuBtnLabel(clockBtn[0],clockBtn[1],clockBtn[2],"使用時鐘",res.font,{
                y:-62
            },this._useClock,this);
            this._clockBtn.x = cc.winSize.width/2;
            this._clockBtn.y = cc.winSize.height/2 + 40;

            this._endBtn = new cc.MenuBtn("不用了，謝謝！",otherBtns[0],this._gameOver,this);
            this._endBtn.x = cc.winSize.width/2;
            this._endBtn.y = cc.winSize.height/2 - 140;

            this._btnField = new cc.Menu(this._clockBtn,this._endBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;

            this._controlLayer = new cc.Layer();
            this._controlLayer.x = 0;
            this._controlLayer.y = 0;

            this.addChild(this._controlLayer);
            this._controlLayer.addChild(this._btnField);


            this._count = new cc.LabelBMFont(userData.clock,res.font);
            this._count.x = cc.winSize.width/2+188;
            this._count.y = cc.winSize.height/2+136;
            this._controlLayer.addChild(this._count);

            this._info = new cc.LabelBMFont("獎勵時間 (加 "+parameters.clockTime+" 秒)",res.font);
            this._info.x = cc.winSize.width/2;
            this._info.y = cc.winSize.height/2+188;
            this._controlLayer.addChild(this._info);

            this._controlLayer.scale = 0;


        },

        _addTip: function(){

            this._controlLayer.scale = 0;
            this._tip.scale = 0;

            this._count.setString(userData.clock);
            if(this.parent._clockUsed){
                this._clockBtn.setEnabled(false);
                this._clockBtn._changeText("時鐘已使用");
            }else if(userData.clock==0) {
                this._clockBtn.setEnabled(false);
                this._clockBtn._changeText("時鐘不足");
            }else{
                this._clockBtn.setEnabled(true);
            }

            var enterAnimation = cc.scaleTo(0.5,1);
            enterAnimation.easing(cc.easeBackOut(10));
            var callback = cc.callFunc(this._addBtns,this);
            var motion = cc.sequence(enterAnimation,cc.delayTime(0.5),callback);
            this._tip.runAction(motion);

        },

        _addBtns: function(){
            this._tip.scale = 0;

            var enterAnimation = cc.scaleTo(0.5,1);
            enterAnimation.easing(cc.easeBackOut(10));
            this._controlLayer.runAction(enterAnimation);
        },
        _useClock: function(){
            playEffect(res.audio_tap);
            this.parent._loadingFn();
            useClock(this._useClockCB,this);
        },
        _useClockCB: function(success){
            success = typeof success === 'undefined'?true:!!success;
            this.parent._loadingOkFn();
            if(success){
                this.parent._addTime += parameters.clockTime*1000;
                this.parent._showTime(parameters.clockTime*1000);
                this.parent._showCountDown(this.parent._useClock,this.parent);
                this.removeFromParent();
            }else{
                this.parent._showLoadingFail();
            }
        },
        _gameOver: function(){
            playEffect(res.audio_tap);
            this._parent._gameOver();
        }
    });

    var LoadingUI = cc.Layer.extend({
        _bg:null,
        _loading:null,
        _loadingMovement:null,

        ctor: function(){
            this._super();

            this._bg = new cc.LayerColor(cc.color(0,0,0,231));
            this._bg.x = 0;
            this._bg.y = 0;
            this.addChild(this._bg);

            this._loading = new cc.Sprite(loadingIcons[0]);
            this._loading.x = cc.winSize.width/2;
            this._loading.y = cc.winSize.height/2;
            this.addChild(this._loading);
        },
        _init: function(){
            var i = 0, moveAnimation;
            moveAnimation = new cc.Animation();
            for(; i<loadingIcons.length;i++){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(loadingIcons[i].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/5);
            this._loadingMovement = cc.animate(moveAnimation).repeatForever();
            this._loading.runAction(this._loadingMovement);
            moveAnimation.retain();
        },
        _remove: function(){
            this._loading.stopAction(this._loadingMovement);
            this.removeFromParent();
        }
    });

    var PauseUI = cc.Layer.extend({
        _bg: null,
        _goonBtn:null,
        _restartBtn:null,
        _backBtn:null,
        _btnField:null,

        ctor: function(){
            this._super();

            this._bg = new cc.LayerColor(cc.color(0,0,0,200));
            this._bg.x = 0;
            this._bg.y = 0;
            this.addChild(this._bg);

            this._addBtns();
        },
        _addBtns: function(){
            this._goonBtn = new cc.MenuBtn('繼續',otherBtns[0],this._goonFn,this);
            this._goonBtn.x = cc.winSize.width/2;
            this._goonBtn.y = cc.winSize.height/2+104;
            this._restartBtn = new cc.MenuBtn('重新開始',otherBtns[1],this._restartFn,this);
            this._restartBtn.x = cc.winSize.width/2;
            this._restartBtn.y = cc.winSize.height/2;
            this._backBtn = new cc.MenuBtn('主菜單',otherBtns[2],this._backFn,this);
            this._backBtn.x = cc.winSize.width/2;
            this._backBtn.y = cc.winSize.height/2-104;

            this._btnField = new cc.Menu(this._goonBtn,this._restartBtn,this._backBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;
            this.addChild(this._btnField);
        },
        _goonFn: function(){
            playEffect(res.audio_tap);
            this.parent._resumeFn();
        },
        _restartFn: function(){
            playEffect(res.audio_tap);
            this.parent._restartFn();

        },
        _backFn: function(){
            playEffect(res.audio_tap);
            runStart(true);
        }
    });

    var HelpUI = cc.Layer.extend({
        _bg:null,
        _helpPic: null,
        _help:null,
        _backBtn: null,
        _btnField:null,

        ctor: function(helpPic){
            this._super();

            this._helpPic = helpPic;

            this._bg = new cc.LayerColor(cc.color(0,0,0,200));
            this._bg.x =0;
            this._bg.y =0;
            this.addChild(this._bg);

            this._addHelp();
            this._addBtn();
        },
        _addHelp: function(){
            this._help = new cc.Sprite(this._helpPic);
            this._help.x = cc.winSize.width/2;
            this._help.y = cc.winSize.height/2;
            this.addChild(this._help);
        },
        _addBtn: function(){
            this._backBtn = new cc.MenuItemImage(closeBtn[0],closeBtn[1],closeBtn[2],this._backFn,this);
            this._backBtn.x = this._help.width/2+cc.winSize.width/2;
            this._backBtn.y = cc.winSize.height/2 + this._help.height/2;

            this._btnField = new cc.Menu(this._backBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;
            this.addChild(this._btnField);
        },
        _backFn: function(){
            playEffect(res.audio_tap);
            this.parent._resumeFn();
        }
    });


})();