/**
 * Created by caidewu on 15/8/4.
 */
var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;