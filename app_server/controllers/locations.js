module.exports.homeList = function(req,res){
    res.render('locations-list', {title:'Home'});
};

module.exports.locationInfo = function(req,res){
    res.render('location-info', {title:'Location info'});
};

module.exports.newReview = function(req,res){
    res.render('new-review', {title:'New review'});
};