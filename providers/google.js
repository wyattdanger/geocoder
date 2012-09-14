var request = require("request");
var _ = require('underscore');

exports.geocode = function ( providerOpts, loc, cbk, opts ) {

  var options = _.extend({sensor: false, address: loc}, opts || {});

  request({
    uri:"http://maps.googleapis.com/maps/api/geocode/json",
    qs:options
  }, function(err,resp,body) {
    if (err) return cbk(err);
    cbk(null,JSON.parse(body));
  });
};

exports.reverseGeocode = function ( providerOpts, lat, lng, cbk, opts ) {

  var options = _.extend({sensor: false, latlng: lat + ',' + lng}, opts || {});

  request({
    uri:"http://maps.googleapis.com/maps/api/geocode/json",
    qs:options
  }, function(err,resp,body) {
    if (err) return cbk(err);
    cbk(null,JSON.parse(body));
  });

};