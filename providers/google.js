var request = require("request");
var extend = require('extend');

exports.geocode = function ( providerOpts, loc, opts, cbk ) {

  var options = extend({address: loc}, opts || {});
  var uri = "http" + ( options.key ? "s" : "" ) + "://maps.googleapis.com/maps/api/geocode/json";
  request({
    uri: uri,
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

exports.reverseGeocode = function ( providerOpts, lat, lng, opts, cbk ) {

  var options = extend({latlng: lat + ',' + lng}, opts || {});
  var uri = "http" + ( options.key ? "s" : "" ) + "://maps.googleapis.com/maps/api/geocode/json";

  request({
    uri:uri,
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

    if(Array.isArray(result.results) && result.results.length > 0 && result.results[0].geometry && result.results[0].geometry.location) {
      result.results[0].geometry.location.lat = parseFloat(lat);
      result.results[0].geometry.location.lng = parseFloat(lng);
    }

    cbk(null,result);
  });

};
