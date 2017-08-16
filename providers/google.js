var phin = require("phin");
var _ = require('underscore');
var querystring = require("querystring");

exports.geocode = function ( providerOpts, loc, cbk, opts ) {

  var options = _.extend({sensor: false, address: loc}, opts || {});
  var uri = "http" + ( options.key ? "s" : "" ) + "://maps.googleapis.com/maps/api/geocode/json"
  phin({
    url: uri + "?" + querystring.stringify(options)
  }, function(err,resp) {
    if (err) return cbk(err);
    var body = resp.body.toString();
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

exports.reverseGeocode = function ( providerOpts, lat, lng, cbk, opts ) {

  var options = _.extend({sensor: false, latlng: lat + ',' + lng}, opts || {});
  var uri = "http" + ( options.key ? "s" : "" ) + "://maps.googleapis.com/maps/api/geocode/json"

  phin({
    url:uri + "?" + querystring.stringify(options)
  }, function(err,resp) {
    if (err) return cbk(err);
    var body = resp.body.toString();
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
