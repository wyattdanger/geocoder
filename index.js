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

var version = '0.0.5';

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
 * Makes request to Google API and passes result to a callback
 *
 * @param {Object} options, required
 * @param {Function} callback, required
 * @api private
 */

function request ( options, cbk ) {

  http.get( options, function ( response ) {
    var data = "", result;

    response.on("error", function ( err ) {
      return cbk( err );
    });

    response.on("data", function ( chunk ) {
      data += chunk;
    });

    response.on("end", function ( argument ) {
      result = JSON.parse( data );
      return cbk( null, result );
    });

  }).on("error", function (err) {
    return cbk( err );
  });

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
        return cbk( new Error( "Geocoder.geocode requires a location.") );
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

    return request( options, cbk ); 

  },

  reverseGeocode: function ( lat, lng, cbk, opts ) {
    if ( !lat || !lng ) {
      return cbk( new Error( "Geocoder.geocode requires a latitude and longitude." ) );
    }

    var sensor, defaults, options;

    sensor = opts && opts.sensor ? opts.sensor : false;

    defaults = {
      host: 'maps.googleapis.com',
      port: 80,
      path: '/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=' + sensor,
      headers: {}
    };

    options = merge( defaults, opts || {} );

    return request( options, cbk ); 

  },

  /**
   * Return Geocoder version
   * 
   * @api public
   */

  version: version

};

/**
 * Expose the geocoder
 */

exports = new Geocoder();

/**
 * Export
 */

module.exports = exports;
