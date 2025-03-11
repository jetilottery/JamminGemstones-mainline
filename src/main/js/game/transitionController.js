/*
* @Description:
* @Author:	Geordi Guo 
* @Email:	Geordi.Guo@igt.com
* @Date:	2019-07-15 11:25:59
* @Last Modified by:	Geordi Guo
* @Last Modified time:	2019-10-15 16:09:47
*/
define(function module(require){
	const PIXI = require('com/pixijs/pixi');
	// const Particles = require('com/pixijs/pixi-particles');
	const gr = require('skbJet/component/gladPixiRenderer/gladPixiRenderer');
	const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
	const LittleGreenMenGameEvent	= require('game/events/littleGreenMenGameEvent');
	// const KeyFrameAnimation = require('skbJet/component/gladPixiRenderer/KeyFrameAnimation');
	const TweenFunctions = require('game/utils/tweenFunctions');
	const config = require('game/configController');
	const CallbackFunc = require('game/component/callbackFunc');
	const resLib = require('skbJet/component/resourceLoader/resourceLib');
	const gameUtils = require('game/utils/gameUtils');
	const audio = require('skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer');
	function TransitionController(){
		this.mainSprite = null;
		this.isRunning = false;
		this.deleted = false;
		this.updateCallback = null;
		this.transitionKeyFrame = null;
		this.addListeners();
	}
	TransitionController.prototype.addListeners = function (){
		msgBus.subscribe('SKBeInstant.gameParametersUpdated', new CallbackFunc(this, this.init));
		msgBus.subscribe("changeBackgroundBGIfPortrait", new CallbackFunc(this, this.handleL2P));
		msgBus.subscribe(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_ENTRE_TRANSITION_START, new CallbackFunc(this, this.startSBonusTrans));
		msgBus.subscribe(LittleGreenMenGameEvent.eventIDs.ACTION_BONUS_ENTRE_TRANSITION_START, new CallbackFunc(this, this.startABonusTrans));
	};
	TransitionController.prototype.handleL2P = function(isPortrait){
		let tag = isPortrait? "portrait": "landscape";
		if(gr.lib._standardSpine.spine){
			gameUtils.setSpineStype(gr.lib._standardSpine.spine, config.positions.standardTranSpine[tag]);
			gameUtils.setSpineStype(gr.lib._actionSpine.spine, config.positions.actionSpinTranSpine[tag]);
			gameUtils.setSpineStype(gr.lib._actionSpine.spine1, config.positions.actionSpinTranSpine[tag]);
		}
	};
	
	TransitionController.prototype.isPortrait = function (){
		return gr.getSize().height > gr.getSize().width;
	};
	TransitionController.prototype.init = function (){
		this.mainSprite = gr.lib._transitionContainer;
		let tag = this.isPortrait()? "portrait": "landscape";
		if(!gr.lib._standardSpine.spine){
			const spineSymbol = new PIXI.spine.Spine(resLib.spine.transitions.spineData);
			const style = config.positions.standardTranSpine[tag];			
			gameUtils.setSpineStype(spineSymbol, style);
			gr.lib._standardSpine.pixiContainer.addChild(spineSymbol);
			gr.lib._standardSpine.spine = spineSymbol;

			gr.lib._standardSpine.spine.state.addListener(
			{
				start: function(){
					if(gr.lib._standardSpine.spine.state.getCurrent(0).animation.name === "land_transition_Finger2"){
						gr.lib._WarpBonus.show(true);
						// gr.lib._BGpanel.spine.state.setAnimationByName(0, 'bonusBG', true);
						// gr.lib._BGpanel_P.spine.state.setAnimationByName(0, 'bonusBG_Portrait', true);
					}else if(gr.lib._standardSpine.spine.state.getCurrent(0).animation.name === "land_transition_Base2"){ //exit standard bonus start
						gr.lib._WarpBonus.show(false);
						// gr.lib._BGpanel.spine.state.setAnimationByName(0, 'baseBG', true);
						// gr.lib._BGpanel_P.spine.state.setAnimationByName(0, 'baseBG_Portrait', true);
						msgBus.publish(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_EXIT_TRANSITION_START);
					}
				},
				complete: function(){
					if(gr.lib._standardSpine.spine.state.getCurrent(0).animation.name === "land_transition_Finger"){
						gr.lib._standardSpine.spine.state.setAnimation(0, 'land_transition_Finger2', false);
						gr.lib._bonusAntiPlaque.spine.state.setAnimationByName(0, "bonusAntiAnim", true);
					}else if(gr.lib._standardSpine.spine.state.getCurrent(0).animation.name === "land_transition_Finger2"){
						msgBus.publish(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_ENTRE_TRANSITION_COMPLETE);					
					}else if(gr.lib._standardSpine.spine.state.getCurrent(0).animation.name === "land_transition_Base"){
						gr.lib._standardSpine.spine.state.setAnimationByName(0,"land_transition_Base2", false);
						msgBus.publish(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_EXIT_TRANSITION_COMPLETE, {bonusType :'WBTriggered'});

					}
				}
			});
		}
		if(!gr.lib._actionSpine.spine){
			let spineSymbol = new PIXI.spine.Spine(resLib.spine.rollingAnim.spineData);
			let style = config.positions.actionSpinTranSpine[tag];
			gameUtils.setSpineStype(spineSymbol, style);
			gr.lib._actionSpine.pixiContainer.addChild(spineSymbol);
			gr.lib._actionSpine.spine = spineSymbol;

			spineSymbol = new PIXI.spine.Spine(resLib.spine.rollingAnim.spineData);
			style = config.positions.actionSpinTranSpine[tag];
			gameUtils.setSpineStype(spineSymbol, style);
			gr.lib._actionSpine.pixiContainer.addChild(spineSymbol);
			gr.lib._actionSpine.spine1 = spineSymbol;
		}
		// this.mainSprite.show(false);
	};
	TransitionController.prototype.ufoOffOnComplete = function() {
		msgBus.publish(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_ENTRE_TRANSITION_COMPLETE);
		const _this = this;
		gr.getTimer().setTimeout(function (){
			_this.exit();
		}, config.timers.transition_startFadeOutAfterUFOFlyOffDelay);
	};
	TransitionController.prototype.exit = function() {
		this.transitionKeyFrame._onUpdate = this.transitionKeyFrame.exitUpdate;
		this.transitionKeyFrame._onComplete = this.transitionKeyFrame.exitComplete;
		this.transitionKeyFrame.play();
	};
	TransitionController.prototype.getSpriteSheetByName = function(spriteName){
		return PIXI.utils.TextureCache[spriteName];
	};
	// TransitionController.prototype.update = function(deltaTime) {
	// 	if(this.isRunning === true && this.deleted === false){
	// 		this.emitter_radiation.update(deltaTime*0.05);
	// 	} 
	// };
	TransitionController.prototype.start = function (){
		this.isRunning = true;
		this.deleted = false;
		// this.ticker.add(this.updateCallback);
	};

	TransitionController.prototype.playSoundByConfig = function(soundName, isloop = false){
		if (config.audio && config.audio[soundName]) {
			const channel = config.audio[soundName].channel;
			if(!config.audio[soundName].hasOwnProperty("currentIndex")){
				config.audio[soundName].currentIndex = 0;
			}
			if(Array.isArray(channel)){
				audio.play(config.audio[soundName].name, channel[config.audio[soundName].currentIndex++ % channel.length]);
			}else{
				audio.play(config.audio[soundName].name, channel, isloop);
			}
        }
	};

	TransitionController.prototype.startSBonusTrans = function () {
		this.mainSprite.show(true);
		const _this = this;
		gr.getTimer().setTimeout(function () {
			gr.lib._standardSpine.show(true);
			gr.lib._standardSpine.spine.state.setAnimation(0, 'land_transition_Finger', false);
			_this.playSoundByConfig("sBonusTransition");
			audio.fadeOut(0, 200);//fade out MusicLoop
			audio.playAndFadeIn(3,"Bonus1MusicLoop",true,200,{completeCallback:function(){
				audio.volume(3,0.4);
			}});
		}, 700);

	};
	TransitionController.prototype.startABonusTrans = function (data) {
		this.mainSprite.show(true);
		gr.lib._actionSpine.spine.state.setAnimation(0, 'shineAnim', false);
		audio.play("Bonus2Shuffle", 1);
		gr.lib._actionSpine.spine1.state.setAnimation(0, 'rolling_Anim', false).listener={
			complete:function(){
				gr.animMap._earthQuake.play();
				if (data.type === "S") {
					gr.lib._actionSpine.spine1.state.setAnimation(0, 'whirl_Win', false).listener={
						complete:function(){
							msgBus.publish(LittleGreenMenGameEvent.eventIDs.ACTION_BONUS_ENTRE_TRANSITION_COMPLETE);
						}
					};
				} else {
					gr.lib._actionSpine.spine1.state.setAnimation(0, 'bomb_Win', false).listener={
						complete:function(){
							msgBus.publish(LittleGreenMenGameEvent.eventIDs.ACTION_BONUS_ENTRE_TRANSITION_COMPLETE);
						}
					};
				}
			}
		};
	};
	TransitionController.prototype.entreOnUpdate = function ({caller:keyFrameAnim, time:timeDelta}){
		const tweenFunc = TweenFunctions.linear;
		const duration = keyFrameAnim.maxTime;
		timeDelta = Math.ceil(timeDelta);
		const opacity = tweenFunc(timeDelta, 0, 1, duration);
		this.mainSprite.updateCurrentStyle({"_opacity": opacity});
	};
	TransitionController.prototype.exitOnUpdate = function ({caller:keyFrameAnim, time:timeDelta}){
		const tweenFunc = TweenFunctions.linear;
		const duration = keyFrameAnim.maxTime;
		timeDelta = Math.ceil(timeDelta);
		const opacity = tweenFunc(timeDelta, 1, 0, duration);
		this.mainSprite.updateCurrentStyle({"_opacity": opacity});
	};
	// TransitionController.prototype.entreOnComplete = function (){
	// 	const _this = this;
	// 	gr.getTimer().setTimeout(function (){
	// 		// _this.ufoOffAnim.play();
	// 	}, config.timers.transition_startUFOAnimationAfterFadeInDelay);
	// };
	TransitionController.prototype.exitOnComplete = function (){
		this.mainSprite.show(false);
		this.isRunning = false;
		msgBus.publish(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_EXIT_TRANSITION_COMPLETE);
	};
	
	return TransitionController;
});