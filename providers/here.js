var request = require("request");
var extend = require('extend');

exports.geocode = function ( providerOpts, loc, opts, cbk ) {

  console.log("Here");

  var options = extend({searchtext: loc, gen:"9", app_id:providerOpts.appid||"[yourappidhere]", app_code: providerOpts.appcode||"[yourappcodehere]" }, opts || {});

  request({
    uri:"http://geocoder.api.here.com/6.2/geocode.json",
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

// Here api https://developer.here.com/rest-apis/documentation/geocoder
exports.reverseGeocode = function ( providerOpts, lat, lng, opts, cbk ) {

  var options = extend({pos:lat+","+lng, mode:"trackPosition", gen:"9", app_id:providerOpts.appid||"[yourappidhere]", app_code: providerOpts.appcode||"[yourappcodehere]"}, opts || {});

  request({
    uri:"http://reverse.geocoder.api.here.com/6.2/reversegeocode.json",
    qs:options,
    headers: {
      'User-Agent': 'request'
    }
  }, function(err,resp,body) {

    // console.log("[GEOCODER Here API] uri:", "http://reverse.geocoder.api.here.com/6.2/reversegeocode.json");
    // console.log("[GEOCODER Here API] options:", JSON.stringify(options));
    // console.log("[GEOCODER Here API] body:", body);

    if (err) return cbk(err);

    var result;
    try {
      result = JSON.parse(body);
    } catch (err) {
      cbk(err);
      return;
    }

    var view = result.Response.View[0];
    if(!view) {
      cbk(false, result);
    }

    // Transform Here structure into something that looks like Google's JSON output
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

    var location = view.Result[0].Location;

    if(location.Address) {
      var a = location.Address;

      var additionalData = {};

      a.AdditionalData.map(function(obj) {
        additionalData[obj.key] = obj.value;
      });

      if (a.HouseNumber || a.Building)
        googlejson.results[0].address_components.push({
          "long_name":a.HouseNumber || a.Building,
          "short_name":a.HouseNumber || a.Building,
          "types":["street_number"]
        });

      if (a.Street)
        googlejson.results[0].address_components.push({
          "long_name":a.Street,
          "short_name":a.Street,
          "types":["route"]
        });

      if (a.City || a.District)
        googlejson.results[0].address_components.push({
          "long_name": a.City || a.District,
          "short_name": a.City || a.District,
          "types":["locality", "political"]
        });

      if (a.State && typeof a.State=="string")
        googlejson.results[0].address_components.push({
          "long_name":additionalData.StateName || a.State,
          "short_name":a.State,
          "types":[ "administrative_area_level_1", "political" ]
        });

      if (a.County && typeof a.County=="string")
        googlejson.results[0].address_components.push({
          "long_name":additionalData.CountyName || a.County,
          "short_name":a.County,
          "types":[ "administrative_area_level_2", "political" ]
        });

      if (a.Country && typeof a.Country=="string")
        googlejson.results[0].address_components.push({
          "long_name":additionalData.CountryName,
          "short_name":(additionalData.Country2 || a.Country.substring(0,2)).toUpperCase(),
          "types":[ "country", "political" ]
        });

      if (location.DisplayPosition.Latitude && typeof location.DisplayPosition.Latitude=="string")
        googlejson.results[0].geometry.location = {
          "lat":parseFloat(location.DisplayPosition.Latitude),
          "lng":parseFloat(location.DisplayPosition.Longitude)
        }

      // Make a formatted address as well as we can
      googlejson.results[0].formatted_address = a.Label;
    }  

    // console.log("[GEOCODER Here API], calling callback w/", JSON.stringify(googlejson));

    cbk(null, googlejson);
  });

};
