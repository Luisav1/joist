// Copyright 2017-2019, University of Colorado Boulder

/**
 * A ScreenButton is displayed on the HomeScreen. There are small and large ScreenButtons, that can be toggled through
 * to select the desired sim screen to go to. See HomeScreenView.js for more information.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const EventType = require( 'TANDEM/EventType' );
  const FireListener = require( 'SCENERY/listeners/FireListener' );
  const Frame = require( 'JOIST/Frame' );
  const inherit = require( 'PHET_CORE/inherit' );
  const joist = require( 'JOIST/joist' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Touch = require( 'SCENERY/input/Touch' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const LARGE_ICON_HEIGHT = 140;

  /**
   * @param {boolean} large - whether or not this is a large or small screenButton
   * @param {Sim} sim
   * @param {number} index - index of this screen so we can get the screen, sorta backwards
   * @param {Property} highlightedScreenIndexProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function ScreenButton( large, sim, index, highlightedScreenIndexProperty, tandem, options ) {

    options = merge( {
      showUnselectedHomeScreenIconFrame: false, // put a frame around unselected home screen icons
      opacity: 1,  // The small screen's nodes have an opacity of .5
      tandem: tandem, // To be passed into mutate, but tandem should be a required param in joist
      phetioEventType: EventType.USER,
      phetioDocumentation: 'A pressable button in the simulation, in the home screen'
    }, options );

    const screen = sim.screens[ index ];

    // Maps the number of screens to a scale for the small icons. The scale is percentage of LARGE_ICON_HEIGHT.
    let smallIconScale = Util.linear( 2, 4, 0.875, 0.50, sim.screens.length );
    if ( sim.screens.length >= 5 ) {
      smallIconScale = 0.4;
    }

    // Use the small icon scale if this is a small screen button
    const height = large ? LARGE_ICON_HEIGHT : smallIconScale * LARGE_ICON_HEIGHT;

    // Wrap in a Node because we're scaling, and the same icon will be used for small and large icon, and may be used by
    // the navigation bar.
    const icon = new Node( {
      opacity: options.opacity,
      children: [ screen.homeScreenIcon ],
      scale: height / screen.homeScreenIcon.height
    } );

    // Frame for small (unselected) home screen icons
    const frame = large ? new Frame( icon ) : new Rectangle( 0, 0, icon.width, icon.height, {
      stroke: options.showUnselectedHomeScreenIconFrame ? PhetColorScheme.SCREEN_ICON_FRAME : null,
      lineWidth: 0.7
    } );

    // Create the icon with the frame inside
    const iconWithFrame = new Node( {
      opacity: options.opacity,
      children: [ frame, icon ]
    } );

    // Text for the screen button
    const text = new Text( screen.name, {
      font: new PhetFont( large ? 42 : 18 ),
      fill: large ? PhetColorScheme.BUTTON_YELLOW : 'gray',
      tandem: tandem.createTandem( 'text' )
    } );

    // Shrink the text if it goes beyond the edge of the image
    text.maxWidth = iconWithFrame.width;

    // Only link if a large button
    highlightedScreenIndexProperty.link( function( highlightedIndex ) {
      const highlighted = highlightedIndex === index;
      frame.setHighlighted && frame.setHighlighted( highlighted );
      icon.opacity = ( large || highlighted ) ? 1 : 0.5;
      text.fill = ( large || highlighted ) ? 'white' : 'gray';
    } );

    // The children are needed in the VBox constructor, but the rest of the options should be mutated later.
    VBox.call( this, {
      children: [
        iconWithFrame,
        text
      ]
    } );

    // Input listeners after the parent call depending on if the ScreenButton is large or small
    const buttonDown = large ?
                       function() {
                         sim.showHomeScreenProperty.value = false;
                         highlightedScreenIndexProperty.value = -1;
                       } :
                       function() {
                         sim.screenIndexProperty.value = index;
                       };

    const fireListener = new FireListener( {
      fireOnDown: true, // to match prior behavior, but I'm not sure why we have this exceptional behavior
      fire: buttonDown,
      tandem: options.tandem.createTandem( 'inputListener' )
    } );
    this.addInputListener( fireListener );
    this.addInputListener( { click: function() { large && fireListener.fire( null ); } } );
    this.addInputListener( { focus: function() { !large && fireListener.fire( null ); } } );
    this.addInputListener( {
      focus: function() {
        highlightedScreenIndexProperty.value = index;
      },
      blur: function() {
        highlightedScreenIndexProperty.value = -1;
      }
    } );

    // Set highlight listeners to the small screen button
    if ( !large ) {

      // @public (joist-internal)
      this.highlightListener = {
        over: function( event ) {
          highlightedScreenIndexProperty.value = index;
        },
        out: function( event ) {
          highlightedScreenIndexProperty.value = -1;
        }
      };

      // On the home screen if you touch an inactive screen thumbnail, it grows.  If then without lifting your finger
      // you swipe over to the next thumbnail, that one would grow.
      this.addInputListener( {
        over: function( event ) {
          if ( event.pointer instanceof Touch ) {
            sim.screenIndexProperty.value = index;
          }
        }
      } );
    }

    this.mouseArea = this.touchArea = Shape.bounds( this.bounds ); // cover the gap in the vbox

    this.disposeScreenButton = function() {
      highlightedScreenIndexProperty.unlink();
    };

    this.mutate( options );
  }

  joist.register( 'ScreenButton', ScreenButton );

  return inherit( VBox, ScreenButton, {

    // @public
    dispose: function() {
      this.disposeScreenButton();
      VBox.prototype.dispose.call( this );
    }
  } );
} );