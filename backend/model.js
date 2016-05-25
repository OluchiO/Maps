var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    title: {type: String, required: true},
    compensation: {type: Number, required: true},
    ageRange: {type: String, required: true},
    gender: {type: String, required: true},
    medType: {type: String, required: true},
    city: {type: String},
    description: {type: String, required: true},
    link: {type: String, required: true},
  // WHAT DO I NEED FOR GOOGLE??
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}


});



module.exports = mongoose.model('mapListing', UserSchema);