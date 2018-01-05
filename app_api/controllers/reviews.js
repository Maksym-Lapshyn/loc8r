var mongoose = require('mongoose');
var locationModel = mongoose.model('Location');

module.exports.getReviewList = function (req, res) {
  if (!req.params.locationId) {
    sendJsonResponse(res, 404, {
      "message": "LocationId is not specified"
    });
  } else {
    locationModel
      .findById(req.params.locationId)
      .select("reviews")
      .exec(function (err, location) {
        if (err) {
          sendJsonResponse(res, 404, err);
        } else if (location.reviews && location.reviews.length > 0) {
          sendJsonResponse(res, 200, location.reviews);
        } else {
          sendJsonResponse(res, 404, {
            "message": "Reviews not found"
          });
        }
      });
  }
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
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(
    function (err, location) {
      var thisReview;

      if (!location) {
        sendJsonResponse(res, 404, {
          "message": "locationid not found"
        });
        return;
      } else if (err) {
        sendJsonResponse(res, 400, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview) {
          sendJsonResponse(res, 404, {
            "message": "reviewid not found"
          });
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save(function (err, location) {
            if (err) {
              sendJsonResponse(res, 404, err);
            } else {
              updateAverageRating(location._id);
              sendJsonResponse(res, 200, thisReview);
            }
          });
        }
      } else {
        sendJsonResponse(res, 404, {
          "message": "No review to update"
        });
      }
    }
    );
};

module.exports.deleteReview = function (req, res) {
  if (!req.params.locationId || !req.params.reviewId) {
    sendJsonResponse(res, 404, {
      "message": "LocationId or reviewId is not specified"
    });
  } else {
    locationModel
      .select('reviews')
      .exec(function (err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {
            "message": "Location not found"
          });
        } else if (err) {
          sendJsonResponse(res, 404, err);
        } else if (location.reviews && location.reviews.length > 0) {
          if (!location.reviews.id(req.params.reviewId)) {
            sendJsonResponse(res, 404, {
              "message": "Review not found"
            });
          } else {
            location.reviews.id(req.params.reviewId).remove();
            location.save(function (err, location) {
              if (err) {
                sendJsonResponse(res, 404, err);
              } else {
                updateRating(location._id);
                sendJsonResponse(res, 204, null);
              }
            });
          }
        } else {
          sendJsonResponse(res, 404, {
            "message": "No review to delete"
          });
        }
      });
  }
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

var updateRating = function updateRating(locationid) {
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(
    function (err, location) {
      if (!err) {
        setAverageRating(location);
      }
    });
};

var setAverageRating = function (location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};