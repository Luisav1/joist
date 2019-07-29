// Copyright 2019, University of Colorado Boulder

/**
 * A prototype overlay that implements panning by placing mouce at edges of the screen.
 * This is a prototype, do not use this in any production code. For https://github.com/phetsims/joist/issues/563.
 *
 * Note that this is implemented with update, so we need to the overlay needs to be updated every animation frame
 * for this feature to work properly.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  const Display = require( 'SCENERY/display/Display' );
  const joist = require( 'JOIST/joist' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Vector2 = require( 'DOT/Vector2' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const BAR_WIDTH = 40;

  class PanZoomOverlay extends Display {

    /**
     * @param {Display} parentDisplay - the Display this overlay will be attached to (for resizing)
     * @param {} panZoomListener - the listener responsible for pan/zoom operations
     */
    constructor( parentDisplay, panZoomListener ) {
      const panZoomRoot = new Node();

      super( panZoomRoot, {
        accessibility: false
      } );

      // @private
      this.parentDisplay = parentDisplay;
      this.panZoomListener = panZoomListener;

      // invisible rectangles for the border of the display -
      this.leftRectangle = new Rectangle( 0, 0, 0, 0 );
      this.rightRectangle = new Rectangle( 0, 0, 0, 0 );
      this.topRectangle = new Rectangle( 0, 0, 0, 0 );
      this.bottomRectangle = new Rectangle( 0, 0, 0, 0 );

      // @private {boolean} - whether a pointer ois over each of the rectangles on the overlay
      this.overLeft = false;
      this.overRight = false;
      this.overTop = false;
      this.overBottom = false;

      this.leftRectangle.addInputListener( this.createPanDeltaListener( 'overLeft' ) );
      this.rightRectangle.addInputListener( this.createPanDeltaListener( 'overRight' ) );
      this.topRectangle.addInputListener( this.createPanDeltaListener( 'overTop' ) );
      this.bottomRectangle.addInputListener( this.createPanDeltaListener( 'overBottom' ) );

      const rectangles = [ this.leftRectangle, this.rightRectangle, this.topRectangle, this.bottomRectangle ];
      panZoomRoot.children = rectangles;

      this.initializeEvents();
    }

    /**
     * Create a listener that will set the provided field when a pointer goes over/out
     * of the Rectangle on this overlay.
     * @param   {string} field - 'overLeft' || 'overRight' || 'overTop' || 'overBottom'
     * @returns {over: function, out: function} - for the scenery listener API
     */
    createPanDeltaListener( field ) {
      assert && assert( typeof field === 'string' );
      assert && assert( typeof this[ field ] === 'boolean', field + ' property not assigned to PanZoomOverlay' );

      return {
        over: () => { this[ field ] = true; },
        out: () => { this[ field ] = false; }
      };
    }

    /**
     * Update the display size if the parent display has also changed size. Also triggers panning from hover over
     * the border rectangles on this overlay.
     *
     * @public (scenery-internal)
     */
    update() {
      if ( !this.parentDisplay.size.equals( this.size ) ) {
        this.setWidthHeight( this.parentDisplay.width, this.parentDisplay.height );
      }

      let deltaX = 0;
      let deltaY = 0;
      const deltaSize = 20;
      if ( this.overLeft ) {
        deltaX = -deltaSize;
      }
      if ( this.overRight ) {
        deltaX = deltaSize;
      }
      if ( this.overTop ) {
        deltaY = -deltaSize;
      }
      if ( this.overBottom ) {
        deltaY = deltaSize;
      }

      this.panZoomListener.panDelta( new Vector2( deltaX, deltaY ) );
      this.updateDisplay();
    }

    /**
   * Resize the overlay so that the panning rectangles run along the bounds of the viewport, but do not change size
     * with window scale (like when zooming in natively with a browser).
     * @public
     *
     * @param   {number} scale
     */
    resize( scale ) {
      const width = this.parentDisplay.width;
      const height = this.parentDisplay.height;
      const rectWidth = BAR_WIDTH * scale;
      this.leftRectangle.setRect( 0, 0, rectWidth, height );
      this.rightRectangle.setRect( width - rectWidth, 0, rectWidth, height );
      this.topRectangle.setRect( 0, 0, width, rectWidth );
      this.bottomRectangle.setRect( 0, height - rectWidth, width, rectWidth  );

      this.updateDisplay();
    }
  }

  return joist.register( 'PanZoomOverlay', PanZoomOverlay );
} );