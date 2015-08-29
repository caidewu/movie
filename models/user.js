/**
 * Created by caidewu on 15/8/16.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User', UserSchema);

module.exports = User;