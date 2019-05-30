// Copyright 2019, University of Colorado Boulder

/**
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const joist = require( 'JOIST/joist' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Panel = require( 'SUN/Panel' );
  const Property = require( 'AXON/Property' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const Node = require( 'SCENERY/nodes/Node' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // constants
  const BAR_WIDTH = 25; 

  class PanZoomOverlay extends Node {
    constructor( panZoomListener, boundsProperty ) {
      super();

      const trackOptions = {
        stroke: PhetColorScheme.PHET_LOGO_BLUE,
        lineWidth: 2
      };

      const barOptions = {
        fill: PhetColorScheme.PHET_LOGO_YELLOW
      };

      this.horizontalScrollBarTrack = new Rectangle( 0, 0, 0, 0, trackOptions );
      this.horizontalScrollBar = new Rectangle( 0, 0, 0, 0, barOptions );

      this.verticalScrollBarTrack = new Rectangle( 0, 0, 0, 0, trackOptions );
      this.verticalScrollBar = new Rectangle( 0, 0, 0, 0, barOptions );

      const trackConnector = new Rectangle( 0, 0, BAR_WIDTH, BAR_WIDTH, {
        fill: PhetColorScheme.PHET_LOGO_BLUE
      } );

      this.addChild( this.horizontalScrollBarTrack );
      this.addChild( this.horizontalScrollBar );

      this.addChild( this.verticalScrollBarTrack );
      this.addChild( this.verticalScrollBar );

      this.addChild( trackConnector );

      this.controlsVisibleProperty = new DerivedProperty( [ panZoomListener.magnificationProperty ], ( magnification ) => {
        return magnification > 1;
      } );

      Property.multilink( [ boundsProperty, panZoomListener.horizontalScrollProperty, panZoomListener.relativeWidthVisibleProperty ], ( bounds, scroll, relativeWidth ) => {
        if ( bounds !== null ) {
          this.horizontalScrollBarTrack.setRect( 0, bounds.height - BAR_WIDTH, bounds.width - BAR_WIDTH, BAR_WIDTH );
          trackConnector.leftCenter = this.horizontalScrollBarTrack.rightCenter;

          const horizontalBarWidth = this.horizontalScrollBarTrack.getWidth() * relativeWidth;
          this.horizontalScrollBar.setRect( 0, 0, horizontalBarWidth, BAR_WIDTH );

          this.horizontalScrollBar.left = ( this.horizontalScrollBarTrack.getWidth() - this.horizontalScrollBar.getWidth() ) * scroll;
          this.horizontalScrollBar.bottom = this.horizontalScrollBarTrack.bottom;
        }
      } );

      Property.multilink( [ boundsProperty, panZoomListener.verticalScrollProperty, panZoomListener.relativeHeightVisibleProperty ], ( bounds, scroll, relativeHeight ) => {
        if ( bounds !== null ) {
          this.verticalScrollBarTrack.setRect( bounds.width - BAR_WIDTH, 0, BAR_WIDTH, bounds.height - BAR_WIDTH );
          trackConnector.centerTop = this.verticalScrollBarTrack.centerBottom;

          const verticalBarHeight = this.verticalScrollBarTrack.getHeight() * relativeHeight;
          this.verticalScrollBar.setRect( 0, 0, BAR_WIDTH, verticalBarHeight );

          this.verticalScrollBar.top = ( this.verticalScrollBarTrack.getHeight() - this.verticalScrollBar.getHeight() ) * scroll;
          this.verticalScrollBar.right = this.verticalScrollBarTrack.right;
        }
      } );

      this.controlsVisibleProperty.link( ( controlsVisible ) => {
        this.visible = controlsVisible;
      } );

      // button panel
      const zoomInButton = new ZoomButton( {
        listener: () => {
          const globalPoint = panZoomListener.transformedPanBoundsProperty.get().center;
          const scale = 1.1;
          panZoomListener.repositionCustom( globalPoint, scale );
        }
      } );
      const zoomOutButton = new ZoomButton( {
        in: false,
        listener: () => {
          const globalPoint = panZoomListener.transformedPanBoundsProperty.get().center;
          const scale = 0.9;
          panZoomListener.repositionCustom( globalPoint, scale );
        }
      } );
      const resetButton = new ResetButton( {
        baseColor: PhetColorScheme.PHET_LOGO_BLUE,
        listener: () => {
          panZoomListener.resetTransform();
        }
      } );

      const zoomBox = new HBox( { children: [ zoomInButton, zoomOutButton ], spacing: 15 } );
      const buttonsBox = new HBox( { children: [ zoomBox, resetButton ], spacing: 90 } );

      const buttonsPanel = new Panel( buttonsBox, {
        fill: 'black',
        stroke: PhetColorScheme.PHET_LOGO_BLUE,
        xMargin: 15,
        yMargin: 15
      } );
      this.addChild( buttonsPanel );

      boundsProperty.link( ( bounds ) => {
        if ( bounds !== null ) {
          buttonsPanel.centerTop = bounds.centerTop;
        }
      } );
    }

    update() {

    }
  }

  return joist.register( 'PanZoomOverlay', PanZoomOverlay );
} );