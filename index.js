/**
 * Geocoder
 */

/**
 * Module Dependencies
 */

/**
 * Version
 */

var version = '0.2.1';


/**
 * Geocoder 
 */

function Geocoder () {
  this.selectProvider("google");
};

/**
 * Geocoder prototype
 */

Geocoder.prototype = {


  /**
   * Selects a webservice provider
   * 
   * @param {String} name, required
   * @param {Object} opts, optional
   * @api public
   */

  selectProvider: function ( name, opts ) {

    if ( ! name ) {
      return cbk( new Error( "Geocoder.selectProvider requires a name.") );
    }

    this.provider = name;
    this.providerOpts = opts || {};
    this.providerObj = require("./providers/"+name);

  },

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
    
    return this.providerObj.geocode(this.providerOpts, loc, cbk, opts);

  },

  reverseGeocode: function ( lat, lng, cbk, opts ) {
    if ( !lat || !lng ) {
      return cbk( new Error( "Geocoder.reverseGeocode requires a latitude and longitude." ) );
    }

    return this.providerObj.reverseGeocode(this.providerOpts, lat, lng, cbk, opts );

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
