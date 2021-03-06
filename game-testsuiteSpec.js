describe('Html5 SP game test suite', function() {
    'use strict';

    var gameContainerNode,
        audioContextSingleton;

    /**
     * Trigger loading of game.js.
     * @param downloadsFinishedCallback executed on *successfull* loading of game.js (but does not mean that parsing succeeded, too). On error
     * a fail call is done.
     */
    function loadGameJsFiles(downloadsFinishedCallback) {
        var expectedDownloads = testsuite.config.gamelibs.length;
        function downloadFinished() {
            expectedDownloads--;
            if (expectedDownloads === 0) {
                downloadsFinishedCallback();
            }
        }
        testsuite.config.gamelibs.forEach(function(libFile) {
		    var node = document.createElement('script');
		    node.type = "text/javascript";
		    node.async = true;
		        node.setAttribute('src', 'base/' + libFile);
		        node.addEventListener('load', downloadFinished, false);
		    node.addEventListener('error', function() {
		            fail('Failed to load game lib ' + libFile);
		    }, true);
		    document.head.appendChild(node);
        });
    }

    function addGameContainerNode() {
        gameContainerNode = document.createElement('div');
        gameContainerNode.id = testsuite.config.gameContainerId;
        // TODO must be dynamic
        gameContainerNode.style.width = '780px';
        gameContainerNode.style.height = '524px';
        document.body.appendChild(gameContainerNode);
        expect(document.getElementById(testsuite.config.gameContainerId)).not.toBeNull();
    }

    /**
     * Create one AudioContext and then override window.AudioContext to always return
     * that one instance.
     * If we would not be doing this, the test browser (at least for Chrome) would soon
     * run out of resources (only 6 AudioContexts allowed).
     * @returns {*}
     */
    function setupAudioContextMocking() {
        var audioCtx = new AudioContext();
        spyOn(window, 'AudioContext').and.callFake(function() {
            return audioContextSingleton;
        });
        return audioCtx;
    }

    beforeAll(function() {
        audioContextSingleton = setupAudioContextMocking();
    });

    beforeEach(function(done) {
        addGameContainerNode();
        loadGameJsFiles(done);
    });

    function lookupGameInstanceFactory() {
        var split = testsuite.config.gameInstanceFactoryFqcn.split('.'),
            end = window,
            rec = function (cur) {
                if (end[cur]) {
                    end = end[cur];
                    rec(split.shift());
                }
            };
        rec(split.shift());
        return end;
    };

    /**
     * Create an instance of the game with standard config.
     * @returns {*}
     */
    function createGameInstance() {
        var factory = lookupGameInstanceFactory();
        return factory.createInstance({
            mediaURL: 'base/',
            language: 'de',
            width : '780px',
            height : '524px',
            gameContainer: gameContainerNode
        });
    }

    /**
     * Matcher for Jasmine: if an expected value can be either null or undefined
     * @type {{asymmetricMatch: undefinedOrNullTester.asymmetricMatch}}
     */
    var undefinedOrNullTester = {
        asymmetricMatch: function(actual) {
            return actual === undefined || actual === null;
        }
    };

    /**
     * Cleanup, removed gameContainerNode and deletes window.Game
     */
    afterEach(function() {
        document.body.removeChild(document.getElementById(testsuite.config.gameContainerId));
        delete window[testsuite.config.gameInstanceFactoryFqcn.split('.')[0]];
    });

    it('test config exists', function() {
        expect(testsuite.config).toBeDefined();
        ['gamelibs', 'gameInstanceFactoryFqcn', 'validSet', 'invalidSet', 'expectedGameApiFunctions', 'unexpectedGameApiFunctions']
            .forEach(function(configProperty) {
                expect(testsuite.config[configProperty]).toBeDefined();
            });
    });

    describe('an instance of the game can be created', function() {
        it('an instance of the game can be created', function() {
            expect(document.getElementById(testsuite.config.gameContainerId)).toBeDefined();
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
            expect(gameInstance[functionName]).toBeDefined();
            expect(typeof gameInstance[functionName]).toEqual('function');
        }

        describe('all lifecycle functions must be defined', function() {
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
        });

        describe('only required non-lifecycle functions must exist', function() {
            function checkNonLifecycleFunction(functionName) {
                if (testsuite.config.expectedGameApiFunctions.indexOf(functionName) !== -1) {
                    expectGameApiFunction(functionName);
                } else if (testsuite.config.unexpectedGameApiFunctions.indexOf(functionName) !== -1) {
                    expect(gameInstance.hasOwnProperty(functionName)).toBeFalsy();
                }
            }

            it('setSoundOn', function() {
                checkNonLifecycleFunction('setSoundOn');
            });

            it('setFxOn', function() {
                checkNonLifecycleFunction('setFxOn');
            });

            it('setColorBlindOn', function() {
                checkNonLifecycleFunction('setColorBlindOn');
            });

            it('setGameDimensions', function () {
                checkNonLifecycleFunction('setGameDimensions');
            });
        });
    });

    describe('lifecycle tests', function () {

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
                expect(eventsListener.onGameEvent).toHaveBeenCalledWith('loaded', undefinedOrNullTester);
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
                gameInstance.startGame({ gameSet : testsuite.config.validSet }, { showTips : true });
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
                        gameInstance.startGame({gameSet: testsuite.config.invalidSet}, {showTips: true});
                    } catch (err) {
                        fail('Error on startGame with invalid gameset: ' + err);
                    }
                });
                it('error event received', function() {
                    expect(listener.onGameEvent).toHaveBeenCalledWith('error', 'loading_error');
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
                                gameInstance.startGame({ gameSet: testsuite.config.validSet }, { showTips: true });
                                gameInstance.forceGameStart();
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
                expect(eventsListener.onGameEvent).toHaveBeenCalledWith('start', undefinedOrNullTester);
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
                                gameInstance.startGame({gameSet: testsuite.config.validSet}, {showTips: true});
                                gameInstance.forceGameStart();
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
                expect(eventsListener.onGameEvent).toHaveBeenCalledWith('start', undefinedOrNullTester);
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
