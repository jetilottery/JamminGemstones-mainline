define( function module(require){
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const gr = require('skbJet/component/gladPixiRenderer/gladPixiRenderer');
    const loader = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const gameUtils = require('game/utils/gameUtils');
    const config = require('game/configController');
    const KeyFrameAnimation = require('skbJet/component/gladPixiRenderer/KeyFrameAnimation');
    const TweenFunctions = require('game/utils/tweenFunctions');
    const CallbackFunc = require('game/component/callbackFunc');
    function WinUpToController (){
        this.textCont = null;
        this.text = null;
        this.value = null;
        this.contCopy = null;
        //this.textCopy = null;
        this.winUpToKeyFrame = null;
        this.currentStake = 0;
        this.zooming = false;
		this.ticketReadyFlag = false;
        this.addListeners();
    }

    WinUpToController.prototype.addListeners = function (){
        msgBus.subscribe('ticketCostChanged', new CallbackFunc(this, this.onTicketCostChanged));
        msgBus.subscribe('SKBeInstant.gameParametersUpdated', new CallbackFunc(this, this.onGameParametersUpdated));
        msgBus.subscribe('changeBackgroundBGIfPortrait', new CallbackFunc(this, this.changeBackgroundBGIfPortrait));
        msgBus.subscribe('jLottery.startUserInteraction', new CallbackFunc(this, this.onStartUserInteraction));
		msgBus.subscribe('jLottery.enterResultScreenState', new CallbackFunc(this, this.onEnterResultScreenState));
    };

    WinUpToController.prototype.onStartUserInteraction = function (data){
        this.onTicketCostChanged(data.price);
    };

    WinUpToController.prototype.changeBackgroundBGIfPortrait = function(data){
        //data : boolean
        gr.getTimer().setTimeout(() => {
            if(this.contCopy){
                this.contCopy.updateCurrentStyle(this.textCont.getCurrentStyle());
            }
            gr.lib[this.text.getName()+'_copy'].updateCurrentStyle(this.text.getCurrentStyle());
            gr.lib[this.value.getName()+'_copy'].updateCurrentStyle(this.value.getCurrentStyle());
            if(data){
                if(this.text){
                    this.text.updateCurrentStyle({'_text':{'_align': 'right'}});
                    gr.lib[this.text.getName()+'_copy'].updateCurrentStyle({'_text':{'_align': 'right'}});
                }
                if(this.value){
                    this.value.updateCurrentStyle({'_text':{'_align': 'left'}});
                    gr.lib[this.value.getName()+'_copy'].updateCurrentStyle({'_text':{'_align': 'left'}});
                }
            }else{
                if(this.text){
                    this.text.updateCurrentStyle({'_text':{'_align': 'center'}});
                    gr.lib[this.text.getName()+'_copy'].updateCurrentStyle({'_text':{'_align': 'center'}});
                }
                if(this.value){
                    this.value.updateCurrentStyle({'_text':{'_align': 'center'}});
                    gr.lib[this.value.getName()+'_copy'].updateCurrentStyle({'_text':{'_align': 'center'}});
                }
            }        
            this.contCopy.updateCurrentStyle({"_opacity":0, _transform:{_scale:{_x:1.5, _y:1.5}}});
        }, 0);
    };

    WinUpToController.prototype.init = function (){
        this.text = gr.lib._winUpToText;        
        this.value = gr.lib._winUpToValue;
        this.textCont = gr.lib._winUpTo;
        this.cloneTextContainer();
        this.winUpToKeyFrame = new KeyFrameAnimation({
            "_name": 'winUpToKeyframeAnim',
            "tweenFunc":  TweenFunctions.linear, //TweenFunctions.easeOutElastic, 
            "_keyFrames": [
                {
                    "_time": 0,
                    "_SPRITES": []
                },
                {
                    "_time": config.timers.baseGame_winUpToAnimDuration,
                    "_SPRITES": []
                }
            ]
        });
        this.winUpToKeyFrame._onUpdate = new CallbackFunc(this, this.KeyFrameAnimationOnUpdate);
        this.winUpToKeyFrame._onComplete = new CallbackFunc(this, this.KeyFrameAnimationOnComplete);
    };
    WinUpToController.prototype.cloneTextContainer = function (){
        let spriteData = this.textCont.getData();
        spriteData = Object.assign({}, spriteData);
        spriteData = this.formatSpriteData(spriteData);
        this.contCopy = this.textCont.getParent().addChildFromData(spriteData);
    };
    /*
    *   Prevent duplicate sprite id and sprite name in the sprite data obj, add a string '_copy' at the end of each id and name.
    */
    WinUpToController.prototype.formatSpriteData = function (sourceObj){
        sourceObj._id += '_copy';
        sourceObj._name += '_copy';
        if(sourceObj._SPRITES.length){
            const tempSpriteArr = sourceObj._SPRITES;
            sourceObj._SPRITES = [];
            for( let sobj of tempSpriteArr){
                sourceObj._SPRITES.push(this.formatSpriteData(Object.assign({}, sobj)));
            }
        }
        return sourceObj;
    };
    WinUpToController.prototype.KeyFrameAnimationOnUpdate = function ({caller:keyFrameAnim, time:timeDelta}){
        const tweenFunc = keyFrameAnim.animData.tweenFunc;
        const duration = keyFrameAnim.maxTime;
        timeDelta = Math.ceil(timeDelta);
        const real_opacity = tweenFunc(timeDelta, 0, 1, duration);
        const copy_opacity = tweenFunc(timeDelta, 1, 0, duration);
        let real_scale = 0, copy_scale = 0;
        if(this.isZooming()){
            real_scale = tweenFunc(timeDelta, 0, 1, duration);
            copy_scale = tweenFunc(timeDelta, 1, 1.5, duration);
        }
        else{
            real_scale = tweenFunc(timeDelta, 1.5, 1, duration);
            copy_scale = tweenFunc(timeDelta, 1, 0, duration);
        }
        this.textCont.updateCurrentStyle({"_opacity":real_opacity, _transform:{_scale:{_x:real_scale, _y:real_scale}}});
        this.contCopy.updateCurrentStyle({"_opacity":copy_opacity, _transform:{_scale:{_x:copy_scale, _y:copy_scale}}});
    };

    WinUpToController.prototype.KeyFrameAnimationOnComplete = function (){
        this.updateCopysDisplay();
    };

    WinUpToController.prototype.onGameParametersUpdated = function(){
		this.ticketReadyFlag = SKBeInstant.config.gameType === 'normal'? false: true;
        this.init();
        this.initTextStyle();
        this.setText();
        if(SKBeInstant.config.gameType !== 'ticketReady'){
            this.onTicketCostChanged();
        }
        this.contCopy.updateCurrentStyle({"_opacity":0, _transform:{_scale:{_x:1.5, _y:1.5}}});
        this.updateCopysDisplay();
    };
    WinUpToController.prototype.initTextStyle = function (){
        if (config.style.winUpToText) {
            gameUtils.setTextStyle(this.text, config.style.winUpToText);
            gameUtils.setTextStyle(gr.lib[this.text.getName()+'_copy'], config.style.winUpToText);
        }
        if (config.style.winUpToValue) {
            gameUtils.setTextStyle(this.value, config.style.winUpToValue);
            gameUtils.setTextStyle(gr.lib[this.value.getName()+'_copy'], config.style.winUpToValue);
        }
        if (config.textAutoFit.winUpToText){
            this.text.autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
            gr.lib[this.text.getName()+'_copy'].autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
        }
        if (config.textAutoFit.winUpToValue){
            this.value.autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
            gr.lib[this.value.getName()+'_copy'].autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
        }
    };
    WinUpToController.prototype.setText = function (){
        this.text.setText(loader.i18n.Game.win_up_to);
        //gr.lib[this.text.getName()+'_copy'].setText(loader.i18n.Game.win_up_to);
    };
    WinUpToController.prototype.onTicketCostChanged = function(prizePoint = SKBeInstant.config.gameConfigurationDetails.pricePointGameDefault){
        const changed = ((prizePoint * 1) != this.currentStake);
        this.zooming = ((prizePoint * 1) > this.currentStake);
        this.currentStake = prizePoint * 1;
        if(this.value){
            const rc = SKBeInstant.config.gameConfigurationDetails.revealConfigurations;
            const prizeElement = rc.find(item => item.price === prizePoint);
            const maxPayElement = prizeElement.prizeStructure.find(item => (item.division)*1 === 1);
            const maxPrize = maxPayElement.prize;
            this.updateTheDisplayText(maxPrize);
            //this.contCopy.show(true);
			if(this.ticketReadyFlag){
				//this.ticketReadyFlag = false;
				return;
			}
            if(changed){
                this.winUpToKeyFrame.play();        
            }
            //this.modifyWinUpTo4Portrait();
        }
    };
	WinUpToController.prototype.onEnterResultScreenState = function(){
		this.ticketReadyFlag = false;
    };
    WinUpToController.prototype.isZooming = function (){
        return this.zooming;
    };
    /*
        Do your updating text here, you will need to overwrite this function to fit your purpose.
    */
    WinUpToController.prototype.updateTheDisplayText = function (maxPrize){
        this.value.setText(SKBeInstant.formatCurrency(maxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
    };
    WinUpToController.prototype.updateCopysDisplay = function (){
        gr.lib[this.text.getName()+'_copy'].setText(loader.i18n.Game.win_up_to);
        gr.lib[this.value.getName()+'_copy'].setText(this.value.getText());
    };

    return WinUpToController;
});