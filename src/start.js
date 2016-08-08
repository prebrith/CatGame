(function(){
    var bg = res.mainBg;
    var cat0 = "#indexCat0.png";
    var cat = ["#indexCat1.png","#indexCat2.png","#indexCat3.png",
        "#indexCat4.png","#indexCat5.png","#indexCat6.png"];
    var catEye = "#indexCatEye.png";

    var startBtn = ["#startBtnBg.png","#startBtnBgOn.png","#startBtnBgDisabled.png"];
    var rankingListBtn = ["#rankingListBtn.png","#rankingListBtnOn.png","#rankingListBtnDisabled.png"];
    var settingBtn = ["#settingBtn.png","#settingBtnOn.png","#settingBtnDisabled.png"];
    var infoBtn = ["#infoBtn.png","#infoBtnOn.png","#infoBtnDisabled.png"];
    var exchangeBtn = ["#exchangeBtn.png","#exchangeBtnOn.png","#exchangeBtnDisabled.png"];

    var starsIcon = ['#star01.png','#star10.png'];
    var otherBtns = ["#UIBtn1.png","#UIBtn2.png","#UIBtn3.png","#UIBtn4.png","#UIBtn5.png"];

    var menuSpace = '#menu_space.png';
    var menuShadow = '#menu_shadow.png';

    var toolBar = "#toolBar.png";

    var Start = window.Start = cc.Scene.extend({
        _screenLayer: null,
        _UILayer:null,
        _startLayer:null,
        _isInit: false,
        _showMenu: false,
        ctor: function(showMenu){
            showMenu = showMenu || false;
            this._super();
            this._showMenu = showMenu;
        },
        onEnter: function(){
            this._isInit = true;
            cc.spriteFrameCache.addSpriteFrames(res.catIndex);
            cc.spriteFrameCache.addSpriteFrames(res.gameList);

            this._screenLayer = new cc.Layer();
            this.addChild(this._screenLayer);

            this._startLayer = new StartLayer();
            this._screenLayer.addChild(this._startLayer);

            this._UILayer = new UILayer(this._showMenu);
            this._screenLayer.addChild(this._UILayer,2);


            if(typeof rotateHandler === 'function') {
                rotateHandler();
            }
            this._super();
        },
        onExit: function(){
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.catIndex);
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.gameList);
        },
        _resize: function(deg,rate,size){
            if(!this._isInit) return;
            this._screenLayer.rotation = deg;
            this._screenLayer.scale = rate;

            this._UILayer._resize(size);
        }

    });

    var ToolBar = cc.Sprite.extend({
        _count:0,
        _font:null,
        ctor: function(count){
            this._super(toolBar);
            this._count = count;

            this._font = new cc.LabelTTF(this._count,'arial',36);
            this._font.setFontFillColor(cc.color(237,85,101));
            this._font.x = this._getWidth()/2-16;
            this._font.y = this._getHeight()/2;
            this.addChild(this._font);
        },
        _setText: function(count){
            this._count = count;
            this._font.setString(this._count);
        }
    });


    var UILayer = cc.Layer.extend({
        _rankingListBtn: null,
        _infoBtn: null,
        _settingBtn: null,
        _startBtn: null,
        _exchangeBtn: null,
        _toolBar: null,
        _btnField:null,
        _pageField: null,
        _nameField: null,
        _settingUI: null,
        _isStart: false,
        _showmenu: false,
        _layoutList:[],
        _nameList: [],
        ctor: function(showmenu){
            this._super();
            showmenu = showmenu || false;

            this._showmenu = showmenu;

            this._nameList = [];
            this._layoutList = [];

            this._rankingListBtn = new cc.MenuItemImage(rankingListBtn[0],rankingListBtn[1],rankingListBtn[2],this._rankingListFn,this);
            this._rankingListBtn.anchorX = 0;
            this._rankingListBtn.anchorY = 0;
            this._rankingListBtn.x = 60;
            this._rankingListBtn.y = 30;

            this._infoBtn = new cc.MenuItemImage(infoBtn[0],infoBtn[1],infoBtn[2],this._infoFn,this);
            this._infoBtn.anchorX = 1;
            this._infoBtn.anchorY = 0;
            this._infoBtn.x = cc.winSize.width - 170;
            this._infoBtn.y = 30;

            this._settingBtn = new cc.MenuItemImage(settingBtn[0],settingBtn[1],settingBtn[2],this._settingFn,this);
            this._settingBtn.anchorX = 1;
            this._settingBtn.anchorY = 0;
            this._settingBtn.x = cc.winSize.width - 60;
            this._settingBtn.y = 30;

            this._startBtn = new cc.MenuBtnLabel(startBtn[0],startBtn[1],startBtn[2],"開始",res.font,{},this._startFn,this);
            this._startBtn.anchorY = 0;
            this._startBtn.x = cc.winSize.width/2;
            this._startBtn.y = 30;

            this._exchangeBtn = new cc.MenuItemImage(exchangeBtn[0],exchangeBtn[1],exchangeBtn[2],this._exchangeFn,this);
            this._exchangeBtn.anchorX = 0;
            this._exchangeBtn.anchorY = 1;
            this._exchangeBtn.x = 30;
            this._exchangeBtn.y = cc.winSize.height - 30;

            this._toolBar = new ToolBar(userData.clock);
            this._toolBar.anchorX = 1;
            this._toolBar.anchorY = 1;
            this._toolBar.x = cc.winSize.width - 30;
            this._toolBar.y = cc.winSize.height - 30;

            this.addChild(this._toolBar);

            this._btnField = new cc.Menu(this._rankingListBtn,this._infoBtn,this._settingBtn,this._exchangeBtn,this._startBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;
            this.addChild(this._btnField,3);


            this._settingUI = new SettingUI();
            this._settingUI.x = 0;
            this._settingUI.y = 0;
        },
        onEnter: function(){
            this._super();
            this._checkBtnState();
            if(this._showmenu){
                this._startFn();
            }
        },
        _checkBtnState: function(){
            if(!pageConfig.helpURL){
                this._infoBtn.setVisible(false);
            }
            if(!pageConfig.rankingURL){
                this._rankingListBtn.setVisible(false);
            }
            if(!pageConfig.exchangeURL){
                this._exchangeBtn.setVisible(false);
            }
        },
        _resize: function(size){
            var height = cc.winSize.height,
                width = cc.winSize.width;
            if(width/height>=size.width/size.height){
                width = height*size.width/size.height;
            }else{
                height = width*size.height/size.width;
            }

            this._rankingListBtn.x = (cc.winSize.width - width)/2 + 60;
            this._rankingListBtn.y = (cc.winSize.height - height)/2 + 30;

            this._infoBtn.x = (cc.winSize.width + width)/2 - 170;
            this._infoBtn.y = (cc.winSize.height - height)/2 + 30;

            this._settingBtn.x = (cc.winSize.width + width)/2 - 60;
            this._settingBtn.y = (cc.winSize.height - height)/2 + 30;

            this._toolBar.x = (cc.winSize.width + width)/2 - 30;
            this._toolBar.y = (cc.winSize.height + height)/2 - 30;

            this._exchangeBtn.x = (cc.winSize.width - width)/2 + 30;
            this._exchangeBtn.y = (cc.winSize.height + height)/2 - 30;

            if(this._isStart){
                this._nameField.y = (cc.winSize.height + height)/2 - 40;
            }else{
                this._startBtn.y = (cc.winSize.height - height)/2 + 30;
            }


        },
        _rankingListFn: function(){
            gotoLink('rankingURL');
        },
        _infoFn: function(){
            gotoLink('helpURL');
        },
        _exchangeFn: function(){
            gotoLink('exchangeURL');
        },
        _settingFn: function(){
            var i = 0;
            this._btnField.setEnabled(false);
            if(this._isStart){
                for(; i< this._layoutList.length; i++){
                    this._layoutList[i]._pause();
                }
            }

            this.addChild(this._settingUI,5);

            playEffect(res.audio_tap);
        },
        _settingCloseFn: function(){
            var i = 0;
            this._btnField.setEnabled(true);
            if(this._isStart){
                for(; i< this._layoutList.length; i++){
                    this._layoutList[i]._resume();
                }
            }

            this.removeChild(this._settingUI);

        },
        _startFn: function(){
            this._startBtn.setEnabled(false);
            this._startBtn.setVisible(false);
            playEffect(res.audio_tap);
            this._isStart = true;

            this.parent.parent._startLayer._start();

            this._pageField = new ccui.TurnedPageView();
            this._pageField.setTouchEnabled(true);
            this._pageField.setContentSize(cc.winSize.width*3/5, cc.winSize.height);
            this._pageField.x = cc.winSize.width*1/5;
            this._pageField.y = 0;
            this._pageField.setClippingEnabled(false);
            this._pageField.setCustomScrollThreshold(0.05*cc.winSize.width);
            this.addChild(this._pageField);
            this._pageField.addCCSEventListener(this._pageViewTurning.bind(this));


            this._nameField = new cc.LabelBMFont('',res.font);
            this._nameField.x = cc.winSize.width/2;
            this._nameField.anchorY = 1;
            this._nameField.y = this._toolBar.y-10;
            this.addChild(this._nameField);


            this._createPages();
        },
        _createPages: function(){
            var layout, i,k = 0,flag= 0;
            for(i in GameList){
                this._nameList.push(GameList[i].menu.name);
                layout = new GameSelectorLayout(i);
                this._pageField.addPage(layout);
                this._layoutList.push(layout);
                if(runningGame && GameList[i].parameters.gameName == runningGame){
                    flag = k;
                }
                k++;
            }
            if(flag){
                this._pageField.scrollToPage(flag);
            }
            runningGame = '';
            this._showName();
        },
        _pageViewTurning: function(sender,type) {
            switch (type) {
                //pageView当前所在的page的index发生了变化。
                case ccui.PageView.EVENT_TURNING:
                    this._showName();
                    break;
                default:
                    break;
            }
        },
        _showName: function(){
            var num = this._pageField.getCurPageIndex();
            this._nameField.setString(this._nameList[num]);
        }
    });


    var GameSelectorEvents = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        x: 0,
        onTouchBegan: function(touch,event){
            var target = event.getCurrentTarget();  // 获取事件所绑定的 target
            if(target.disabled) return false;
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();

            var rect = cc.rect(0, 0, s.width, s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                target._touchOver();
            }
            this.x = pageIsturned?event.getTouches()[0].getLocationY():event.getTouches()[0].getLocationX();  //记录事件初始位置
            return true;
        },
        onTouchMoved: function(touch,event){
            var target = event.getCurrentTarget(),                              //获取事件所绑定的 target
                x = pageIsturned?event.getTouches()[0].getLocationY():event.getTouches()[0].getLocationX(),
                dX = Math.abs(this.x - x);                                      //记录偏移量
            if(dX > 10){                                                        //如果偏移量过大则忽略点击事件
                target._touchOut();
            }
        },
        onTouchEnded: function(touch,event){
            var target = event.getCurrentTarget();  // 获取事件所绑定的 target
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();

            var rect = cc.rect(0, 0, s.width, s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                target._touchStart();
            }
            target._touchOut();
        }
    });

    var SettingUI = cc.Layer.extend({
        _bg: null,
        _soundBtn: null,
        _soundTexts:['音效：開','音效：關'],
        _qualityBtn: null,
        _qualityTexts:['畫質：高','畫質：低'],
        _backBtn: null,
        _btnField: null,
        ctor: function(){
            this._super();

            this._bg = new cc.LayerColor(cc.color(0,0,0,200));
            this._bg.x = 0;
            this._bg.y = 0;
            this.addChild(this._bg);

            var os = getOS();
            if(os == 'ios'){
                this._addBtnsIos();
            }else if(os == 'android'){
                this._addBtnsAndroid();
            }else{
                this._addBtns();
            }
        },
        _addBtnsIos: function(){
            var type1 = hasSound? 0:1;

            this._soundBtn = new cc.MenuBtn(this._soundTexts[type1],otherBtns[0],this._soundFn,this);
            this._soundBtn.x = cc.winSize.width/2;
            this._soundBtn.y = cc.winSize.height/2+52;
            this._backBtn = new cc.MenuBtn('返回',otherBtns[2],this._backFn,this);
            this._backBtn.x = cc.winSize.width/2;
            this._backBtn.y = cc.winSize.height/2-52;

            this._btnField = new cc.Menu(this._soundBtn,this._backBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;
            this.addChild(this._btnField);

        },
        _addBtnsAndroid: function(){
            var type1 = highQuality? 0:1;

            this._qualityBtn = new cc.MenuBtn(this._qualityTexts[type1],otherBtns[1],this._qualityFn,this);
            this._qualityBtn.x = cc.winSize.width/2;
            this._qualityBtn.y = cc.winSize.height/2+52;
            this._backBtn = new cc.MenuBtn('返回',otherBtns[2],this._backFn,this);
            this._backBtn.x = cc.winSize.width/2;
            this._backBtn.y = cc.winSize.height/2-52;

            this._btnField = new cc.Menu(this._qualityBtn,this._backBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;
            this.addChild(this._btnField);

        },
        _addBtns: function(){
            var type1 = hasSound? 0:1,
                type2 = highQuality? 0:1;

            this._soundBtn = new cc.MenuBtn(this._soundTexts[type1],otherBtns[0],this._soundFn,this);
            this._soundBtn.x = cc.winSize.width/2;
            this._soundBtn.y = cc.winSize.height/2+104;
            this._qualityBtn = new cc.MenuBtn(this._qualityTexts[type2],otherBtns[1],this._qualityFn,this);
            this._qualityBtn.x = cc.winSize.width/2;
            this._qualityBtn.y = cc.winSize.height/2;
            this._backBtn = new cc.MenuBtn('返回',otherBtns[2],this._backFn,this);
            this._backBtn.x = cc.winSize.width/2;
            this._backBtn.y = cc.winSize.height/2-104;

            this._btnField = new cc.Menu(this._soundBtn,this._qualityBtn,this._backBtn);
            this._btnField.x = 0;
            this._btnField.y = 0;
            this.addChild(this._btnField);
        },
        _soundFn: function(){
            hasSound = !hasSound;
            if(hasSound){
                playEffect(res.audio_tap);
            }else{
                stopEffect();
            }
            var type = hasSound? 0:1;
            this._soundBtn._changeText(this._soundTexts[type]);
        },
        _qualityFn: function(){
            playEffect(res.audio_tap);
            setQuality();
            var type = highQuality? 0:1;
            this._qualityBtn._changeText(this._qualityTexts[type]);
        },
        _backFn: function(){
            playEffect(res.audio_tap);
            this.parent._settingCloseFn();
        }
    });

    var GameSelectorBtnSprite = cc.Sprite.extend({
        _stars:[],
        _name:'',
        ctor: function(name){
            this._name = name;
            this._super(GameList[this._name].menu.pic);
            this._stars = [];
            this._addStars();
            this._showStars();
        },
        _addStars: function(){
            var levels = GameList[this._name].parameters.levels,
                star = null,
                i = 0;
            for(;i<levels.length;i++){
                star = new cc.Sprite(starsIcon[0]);
                star.x = this.width/2 + (i - (levels.length-1)/2)*72;
                star.y = this.height/2 - 152;
                this.addChild(star);
                this._stars.push(star);
            }
        },
        _showStars: function(){
            var levels = GameList[this._name].parameters.levels,
                k = 0,
                score = getScore(this._name);
            while(score>=levels[k] && k<levels.length){
                this._stars[k].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(starsIcon[1].replace('#','')));
                k++;
            }
        }
    });

    var GameSelectorBtn = cc.Sprite.extend({
        _name:'',
        _callback:null,
        _target:null,
        _pic:null,
        _shadow:null,
        _canClick:true,
        ctor: function(name,callback,target){
            this._name = name;
            this._callback = callback;
            this._target = target;
            this._super(menuSpace);


            this._pic = new GameSelectorBtnSprite(this._name);
            this._pic.x = this._getWidth()/2;
            this._pic.y = this._getHeight()/2;
            this.addChild(this._pic,2);

            this._shadow = new cc.Sprite(menuShadow);
            this._shadow.x = this._getWidth()/2;
            this._shadow.y = this._getHeight()/2;
            this.addChild(this._shadow,1);

        },
        _touchStart: function(){
            if(!this._canClick) return;
            this._callback.call(this._target,this._type);
        },
        _touchOver: function(){
            playEffect(res.audio_tap);
            this._pic.stopAllActions();
            this._shadow.stopAllActions();
            this._canClick = true;

            var motion1 = cc.moveTo(0.05,cc.p(this._getWidth()/2+8,this._getHeight()/2-8)),
                motion2 = cc.moveTo(0.05,cc.p(this._getWidth()/2-8,this._getHeight()/2+8));

            this._pic.runAction(motion1);
            this._shadow.runAction(motion2);
        },
        _touchOut: function(){
            this._pic.stopAllActions();
            this._shadow.stopAllActions();

            this._canClick = false;

            var motion1 = cc.moveTo(0.05,cc.p(this._getWidth()/2,this._getHeight()/2)),
                motion2 = cc.moveTo(0.05,cc.p(this._getWidth()/2,this._getHeight()/2));

            this._pic.runAction(motion1);
            this._shadow.runAction(motion2);
        }
    });

    var GameSelectorLayout = ccui.Layout.extend({
        _name:null,
        _btn:null,
        ctor: function(name){
            this._super();
            this.setContentSize(cc.winSize.width*3/5, cc.winSize.height);
            this._name = name;

            this._btn = new GameSelectorBtn(this._name,this._enterGame,this);
            this._btn.x = this._getWidth()/2;
            this._btn.y = this._getHeight()/2;
            cc.eventManager.addListener(GameSelectorEvents.clone(), this._btn);
            this.addChild(this._btn);
        },
        _enterGame: function(){
            loadGame(this._name);
        },
        _pause: function(){
            this._btn.disabled = true;
        },
        _resume: function(){
            this._btn.disabled = false;
        }
    });

    var Cat = cc.Sprite.extend({
        _cat:null,
        _eye:null,
        _motions:null,
        ctor: function(){
            this._super();

            this._cat = new cc.Sprite(cat0);
            this._cat.x = 0;
            this._cat.y = 0;
            this.addChild(this._cat);

            this._eye = new cc.Sprite(catEye);
            this._eye.x = 0;
            this._eye.y = 0;
            this.addChild(this._eye);

            this._motions = [this._eyeMotion1,this._eyeMotion2,this._eyeMotion3,this._eyeMotion4,this._eyeMotion5];

        },
        _eyeMotion1: function(callback,target){
            var motion1 = cc.moveTo(0.8,cc.p(-30,-22));
            motion1.easing(cc.easeInOut(5));
            var bezier = [cc.p(-19, -47), cc.p(32, -37), cc.p(36, 0)];
            var motion2 = cc.bezierTo(1.2,bezier);
            motion2.easing(cc.easeInOut(5));
            var motion3 = cc.moveTo(0.8,cc.p(0,0));
            motion3.easing(cc.easeInOut(5));

            var cb = cc.callFunc(callback,target);

            this._eye.runAction(cc.sequence(motion1,cc.delayTime(0.3),motion2,cc.delayTime(0.6),motion3,cb));

        },
        _eyeMotion2: function(callback,target){
            var motion1 = cc.moveTo(0.8,cc.p(-23,23));
            motion1.easing(cc.easeInOut(5));
            var motion2 = cc.moveTo(0.8,cc.p(0,0));
            motion2.easing(cc.easeInOut(5));

            var cb = cc.callFunc(callback,target);

            this._eye.runAction(cc.sequence(motion1,cc.delayTime(1),motion2,cb));
        },
        _eyeMotion3: function(callback,target){
            var motion1 = cc.moveTo(0.8,cc.p(0,26));
            motion1.easing(cc.easeInOut(5));
            var motion2 = cc.moveTo(1.4,cc.p(0,-28));
            motion2.easing(cc.easeInOut(5));
            var motion3 = cc.moveTo(0.8,cc.p(0,0));
            motion3.easing(cc.easeInOut(5));

            var cb = cc.callFunc(callback,target);

            this._eye.runAction(cc.sequence(motion1,cc.delayTime(0.4),motion2,cc.delayTime(0.8),motion3,cb));
        },
        _eyeMotion4: function(callback,target){
            var motion1 = cc.moveTo(0.8,cc.p(23,-23));
            motion1.easing(cc.easeInOut(5));
            var motion2 = cc.moveTo(0.8,cc.p(0,0));
            motion2.easing(cc.easeInOut(5));

            var cb = cc.callFunc(callback,target);

            this._eye.runAction(cc.sequence(motion1,cc.delayTime(0.4),motion2,cb));
        },
        _eyeMotion5: function(callback,target){
            var moveAnimation = new cc.Animation(),i = 0;
            for(; i<cat.length;i++){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cat[i].replace('#','')));
            }
            for(i=cat.length-1; i>=0;i--){
                moveAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cat[i].replace('#','')));
            }
            moveAnimation.setDelayPerUnit(1/25);
            var motion1 = cc.animate(moveAnimation).repeat(1);

            var cb = cc.callFunc(callback,target);
            var startHandler = cc.callFunc(this._eyeMotion5StartHandler,this);
            var endHandler = cc.callFunc(this._eyeMotion5EndHandler,this);

            this._cat.runAction(cc.sequence(cc.delayTime(0.4),startHandler,motion1,endHandler,cc.delayTime(0.6),cb));
        },
        _eyeMotion5StartHandler: function(){
            this._eye.setVisible(false);
        },
        _eyeMotion5EndHandler: function(){
            this._cat.initWithSpriteFrameName(cat0.replace('#',''));
            this._eye.setVisible(true);
        }
    });


    var StartLayer = cc.Layer.extend({
        _bg:null,
        _cat:null,
        _frameCount:0,
        _catIsMoving: false,
        ctor: function(){
            this._super();

            this._bg = new cc.Sprite(bg);
            this._bg.x = cc.winSize.width/2;
            this._bg.y = cc.winSize.height/2;
            this.addChild(this._bg);

            this._cat = new Cat();
            this._cat.x = cc.winSize.width/2-10;
            this._cat.y = cc.winSize.height/2+30;
            this.addChild(this._cat);

            this.scheduleUpdate();

        },
        update: function(){
            if(!this._catIsMoving){
                this._frameCount++;
            }
            if(this._frameCount >= 40){
                this._frameCount = 0;
                if(Math.floor(Math.random()*100)%3 == 0){
                    this._runCatMovement();
                }
            }
        },
        _runCatMovement: function(){
            this._catIsMoving = true;
            var catMotion = this._cat._motions[Math.floor(Math.random()*this._cat._motions.length)];
            catMotion.call(this._cat,this._catMovementOver,this);
        },
        _catMovementOver: function(){
            this._catIsMoving = false;
        },
        _start: function(){
            this.unscheduleUpdate();
            this._cat.removeFromParent();
        }
    });

})();