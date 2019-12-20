var express = require('express');


var routes = function(Vote){
    var voteRouter = express.Router();

    voteRouter.route('/')
        .post(function(req, res){
            var votes = new Vote(req.body);
            votes.save();
            res.status(200).send(votes);
        })
        .get(function(req, res){
            res.header("Access-Control-Allow-Origin", "*");
            var query = {};

            if(req.query.vote){
                query.vote = req.query.vote;
            }
            Vote.find(query, function (err, votes) {
                if(err)
                    res.status(500).send(err);
                else
                    res.json(votes);
            });
        });

    return voteRouter;
};


module.exports = routes;