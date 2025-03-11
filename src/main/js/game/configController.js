/**
 * @module control some game config
 * @description control the customized data of paytable&help page and other customized config


 <api-key key="nloxrgynWRqU5B55HlN4lY8l8sO27A9xZ2Hq" roles="eiGame"/>
 */
define({
    timers:{
        basegame_gamePlayDelayAfterBuy:10,
        baseGame_ETFadeOutDuration:500,
        baseGame_logoFadeInDuration:800,
        baseGame_perSymbolLandingDuration:800,
        baseGame_perSymbolLandingDelay: 100, // the middle landing symbol fires every 100 ms
        baseGame_symbolHoneyCombLastTimer: 500,
        baseGame_delayBetweenNextGroupExplosion: 10,
        baseGame_delayForReactDrop: 10,
        baseGame_reactDropDuration: 800,
        baseGame_winUpToAnimDuration:250,
        baseGame_scaleStayDuration:150,
        baseGame_planetFlyPingPongDuration:50,
        baseGame_planetFlyCollectDuration:400,
        baseGame_noMoreChainAnimationDuration:300,
        baseGame_noMoreChainPanelStayDuration:1700,
        prizeTable_levelUpTextDisplayMinimum:200,
        prizeTable_levelUpAnimationDuration:100,
        prizeTable_AchievedNumberrollingUpDuration:700,
        prizeDetailFadeoutDuration:150,
        result_sunShineAnimationDuration:1000,
        result_autoHideCountDown:5000,
        prizeDetailFadeCountDownDuration:5000,

        
        standard_delayAfterComebackFromBonus:1000,
        standard_UFOFlyCurvePathDuration:500,
        standard_UFOPingPongMovementDuration:500, 
        standard_UFOZoomInAndFadeOutDuration:500,
        standard_spinBounceUpDuration:300,
        standard_spinPerSymbolMovementDuration:50,
        standard_spinStopDuration:500,
        standard_spinStopSlowingMultiplier: 10,
        standard_instantWinPricePopupDuration:500,
        standard_honeyCombHaloHeartBeat0to1Druation:800,
        standard_honeyCombHaloHeartBeat1to0Druation:800,
        standard_dimFadeInOrOutDruation:300,
        standard_startFadeOutDelay:1000,
        standard_reelsSpinGap:200,
        standard_reelsStopGap:200,
        standard_startReelStopUntil:1000,
        standard_reelsShowWinningGap:500,
        standard_startReelSpinningDelay:1000, //the delay for acting go button replacement animation automatically

        transition_screenFadeInOrOutDuration: 1000,
        transition_startUFOAnimationAfterFadeInDelay:500,
        transition_startFadeOutAfterUFOFlyOffDelay:1000,


        action_spinActionPerMovementDuration:200,
        action_spinActionShowWinSequence_delay: 500,
        action_bulletFlyingDuration:400,
        action_honeyCombBolderFadeInAndOutDuration:1000,

        ufoMeteorite_symbolBonusIconPingPongDuration:600,
        ufoMeteorite_symbolBonusIconCollectDuration:200,
        ufoMeteorite_multiBonusSymbolsLiteUpGap:250,//the gap between 2 ufo/meteorite icons being lite up.
    },
    positions:{
        mainSpineET:{
            portrait:{x:400, y:800,scaleX:0.85, scaleY:0.85, rotation:0,alpha:1},
            landscape:{x:680, y:360,scaleX:0.85, scaleY:0.85, rotation:0,alpha:1}
        },
        logoSpineET:{
            portrait:{x:300,y:180,scaleX:1, scaleY:1, rotation:0,alpha:0},
            landscape:{x:214,y:108,scaleX:1, scaleY:1, rotation:0,alpha:0}
        },
        warpBonusET:{
            portrait:{x:300,y:150,scaleX:0.3, scaleY:0.3, rotation:-0.05,alpha:1},
            landscape:{x:110,y:310,scaleX:0.43, scaleY:0.43, rotation:-0.05,alpha:1}
        },
        baseGameReelsetMask:{
            portrait:{x:78,y:306,scaleX:1, scaleY:1},
            landscape:{x:691,y:20,scaleX:0.93, scaleY:0.93}
        },
        baseGameReelsetDrawMask:{
            portrait:{x:408,y:820,armLenth:360,roundDeg:2.5},
            landscape:{x:685,y:389,armLenth:360,roundDeg:2.5} // 1014-325 = 689
        },
        standardTranSpine:{
            portrait:{x:415, y:700,scaleX:1, scaleY:1, alpha:1},
            landscape:{x:700, y:400,scaleX:1, scaleY:1, alpha:1}
        },
        actionSpinTranSpine:{
            portrait:{x:415, y:800,scaleX:1, scaleY:1, alpha:1},
            landscape:{x:680, y:400,scaleX:1, scaleY:1, alpha:1}
        },
        standardReelsetDrawMask:{
            // portrait:[
            //     {"cp": {"x": 406,      "y": 1102},  "left": {"x": 384, "y": 1090},     "right": {"x": 426, "y": 1090}},
            //     {"cp": {"x": 734,      "y": 900},   "left": {"x": 718, "y": 912},      "right": {"x": 733, "y": 884}},
            //     {"cp": {"x": 730,      "y": 514},   "left": {"x": 732, "y": 557},      "right": {"x": 706, "y": 500}},
            //     {"cp": {"x": 404,      "y": 324},   "left": {"x": 424, "y": 336},      "right": {"x": 382, "y": 336}},
            //     {"cp": {"x": 70,       "y": 528},   "left": {"x": 95,  "y": 514},      "right": {"x": 74,  "y": 557}},
            //     {"cp": {"x": 76,       "y": 910},   "left": {"x": 74,  "y": 894},      "right": {"x": 95,  "y": 926}},
            //     {"cp": {"x": 406,      "y": 1102},  "left": {"x": 384, "y": 1090},     "right": {"x": 426, "y": 1090}}
            // ],
            portrait:{
                "startPos":{"x":27,"y":555},
                "width":765,
                "height": 520
            },
            landscape:{
                "startPos":{"x":398,"y":100},
                "width":852,
                "height": 580
            }
            // landscape:[
            //     {"cp": {"x": 1045,   "y": 716},  "left": {"x": 1030,  "y": 710},  "right": {"x": 1060, "y": 710}},
            //     {"cp": {"x": 1337,  "y": 539},  "left": {"x": 1325, "y": 548},  "right": {"x": 1340, "y": 523}},
            //     {"cp": {"x": 1341,  "y": 190},  "left": {"x": 1340, "y": 216},  "right": {"x": 1323, "y": 180}},
            //     {"cp": {"x": 1040,   "y": 15},   "left": {"x": 1058, "y": 23},   "right": {"x": 1025,  "y": 23}},
            //     {"cp": {"x": 752,   "y": 200},  "left": {"x": 764,  "y": 191},  "right": {"x": 749,  "y": 216}},
            //     {"cp": {"x": 745,   "y": 550},  "left": {"x": 749,  "y": 523},  "right": {"x": 764,  "y": 560}},
            //     {"cp": {"x": 1045,   "y": 716},  "left": {"x": 1030,  "y": 710},  "right": {"x": 1060, "y": 710}} 
            // ]
        },
        winScreenETwithBG:{
            portrait:{x:-70, y:1320, scaleX:1.1, scaleY:1.1, rotation: 0.05},
            landscape:{x:-120, y:1160, scaleX:1.1, scaleY:1.1, rotation: 0.05}
        },
        winScreenETwithoutBG:{
            portrait:{x: 350, y: 700, scaleX:0.7, scaleY:0.7, rotation: -0.1},
            landscape:{x:400, y:270, scaleX:0.7, scaleY:0.7, rotation: -0.1}
        }
    },
    style: {
        //button_label:{dropShadow: true, dropShadowDistance: -4, dropShadowAlpha: 0.8, dropShadowBlur: 10, dropShadowAngle: -Math.PI / 4, dropShadowColor: "#cc4e12"},
        button_label:{dropShadow: false, dropShadowDistance: 4, dropShadowAlpha: 0.8, dropShadowBlur: 10, dropShadowAngle: Math.PI / 3, dropShadowColor: "#cc4e12"},
        win_Text: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.7, dropShadowAngle: Math.PI / 3, dropShadowBlur: 5, dropShadowColor: "#380e54", padding:3},
        win_Try_Text: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.7, dropShadowAngle: Math.PI / 3, dropShadowBlur: 5, dropShadowColor: "#380e54", padding:3},
        win_Value_color: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.7, dropShadowBlur: 5, dropShadowColor: "#380e54"},
        nonWin_Text: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowAngle: Math.PI / 3, dropShadowBlur: 20, dropShadowColor: "#5f300a", padding:10},
        errorText: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowBlur: 10},
        warningText: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowBlur: 10},
        tutorialTitleText: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowBlur: 10},
        winUpToText: {dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.7, dropShadowBlur: 10, dropShadowColor: "#851728"},
        winUpToValue: {dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.7, dropShadowBlur: 10, dropShadowColor: "#851728"},
        priceTableHeaderText:{dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.7, dropShadowBlur: 10, dropShadowColor: "#00deff"},
        priceTablePriceLevel0:{fontSize:24, fill:'#2fb718', dropShadow: false, dropShadowDistance: 0, dropShadowAlpha: 0.8, dropShadowBlur: 10, dropShadowColor: "#faff54"},
        priceTablePriceLevel0_win:{fontSize:26, fill:'#faff54', dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.8, dropShadowBlur: 10, dropShadowColor: "#faff54"},
        priceTablePriceLevel1:{fontSize:20, fill:'#1ed1f1'},
        priceTablePriceLevel2:{fontSize:20, fill:'#1ed1f1'},

        prizeText:{fontSize:26, fill:'#3666b5', dropShadow: false, dropShadowDistance: 0, dropShadowAlpha: 0.8, dropShadowBlur: 10, dropShadowColor: "#3666b5"},
        prizeText_win:{fontSize:28, fill:'#faff54', dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.6, dropShadowBlur: 6, dropShadowColor: "#faff54"},

        priceTableRollingUpText:{fill:'#ffffff', dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.5, dropShadowBlur: 6, dropShadowColor: "#263588", strokeColor:"263588"},
        priceTableRollingUpTextWin:{fill:'#ffff00', dropShadow: true, dropShadowDistance: 0, dropShadowAlpha: 0.5, dropShadowBlur: 6, dropShadowColor: "#6f1776", strokeColor:"6f1776"},

        warpBonusTitle:{dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.8, dropShadowAngle: Math.PI / 3, dropShadowBlur: 10, dropShadowColor: "#5f300a"},
        noMoreChainText: {dropShadow: true, dropShadowDistance: 5, dropShadowAlpha: 0.9, dropShadowBlur: 8, dropShadowColor: "#000000"},   
        balanceText: {padding:5},
        balanceValue: {padding:5}, 
        winsText: {padding:5}, 
        winsValue: {padding:5}, 
        ticketCostMeterText: {padding:5}, 
        ticketCostMeterValue: {padding:5}, 
    },
    symbolsMap:{
        A:"blue",
        B:"yellow",
        C:"purple",
        D:"green",
        E:"orange",
        F:"red",
        IW:'IW',
        X: 'bubble',
    },
    positionMap:[
        "r0s3", "r0s2", "r0s1", "r0s0",
        "r1s4", "r1s3", "r1s2", "r1s1", "r1s0",
        "r2s5", "r2s4", "r2s3", "r2s2", "r2s1", "r2s0",
        "r3s6", "r3s5", "r3s4", "r3s3", "r3s2", "r3s1", "r3s0", 
        "r4s5", "r4s4", "r4s3", "r4s2", "r4s1", "r4s0", 
        "r5s4", "r5s3", "r5s2", "r5s1", "r5s0", 
        "r6s3", "r6s2", "r6s1", "r6s0",
    ],
    actionBonusEffect:{
        "S1":{ "source":[[18,25,26,20,13,12]], 'colourCodes':['x03']},
        "S2":{ "source":[[17,24,30,31,32,27,21,14,8,7,6,11]], 'colourCodes':['x03']},
        "S3":{ "source":[[16,23,29,34,35,36,37,33,28,22,15,9,4,3,2,1,5,10]], 'colourCodes':['x03']}, 
        "S4":{ "source":[[16,23,29,34,35,36,37,33,28,22,15,9,4,3,2,1,5,10],[18,25,26,20,13,12]], 'colourCodes':['x03','x05']}, 
        "S5":{ "source":[[16,23,24,18,11,10],[31,36,37,33,27,26],[7,13,14,9,4,3]], 'colourCodes':['x03','x05','x04']}, 
        "S6":{ "source":[[23,29,30,25,18,17],[26,32,33,28,21,20],[6,12,13,8,3,2]], 'colourCodes':['x03','x05','x04']}, 
        "S7":{ "source":[[29,34,35,31,25,24],[20,27,28,22,15,14],[5,11,12,7,2,1]], 'colourCodes':['x03','x05','x04']}, 
        "S8":{ "source":[[30,35,36,32,26,25],[13,20,21,15,9,8],[10,17,18,12,6,5]], 'colourCodes':['x03','x05','x04']}, 
        "S9":{ "source":[[16,23,24,18,11,10],[30,35,36,32,26,25],[20,27,28,22,15,14],[6,12,13,8,3,2]], 'colourCodes':['x03','x05','x04','x06']}, 
        "S10":{ "source":[[23,29,30,25,18,17],[31,36,37,33,27,26],[13,20,21,15,9,8],[5,11,12,7,2,1]],  'colourCodes':['x03','x05','x04','x06']},
        "S11":{ "source":[[29,34,35,31,25,24],[26,32,33,28,21,20],[7,13,14,9,4,3],[10,17,18,12,6,5]],  'colourCodes':['x03','x05','x04','x06']}, 

        "R1":{ "source":[[37,32,26,19,12,6,1]]}, 
        "R2":{ "source":[[16,17,18,19,20,21,22]]}, 
        "R3":{ "source":[[34,30,25,19,13,8,4]]}, 
        "R4":{ "source":[[18,25,26,20,13,12]]},
        "R5":{ "source":[[24,31,27,14,7,11,19]]},
        "R6":{ "source":[[17,30,32,21,8,6,19]]}, 
        "R7":{ "source":[[16,34,37,22,4,1,19]]},
    },
    backgroundStyle: {
        "splashSize": "100% 100%",
        "gameSize": "100% 100%"
    },
    winMaxValuePortrait: true,
    winUpToTextFieldSpace: 10,
    textAutoFit: {
        "mainIntroText":{
            "isAutoFit":true,
        },
        "noMoreChainText":{
            "isAutoFit":true,
        },
        "priceTableHeaderText":{
            "isAutoFit":true,
        },
        "autoPlayText": {
            "isAutoFit": true
        },
        "autoPlayMTMText": {
            "isAutoFit": true
        },
        "buyText": {
            "isAutoFit": true
        },
        "playText": {
            "isAutoFit": true
        },
        "tryText": {
            "isAutoFit": true
        },
        "quickPickText": {
            "isAutoFit": true
        },
        "clearText": {
            "isAutoFit": true
        },
        "speedText": {
            "isAutoFit": true
        },
        "warningExitText": {
            "isAutoFit": true
        },
        "warningContinueText": {
            "isAutoFit": true
        },
        "warningText": {
            "isAutoFit": true
        },
        "errorExitText": {
            "isAutoFit": true
        },
        "winBoxExitText": {
            "isAutoFit": true
        },
        "errorTitle": {
            "isAutoFit": true
        },
        "errorText": {
            "isAutoFit": false
        },
        "exitText": {
            "isAutoFit": true
        },
        "playAgainText": {
            "isAutoFit": true
        },
        "playAgainMTMText": {
            "isAutoFit": true
        },
        "MTMText": {
            "isAutoFit": true
        },
        "win_Text": {
            "isAutoFit": true
        },
        "win_Try_Text": {
            "isAutoFit": true
        },
        "win_Value": {
            "isAutoFit": true
        },
        "closeWinText": {
            "isAutoFit": true
        },
        "nonWin_Text": {
            "isAutoFit": true
        },
        "closeNonWinText": {
            "isAutoFit": true
        },
        "win_Value_color": {
            "isAutoFit": true
        },
        "ticketCostText": {
            "isAutoFit": true
        },
        "ticketCostValue": {
            "isAutoFit": true
        },
        "spotText": {
            "isAutoFit": true
        },
        "spotFrequency": {
            "isAutoFit": true
        },
        "tutorialTitleText": {
            "isAutoFit": true
        },
        "closeTutorialText": {
            "isAutoFit": true
        },
        "winUpToText": {
            "isAutoFit": true
        },
        "winUpToValue": {
            "isAutoFit": true
        },
        "multiplierText": {
            "isAutoFit": true
        },
        "prizeTableText": {
            "isAutoFit": true
        },
        "matchText": {
            "isAutoFit": true
        },
        "prizeText": {
            "isAutoFit": true
        },
        "prizeWinText": {
            "isAutoFit": true
        },
        "versionText": {
            "isAutoFit": true
        },
        "payTable": {
            "isAutoFit": true
        },
        "goButtonText":{
            "isAutoFit": true
        }
    },
    audio: {
        "ButtonGeneric": {
            "name": "ButtonClick",
            "channel": "5"
          },
          "ButtonBetMax": {
            "name": "BetMax",
            "channel": "5"
          },
          "ButtonBetUp": {
            "name": "BetUp",
            "channel": ["4", "3"]
          },
          "ButtonBetDown": {
            "name": "BetDown",
            "channel": ["3", "4"]
          },
          "SymbolCombine": {
            "name": "SymbolCombine",
            "channel": ["7", '8']
          },
          "Bonus1Reveal": {
            "name": "Bonus1Reveal",
            "channel": ["1", '2']
          },
          "Win": {
            "name": "MusicLoopTermWin",
            "channel": "0"
          },
          "Loss": {
            "name": "MusicLoopTermLose",
            "channel": "0"
          },
          "baseGameLoop": {
            "name": "MusicLoop",
            "channel": "0"
          },
          "ReactDrop": {
            "name": "SymbolsDrop",
            "channel": "9"
          },
          "ReelLanding": {
            "name": "SymbolsDropInitial",
            "channel": "10"
          },
          "ButtonBuy": {
            "name": "ButtonBuy",
            "channel": "2"
          },
          "ButtonPress": {
            "name": "ButtonClick",
            "channel": "5"
          },
          "PlanetRollingUp": {
            "name": "SymbolPrizeIncrease",
            "channel": ["9", "10"]
          },
          "StandardBonusAchieved": {
            "name": "SymbolBonusIncrease1",
            "channel": ["3", "4"]
          },
          "ActionBonusAchieved": {
            "name": "SymbolBonusIncrease2",
            "channel": ["5", "6"]
          },
          "aBonusPerSpin": {
            "name": "SymbolShuffle",
            "channel": ["9", "10"]
          },
          "sBonusTransition": {
            "name": "TransitionBonus1",
            "channel": "8"
          },
          "showBonusMsg": {
            "name": "TransitionMessage",
            "channel": "7"
          },
          "collection": {
            "name": "SymbolBonus",
            "channel": ["1", "2"]
          },
          "PlanetWin":{
              "name":"SymbolWinPrize",
              "channel":["7","8"]
          },

    },
    gladButtonImgName: {
        //audioController
        "buttonAudioOn": "soundOnButton",
        "buttonAudioOff": "soundOffButton",
        
        "AllPanelOKButton" : "tutorialOKButton",

        "ticketCostPlus":'plusButton',
        "ticketCostMinus":'minusButton',

        "iconOn":"tutorialPiontOn",
        "iconOff":"tutorialPiontOff"

    },
    gameParam: {
        //tutorialController
        "pageNum": 3,
        "arrowPlusSpecial": true,
        "popUpDialog": true
    },
    predefinedStyle: {
        "swirlName": "LoadingSwir",
        "splashLogoName": "portrait_gameLogo",
        "backgroundSize": "cover",
        landscape: {
            canvas: {
                width: 1440,
                height: 810,
                landscapeMargin: 0
            },
            gameImgDiv: {
                width: 1440,
                height: 810,
                top: 0
            },
            gameLogoDiv: {
                width: 810,
                height: 412,
                y: 320
            },
            progressSwirl: {
                width: 100,
                height: 100,
                animationSpeed: 0.5,
                loop: true,
                y: 600,
                scale: {
                    x: 1.2,
                    y: 1.2
                }
            },
            progressTextDiv: {
                y: 600,
                style: {
                    fontSize: 25,
                    fill: "#ffffff",
                    fontWeight: 800,
                    fontFamily: '"Oswald"',
                    stroke: "#3800a5",
                    strokeThickness:6
                }
            },
            copyRightDiv: {
                bottom: 20,
                fontSize: 20,
                color: "#d4c5fb",
                fontFamily: '"Arial"'
            }
        },
        portrait: {
            canvas: {
                width: 810,
                height: 1440
            },
            gameImgDiv: {
                width: 810,
                height: 1440,
                top: 0
            },
            gameLogoDiv: {
                width: 810,
                height: 412,
                y: 400
            },
            progressSwirl: {
                width: 100,
                height: 100,
                animationSpeed: 0.5,
                loop: true,
                y: 900,
                scale: {
                    x: 1.2,
                    y: 1.2
                }
            },
            copyRightDiv: {
                bottom: 20,
                fontSize: 18,
                color: "#d4c5fb",
                fontFamily: '"Arial"'
            },
            progressTextDiv: {
                y: 900,
                style: {
                    fontSize: 25,
                    fill: "#ffffff",
                    fontWeight: 800,
                    fontFamily: '"Oswald"',
                    stroke: "#3800a5",
                    strokeThickness:6
                }
            }
        }
    }

});
