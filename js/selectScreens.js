// Copyright 2020, University of Colorado Boulder

import joist from './joist.js';

/**
 * Given an array of all possible screens that a sim can have, select and order them according to the relevant query
 * parameters. This also will create a homeScreen if needed, and specify the initialScreen for startup.
 *
 * Parameters suffixed with "Provided" will be true if the that query parameter was actually in the URL, as opposed to
 * the value of the query parameter being the default.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 *
 * @param {Screen[]} allSimScreens - all of the screens declared by the sim, duck-typed for tests
 * @param {boolean} homeScreenQueryParameter - from phet.chipper.queryParameters.homeScreen
 * @param {boolean} homeScreenQueryParameterProvided
 * @param {number} initialScreenIndex - from phet.chipper.queryParameters.initialScreen
 * @param {boolean} initialScreenQueryParameterProvided
 * @param {number[]} screensQueryParameter - from phet.chipper.queryParameters.screens
 * @param {boolean} screensQueryParameterProvided
 * @param {function( selectedSimScreens ):HomeScreen} createHomeScreen
 * @returns {{homeScreen:HomeScreen|null, initialScreen:Screen, selectedSimScreens:Screen[], screens:Screen[]}} - duck-typed for tests
 * @throws Error if incompatible data is provided
 */
const selectScreens = ( allSimScreens,
                        homeScreenQueryParameter,
                        homeScreenQueryParameterProvided,
                        initialScreenIndex,
                        initialScreenQueryParameterProvided,
                        screensQueryParameter,
                        screensQueryParameterProvided,
                        createHomeScreen ) => {

  if ( allSimScreens.length === 1 && homeScreenQueryParameterProvided && homeScreenQueryParameter ) {
    const errorMessage = 'cannot specify homeScreen=true for single-screen sims';

    // handle gracefully when running without ?ea
    QueryStringMachine.addWarning( 'homeScreen', homeScreenQueryParameter, errorMessage );

    // to support expected failures in selectScreensTests.js unit tests
    assert && assert( false, errorMessage );
  }

  // the ordered list of sim screens for this runtime
  let selectedSimScreens = [];

  // If a subset of screens was specified with the `screens` query parameter, add them to selectedSimScreens. Otherwise,
  // use all of the available sim screens as the default. Note that if the value of `screens` did not pass validation
  // in QueryStringMachine, it will be reverted to its default value of `null`, so it also needs to be checked for
  // truthiness before attempting to use it. For `screens` documentation, see the schema at
  // phet.chipper.queryParameters.screens in initialize-globals.js.
  if ( screensQueryParameterProvided && screensQueryParameter ) {

    let allScreensValid = true;
    screensQueryParameter.forEach( userIndex => {
      const screenIndex = userIndex - 1; // screens query parameter is 1-based

      // add screen to selectedSimScreens if it's a valid index, otherwise error and revert to defaults
      if ( screenIndex >= 0 && screenIndex < allSimScreens.length ) {
        selectedSimScreens.push( allSimScreens[ screenIndex ] );
      }
      else {
        const errorMessage = `invalid screen index: ${userIndex}`;

        // handle gracefully when running without ?ea and set selectedSimScreens to default values, see https://github.com/phetsims/joist/issues/599
        QueryStringMachine.addWarning( 'screens', userIndex, errorMessage );

        // to support expected failures in selectScreensTests.js unit tests
        assert && assert( false, errorMessage );
        allScreensValid = false;
      }
    } );

    if ( !allScreensValid ) {
      selectedSimScreens = allSimScreens;
    }
  }
  else {
    selectedSimScreens = allSimScreens;
  }

  // Specifying ?homeScreen=false creates a simulation with no HomeScreen, and hence is incompatible with
  // ?initialScreen=0, which specifies to show the home screen. Note that the default value of initialScreen:0 is
  // ignored when there is no HomeScreen.
  if ( initialScreenQueryParameterProvided && initialScreenIndex === 0 && homeScreenQueryParameter === false ) {
    const errorMessage = 'cannot specify initialScreen=0 when home screen is disabled with homeScreen=false';

    // handle gracefully when running without ?ea
    QueryStringMachine.addWarning( 'initialScreen', initialScreenIndex, errorMessage );
    QueryStringMachine.addWarning( 'homeScreen', homeScreenQueryParameter, errorMessage );

    // to support expected failures in selectScreensTests.js unit tests
    assert && assert( false, errorMessage );
  }

  // For a single screen simulation (whether the simulation only declares one screen, or whether the user has specified
  // a single screen via ?screens), there is no HomeScreen, and hence ?initialScreen=0 which requests to show the
  // HomeScreen on startup should fail.
  if ( initialScreenQueryParameterProvided && initialScreenIndex === 0 && selectedSimScreens.length === 1 ) {
    const errorMessage = 'cannot specify initialScreen=0 for single-screen sims or when only one screen is loaded with screens=n';

    // handle gracefully when running without ?ea
    QueryStringMachine.addWarning( 'initialScreen', initialScreenIndex, errorMessage );

    // to support expected failures in selectScreensTests.js unit tests
    assert && assert( false, errorMessage );
  }

  const screens = selectedSimScreens.slice();

  let homeScreen = null;

  // If a sim has multiple screens and the query parameter homeScreen=false is not provided, add a HomeScreen
  if ( selectedSimScreens.length > 1 && homeScreenQueryParameter ) {
    homeScreen = createHomeScreen( selectedSimScreens );
    screens.unshift( homeScreen );
  }

  // The first screen for the sim, can be the HomeScreen if applicable
  let initialScreen;
  if ( homeScreen && initialScreenIndex === 0 ) {

    // If the home screen is supplied, then it is at index 0, so use the query parameter value directly (because the
    // query parameter is 1-based). If `?initialScreen` is 0 then there is no offset to apply.
    initialScreen = homeScreen;
  }
  else if ( initialScreenIndex === 0 ) {

    // There is no home screen and the initialScreen query parameter was not supplied, so we select the first sim screen.
    initialScreen = selectedSimScreens[ 0 ];
  }
  else {

    // If the home screen is not supplied, then the first sim screen is at index 0, so subtract 1 from the query parameter.
    initialScreen = allSimScreens[ initialScreenIndex - 1 ];
  }

  if ( screens.indexOf( initialScreen ) === -1 ) {
    throw new Error( 'screen not found: ' + initialScreenIndex );
  }

  return {
    homeScreen: homeScreen,
    initialScreen: initialScreen,
    selectedSimScreens: selectedSimScreens,
    screens: screens
  };
};

joist.register( 'selectScreens', selectScreens );
export default selectScreens;