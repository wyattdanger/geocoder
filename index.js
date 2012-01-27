/**
 * Geocoder
 */

/**
 * Module Dependencies
 */

var http = require( 'http' );
var Hash = require('hashish');
var querystring = require('querystring');

/**
 * Version
 */

var version = '0.1.0';

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

    var options = Hash.merge({sensor: false, address: loc}, opts || {});

    var params = {
      host: 'maps.googleapis.com',
      port: 80,
      path: '/maps/api/geocode/json?' + querystring.stringify(options),
      headers: {}
    };

    return request( params, cbk );
  },

  reverseGeocode: function ( lat, lng, cbk, opts ) {
    if ( !lat || !lng ) {
      return cbk( new Error( "Geocoder.reverseGeocode requires a latitude and longitude." ) );
    }

    var options = Hash.merge({sensor: false, latlng: lat + ',' + lng}, opts || {});

    var params = {
      host: 'maps.googleapis.com',
      port: 80,
      path: '/maps/api/geocode/json?' + querystring.stringify(options),
      headers: {}
    };

    return request( params, cbk );

  },

  /**
   * Return Geocoder version
   * 
   * @api public
   */

  version: version

};

/**
 * Export
 */

module.exports = new Geocoder();
