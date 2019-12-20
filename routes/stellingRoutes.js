var express = require('express');


var routes = function (Stelling, js2xmlparser) {
    var stellingRouter = express.Router();

    stellingRouter.use('/:stellingId', function (req, res, next) {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'PUT, GET, DELETE, OPTIONS');
            res.status(200);
            res.end();
        } else {
            next()
        }
    });

    stellingRouter.use('', function (req, res, next) {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.status(200);
            res.end();
        } else {
            next()
        }
    });


    var stellingController = require("../controller/stellingController")(Stelling, js2xmlparser);

    stellingRouter.route('')
        .post(stellingController.post)
        .get(stellingController.get)


    stellingRouter.use('/:stellingId', function (req, res, next) {
        Stelling.findById(req.params.stellingId, function (err, stelling) {
            if (err)
                res.status(500).send(err);
            else if (stelling) {
                req.stelling = stelling;
                next();
            }
            else {
                res.status(404).send('no stelling found');
            }
        });
    });


    stellingRouter.route('/:stellingId')
        .get(function (req, res) {
            res.header('Access-Control-Allow-Origin', '*');
            //res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            //res.header('Access-Control-Allow-Headers', 'Content-Type');

            var returnStelling = req.stelling.toJSON();
            var id = String(returnStelling._id);
            returnStelling._id = id;
            returnStelling.links = [{
                rel: "self",
                href: 'http://' + req.headers.host + '/api/stelling/' + req.stelling._id
            }, {rel: "collection",
                href: 'http://' + req.headers.host + '/api/stelling/'
            }];


            var xmlresponse = js2xmlparser('stellingen',returnStelling);
            var json = returnStelling;

            if (req.accepts('json')) {
                res.json(json);
            } else if (req.accepts('xml')) {
                res.set('Content-Type', 'application/xml');
                res.send(xmlresponse);
            }
            else {
                res.status(400);
                res.send("Accepteert alleen maar json en xml");
            }
        })
        .put(function (req, res) {
            req.stelling.stelling = req.body.stelling;
            req.stelling.author = req.body.author;
            req.stelling.test = req.body.test;

            req.stelling.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                }
                else if (req.body.stelling == null || req.body.author == null || req.body.test == null ||
                    req.body.stelling == "" || req.body.author == "" || req.body.test == "") {
                    res.status(400).send('Alles moet ingevuld zijn.');
                }
                else {
                    res.json(req.stelling);
                }
            });
        })
        .delete(function (req, res) {
            req.stelling.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(204).send("removed");
            })
        });

    return stellingRouter;
};


module.exports = routes;