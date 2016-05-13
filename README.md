# sp-test-suite
A test suite exists which covers:

 * A game instance can be created
 * All lifecycle functions are present
 * All menubar, etc callbacks are present - and none of these have been implemtened if the game will not need them.
 * The game reacts correctly if lifecycle functions are called.
 
This test suite in in no ways complete, manual testing is still required. Our test suite is not able to test full games, lifecycle tests are restricted to those cases which can be triggered from outside (without putting the game in an inconsistent state).

**Notes:**
The test suite uses Chrome as the test browser. Other browsers can be added (see the karma.conf.js file). PhantomJS cannot not be used, unfortunately: it does not implement all the APIs which are required by the games (e.g. sound playback).

## install test suite
Install this test suite as dependency of your package.json. An example package.json could look like:
```js
{
  "name": "module-name",
  "description": "Basic test setup to test <module-name> functionality",
  "version": "0.0.1",
  "devDependencies": {
    "sp-test-suite": "gameduell/sp-test-suite#v1.0.0"
  }
}
```

## configure test suite
Put a game-testSuite-config.js file into the same directory as package.json. The contents of that file are
```js
var testsuite = testsuite || {};
testsuite.config = {
    gameContainerId : 'string', // DOM id which is used for the game container node, can be an arbitrary string in most cases
    gamelibs : ['string'], // a list of the JS files which make up the game (incl. any dependencies referenced from code in game.js)
    gameInstanceFactoryFqcn : '', // use empty string if createInstance is global (bad practice!) or the object which has the function (e.g. "Games.jwl")
    validSet : '<A_VALID_SET>', // the game set
    invalidSet : '<ANY_INVALID_SET>', // the invalid set should break the parsing of the set
    expectedGameApiFunctions : ['string'], // the list of functions which must be implemented
    unexpectedGameApiFunctions : ['string'] // the list of functions which the game must not implemented (because they don't make sense for the game)
};
```
**Note for 3rd parties:** please ask Gameduell for the correct values for a specific game you're porting. The values in the snippet above may not be correct for a particular game.

## run test suite
Precondition is of course that the Karma and Jasmine command line tool has been installed. - since version v1.0.0 you don't need a global Karma and Jasmine installation.
1. Change to src/main/resources/META-INF/resources/games/singleplayer/<GAMETYPE> directory
2. Run npm install 
3. go to directory node_modules/sp-test-suite
4. Run npm test