var runningGame = '';
var GameList = {};
var pageIsturned = false;
var hasSound = true;
var highQuality = false;

cc.game.onStart = function(){
    highQuality = cc.view.isRetinaEnabled();
    hasSound = getOS() != 'android';
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(1334,750,1);
    cc.view.resizeWithBrowserSize(true);
    LoaderScene.preload(gameResources, function () {
        cc.spriteFrameCache.addSpriteFrames(res.ui);
        cc.spriteFrameCache.addSpriteFrames(res.boomFrames);
        var gameName = readURL();
        if(gameName && GameList[gameName]){
            loadGame(gameName);
        }else{
            runStart();
        }
    }, this);
};
cc.game.run("gameCanvas");

window.addEventListener('resize',rotateHandler,false);
function rotateHandler(){
    if(!cc || !cc.director || !cc.director.getRunningScene) return;
    var currentScene = cc.director.getRunningScene();
    var resize = currentScene._resize;
    if(typeof resize === 'function'){
        var rate = 1,deg = 0,
            width = document.documentElement.clientWidth,
            height = document.documentElement.clientHeight,
            tempVal = 0;
        if(width<height){
            rate = width/height;
            tempVal = width;
            width = height;
            height = tempVal;
            deg = 90;
            pageIsturned = true;
        }else{
            pageIsturned = false;
        }
        resize.call(currentScene,deg,rate,{
            width:width,
            height:height
        });
    }
}

function readURL(){
    var hash = location.hash,gameName = false;
    if(hash && hash.indexOf('gameName=')!=-1){
        gameName = hash.split('gameName=')[1].split('&')[0];
    }
    location.hash = '';
    return gameName;
}

function runStart(showMenu){
    stopEffect();
    showMenu = showMenu || false;
    var start = new Start(showMenu);
    cc.director.runScene(start);
}
function loadGame(gameName){
    stopEffect();
    var gameRes = checkRes(GameList[gameName].res);
    runningGame = gameName;
    LoaderScene.preload(gameRes,function(){
        var gameScene = new GameScene(GameList[gameName]);
        cc.director.runScene(gameScene);
    },this);
}
function returnGame(){
    stopEffect();
    if(!runningGame) return;
    var gameScene = new GameScene(GameList[runningGame]);
    cc.director.runScene(gameScene);
}
function renewScore(name,score){
    userData.scores[name] = Math.max(score,(userData.scores[name] || 0));
}
function getScore(name){
    return userData.scores[name] || 0;
}

function playEffect(url,loop){
    if(!hasSound) return false;
    loop = loop || false;
    if(typeof url !== 'string'){
        var randomCode = Math.floor(Math.random() * url.length);
        url = url[randomCode];
    }
    return cc.audioEngine.playEffect(url,loop);
}
function stopEffect(eff){
    if(eff){
        cc.audioEngine.stopEffect(eff);
    }else{
        cc.audioEngine.stopAllEffects();
    }
}

function getOS(){
    return cc.sys.os.toLowerCase();
}


function setQuality(){
    highQuality = !highQuality;
    cc.view.enableRetina(highQuality);
    cc.view.setDesignResolutionSize(1334,750,1);
}
function gotoLink(name){
    var i = 1,href,arg;
    if(!name || !pageConfig[name]) return;
    href = pageConfig[name];
    for(; i<arguments.length; i++){
        arg = encodeURIComponent(arguments[i]);
        href = href.replace('{{arg_'+i+'}}',arg);
    }
    window.location.href = href;
}

function checkRes(res){
    var i,result = [], isAndroid = getOS() == 'android';
    for(i in res){
        if(i.indexOf('audio_')!==0 || !isAndroid){
            result.push(res[i]);
        }
    }
    return result;
}
