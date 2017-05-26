// Copyright 2017, University of Colorado Boulder

/**
 * Experimental post message API for PhET sims.  Enables cross origin commands to be run on the sim. PostMessageAPI assumes that
 * window.parent exists.
 * 
 * @author Sam Reid (PhET Interactive Simulations) 
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var joist = require( 'JOIST/joist' );

  /**
   * @constructor
   * @param {Sim} sim
   */
  function PostMessageAPI( sim ) {
    
    window.addEventListener( 'message', function( event ) {
      var data = event.data;
      if ( data.protocol === '1.0.0-phet' ) {
        if ( data.instance === 'phet.joist.sim' && data.method === 'setActive' ) {
          assert && assert( data.arguments && data.arguments.length === 1 && typeof data.arguments[ 0 ] === 'boolean', 'phet.joist.sim.setActive requires one boolean argument' );
          sim.activeProperty.set( data.arguments[ 0 ] );
        }
        if ( data.instance === 'phet.joist.sim' && data.method === 'getTitle' ) {
          assert && assert( ( data.arguments && data.arguments.length === 0 ) || !data.arguments );
          window.parent.postMessage( { protocol: '1.0.0-phet', request: data, response: sim.name }, '*' );
        }
      }
    } );
  
    // when the PostMessageAPI has completed construction, post a message that signifies the API is ready
    window.parent.postMessage( { request: null, protocol: '1.0.0-phet', response: 'endedSimConstruction' }, '*' );

  }

  joist.register( 'PostMessageAPI', PostMessageAPI );

  return inherit( Object, PostMessageAPI );
} );
