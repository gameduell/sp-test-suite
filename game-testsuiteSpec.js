describe('jwl', function() {
    'use strict';

    var gameContainerNode;

    /**
     * Trigger loading of game.js.
     * @param cb executed on *successfull* loading of game.js (but does not mean that parsing succeeded, too). On error
     * a fail call is done.
     */
    function loadGameJs(cb) {
        var node = document.createElement('script');
        node.type = "text/javascript";
        node.async = true;
        node.setAttribute('src', 'base/src/main/resources/META-INF/resources/games/singleplayer/jwl/game.js');
        node.addEventListener('load', cb, false);
        node.addEventListener('error', function() {
            fail('Failed to load game.js');
        }, true);
        document.head.appendChild(node);
    }

    function addGameContainerNode() {
        gameContainerNode = document.createElement('div');
        // TODO check if id is the same for all games
        gameContainerNode.id = 'main_container';
        // TODO must be dynamic
        gameContainerNode.style.width = '780px';
        gameContainerNode.style.height = '524px';
        document.body.appendChild(gameContainerNode);
        expect(document.getElementById('main_container')).not.toBeNull();
    }

    beforeEach(function(done) {
        addGameContainerNode();
        loadGameJs(done);
    });

    /**
     * Create an instance of the game with standard config.
     * @returns {*}
     */
    function createGameInstance() {
        return Game.jwl.createInstance({
            mediaURL: 'base/src/main/resources/META-INF/resources/games/singleplayer/jwl/',
            language: 'de',
            width : '780px',
            height : '524px',
            gameContainer: gameContainerNode
        });
    }

    /**
     * Cleanup, removed gameContainerNode and deletes window.Game
     */
    afterEach(function() {
        document.body.removeChild(document.getElementById('main_container'));
        // TODO must not be window.Game for all gametypes
        delete window.Game;
    });

    describe('an instance of the game can be created', function() {
        it('an instance of the game can be created', function() {
            var gameInstance = createGameInstance();
            expect(gameInstance).toBeDefined();
        });
    });

    describe('game API must have expected functions', function () {

        var gameInstance;

        beforeEach(function() {
            gameInstance =  createGameInstance();
        });

        function expectGameApiFunction(functionName) {
            expect(gameInstance.hasOwnProperty(functionName)).toBeTruthy();
            expect(typeof gameInstance[functionName]).toEqual('function');
        }

        it('onGameEvent', function() {
            expectGameApiFunction("onGameEvent");
        });

        it('startGame', function() {
            expectGameApiFunction('startGame');
        });

        it('forceGameStart', function() {
            expectGameApiFunction('forceGameStart');
        });

        it('gameAbort', function () {
            expectGameApiFunction('gameAbort');
        });

        it('stopGame', function () {
            expectGameApiFunction('stopGame');
        });

        it('setSoundOn', function() {
            expectGameApiFunction('setSoundOn');
        });

        it('setFxOn', function() {
            expectGameApiFunction('setFxOn');
        });

        it('setColorBlindOn', function() {
            expectGameApiFunction('setColorBlindOn');
        });

        it('setGameDimensions', function () {
            expectGameApiFunction('setGameDimensions');
        });
    });

    describe('lifecycle tests', function () {

        var validSet = '1:3-5:3;3:3-5:6;3:3-5:3-4:3;3:3-4:6-1:6;3:3-5:3|4345531155412332135114315115321142323522542354352123243251524224;5423454422525145554341532435351233122114125353421542123355313453;2512155252312351123443452353225245341434441351453545435141313433;3144114255342343423153154414223123254343315531445433533151543115;3541511445152454221122124123124432455324243412114321334524422445;1352511221351441234245251324413355235434243514554452413115114241;4232434234415133353345531434451525432135123412535433454344134152;4352255441445543143433153412542335255445545341123251532215445443;5213125153113345243343235251145314511535554342514211443411342245;4352431241522441244133421421541332145252321441425532354344542513#43231221351351324452253123523134513551534151334215143421514124324112312113353553125523354224133223535355121131445442214524143131123535414155141253151433134223243344521134244512322445212544511545335122454232455135513152534112332142241323342341425221312325513113154142412315142441122334411451251122332521123243123344235135122141541135335331522154451553241352533125325425511324114515125232551125412353533443315134151322343215221543421314131334343223351535521445113542211551453343551415154331242143312154/4:3-2:3;7:3-2:6;3:3-7:3-4:3;2:3-4:3-1:6;3:3-2:3-5:3-1:6;3:3-7:3-4:6-2:6;5:3-3:6|4271131453574335311277541137414327227535571434343377577554533237;5432134114721235175327122542354755211714774142234473341134511754;4112515317724355475324415237754333141712732737434272214117731452;4357531117372121573573752421472135215132773352317752714443255337;2321433223475773355452255171223455753737312435121133717512213424;4745471172471414735525545745717327431574343425453212273741714127;3557744313737534145217224542341127213113221147443755175352112122;2453425271442515551221137344344373351721411451232547153147317531;4744714414531435255717537112534175237412327434241151713421753411;5521343455711313425325571147351155435723435275213341153445213455#52717122537273553743137234354123315725347145447521474313511771357715377113235154154323127452334751377137372154272243212713142745232554237721235742211337175234525123445247713554457243345723754525422177231151717713134541271431257421354432145345154727121124454127515371124325421241374212573714554237425435732242211745154523717252521142321432122734414771517353173522534453253775575543341554227574315155722713471357415312355255425241171173345754455427251517754227127277571125353312132543472515147575241135/1:3-7:3;7:3-5:6;1:3-2:3-3:3;5:3-7:3-4:6;2:3-4:6-7:6;2:3-5:3-1:6-3:6;4:3-5:6-2:6-7:6;4:3-1:6|3415152433423453217524272771323257452133122733553521721535324532;3233775323351227752147257425314742143377353425312153124477234412;2174433151717711242577177334225775254225251155322734273332154573;3545247237447245725517115124512127125527533171373313342437114727;3114345417232774133533537711744773272332211432117145324274242175;3575771435372422217413423241237324735144317542431257447771331315;5144727214715433244747412127471174235115223431771472551552411432;2252257124417255744743233771334772341577243553345353345472442552;2214217323537421132232312121355357152772335327341315445221531173;1347542554142434431511315423321552174343142171174472151557554277#37172547524252435723142344251417454717713123113123453412312274371352251225411213545744155412341223422455241714541321132423247144735441173255234431151575225257342714423142314173742334177434145355742757447713473113725477413357515517715573752311255754711532571771432134527413537741451477341547735577421524437537534221325574745172771374711471257353412745242277437554135121237117747414715342543253744112731771231133472152137335241131521452242121517234132113155323473554277273123323524511721214324144747545/5:3-2:3;2:3-4:6;3:3-6:3-7:3;6:3-3:3-1:6;4:3-6:6-3:6;3:3-4:3-5:6-1:6;1:3-6:6-7:6-3:6;2:3-3:6-4:6-1:8;7:3-4:6|3423256411631646576132216612621522166115347114767237443453574233;2112534537337447461652625155174553776561771423252122533521367723;6215321631446771774151327337261762113321473166475563317765644162;5417442514327624613725172357725172537214626357111535727171272664;4237766135663726764265573352632122713431517566722113743276122163;3312511233521641145623665337753621632635157735536131443152567261;5213232654557153473552463146412224332441337631567334412536562631;4753135216431415164155742575416663657162734262454167545552732273;5461371754664647167122466462552137227237665174334352421477132712;2162572732525371572723116131255666256177375371456632462464765621#35463162526335627622733527643751454751312462374472331517726746446165117635725235624734166563341232657715736671562751415132431142556357312614672375351364622543546116623534531471165175427276445343541625721277156672125264322176356334455144574414644647325723645363113662324466761721633177336112334747752424177142436445542477372644511514635232425131136517347214174776414733574172576451435711241121341643453577252726345711267547511236565662511672174711425124155636537543616717425664146374537725745363511516',
            invalidSet = 'thisisnotavalidgameset';

        describe('game will initialize by itself after game instance created', function() {
            var gameInstance, eventsListener;

            beforeEach(function(done) {
                eventsListener = {
                    onGameEvent : function(eventName) {
                        // we're only expecting 1 event here (i.e. loaded) so we can already end the beforeEach if any
                        // event arrived
                        done();
                    }
                };
                spyOn(eventsListener, 'onGameEvent').and.callThrough();
                gameInstance =  createGameInstance();
                gameInstance.onGameEvent(eventsListener.onGameEvent);
            });
            it('there was a loaded event', function() {
                expect(eventsListener.onGameEvent).toHaveBeenCalledWith('loaded', undefined);
            });
        });

        describe('game processes gamesets on startGame', function() {
            var gameInstance;
            beforeEach(function(done) {
                gameInstance = createGameInstance();
                gameInstance.onGameEvent(function(eventName) {
                    if (eventName === 'loaded') {
                        done();
                    }
                })
            });
            it('valid gameset', function() {
                gameInstance.startGame(
                    {
                        gameSet : validSet
                    },
                    {
                        showTips : true
                    });
            });
            describe('invalid gameset raises error', function() {
                var listener;
                beforeEach(function(done) {
                    listener = {
                        onGameEvent: function (eventName) { done(); }
                    };
                    spyOn(listener, 'onGameEvent').and.callThrough();
                    gameInstance.onGameEvent(listener.onGameEvent);
                    try {
                        gameInstance.startGame({gameSet: invalidSet}, {showTips: true});
                    } catch (err) {
                        fail('Error on startGame with invalid gameset: ' + err);
                    }
                });
                it('error event received', function() {
                    expect(listener.onGameEvent).toHaveBeenCalledWith('error');
                });
            });
        });

        describe('game can be forcefully started', function() {
            var gameInstance, eventsListener;

            beforeEach(function(done) {
                eventsListener = {
                    onGameEvent : function(eventName) {
                        switch (eventName) {
                            case 'loaded':
                                gameInstance.startGame({gameSet: validSet}, {showTips: true});
                                // give the game a few secs time for processing
                                setTimeout(function () {
                                    gameInstance.forceGameStart();
                                }, 2000);
                                break;
                            case 'start':
                                done();
                                break;
                            case 'abort':
                                done();
                                break;
                            case 'end':
                                done();
                                break;
                        }
                    }
                };
                spyOn(eventsListener, 'onGameEvent').and.callThrough();
                gameInstance =  createGameInstance();
                gameInstance.onGameEvent(eventsListener.onGameEvent);
            });
            it('there was a start event', function() {
                expect(eventsListener.onGameEvent).toHaveBeenCalledWith('start', undefined);
            });
        });

        // TBD what about "forceGameStart has no effect or raises error after invalid set was passed in"-test?

        describe('game can be forcefully aborted', function() {

            var gameInstance, eventsListener;

            beforeEach(function(done) {
                eventsListener = {
                    onGameEvent : function(eventName) {
                        switch (eventName) {
                            case 'loaded':
                                gameInstance.startGame({gameSet: validSet}, {showTips: true});
                                // give the game a few secs time for processing
                                setTimeout(function () {
                                    gameInstance.forceGameStart();
                                }, 2000);
                                break;
                            case 'start':
                                gameInstance.gameAbort();
                                break;
                            case 'abort':
                                done();
                                break;
                            case 'end':
                                done();
                                break;
                        }
                    }
                };
                spyOn(eventsListener, 'onGameEvent').and.callThrough();
                gameInstance =  createGameInstance();
                gameInstance.onGameEvent(eventsListener.onGameEvent);
            });
            it('there was an abort event but no end event', function() {
                expect(eventsListener.onGameEvent).toHaveBeenCalledWith('start', undefined);
                expect(eventsListener.onGameEvent).toHaveBeenCalledWith('abort', jasmine.objectContaining(
                    {
                        score : jasmine.any(Number),
                        playTime : jasmine.any(Number)
                    })
                );
                expect(eventsListener.onGameEvent).not.toHaveBeenCalledWith('end', jasmine.objectContaining(
                    {
                        score : jasmine.any(Number),
                        playTime : jasmine.any(Number)
                    })
                );
            });
        });
    });
});
