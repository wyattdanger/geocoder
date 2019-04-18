var request = require("request");
var _ = require("underscore");

exports.geocode = function(providerOpts, loc, key, cbk, opts) {
  var options = _.extend({ sensor: false, address: loc }, opts || {});
  var uri = "https://maps.googleapis.com/maps/api/geocode/json?key=" + key;
  request(
    {
      uri: uri,
      qs: options
    },
    (err, resp, body) => {
      if (err) return cbk(err);
      var result;
      try {
        result = JSON.parse(body);
      } catch (err) {
        cbk(err);
        return;
      }
      cbk(null, result);
    }
  );
};

exports.reverseGeocode = function(providerOpts, lat, lng, key, cbk, opts) {
  var options = _.extend(
    { sensor: false, latlng: lat + "," + lng },
    opts || {}
  );
  var uri = "https://maps.googleapis.com/maps/api/geocode/json?key=" + key;

  request(
    {
      uri: uri,
      qs: options
    },
    (err, resp, body) => {
      if (err) return cbk(err);
      var result;
      try {
        result = JSON.parse(body);
      } catch (err) {
        cbk(err);
        return;
      }
      cbk(null, result);
    }
  );
};
