var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var voteModel = new Schema({
    vote: {
        type: Boolean
    },
    time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Vote', voteModel);