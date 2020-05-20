// Copyright 2020, University of Colorado Boulder

import Enumeration from '../../phet-core/js/Enumeration.js';
import MultiClip from '../../tambo/js/sound-generators/MultiClip.js';
import homeSelectedSound from '../sounds/screen-selection-home-v3_mp3.js';
import screenSelectedSound from '../sounds/screen-selection_mp3.js';
import iconSelectedSound from '../sounds/switching-screen-selector-icons-003_mp3.js';
import joist from './joist.js';

// constants
const SoundType = Enumeration.byKeys( [ 'ICON_SELECTED', 'HOME_SCREEN', 'OTHER_SCREEN' ] );

/**
 * ScreenSelectionSoundGenerator generates sounds when the user switches between screens and screen icons.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
class ScreenSelectionSoundGenerator extends MultiClip {

  /**
   * @param {Property.<Screen>} screenProperty - indicates which sim screen is visible
   * @param {HomeScreen|null} homeScreen - the home screen, null if the HomeScreen was not created
   * @param {Object} [options]
   */
  constructor( screenProperty, homeScreen, options ) {

    // create the map of screen index values to sounds
    const valuesToSoundsMap = new Map();

    // can't use initialization constructor since it's not supported in IE
    valuesToSoundsMap.set( SoundType.ICON_SELECTED, iconSelectedSound );
    valuesToSoundsMap.set( SoundType.HOME_SCREEN, homeSelectedSound );
    valuesToSoundsMap.set( SoundType.OTHER_SCREEN, screenSelectedSound );

    super( valuesToSoundsMap, options );

    // play the sound when the user selects a different icon on the home screen
    homeScreen && homeScreen.model.selectedScreenProperty.lazyLink( () => {

      // only play this sound when on the home screen
      if ( screenProperty.value === homeScreen ) {
        this.playAssociatedSound( SoundType.ICON_SELECTED );
      }
    } );

    // play sounds when the user navigates between screens and to/from the home screen
    screenProperty.lazyLink( currentScreen => {

      // play one sound for the home screen, another for all other screens
      this.playAssociatedSound( homeScreen && currentScreen === homeScreen ? SoundType.HOME_SCREEN : SoundType.OTHER_SCREEN );
    } );
  }
}

joist.register( 'ScreenSelectionSoundGenerator', ScreenSelectionSoundGenerator );
export default ScreenSelectionSoundGenerator;