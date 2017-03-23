const request = require('request');
const _ = require('underscore');

exports.geocode = function (providerOpts, loc, cbk, opts) {
  const options = _.extend({ sensor: false, address: loc }, opts || {});
  const uri = `http${options.key ? 's' : ''}://maps.googleapis.com/maps/api/geocode/json`;
  request({
    uri,
    qs: options,
  }, (err, resp, body) => {
    if (err) return cbk(err);
    let result;
    try {
      result = JSON.parse(body);
    } catch (err) {
      cbk(err);
      return;
    }
    cbk(null, result);
  });
};

exports.reverseGeocode = function (providerOpts, lat, lng, cbk, opts) {
  const options = _.extend({ sensor: false, latlng: `${lat},${lng}` }, opts || {});
  const uri = `http${options.key ? 's' : ''}://maps.googleapis.com/maps/api/geocode/json`;

  request({
    uri,
    qs: options,
  }, (err, resp, body) => {
    if (err) return cbk(err);
    let result;
    try {
      result = JSON.parse(body);
    } catch (err) {
      cbk(err);
      return;
    }
    cbk(null, result);
  });
};
