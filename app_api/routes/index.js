var express = require('express');
var router = express.Router();
var locationsController = require('../controllers/locations');
var reviewsController = require('../controllers/reviews');

//locations
router.get('/locations', locationsController.getLocationListByDistance);
router.post('/locations', locationsController.createLocation);
router.put('/locations/:locationId', locationsController.updateLocation);
router.delete('/locations/:locationId', locationsController.deleteLocation);
router.get('/locations/:locationId', locationsController.getLocation);

//reviews
router.get('/locations/:locationId/reviews', reviewsController.getReviewList);
router.post('/locations/:locationId/reviews', reviewsController.createReview);
router.put('/locations/:locationId/reviews/:reviewId', reviewsController.updateReview);
router.delete('/locations/:locationId/reviews/:reviewId', reviewsController.deleteReview);
router.get('/locations/:locationId/reviews/:reviewId', reviewsController.getReview);

module.exports = router;