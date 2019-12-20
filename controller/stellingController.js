var stellingController = function (Stelling, js2xmlparser) {

        var post = function (req, res) {
            if (req.accepts('json')) {
                var stelling = new Stelling(req.body);

                if (!req.body.stelling) {
                    res.status(400);
                    res.send('Stelling is required');
                }
                else {
                    stelling.save();
                    res.status(201);
                    res.set('Content-Type', 'application/json');
                    res.send(stelling);
                }
            } else {
                res.status(400);
                res.send("Accepteert alleen maar json en xml");
            }
        };

        var get = function (req, res) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

            var query = {};


            if (req.query.author) {
                query.author = req.query.author;
            }
            Stelling.find(query, function (err, stelling) {
                if (err)
                    res.status(500).send(err);
                else {

                    var stellingCount = stelling.length;

                    var aantalItems = req.query.limit;
                    var startItems = req.query.start;
                    var skipCount = 0;
                    var countItems = 0;

                    if (typeof  req.query.start == "undefined" || req.query.start == null) {
                        if (typeof  req.query.limit == "undefined" || req.query.limit == null) {
                            var totalpages = 1;
                            var currentPage = 1;
                            var last = stellingCount;
                            var next = 1;
                            var previous = 1;
                            var urllimit = stellingCount;
                            var currenItems = stellingCount;
                            //var startlast = Math.max(stellingCount, stellingCount - Number(req.query.limit));
                            var startlast = last;
                        }
                    } else {
                        var totalpages = Math.ceil(stellingCount / req.query.limit);
                        var currentPage = Math.ceil(req.query.limit / req.query.start);
                        var last = stellingCount;
                        var next = Number(req.query.start) + 1;
                        var previous = Number(req.query.start) - Number(req.query.limit);
                        var urllimit = req.query.limit;
                        //var startlast = Math.max(stellingCount, stellingCount - Number(req.query.limit));
                        var currenItems = Number(req.query.limit);
                    }


                    var pagination = {
                        currentPage: currentPage,
                        currentItems: currenItems,
                        totalPages: totalpages,
                        totalItems: stellingCount,
                        links: [
                            {
                                rel: "first",
                                page: 1,
                                href: 'http://' + req.headers.host + '/api/stelling?start=1&limit=' + urllimit
                            },
                            {
                                rel: "previous",
                                page: Math.max(1, currentPage - 1),
                                href: 'http://' + req.headers.host + '/api/stelling?start=' + previous + '&limit=' + urllimit
                            },
                            {
                                rel: "next",
                                page: Math.min(10, currentPage + 1),
                                href: 'http://' + req.headers.host + '/api/stelling?start=' + next + '&limit=' + urllimit
                            },
                            {
                                rel: "last",
                                page: last,
                                href: 'http://' + req.headers.host + '/api/stelling?start=' + last + '&limit=' + urllimit
                            }
                        ]
                    };


                    var returnStelling = {
                        items: [],
                        links: [{rel: "self", href: 'http://' + req.headers.host + '/api/stelling/'}],
                        pagination: pagination
                    };


                    stelling.forEach(function (element, index, arry) {
                            if (typeof aantalItems != "undefined" || aantalItems != null) {
                                if (typeof startItems != "undefined" || startItems != null) {
                                    if (skipCount == startItems) {
                                        if (aantalItems != countItems) {

                                            var newStelling = element.toJSON();
                                            var id = String(newStelling._id);
                                            newStelling._id = id;
                                            newStelling.links = [{
                                                rel: "self",
                                                href: 'http://' + req.headers.host + '/api/stelling/' + newStelling._id
                                            }, {
                                                rel: "collection",
                                                href: 'http://' + req.headers.host + '/api/stelling/'
                                            }];
                                            //newStelling.links.self = 'http://' + req.headers.host + '/api/stelling/' + newStelling._id ;

                                            returnStelling.items.push(newStelling);


                                            countItems++;

                                        }

                                    } else {
                                        skipCount++;
                                    }
                                }
                            }
                            else {

                                var newStelling = element.toJSON();
                                var id = String(newStelling._id);
                                newStelling._id = id;
                                newStelling.links = [{
                                    rel: "self",
                                    href: 'http://' + req.headers.host + '/api/stelling/' + newStelling._id
                                }, {
                                    rel: "collection",
                                    href: 'http://' + req.headers.host + '/api/stelling/'
                                }];
                                //newStelling.links.self = 'http://' + req.headers.host + '/api/stelling/' + newStelling._id ;

                                returnStelling.items.push(newStelling);

                                countItems++;
                            }


                        }
                    );



                }

                var xmlresponse = js2xmlparser("stellingen", returnStelling);
                var json = returnStelling;

                if (req.accepts('application/json')) {
                    res.json(json);
                } else if (req.accepts('application/xml')) {
                    res.set('Content-Type', 'application/xml');
                    res.send(xmlresponse);
                }
                else {
                    res.status(400);
                    res.send("Accepteert alleen maar json en xml");
                }


            });

        };


        return {
            get: get,
            post: post
        }
    }
    ;

module.exports = stellingController;