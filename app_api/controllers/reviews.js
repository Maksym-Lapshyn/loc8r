var mongoose = require('mongoose');
var locationModel = mongoose.model('Location');

module.exports.getReviewList = function (req, res) {
  res.status(200);
  res.json({ "status": "success" });
};

module.exports.getReview = function (req, res) {
  if (req.params && req.params.locationId && req.params.reviewId) {
    locationModel
      .findById(req.params.locationId)
      .select("name reviews")
      .exec(function (err, location) {
        if (!location) {
          var review;
          sendJsonResponse(res, 404, {
            "message": "Location not found"
          });
        } else if (err) {
          sendJsonResponse(res, 404, err);
        }
        if (location.reviews && location.reviews.length > 0) {
          review = location.reviews.id(req.params.reviewId);
          if (!review) {
            sendJsonResponse(res, 404, {
              "message": "Incorrect review id"
            })
          } else {
            sendJsonResponse(res, 200, {
              location: {
                name: location.name,
                id: req.params.locationId
              },
              review: review
            });
          }
        } else {
          sendJsonResponse(res, 404, {
            "message": "No reviews found"
          })
        }
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "Either location id or review id is not provided"
    });
  }
};

module.exports.createReview = function (req, res) {
  var locationId = req.params.locationId;
  if (!locationId) {
    sendJsonResponse(res, 404, {
      "message": "Not found, locationId is required"
    });
  } else {
    locationModel
      .findById(locationId)
      .select("reviews")
      .exec(function (err, location) {
        if (err) {
          sendJsonResponse(res, 400, err);
        } else {
          addReview(req, res, location);
        }
      });
  }
};

module.exports.updateReview = function (req, res) {
  res.status(200);
  res.json({ "status": "success" });
};

module.exports.deleteReview = function (req, res) {
  res.status(200);
  res.json({ "status": "success" });
};

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

function addReview(req, res, location) {
  if (!location) {
    sendJsonResponse(res, 404, {
      message: "location not found"
    })
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
  }
  locationModel.save(function (err, location) {
    var thisReview;
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      updateRating(location._id);
      thisReview = lcoation.reviews[location.reviews.length - 1];
      sendJsonResponse(res, 201, thisReview);
    }
  });
};

function updateRating(res, )