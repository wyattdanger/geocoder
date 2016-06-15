var request = require("request");
var extend = require('extend');

exports.geocode = function ( providerOpts, loc, opts, cbk ) {

  var options = extend({q: loc, format: "json", addressdetails:"1" }, opts || {});

  request({
    uri:"http://nominatim.openstreetmap.org/search",
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

// Nominatim api http://wiki.openstreetmap.org/wiki/Nominatim
exports.reverseGeocode = function ( providerOpts, lat, lng, opts, cbk ) {

  var options = extend({lat:lat, lon:lng, format:"json", addressdetails:"1"}, opts || {});

  request({
    uri:"http://nominatim.openstreetmap.org/reverse",
    qs:options,
    headers: {
      'User-Agent': 'request'
    }
  }, function(err,resp,body) {

    // console.log("[GEOCODER Nominatim API] uri:", "http://nominatim.openstreetmap.org/reverse");
    // console.log("[GEOCODER Nominatim API] options:", JSON.stringify(options));
    // console.log("[GEOCODER Nominatim API] body:", body);

    if (err) return cbk(err);

    var result;
    try {
      result = JSON.parse(body);
    } catch (err) {
      cbk(err);
      return;
    }

    // Transform Nominatim structure into something that looks like Google's JSON output
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
          },
          "place_id": ""
        }
      ]
    };

    if(result.address) {
      var a = result.address;

      if (a.house_number || a.building)
        googlejson.results[0].address_components.push({
          "long_name":a.house_number || a.building,
          "short_name":a.house_number || a.building,
          "types":["street_number"]
        });

      if (a.road || a.cycleway)
        googlejson.results[0].address_components.push({
          "long_name":a.road || a.cycleway,
          "short_name":a.road || a.cycleway,
          "types":["route"]
        });

      if (a.city || a.town || a.village || a.hamlet)
        googlejson.results[0].address_components.push({
          "long_name": a.city || a.town || a.village || a.hamlet,
          "short_name": a.city || a.town || a.village || a.hamlet,
          "types":["locality", "political"]
        });

      if (a.state && typeof a.state=="string")
        googlejson.results[0].address_components.push({
          "long_name":a.state,
          "short_name":a.state,
          "types":[ "administrative_area_level_1", "political" ]
        });

      if (a.county && typeof a.county=="string")
        googlejson.results[0].address_components.push({
          "long_name":a.county,
          "short_name":a.county,
          "types":[ "administrative_area_level_2", "political" ]
        });

      if (a.country && a.country_code && typeof a.country=="string")
        googlejson.results[0].address_components.push({
          "long_name":a.country,
          "short_name":a.country_code.toUpperCase(),
          "types":[ "country", "political" ]
        });

      /*if (result.lat && typeof a.lat=="string")
        googlejson.results[0].geometry.location = {
          "lat":parseFloat(result.lat),
          "lng":parseFloat(result.lon)
        }*/
    }

    // Make a formatted address as well as we can
    googlejson.results[0].formatted_address = result.display_name;

    // Set place id
    googlejson.results[0].place_id = result.place_id;    

    // console.log("[GEOCODER Nominatim API], calling callback w/", JSON.stringify(googlejson));

    cbk(null, googlejson);
  });

};
