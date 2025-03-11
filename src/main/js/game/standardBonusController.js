"use strict";
/*
 * @Description:
 * @Author: Geordi Guo 
 * @Email:  Geordi.Guo@igt.com
 * @Date: 2019-07-15 14:48:20
 * @Last Modified by: Geordi Guo
 * @Last Modified time: 2019-11-14 15:09:24
 */

define(function module(require) {
    var gr = require('skbJet/component/gladPixiRenderer/gladPixiRenderer');

    var SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');

    var PIXI = require('com/pixijs/pixi');

    var msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

    var LittleGreenMenGameEvent = require('game/events/littleGreenMenGameEvent');

    var ReelH = require('game/component/reelHorizontal'); // const loader   = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');


    var config = require('game/configController');

    var KeyFrameAnimation = require('skbJet/component/gladPixiRenderer/KeyFrameAnimation');

    var TweenFunctions = require('game/utils/tweenFunctions');

    var CallbackFunc = require('game/component/callbackFunc');

    var audio = require('skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer');

    var gameUtils = require('game/utils/gameUtils');

    var resLib = require('skbJet/component/resourceLoader/resourceLib');

    var loader = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');

    var _this;

    var Maths = {};

    (function(obj) {
        var factorial = [1];
        var accuracy = 25;

        for (var i = 1; i < accuracy; i++) {
            factorial[i] = factorial[i - 1] * i;
        }

        function precision_sum(array) {
            var result = 0;

            while (array.length > 0) {
                result += array.pop();
            }

            return result;
        }

        obj.sin = function(x) {
            x = x % (Math.PI * 2);
            var sign = 1;
            var x2 = x * x;
            var terms = [];

            for (var _i = 1; _i < accuracy; _i += 2) {
                terms.push(sign * x / factorial[_i]);
                x *= x2;
                sign *= -1;
            }

            return precision_sum(terms);
        };

        obj.cos = function(x) {
            x = x % (Math.PI * 2);
            var sign = -1;
            var x2 = x * x;
            x = x2;
            var terms = [1];

            for (var _i2 = 2; _i2 < accuracy; _i2 += 2) {
                terms.push(sign * x / factorial[_i2]);
                x *= x2;
                sign *= -1;
            }

            return precision_sum(terms);
        };
    })(Maths);

    function StandardBonusController() {
        this.mainSprite = null;
        this.maskParent = null;
        this.reelset = null;
        this.numOfReels = 1;
        this.reels = {
            reception: []
        };
        this.reelOffPosY = [0, 0, 0, 0, 0]; //this.responseData = 'BDXBF';
        // this.dim = null;

        this.responseData = null;
        this.goButtonText = null;
        this.titleText = null;
        this.headerText = null;
        this.outterLight = null;
        this.outterLightHeartBeatKeyAnim = null; // this.fadeOutKeyFrameAnim = null;

        this.currentStake = null; // this.ufoSprite = null;
        // this.etBonusSprite = null;
        // this.ufoAnimation = null;

        this.bln_terminateGameNow = false;
        this.addListeners();
        this.headerSpineSymbol = null;
        this.maskL = null;
        this.maskP = null;
        _this = this;
        window.sb = this;
    }

    StandardBonusController.prototype.addListeners = function() {
        msgBus.subscribe('SKBeInstant.gameParametersUpdated', new CallbackFunc(this, this.init)); //msgBus.subscribe('ticketCostChanged', new CallbackFunc(this, this.onTicketCostChanged));
        // msgBus.subscribe(LittleGreenMenGameEvent.eventIDs.INNERPAYTABLE_CLOSED, new CallbackFunc(this, this.enableButton));
        // msgBus.subscribe(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_EXIT_TRANSITION_COMPLETE, new CallbackFunc(this, this.ufoAnimationOnComplete));

        msgBus.subscribe(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_ALL_REELS_STOPPED, new CallbackFunc(this, this.allReelStoppedHandler));
        msgBus.subscribe(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_ENTRE_TRANSITION_START, new CallbackFunc(this, this.beforeEntre));
        msgBus.subscribe(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_ENTRE_TRANSITION_COMPLETE, new CallbackFunc(this, this.startSpinAnim));
        msgBus.subscribe(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_ALL_WIN_SEQUENCE_COMPLETED, new CallbackFunc(this, this.exit));
        msgBus.subscribe('winboxError', new CallbackFunc(this, this.onWinBoxError));
        msgBus.subscribe("changeBackgroundBGIfPortrait", new CallbackFunc(this, this.handleL2P));
    };

    StandardBonusController.prototype.handleL2P = function(isPortrait) {
        if (this.spriteToBeMask) {
            this.spriteToBeMask.pixiContainer.mask = isPortrait ? this.maskP : this.maskL;
        }

        if (this.headerText) {
            if (isPortrait) {
                this.headerText.setText(loader.i18n.Game.warpBonus_headerP);
                this.handleTextWithImage(this.headerText, loader.i18n.Game.warpBonus_headerP.split(new RegExp('[\n]', 'g')));
            } else {
                this.headerText.setText(loader.i18n.Game.warpBonus_headerL);
                this.handleTextWithImage(this.headerText, loader.i18n.Game.warpBonus_headerL.split(new RegExp('[\n]', 'g')));
            }
        }
    };

    StandardBonusController.prototype.onWinBoxError = function(err_evt) {
        if (err_evt.errorCode === '29000') {
            this.bln_terminateGameNow = true;
        }
    };

    StandardBonusController.prototype.isEveryThingOkay = function() {
        return this.bln_terminateGameNow === false;
    };

    StandardBonusController.prototype.init = function() {
        gr.lib._IWwinValue.autoFontFitText = true;
        this.mainSprite = gr.lib._WarpBonus;
        this.spriteToBeMask = gr.lib._WarpBonusMask;
        this.reelset = gr.lib._Pipeline02;
        this.maskParent = gr.lib._WarpBonus.pixiContainer;
        this.outterLight = gr.lib._outterShadow; // this.ufoSprite = gr.lib._goBtnReplacement;
        // this.etBonusSprite = gr.lib._ETInSBonus;
        // this.etBonusSprite.show(false);

        this.outterLight.updateCurrentStyle({
            "_opacity": 0
        }); // this.dim = gr.lib._BG_dim;
        // this.setupButtonsAndTexts();

        this.initReels();
        this.createMask(); // this.initUfoKeyFrameAnimation ();

        this.hide();
        this.initSpine(); // gr.lib._bonusExplosionContainer.show(false);

        this.headerText = gr.lib._warpBonusHeader;
        this.handleL2P(this.isPortrait());
    };

    StandardBonusController.prototype.initSpine = function() {
        var spineSymbol = new PIXI.spine.Spine(resLib.spine.bonusAntiAnim.spineData);
        gameUtils.setSpineStype(spineSymbol, {
            x: 100,
            y: 330,
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        });

        gr.lib._bonusAntiPlaque.pixiContainer.addChild(spineSymbol);

        gr.lib._bonusAntiPlaque.spine = spineSymbol;
        this.headerSpineSymbol = new PIXI.spine.Spine(resLib.spine.instantWinAnim.spineData);
        gameUtils.setSpineStype(this.headerSpineSymbol, {
            x: 0,
            y: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 1
        });
        this.headerSpineSymbol.state.setAnimationByName(0, "instantWinAnim_Idle", true);
        this.headerSpineSymbol.originalW = this.headerSpineSymbol.width;
        this.headerSpineSymbol.originalH = this.headerSpineSymbol.height; // gr.lib._warpBonusHeader.pixiContainer.addChild(spineSymbol);
        // gr.lib._warpBonusHeader.spine = spineSymbol; 

        spineSymbol = new PIXI.spine.Spine(resLib.spine.instantWinAnim.spineData); //IW symbol in reel

        gameUtils.setSpineStype(spineSymbol, {
            x: 80,
            y: 76,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 1
        });

        gr.lib._IWSpine.pixiContainer.addChild(spineSymbol);

        gr.lib._IWSpine.spine = spineSymbol; // gr.lib._IWSpine.originalY= gr.lib._IWSpine.getCurrentStyle()._top;
        // spineSymbol.state.setAnimationByName(0,"instantWinAnim_Intro",true);
    };

    StandardBonusController.prototype.initReels = function() {
        var reels = this.reelset.getChildren();
        var reelName = null;
        var reelSpr = null;
        var reelData = {};
        reelData.symbolsMap = Object.assign({}, config.symbolsMap);

        var _arr = Object.keys(reels);

        for (var _i3 = 0; _i3 < _arr.length; _i3++) {
            var item = _arr[_i3];
            reelName = reels[item].getName();
            reelSpr = reels[item];
            reelData.sourceObj = reelSpr;
            reelData.orderInReelset = this.reels.reception.length; //just to get a number in order, during reels initialisation

            reelData.offPositionY = this.reelOffPosY[reelSpr.orderInReelset];
            reelData.offPositionX = [-10, 810]; //reelData.currentStake = this.currentStake;

            this.reels[reelName] = new ReelH(reelData);
            this.reels.reception.push(reelName);
        }
    }; // StandardBonusController.prototype.initUfoKeyFrameAnimation = function() {
    //  this.ufoAnimation = new KeyFrameAnimation({
    //    "_name": 'ufoArctanMovement',
    //    "tweenFunc": TweenFunctions.linear,
    //    "_keyFrames": [
    //      {
    //        "_time": 0,
    //        "_SPRITES": []
    //      },
    //      {
    //        "_time": config.timers.standard_startReelSpinningDelay,
    //        "_SPRITES": []
    //      }
    //    ]
    //  });
    //  this.ufoAnimation._onUpdate = new CallbackFunc(this, this.ufoAnimationOnUpdate);
    //  this.ufoAnimation._onComplete = new CallbackFunc(this, this.ufoAnimationOnComplete);
    // };
    // StandardBonusController.prototype.ufoAnimationOnUpdate = function({caller:keyFrameAnim, time:timeDelta}) {
    //  const tweenFunc = keyFrameAnim.animData.tweenFunc;
    //  const duration = keyFrameAnim.maxTime;
    //  timeDelta = Math.ceil(timeDelta);
    //  if(this.isPortrait()){
    //    //portrait mode, animate from from top left to bottom right horizontally
    //    //const x = tweenFunc(timeDelta, gr.getSize().width, -3 * this.ufoSprite.getCurrentStyle()._width, duration); // from top right to bottom left
    //    const x = tweenFunc(timeDelta, -this.ufoSprite.getCurrentStyle()._width, gr.getSize().width, duration);  // from top left to bottom right.
    //    const amplitude = 300;
    //    const y = parseInt(this.ufoSprite.data._style._top - this.ufoYMovement(timeDelta, amplitude, duration));
    //    const scale = tweenFunc(timeDelta, 1, 3, duration);
    //    this.ufoSprite.updateCurrentStyle({"_top": y, "_left":x, "_transform":{"_scale":{"_x":scale, "_y":scale}}});
    //  }
    //  else{
    //    //landscape mode, animate from top center to bottom right vertically.
    //    //const y = tweenFunc(timeDelta, this.gr.getSize().height, -3 * this.actionBonusFlyingETSprite.getCurrentStyle()._height, duration); // from top right to bottom left
    //    const y = tweenFunc(timeDelta, -this.ufoSprite.getCurrentStyle()._height, gr.getSize().height, duration);  // from top right to bottom left.
    //    const amplitude = 300;
    //    const x = parseInt(this.ufoSprite.data._style._left - this.ufoYMovement(timeDelta, amplitude, duration));
    //    const scale = tweenFunc(timeDelta, 1, 3, duration);
    //    this.ufoSprite.updateCurrentStyle({"_top": y, "_left":x, "_transform":{"_scale":{"_x":scale, "_y":scale}}});  
    //  }
    // };


    StandardBonusController.prototype.startSpinAnim = function() {
        msgBus.publish(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_GO_BUTTON_CLICKED);
        audio.play("Bonus1Shuffle", 1);
        this.startSpin();
    }; // StandardBonusController.prototype.ufoYMovement = function(timeDelta, amplitude, duration) {
    //  //return -amplitude * Math.atan(-amplitude + (timeDelta/duration)*amplitude*2);
    //  return amplitude * Maths.sin(Math.PI * (0.5 +  timeDelta / duration));
    // /*function (t, b, _c, d, a = 5, r = 1){
    //  return b + amplitude * Maths.sin( t / d * r * 2 * Math.PI);*/
    // };
    // StandardBonusController.prototype.playUfoAnimation = function (){
    //  this.ufoAnimation.play();
    // };
    // StandardBonusController.prototype.disableButton = function (){
    //  this.goButton.enable(false);
    // };
    // StandardBonusController.prototype.enableButton = function (){
    //  this.goButton.enable(true);
    // };
    // StandardBonusController.prototype.goButtonOnClick = function(){
    //  msgBus.publish(LittleGreenMenGameEvent.eventIDs.STANDARD_BONUS_GO_BUTTON_CLICKED);
    //  this.goButton.enable(false);
    //  this.goButton.show(false);
    //  this.playSoundByConfig('ButtonGo');
    //  this.startSpin();
    // };


    StandardBonusController.prototype.startShadowHeartBeat = function() {
        if (!this.outterLightHeartBeatKeyAnim) {
            this.outterLightHeartBeatKeyAnim = new KeyFrameAnimation({
                "_name": this.outterLight.getName() + 'HBAnimation',
                "tweenFunc": TweenFunctions.linear,
                "_keyFrames": [{
                    "_time": 0,
                    "_SPRITES": [{
                        "_name": this.outterLight.getName(),
                        "_style": {
                            "_opacity": 0
                        }
                    }]
                }, {
                    "_time": config.timers.standard_honeyCombHaloHeartBeat0to1Druation,
                    "_SPRITES": [{
                        "_name": this.outterLight.getName(),
                        "_style": {
                            "_opacity": 1
                        }
                    }]
                }, {
                    "_time": config.timers.standard_honeyCombHaloHeartBeat0to1Druation + config.timers.standard_honeyCombHaloHeartBeat1to0Druation,
                    "_SPRITES": [{
                        "_name": this.outterLight.getName(),
                        "_style": {
                            "_opacity": 0
                        }
                    }]
                }]
            });
        }

        this.outterLightHeartBeatKeyAnim.setLoop(true);
        this.outterLightHeartBeatKeyAnim.play();
    };

    StandardBonusController.prototype.stopShadowHeartBeat = function() {
        this.outterLightHeartBeatKeyAnim.stop();
    };

    StandardBonusController.prototype.startSpin = function() {
        this.spinReel(0);
        this.startShadowHeartBeat();
    };

    StandardBonusController.prototype.spinReel = function(index) {
        var reel = this.getReelAtIndex(index);
        reel.updateCurrentStake(this.currentStake); //reel.spin(this.responseData[index]);

        reel.spin(this.responseData);
        index++;

        var _this = this;

        if (index < this.numOfReels) {
            gr.getTimer().setTimeout(function() {
                _this.spinReel(index);
            }, config.timers.standard_reelsSpinGap);
        } else {
            //all reels started spin, wait for 2 seconds then start reel stopping;
            gr.getTimer().setTimeout(function() {
                _this.stopReel(0);
            }, config.timers.standard_startReelStopUntil);
        }
    };

    StandardBonusController.prototype.stopReel = function(index) {
        this.getReelAtIndex(index).stopReel();
        index++;

        if (index < this.numOfReels) {
            var _this2 = this;

            gr.getTimer().setTimeout(function() {
                _this2.stopReel(index);
            }, config.timers.standard_reelsStopGap);
        }
    };

    StandardBonusController.prototype.allReelStoppedHandler = function() {
        this.stopShadowHeartBeat();
        this.showWinningSequence(0);
    };

    StandardBonusController.prototype.showWinningSequence = function(index) {
        if (this.isEveryThingOkay()) {
            var reel = this.getReelAtIndex(index);
            reel.presentWinSymbolAnimation();
        }
    };
    /*  StandardBonusController.prototype.showWinningSequenceFinished = function (){
        this.exit();
      };*/


    StandardBonusController.prototype.getReelAtIndex = function(num0To6) {
        num0To6 = parseInt(num0To6);

        if (this.reels.reception[num0To6]) {
            return this.reels[this.reels.reception[num0To6]];
        } else {
            throw new Error('Can not found Reels at ' + num0To6);
        }
    };

    StandardBonusController.prototype.isPortrait = function() {
        return gr.getSize().height > gr.getSize().width;
    };

    StandardBonusController.prototype.newMask = function(style) {
        var mask = new PIXI.Graphics();
        mask.data = {};
        mask.data._name = "point"; // mask.pathData = style;
        // this.drawRectangleMask();

        mask.clear();
        mask.beginFill(0xAA00AA);
        mask.lineStyle(1, 0xFFAAFF, 1);
        mask.drawRect(style.startPos.x, style.startPos.y, style.width, style.height);
        mask.endFill();
        mask.alpha = 0;
        this.maskParent.addChild(mask);
        return mask;
    };

    StandardBonusController.prototype.createMask = function() {
        this.maskL = this.newMask(config.positions.standardReelsetDrawMask.landscape);
        this.maskP = this.newMask(config.positions.standardReelsetDrawMask.portrait);
        this.spriteToBeMask.pixiContainer.mask = this.isPortrait() ? this.maskP : this.maskL;
    }; // StandardBonusController.prototype.drawRectangleMask = function (posChain = this.mask.pathData){
    //  this.mask.clear();
    //  this.mask.beginFill(0xAA00AA);
    //  this.mask.lineStyle(1, 0xFFAAFF, 1);
    //  this.mask.drawRect(posChain.startPos.x, posChain.startPos.y, posChain.width, posChain.height);
    //  this.mask.endFill();
    //  this.mask.alpha = 0.5;
    // };
    // StandardBonusController.prototype.drawHexagonMask = function (posChain = this.mask.pathData){
    //  this.mask.clear();
    //  this.mask.beginFill(0xAA00AA);
    //  this.mask.lineStyle(1, 0xFFAAFF, 1);
    //  //console.group();
    //  let node;
    //  for (let i = 0; i < posChain.length; i++) {
    //    node = posChain[i];
    //    if(i==0){
    //      this.mask.moveTo(node.left.x, node.left.y);
    //    }
    //    else{
    //      this.mask.lineTo(node.left.x, node.left.y);
    //    }
    //    this.mask.quadraticCurveTo(node.cp.x, node.cp.y, node.right.x, node.right.y);
    //    //console.log(`i:${i}, cP_x:${node.cp.x}, cP_y:${node.cp.y}, leftX:${node.left.x}, leftY:${node.left.y}, rightX:${node.right.x}, rightY:${node.right.y}`);
    //  }
    //  this.mask.endFill();
    //  this.mask.alpha = 0.5;
    // };


    StandardBonusController.prototype.formatResultData = function() {
        if (typeof this.responseData === 'string') {
            this.responseData = this.responseData.match(new RegExp('.{1}', "g"));
        }
    };

    StandardBonusController.prototype.exit = function() {
        if (this.isEveryThingOkay()) {
            var _this3 = this;

            gr.getTimer().setTimeout(function() {
                if (_this3.isEveryThingOkay()) {
                    gr.lib._standardSpine.spine.state.setAnimationByName(0, "land_transition_Base", false);

                    audio.play("Bonus1toBaseTransition", 2);
                    audio.fadeOut(3, 200); //fade out Bonus1MusicLoop

                    audio.playAndFadeIn(0, "MusicLoop", true, 200, {
                        completeCallback: function completeCallback() {
                            audio.volume(0, 0.4);
                        }
                    });
                }
            }, config.timers.standard_startFadeOutDelay);
        }
    };

    StandardBonusController.prototype.beforeEntre = function(data) {
        if (data.rs) {
            this.responseData = data.rs;
            this.onTicketCostChanged(data.currentStake);

            if (this.isEveryThingOkay()) {
                this.resetAllReels();
            }
        }

        gr.lib._IWSpine.spine.state.setEmptyAnimations();

        gr.lib._IWwinValue.show(false);
    };

    StandardBonusController.prototype.resetAllReels = function() {
        var reel;

        for (var i = 0; i < this.reels.reception.length; i++) {
            reel = this.getReelAtIndex(i);
            reel.reset();
        }
    };

    StandardBonusController.prototype.hide = function() {
        this.mainSprite.show(false);
        this.mainSprite.updateCurrentStyle({
            "_opacity": 1
        });
    };

    StandardBonusController.prototype.onTicketCostChanged = function(prizePoint) {
        this.currentStake = prizePoint;
    };

    StandardBonusController.prototype.handleTextWithImage = function(parentSpr, linesArr) {
        var spiney = 20;
        var curStyle = parentSpr._currentStyle;
        var fSize = curStyle._font._size,
            parentWidth = curStyle._width,
            parentHeight = curStyle._height,
            contentWidth = 0,
            contentHeight;
        var regImg = new RegExp('\{[^\{]+\}', 'g');
        var perLineHeight = Math.floor((curStyle._height - (linesArr.length - 1) * 10) / linesArr.length);
        var txtStyle = {
            fontWeight: curStyle._font._weight,
            fontFamily: curStyle._font._family,
            fontSize: fSize,
            fill: '#' + curStyle._text._color,
            align: curStyle._text._align,
            lineHeight: perLineHeight,
            height: perLineHeight
        };

        if (curStyle._text._gradient) {
            txtStyle._gradient = curStyle._text._gradient;
        }

        createLineSpr();

        while (contentWidth > parentWidth || contentHeight > parentHeight - (linesArr.length - 1) * 10) {
            fSize--;
            txtStyle.fontSize = fSize;
            createLineSpr();
        }

        setPosition(this.isPortrait());

        function createLineSpr() {
            parentSpr.pixiContainer.removeChildren();
            var prevContentWidth = 0;
            contentHeight = 0;

            for (var i = 0; i < linesArr.length; i++) {
                var txts = linesArr[i].split(regImg);
                var imgs = linesArr[i].match(regImg);
                contentWidth = 0;

                if (txts.length === 1 && imgs === null) {
                    var txtSpr = new PIXI.Text(txts[0], txtStyle);

                    if (txtStyle._gradient) {
                        updateGradientStyle(txtSpr, txtStyle._gradient);
                    }

                    parentSpr.pixiContainer.addChild(txtSpr);
                    contentWidth = txtSpr.width;
                    contentHeight += txtSpr.height;
                } else {
                    var lineSpr = new PIXI.Container();
                    createSubSpr(lineSpr, txts, imgs);
                    contentHeight += lineSpr.cttHeight;
                }

                contentWidth = prevContentWidth >= contentWidth ? prevContentWidth : contentWidth;
                prevContentWidth = contentWidth;
            }

            function updateGradientStyle(txtObj, gStyle) {
                var colorArr = [];

                for (var i = 0; i < gStyle._color.length; i++) {
                    colorArr[i] = "#" + gStyle._color[i];
                }

                txtObj.style.fill = colorArr;
                txtObj.style.fillGradientStops = gStyle._stop;

                if (gStyle._orientation === "horizontal") {
                    txtObj.style.fillGradientType = PIXI.TEXT_GRADIENT.LINEAR_HORIZONTAL;
                } else {
                    txtObj.style.fillGradientType = PIXI.TEXT_GRADIENT.LINEAR_VERTICAL;
                }
            }

            function createSubSpr(container, txtArr, imgArr) {
                var imgW,
                    imgH,
                    prevSubHeight = 0;

                for (var j = 0; j < txtArr.length; j++) {
                    var txtSprite = new PIXI.Text(txtArr[j], txtStyle);

                    if (txtStyle._gradient) {
                        updateGradientStyle(txtSprite, txtStyle._gradient);
                    }

                    container.addChild(txtSprite);
                    contentWidth += txtSprite.width;
                    container.cttHeight = prevSubHeight >= txtSprite.height ? prevSubHeight : txtSprite.height;
                    prevSubHeight = container.cttHeight;

                    if (imgArr[j]) {
                        container.addChild(_this.headerSpineSymbol); // _this.headerSpineSymbol.state.setAnimationByName(0, "instantWinAnim_Idle", true);
                        // imgName = imgArr[j].match(new RegExp('[^\{\@\}]+'))[0];
                        // imgSpr = PIXI.Sprite.fromImage(imgName);

                        imgW = _this.headerSpineSymbol.originalW * 1;
                        imgH = _this.headerSpineSymbol.originalH * 1; // ratio = imgW / imgH;

                        var initHeight = perLineHeight >= imgH ? perLineHeight : perLineHeight; // var initHeight = imgH;
                        // container.addChild(imgSpr);

                        var scale = (initHeight + spiney) / imgH;
                        _this.headerSpineSymbol.scale.y = scale;
                        _this.headerSpineSymbol.scale.x = scale; // _this.headerSpineSymbol.x = 165;
                        // _this.headerSpineSymbol.y = 20;

                        contentWidth += imgW * scale; // container.cttHeight = prevSubHeight >= imgH /2 ? prevSubHeight : imgH/2;
                        // container.cttHeight = Number(container.cttHeight) + 10;
                        // container.cttHeight = container.cttHeight > perLineHeight ? perLineHeight : container.cttHeight;

                        container.cttHeight = prevSubHeight >= initHeight ? prevSubHeight : initHeight; // container.cttHeight = Number(container.cttHeight) + 10;

                        container.cttHeight = container.cttHeight > perLineHeight ? perLineHeight : container.cttHeight;
                        prevSubHeight = container.cttHeight;
                    }

                    container.cttWidth = contentWidth;
                }

                parentSpr.pixiContainer.addChild(container);
            }
        }

        function setPosition(isPortrait) {
            var line, prevLine, prevSpr;

            for (var i = 0; i < parentSpr.pixiContainer.children.length; i++) {
                line = parentSpr.pixiContainer.children[i];

                if (line.children.length === 0) {
                    line.x = (parentWidth - line.width) / 2;
                } else {
                    for (var j = 0; j < line.children.length; j++) {
                        var subSpr = line.children[j];

                        if (j === 0) {
                            subSpr.x = 0;
                        } else {
                            prevSpr = line.children[j - 1];

                            if (subSpr.hasOwnProperty('_text')) {
                                if (prevSpr.hasOwnProperty('_text')) {
                                    subSpr.x = prevSpr.x + prevSpr.width;
                                } else {
                                    //pre is imag
                                    subSpr.x = prevSpr.x + prevSpr.width / 2;
                                }
                            } else {
                                subSpr.x = prevSpr.x + prevSpr.width + subSpr.width / 2;
                            }
                        }

                        if (subSpr.hasOwnProperty('_text')) {
                            //is a text
                            subSpr.y = (line.cttHeight - subSpr.height) / 2;
                        } else {
                            subSpr.y = spiney / 2;
                        }
                    }

                    line.x = (parentWidth - line.cttWidth) / 2;
                }

                if (i === 0) {
                    if (isPortrait) {
                        if (SKBeInstant.config.locale != 'en_us') {
                            line.y = (parentHeight - contentHeight - (linesArr.length - 1) * 10) / 2 - 30;
                        } else {
                            line.y = (parentHeight - contentHeight - (linesArr.length - 1) * 10) / 2;
                        }
                    } else {
                        line.y = (parentHeight - contentHeight - (linesArr.length - 1) * 10) / 2;
                    }
                } else {
                    prevLine = parentSpr.pixiContainer.children[i - 1];
                    line.y = prevLine.y + prevLine.cttHeight;
                }
            }
        }
    };

    StandardBonusController.prototype.playSoundByConfig = function(soundName) {
        var isloop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (config.audio && config.audio[soundName]) {
            var channel = config.audio[soundName].channel;

            if (!config.audio[soundName].hasOwnProperty("currentIndex")) {
                config.audio[soundName].currentIndex = 0;
            }

            if (Array.isArray(channel)) {
                audio.play(config.audio[soundName].name, channel[config.audio[soundName].currentIndex++ % channel.length]);
            } else {
                audio.play(config.audio[soundName].name, channel, isloop);
            }
        }
    };

    return StandardBonusController;
});
//# sourceMappingURL=standardBonusController.js.map