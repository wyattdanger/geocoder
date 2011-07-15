/**
 * Geocoder
 */

/**
 * Module Dependencies
 */

var http = require( 'http' );

/**
 * Version
 */

exports.version = '0.0.2';

/**
 * Formats a given `loc` to submit to Google
 *
 * @param {String} loc, required
 * @api private
 */

function formatLoc ( loc ) {
    return loc.replace( /\s/g, '+' );
}

/**
 * Combines given `objects` and returns the result
 *
 * @param objects, required
 * @api private
 */

function merge ( objects ) {
    var result = {},
        args = Array.prototype.slice.call( arguments );

    args.forEach(function ( item ) {
        for ( var prop in item ) {
            if ( item.hasOwnProperty( prop ) ) {
                result[prop] = item[prop];
            }
        }
    });

    return result;
}

/**
 * Geocoder 
 */

function Geocoder () {}

/**
 * Geocoder prototype
 */

Geocoder.prototype = {

  /**
   * Request geocoordinates of given `loc` from Google
   * 
   * @param {String} loc, required
   * @param {Function} cbk, required
   * @param {Object} opts, optional
   * @api public
   */

  geocode: function ( loc, cbk, opts ) {
    if ( ! loc ) {
      throw new Error( "Geocoder.geocode requires a string. You passed " + loc );
    }

    var sensor, defaults, options;

    sensor = opts && opts.sensor ? opts.sensor : false;

    defaults = {
      host: 'maps.googleapis.com',
      port: 80,
      path: '/maps/api/geocode/json?address=' + formatLoc( loc ) + '&sensor=' + sensor,
      headers: {}
    };

    options = merge( defaults, opts || {} );

    http.get( options, function ( response ) {
      var data = "", result;

      response.on("data", function ( chunk ) {
        data += chunk;
      });

      response.on("end", function ( argument ) {
        result = JSON.parse( data );
        return cbk( result );
      });

    });

  }

};

/**
 * Expose the geocoder
 */

exports.geocoder = new Geocoder();

/**
 * Export
 */

module.exports = exports;
