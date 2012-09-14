/**
 * Geocoder
 */

/**
 * Module Dependencies
 */

var http = require( 'http' );
var Hash = require('hashish');
var querystring = require('querystring');

// xml2js is optional because only needed for geonames support
try {
  var xml2js = require("xml2js");
} catch (e) {

}

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

function request ( options, cbk, nojson ) {

  http.get( options, function ( response ) {
    var data = "";

    response.on("error", function ( err ) {
      return cbk( err );
    });

    response.on("data", function ( chunk ) {
      data += chunk;
    });

    response.on("end", function ( argument ) {
      if (!nojson) data = JSON.parse( data );
      return cbk( null, data );
    });

  }).on("error", function (err) {
    return cbk( err );
  });

}


var providers = {
  "google":{

    geocode: function ( providerOpts, loc, cbk, opts ) {

      var options = Hash.merge({sensor: false, address: loc}, opts || {});

      var params = {
        host: 'maps.googleapis.com',
        port: 80,
        path: '/maps/api/geocode/json?' + querystring.stringify(options),
        headers: {}
      };

      return request( params, cbk );
    },

    reverseGeocode: function ( providerOpts, lat, lng, cbk, opts ) {

      var options = Hash.merge({sensor: false, latlng: lat + ',' + lng}, opts || {});

      var params = {
        host: 'maps.googleapis.com',
        port: 80,
        path: '/maps/api/geocode/json?' + querystring.stringify(options),
        headers: {}
      };

      return request( params, cbk );

    }

  },

  "geonames":{

    geocode: function ( providerOpts, loc, cbk, opts ) {

      var options = Hash.merge({q: loc, maxRows: 10, username:providerOpts.username||"demo" }, opts || {});

      var params = {
        host: 'api.geonames.org',
        port: 80,
        path: '/searchJSON?' + querystring.stringify(options),
        headers: {}
      };

      return request( params, cbk );
    },

    reverseGeocode: function ( providerOpts, lat, lng, cbk, opts ) {

      var options = Hash.merge({lat:lat, lng:lng, username:providerOpts.username||"demo" }, opts || {});

      var params = {
        host: 'api.geonames.org',
        port: 80,
        path: '/extendedFindNearby?' + querystring.stringify(options),
        headers: {}
      };

      // geonames only returns this service in XML :(
      return request( params, function(err, data) {
        if (err) return cbk(err);

        var parser = new xml2js.Parser();
        parser.parseString(data, function (err, result) {
          if (err) return cbk(err); 

          // Transform geonames' structure into something that looks like Google's JSON outpu
          // https://developers.google.com/maps/documentation/geocoding/#JSON
          var googlejson = {
            "status":"OK",
            "results":[
              {
                "address_components":[],
                "formatted_address":"",
                "geometry":{
                  "location":{
                    "lat":lat,
                    "lng":lng
                  }
                }
              }
            ]
          };

          if (result.geonames.address) {
            var a = result.geonames.address[0];

            if (a.streetNumber && typeof a.streetNumber[0]=="string")
              googlejson.results[0].address_components.push({
                "long_name":a.streetNumber[0],
                "short_name":a.streetNumber[0],
                "types":["street_number"]
              });

            if (a.street && typeof a.street[0]=="string")
              googlejson.results[0].address_components.push({
                "long_name":a.street[0],
                "short_name":a.street[0],
                "types":["route"]
              });

            if (a.placename && typeof a.placename[0]=="string")
              googlejson.results[0].address_components.push({
                "long_name":a.placename[0],
                "short_name":a.placename[0],
                "types":["locality", "political"]
              });

            if (a.adminName1 && typeof a.adminName1[0]=="string")
              googlejson.results[0].address_components.push({
                "long_name":a.adminName1[0],
                "short_name":a.adminCode1[0],
                "types":[ "administrative_area_level_1", "political" ]
              });

            if (a.adminName2 && typeof a.adminName2[0]=="string")
              googlejson.results[0].address_components.push({
                "long_name":a.adminName2[0],
                "short_name":a.adminCode2[0],
                "types":[ "administrative_area_level_2", "political" ]
              });

            if (a.countryCode && typeof a.countryCode[0]=="string")
              googlejson.results[0].address_components.push({
                "long_name":a.countryCode[0]=="US"?"United States":"",
                "short_name":a.countryCode[0],
                "types":[ "country" ]
              });

            if (a.lat && typeof a.lat[0]=="string")
              googlejson.results[0].geometry.location = {
                "lat":parseFloat(a.lat[0]),
                "lng":parseFloat(a.lng[0])
              }
          }

          if (result.geonames.geoname) {
            // http://www.geonames.org/export/codes.html
            // https://developers.google.com/maps/documentation/geocoding/#Types
            var fcode2google = {
              "ADM1":[ "administrative_area_level_1", "political" ],
              "ADM2":[ "administrative_area_level_2", "political" ],
              "ADM3":[ "administrative_area_level_3", "political" ],
              "ADMD":[ "political"],
              "PPL" :[ "locality"]
            };

            result.geonames.geoname.forEach(function(geoname) {

              // Push only recognized types to results
              if (geoname.fcode[0]=="PCLI") {
                googlejson.results[0].address_components.push({
                  "long_name":geoname.name[0],
                  "short_name":geoname.countryCode[0],
                  "types":[ "country", "political"]
                });
              
              } else if (fcode2google[geoname.fcode[0]]) {


                googlejson.results[0].address_components.push({
                  "long_name":geoname.toponymName[0],
                  "short_name":geoname.name[0],
                  "types":fcode2google[geoname.fcode[0]]
                });
              }

            });
          }

          // Make a formatted address as well as we can
          var shortNames = {};
          googlejson.results[0].address_components.forEach(function(c) {
            if (c.types[0]=="country") return shortNames.country = c.long_name || c.short_name;
            shortNames[c.types[0]] = c.short_name;
          });

          var formatted = [];
          if (shortNames.street_number || shortNames.route) {
            formatted.push((shortNames.street_number?shortNames.street_number+" ":"")+shortNames.route);
          }
          if (shortNames.locality) {
            formatted.push(shortNames.locality);
          }
          if (shortNames.administrative_area_level_1) {
            formatted.push(shortNames.administrative_area_level_1);
          }
          if (shortNames.country) {
            formatted.push(shortNames.country);
          }

          googlejson.results[0].formatted_address = formatted.join(", ");

          cbk(null, googlejson);
        });
      },true);

    }


  }


};






/**
 * Geocoder 
 */

function Geocoder () {
  this.provider = "google";
  this.providerOpts = {};
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

    return providers[this.provider].geocode(this.providerOpts, loc, cbk, opts);

  },

  reverseGeocode: function ( lat, lng, cbk, opts ) {
    if ( !lat || !lng ) {
      return cbk( new Error( "Geocoder.reverseGeocode requires a latitude and longitude." ) );
    }

    return providers[this.provider].reverseGeocode(this.providerOpts, lat, lng, cbk, opts );

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
