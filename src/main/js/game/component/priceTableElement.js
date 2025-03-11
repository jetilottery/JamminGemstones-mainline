/*
* @Description:
* @Author:	Geordi Guo 
* @Email:	Geordi.Guo@igt.com
* @Date:	2019-07-01 16:44:57
* @Last Modified by:	Geordi Guo
* @Last Modified time:	2019-10-24 11:06:02
*/
define(function module(require){
	const msgBus   	= require('skbJet/component/gameMsgBus/GameMsgBus');
	const LittleGreenMenGameEvent	= require('game/events/littleGreenMenGameEvent');
	const PIXI = require('com/pixijs/pixi');
	const gr 			= require('skbJet/component/gladPixiRenderer/gladPixiRenderer');
	//const loader		= require('skbJet/component/pixiResourceLoader/pixiResourceLoader');
	const SKBeInstant	= require('skbJet/component/SKBeInstant/SKBeInstant');
	const config 		= require('game/configController');
	const KeyFrameAnimation = require('skbJet/component/gladPixiRenderer/KeyFrameAnimation');
	const TweenFunctions = require('game/utils/tweenFunctions');
	const audio = require('skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer');
	const gameUtils = require('game/utils/gameUtils');
	const CallbackFunc = require('game/component/callbackFunc');
	const resLib = require('skbJet/component/resourceLoader/resourceLib');


	function PriceTableElement(data){
		this.order = -1;
		this.code = "";
		this.planet = null;
		// this.planetGlory = null;
		this.mouseActionSprite = null;
		this.achievedNum = 0;
		this.achievedNum_old = 0;
		this.achievedTextSprite = null;
		this.prizeTextLevel_1 = null;
		this.prizeTextLevel_2 = null;
		this.prizeTextLevel_3 = null;
		this.levelText_current = null;
		this.levelText_next = null;
		this.levelText_hidden = null;
		this.levels = [10, 13, 16];
		this.prices = [0, 0, 0, 0];
		this.currentLevelNum = 0;
		this.levelUpAnimation = null;
		this.planetPopKeyFrameAnim = null;
		this.rollingUpTween = null;
		this.copperWin = null;
		this.silverWin = null;
		this.goldenWin = null;
		this.winPlaque = null;
		this.init(data);
		this.newLevelNum = -1;
	}
	PriceTableElement.prototype.init = function(data) {
		this.code = data.code;
		this.order = data.order;
		this.parent = data.parent;
		this.planet = gr.lib['icon'+this.code];
		// this.planetGlory = gr.lib['_planetGlory'+this.code];
		this.mouseActionSprite = gr.lib['_'+this.code];
		// this.planetGlory.show(false);
		this.achievedTextSprite = gr.lib['_achieved'+this.code];
		this.prizeTextLevel_1 = gr.lib["_level_1_prize"+this.code];
		this.prizeTextLevel_2 = gr.lib["_level_2_prize"+this.code];
		this.prizeTextLevel_3 = gr.lib["_level_3_prize"+this.code];
		this.prizeTextLevel_1.autoFontFitText = true;
		this.prizeTextLevel_2.autoFontFitText = true;
		this.prizeTextLevel_3.autoFontFitText = true;
		this.copperWin = gr.lib['_copperSelectWin'+this.code];
		this.silverWin = gr.lib['_silverSelectWin'+this.code];
		this.goldenWin = gr.lib['_goldenSelectWin'+this.code];
		this.winPlaque = gr.lib['_winPlaqueAnim'+this.code];

		this.initText();
		this.initSpine();
		this.cloneKeyAnim();
	};

	PriceTableElement.prototype.cloneKeyAnim = function(){
		for(let i=1; i<4; i++){
			const name = 'win_level'+i+'_prize'+this.code;
			if(name !== 'win_level'+i+'_prizeA'){
				let list = [];
				list.push('_level_'+i+'_prize'+this.code);
				gr.animMap['win_level'+i+'_prizeA'].clone(list, name);
			}
		}
	};
	PriceTableElement.prototype.initSpine = function(){
		let spineSymbol, style;
		if(!gr.lib._logoBG.spine){
			spineSymbol = new PIXI.spine.Spine(resLib.spine.logoBG.spineData);
			style = {x:210, y:100,scaleX:1, scaleY:1, alpha:1};
			gameUtils.setSpineStype(spineSymbol, style);
			gr.lib._logoBG.pixiContainer.addChild(spineSymbol);
			gr.lib._logoBG.spine = spineSymbol;
			spineSymbol.state.setAnimationByName(0, 'logoBG_Anim', true);
		}

		spineSymbol = new PIXI.spine.Spine(resLib.spine.prizeSymbols.spineData);
		style = {x:38, y:38,scaleX:1, scaleY:1, alpha:1};
		gameUtils.setSpineStype(spineSymbol, style);
		this.planet.pixiContainer.addChild(spineSymbol);
		this.planet.spine = spineSymbol;
		spineSymbol.state.setAnimationByName(0, config.symbolsMap[this.code]+'_Idle',false);

		spineSymbol = new PIXI.spine.Spine(resLib.spine.prizePlaqueGlow.spineData);
		style = {x:152, y:49,scaleX:1, scaleY:1, alpha:1};
		gameUtils.setSpineStype(spineSymbol, style);
		gr.lib['_prizePlaqueGlow_'+this.code].pixiContainer.addChild(spineSymbol);
		gr.lib['_prizePlaqueGlow_'+this.code].spine = spineSymbol;
		spineSymbol.state.setAnimationByName(0, 'prizePlaqueGlow_' + this.code+"_Idle",false);
	};

	PriceTableElement.prototype.resetGlowAnim = function(){
		gr.lib['_prizePlaqueGlow_'+this.code].spine.state.setAnimationByName(0, 'prizePlaqueGlow_' + this.code+"_Idle",false);
	};
	// PriceTableElement.prototype.resetAllPrizeTextStyle = function (){
	// 	if(config.style.prizeText){
	// 		this.updateTextStyle(this.prizeTextLevel_1, config.style.prizeText);
	// 		this.updateTextStyle(this.prizeTextLevel_2, config.style.prizeText);
	// 		this.updateTextStyle(this.prizeTextLevel_3, config.style.prizeText);
	// 	}		
	// };
	// PriceTableElement.prototype.updatePrizeTextAccordingly = function (levelNum = this.currentLevelNum){
	// 	if(config.style.prizeText_win){
	// 		switch(levelNum){
	// 			case 1:
	// 				this.updateTextStyle(this.prizeTextLevel_1, config.style.prizeText_win);
	// 				break;
	// 			case 2:
	// 				this.updateTextStyle(this.prizeTextLevel_2, config.style.prizeText_win);
	// 				break;
	// 			case 3:
	// 				this.updateTextStyle(this.prizeTextLevel_3, config.style.prizeText_win);
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 	}
	// };
	PriceTableElement.prototype.displayPrizeTableAccordingly = function (){
		this.setTextWithFormat(this.prizeTextLevel_1, this.prices[1]);
		this.setTextWithFormat(this.prizeTextLevel_2, this.prices[2]);
		this.setTextWithFormat(this.prizeTextLevel_3, this.prices[3]);
		// this.resetAllPrizeTextStyle();
		// this.updatePrizeTextAccordingly();
	};

	PriceTableElement.prototype.isPortrait = function (){
		return gr.getSize().height > gr.getSize().width;
	};
	PriceTableElement.prototype.initLevelUpAnimation = function (){
		this.levelUpAnimation = new KeyFrameAnimation({
			"_name": this.code+'_levelUpAnimation',
			"tweenFunc": TweenFunctions.easeOutBounce,
			"_keyFrames": [
				{
					"_time": 0,
					"_SPRITES": []
				},
				{
					"_time": config.timers.prizeTable_levelUpAnimationDuration,
					"_SPRITES": []
				}
			]
		});
		this.levelUpAnimation._onComplete = new CallbackFunc(this, this.levelUpAnimationOnComplete);
		this.levelUpAnimation._onUpdate = new CallbackFunc(this, this.levelUpAnimationOnUpdate);
		// this.levelUpAnimation.queuingCallback = new CallbackFunc(this, this.startLevelUpAnimation);
		this.levelUpAnimation.level = 0;
		this.levelUpAnimation.isDelaying = false; 
	};
	// PriceTableElement.prototype.startLevelUpAnimation = function() {
	// 	if(this.levelUpAnimation.isPlaying() === false && this.levelUpAnimation.isDelaying === false){
	// 		this.levelUpAnimation.play();
	// 		this.planet.isOnWinning = true;
	// 		this.playSoundByConfig("PlanetWin");
	// 	}
	// };

	PriceTableElement.prototype.levelUpAnimationOnUpdate = function(){
		// const tweenFunc = this.levelUpAnimation.animData.tweenFunc;
		// const duration = this.levelUpAnimation.maxTime;
		// const timeDelta = Math.ceil(obj.time);
		
	};
	PriceTableElement.prototype.levelUpAnimationOnComplete = function() {
		this.levelUpAnimation.level++;
		//const [current, next, hidden] = this.getPricesAccordingly();
		
		//this.textsReturnInstantly();
		// this.resetAllPrizeTextStyle();
		// this.updatePrizeTextAccordingly(this.levelUpAnimation.level);
		if(this.levelUpAnimation.level !== this.currentLevelNum){
			this.levelUpAnimation.isDelaying = true; // it is currently waiting for the gr.getTimer().setTimeout, will get called after the delay
			const _this = this;
			gr.getTimer().setTimeout(function (){
				_this.levelUpAnimation.isDelaying = false;
				_this.levelUpAnimation.play();
			},config.timers.prizeTable_levelUpTextDisplayMinimum);
		}
	};
	PriceTableElement.prototype.updateTextStyle = function(sourceObj, style){
		let newStyle = {_text:{}};
		if(typeof style.fontSize !== 'undefined'){
			newStyle._font = {"_size": style.fontSize};
		}
		if(typeof style.fill !== "undefined"){
			newStyle._text._color =  style.fill.replace('#', "");
		}
		if(typeof style.strokeColor !== "undefined"){
			newStyle._text._strokeColor = style.strokeColor.replace('#', "");
		}
		if(typeof style.dropShadow !== 'undefined'){
			gameUtils.setTextStyle(sourceObj, style);
		}
		sourceObj.updateCurrentStyle(newStyle);
	};
	PriceTableElement.prototype.textsReturnInstantly = function() {
		// this.levelText_current.updateCurrentStyle({"_top":this.levelText_current.orgPosY});
		// this.levelText_next.updateCurrentStyle({"_top":this.levelText_next.orgPosY});
		// this.levelText_hidden.updateCurrentStyle({"_top":this.levelText_hidden.orgPosY});
	};
	PriceTableElement.prototype.getPricesAccordingly = function (){
		switch(this.levelUpAnimation.level){
			case 0: 
				return [this.prices[0], this.prices[1], this.prices[2]];
			case 1:
				return [this.prices[1], this.prices[2], this.prices[3]];
			case 2:
				return [this.prices[2], this.prices[3], null];
			case 3:
				return [this.prices[3], null, null];
		}
	};
	PriceTableElement.prototype.resetAll = function (){
		this.currentLevelNum = 0;
		this.achievedNum = 0;
		this.achievedNum_old = 0;
		this.levelUpAnimation.level = 0;
		this.setAchievedValue(0);
		if(this.planet.spine){
			this.planet.spine.state.setAnimationByName(0, config.symbolsMap[this.code]+'_Idle',false);
		}
		// this.planetGlory.stopPlay();
		// this.planetGlory.show(false);
		// this.planet.stopPlay();
		if(this.code){
			// this.planet.setImage(config.symbolsMap[this.code]+"x_0019");
			if(config.style.priceTableRollingUpText){
				this.updateTextStyle(this.achievedTextSprite,config.style.priceTableRollingUpText);
			}
		}
		this.planet.isOnWinning = false;

		this.achievedTextSprite.setText('');
		this.copperWin.setImage('copperSelectWin_0000');
		this.silverWin.setImage('silverSelectWin_0000');
		this.goldenWin.setImage('goldenSelectWin_0000');
		this.winPlaque.gotoAndStop(0);
		this.winPlaque.show(false);
		for(let i=0; i<16; i++){
			if(i< 10){
				gr.lib['_point'+this.code+'_'+i].setImage('pointCopper');
			}else if(i<13){
				gr.lib['_point'+this.code+'_'+i].setImage('pointSilver');
			}else{
				gr.lib['_point'+this.code+'_'+i].setImage('pointGolden');
			}
		}	
		// gr.lib['_prizePlaqueGlow_'+this.code].show(false);
		if(gr.lib['_prizePlaqueGlow_'+this.code].spine){
			gr.lib['_prizePlaqueGlow_'+this.code].spine.state.setAnimationByName(0, 'prizePlaqueGlow_' + this.code+ "_Idle",true);
		}


		for(let i=1; i<4; i++){
			if(gr.animMap['win_level'+ i +'_prize'+this.code]){
				gr.animMap['win_level'+ i +'_prize'+this.code].stop();
				gr.animMap['win_level'+ i +'_prize'+this.code].updateStyleToTime(0);
			}
		}
	};
	PriceTableElement.prototype.queue = function (callbackObj, paramObj){
		gr.getTimer().setTimeout(function (){
			callbackObj.handler.call(callbackObj.subscriberRef, paramObj);
		}, 500);
	};
	PriceTableElement.prototype.setAchievedValue = function (val, isFinal){
		val = val*1;
		this.achievedNum_old = this.achievedNum;
		this.achievedNum += val;
		// let newLevelNum = -1;
		if(this.achievedNum < this.levels[0]){
			//under 10
			this.newLevelNum = 0;
		}
		else{
			if(this.achievedNum < this.levels[1]){
				// between 10 and 13
				this.newLevelNum = 1;
			}
			else{
				//set target to 16
				if(this.achievedNum < this.levels[2]){
					this.newLevelNum = 2;
				}
				else{
					this.newLevelNum = 3;
				}
			}
		}
		this.rollingUpAchievedText(isFinal);
		//this.achievedTextSprite.setText(this.achievedNum);
		// if(isInstant == false){
		// 	this.zoomInPlanetAndFlash();
		// }
		if(this.newLevelNum !== this.currentLevelNum){
			this.currentLevelNum = this.newLevelNum;
			//this.startLevelUpAnimation();
			this.playSoundByConfig("PlanetWin");
			this.playLevelAnim();
		}
	};
	PriceTableElement.prototype.rollingUpAchievedText = function(isFinal) {
		if(this.achievedNum && (this.achievedNum - this.achievedNum_old > 1)){
			// Init or play rolling up tween
			this.initRollingUpTween();
			// Set spine animation
			gr.lib['_prizePlaqueGlow_'+this.code].spine.state.setAnimationByName(0, 'prizePlaqueGlow_' + this.code,true);
		}else{
			// it is 0, just update
			if(this.achievedNum !== 0){
				this.playSoundByConfig("PlanetRollingUp");
				this.achievedTextSprite.setText(this.achievedNum);

				if(this.achievedNum < 17){
					// gr.lib['_point'+this.code+ '_'+(this.achievedNum-1)].setImage('pointWin_'+ config.symbolsMap[this.code]);
					const _this = this;
					const index = this.achievedNum-1;
					gr.lib['_point'+this.code+ '_'+index].onComplete = function(){
						gr.lib['_prizePlaqueGlow_'+_this.code].spine.state.setAnimationByName(0, 'prizePlaqueGlow_' + _this.code+ "_Idle",true);
						gr.lib['_point'+_this.code+ '_'+index].onComplete = null;
					};
					gr.lib['_point'+this.code+ '_'+index].gotoAndPlay('pointWin_'+ config.symbolsMap[this.code],0.5);
				}
				//console.log(this.code+": rollingUpAchievedText "+this.achievedNum);
				gr.lib['_prizePlaqueGlow_'+this.code].spine.state.setAnimationByName(0, 'prizePlaqueGlow_' + this.code,true);


				if((this.achievedNum > 9) && config.style.priceTableRollingUpTextWin){
					this.updateTextStyle(this.achievedTextSprite,config.style.priceTableRollingUpTextWin);
				}
				this.achievedNum_old = this.achievedNum;
			}

			// JAMGEM-192 - LNB - Game freezes after Centor reels are won.
			// If we have made it here and this is the final prize table element
			// Simply publish LittleGreenMenGameEvent.eventIDs.FORCE_NEXT_TURN
			// To force the game to continue, since we usually rely on completion of rollingUpTween
			// But we are not rolling up

			// JAMGEM-196 - LNB (All Locs) - Error 290000 appears at the end of the game after certain scenarios
			// We need to make sure there are no other tweens running
			if (isFinal && this.parent.getActiveTweens() === 0){
				msgBus.publish(LittleGreenMenGameEvent.eventIDs.FORCE_NEXT_TURN);
			}
		}
	};
	/**
	 * This function will only get called when level up, but possibilly jump to level 2-3 directly.
	 */
	PriceTableElement.prototype.playLevelAnim = function () {
		this.planet.spine.state.setAnimationByName(0, config.symbolsMap[this.code]+'_win',true);
		this.winPlaque.show(true);
		this.winPlaque.gotoAndPlay('winPlaqueAnim', 0.3,true);
		for(let i=1; i<4; i++){
			if(gr.animMap['win_level'+ i +'_prize'+this.code]){
				gr.animMap['win_level'+ i +'_prize'+this.code].stop();
				gr.animMap['win_level'+ i +'_prize'+this.code].updateStyleToTime(0);
			}
		}
		gr.animMap['win_level' + this.newLevelNum + '_prize'+this.code].play(Number.MAX_VALUE);
		if (this.newLevelNum === 1) {
			this.copperWin.gotoAndPlay('copperSelectWin', 0.3);
		} else if (this.newLevelNum === 2) {
			this.copperWin.gotoAndStop(0);
			this.silverWin.gotoAndPlay('silverSelectWin', 0.3);
		} else if (this.newLevelNum === 3) {
			this.copperWin.gotoAndStop(0);
			this.silverWin.gotoAndStop(0);
			this.goldenWin.gotoAndPlay('goldenSelectWin', 0.3);
		}
	};
	PriceTableElement.prototype.initRollingUpTween = function (){
		// Tween active
		this.parent.onTweenActive(this);
		if(this.rollingUpTween){
			this.rollingUpTween.play();
			return;
		}
		this.rollingUpTween = new KeyFrameAnimation({
			"_name": 'rollingUpTweenKey'+this.code,
			"tweenFunc":  TweenFunctions.linear, //TweenFunctions.easeOutElastic, 
			"_keyFrames": [
				{
					"_time": 0,
					"_SPRITES": []
				},
				{
					"_time": config.timers.prizeTable_AchievedNumberrollingUpDuration,
					"_SPRITES": []
				}
			]
		});
		this.rollingUpTween._onUpdate = new CallbackFunc(this, this.rollingUpOnUpdate);
		this.rollingUpTween._onComplete = new CallbackFunc(this, this.rollingUpOnComplete);
		this.rollingUpTween.play();
		
	};
	PriceTableElement.prototype.rollingUpOnUpdate = function ({caller:keyFrameAnim, time:timeDelta}){
		const tweenFunc = keyFrameAnim.animData.tweenFunc;
		const duration = keyFrameAnim.maxTime;
		timeDelta = Math.ceil(timeDelta);
		let value = parseInt(tweenFunc(timeDelta, this.achievedNum_old, this.achievedNum, duration));
		if(value !== this.achievedTextSprite.getText()*1){
			this.playSoundByConfig("PlanetRollingUp");
			this.achievedTextSprite.setText(value);
			//console.log(this.code+": rollingUpOnUpdate "+value);
			this.achievedTextSprite.updateCurrentStyle({"_transform":{"_scale":{"_x":1.4, "_y":1.4}}});
			this.litUpPricePoint(value); 
			//change text colour to gold
			if((value > 9) && config.style.priceTableRollingUpTextWin){
				this.updateTextStyle(this.achievedTextSprite,config.style.priceTableRollingUpTextWin);
			}
		}
	};
	/**
	 * because timeDelta won't guarantee going through each number so use a for loop instead
	 **/
	PriceTableElement.prototype.litUpPricePoint = function (targetPoint){
		targetPoint = (targetPoint>16)? 16 : targetPoint; //avoid index out of range issue.
		// for(let i = 0 ; i < targetPoint; i++){
			// 	// gr.lib['_point'+this.code+ '_'+i].setImage('pointWin_'+config.symbolsMap[this.code]);
			// 	gr.lib['_point'+this.code+ '_'+i].gotoAndPlay('pointWin_'+config.symbolsMap[this.code],0.5);
			// }
			if(targetPoint >0){
				gr.lib['_point'+this.code+ '_'+(targetPoint-1)].gotoAndPlay('pointWin_'+config.symbolsMap[this.code],0.5);
			}
	};

	PriceTableElement.prototype.rollingUpOnComplete = function (){
		this.achievedTextSprite.updateCurrentStyle({"_transform":{"_scale":{"_x":1, "_y":1}}});
		this.achievedNum_old = this.achievedNum;
		gr.lib['_prizePlaqueGlow_'+this.code].spine.state.setAnimationByName(0, 'prizePlaqueGlow_' + this.code+ "_Idle",true);
		msgBus.publish(LittleGreenMenGameEvent.eventIDs.PAYTABLE_TEXT_ROLL_UP_COMPLETE);
		// Tween active
		this.parent.onTweenInactive(this);
	};
	PriceTableElement.prototype.getWinningAmount = function (){
		return this.prices[this.currentLevelNum];
	};
	// PriceTableElement.prototype.zoomInPlanetAndFlash = function (){
	// 	//this.planet.updateCurrentStyle({"_transform":{"_scale":{"_x":1.2, "_y":1.2}}});
	// 	if(this.planet.isOnWinning){
	// 		//the price has won.
	// 		this.planet.gotoAndPlay(config.symbolsMap[this.code]+"x_highLightAndWon", 0.3);
	// 	}
	// 	else{
	// 		//the price hasn't win yet.
	// 		this.planet.gotoAndPlay(config.symbolsMap[this.code]+"x_highLight", 0.3);

	// 	}
	// };
	PriceTableElement.prototype.zoomOutPlanet = function (){
		//this.planet.updateCurrentStyle({"_transform":{"_scale":{"_x":1, "_y":1}}});
		// this.planetGlory.show(false);
	};
	PriceTableElement.prototype.initText = function (){
		this.initLevelUpAnimation();
		this.resetAll();
	};
	PriceTableElement.prototype.updateText = function (data){
		const levelNum = data.description.substr(-1) * 1;
		this.prices[(this.prices.length-levelNum)] = data.prize; // set the index reversely 
		this.setTextWithFormat(this.prizeTextLevel_1, this.prices[1]);
		this.setTextWithFormat(this.prizeTextLevel_2, this.prices[2]);
		this.setTextWithFormat(this.prizeTextLevel_3, this.prices[3]);
		if(this['levelText'+levelNum]){
			const prize = data.prize;
			this['levelText'+levelNum].setText(SKBeInstant.formatCurrency(prize).formattedAmount);
		}
	};
	PriceTableElement.prototype.setTextWithFormat = function(sourceObj, val) {
		if(val !== null){
			sourceObj.setText(SKBeInstant.formatCurrency(val).formattedAmount);
		}
		else{
			sourceObj.show(false);
		}
	};
	PriceTableElement.prototype.playSoundByConfig = function(soundName, isloop = false){
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
	return PriceTableElement;
});