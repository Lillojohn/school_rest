var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var voteModel = new Schema({
    stelling : { type: String },
    time : { type : Date, default: Date.now },
    author : {type: String, default: "noUser"},
    test : {type: String, default :"ok"}
});

module.exports = mongoose.model('Stelling', voteModel);