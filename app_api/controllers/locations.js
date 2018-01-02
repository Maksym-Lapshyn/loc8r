var mongoose = require('mongoose');
var locationModel = mongoose.model('Location');

module.exports.getLocationListByDistance = function (req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  if (!lng || !lat) {
    sendJsonResponse(res, 404, {
      "message": "lng and lat query paramaters are required"
    });

    return;
  }

  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  var options = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };

  locationModel.geoNear(point, options, function (err, results, stats) {
    if (err) {
      sendJsonResponse(res, 404, err);
    }

    var locations = [];

    results.forEach(function (doc) {
      locations.push({
        distance: theEarth.getDistanceFromRads(doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      });
    });

    sendJsonResponse(res, 200, locations);
  });
};

module.exports.getLocation = function (req, res) {
  if (req.params && req.params.locationId) {
    locationModel
      .findById(req.params.locationId)
      .exec(function (err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {
            "message": "Location not found"
          });
        } else if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, location);
        }
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "Location id is not provided"
    });
  }
};

module.exports.createLocation = function (req, res) {
  locationModel.create({
    name: req.body.name,
    address: req.body.adress,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: getOpeningTimes(res)
  }, function (err, location) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, location);
    }
  });

  function getOpeningTimes(res) {
    var openingTimes = [];
    var i = 1;

    while (true) {
      var days = req.body[`days${i}`];
      var opening = req.body[`opening${i}`];
      var closing = req.body[`closing${i}`];
      var closed = req.body[`closed${i}`];

      if (!days && !opening && !closing && !closed) {
        return openingTimes;
      }

      openingTimes.push({
        days: days,
        opening: opening,
        closing: closing,
        closed: closed
      });

      i++;
    }
  }
};

module.exports.updateLocation = function (req, res) {
  res.status(200);
  res.json({
    "status": "success"
  });
};

module.exports.deleteLocation = function (req, res) {
  res.status(200);
  res.json({
    "status": "success"
  });
};

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

var theEarth = (function () {
  var earthRadius = 6371;

  var getDistanceFromRads = function (rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function (distance) {
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();