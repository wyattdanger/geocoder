// xml2js is optional because only needed for geonames support
var xml2js = require("xml2js");
var request = require("request");
var _ = require('underscore');

exports.geocode = function ( providerOpts, loc, cbk, opts ) {

  var options = _.extend({q: loc, flags: "J", appid:providerOpts.appid||"[yourappidhere]" }, opts || {});

  request({
    uri:"http://where.yahooapis.com/geocode",
    qs:options
  }, function(err,resp,body) {
    if (err) return cbk(err);
    var result;
    try {
      result = JSON.parse(body);
    } catch (err) {
      cbk(err);
      return;
    }
    cbk(null,result);
  });
};

// yahoo placefinder api http://developer.yahoo.com/geo/placefinder/guide/
exports.reverseGeocode = function ( providerOpts, lat, lng, cbk, opts ) {

  var options = _.extend({q: lat+", "+lng, gflags:"R", flags: "J", appid:providerOpts.appid||"[yourappidhere]" }, opts || {});

  request({
    uri:"http://where.yahooapis.com/geocode",
    qs:options
  }, function(err,resp,body) {

    // console.log("[GEOCODER Yahoo API] uri:", "http://where.yahooapis.com/geocode");
    // console.log("[GEOCODER Yahoo API] options:", JSON.stringify(options));
    // console.log("[GEOCODER Yahoo API] body:", body);

    if (err) return cbk(err);

    var result;
    try {
      result = JSON.parse(body);
    } catch (err) {
      cbk(err);
      return;
    }

    // Transform yahoo' structure into something that looks like Google's JSON outpu
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

    if (result.ResultSet.Error !== "0" && result.ResultSet.Error !== 0) {
      console.log("[GEOCODER Yahoo API] ERROR", result.Error, result.ErrorMessage);
      return cbk(result.ResultSet.ErrorMessage);
    }

    var a = null;
    // Yahoo seems to change its response format "randomly". So, sometimes, it there is only one result,
    // it will be in ResultSet.Result, and sometimes, in ResultSet.Results[0]
    if (undefined !== result.ResultSet.Result) {
      a = result.ResultSet.Result;
    }
    else if (result.ResultSet.Results && result.ResultSet.Results.length) {
      a = result.ResultSet.Results[0];
    }

    if (!a) {
      return cbk("Error getting results from Yahoo API");
    }

    if (a.house)
      googlejson.results[0].address_components.push({
        "long_name":a.house,
        "short_name":a.house,
        "types":["street_number"]
      });

    if (a.street)
      googlejson.results[0].address_components.push({
        "long_name":a.street,
        "short_name":a.street,
        "types":["route"]
      });

    if (a.city)
      googlejson.results[0].address_components.push({
        "long_name":a.city,
        "short_name":a.city,
        "types":["locality", "political"]
      });

    if (a.state)
      googlejson.results[0].address_components.push({
        "long_name":a.state,
        "short_name":a.statecode || a.state,
        "types":[ "administrative_area_level_1", "political" ]
      });

    if (a.county)
      googlejson.results[0].address_components.push({
        "long_name":a.county,
        "short_name":a.countycode || a.county,
        "types":[ "administrative_area_level_2", "political" ]
      });

    if (a.country)
      googlejson.results[0].address_components.push({
        "long_name":a.country,
        "short_name":a.countrycode,
        "types":[ "country" ]
      });

    if (a.postal)
      googlejson.results[0].address_components.push({
        "long_name":a.postal,
        "short_name":a.postal,
        "types":[ "postal_code" ]
      });

    if (a.latitude)
      googlejson.results[0].geometry.location = {
        "lat":parseFloat(a.latitude),
        "lng":parseFloat(a.longitude)
      };

    // Make a formatted address as well as we can
    var formatted = [];
    if (a.line1) formatted.push(a.line1);
    if (a.line2) formatted.push(a.line2);
    if (a.line3) formatted.push(a.line3);
    if (a.line4) formatted.push(a.line4);

    googlejson.results[0].formatted_address = formatted.join(", ");

    // console.log("[GEOCODER Yahoo API], calling callback w/", JSON.stringify(googlejson));

    cbk(null, googlejson);
  });

};
