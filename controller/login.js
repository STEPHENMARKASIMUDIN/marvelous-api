var router = require('express').Router();
var async = require('async');
var marvelDB = require('../database_connection/marvelous_connection');


router.post('/', function (req, res) {

    async.waterfall([

        function checkUser(cb) {

            marvelDB.getConnection(function (err, connection) {
                if (!!err) {
                    console.log(err.stack);
                    cb("Unable to Connect to Database!", 500);
                }
                connection.query({ sql: 'SELECT * FROM db WHERE username=? AND password=? ', timeout: 30000 }, [req.body.userid, req.body.password],
                    function (err, data) {
                        if (!!err) {
                            connection.release();
                            console.log(err.stack)
                            return cb("Unable to execute query!", 500);
                        }
                        if (!data.length) {
                            console.log("Invalid Credentials!")
                            connection.release();
                            return cb("Invalid Credentials!", 401);
                        }

                        try {

                            let login_details = {
                                fname: data[0].fname,
                                lname: data[0].lname
                            };
                            connection.release();
                            cb(null, 200, "Success!", login_details);
                        } catch (error) {
                            console.log(error.stack)
                            connection.release();
                            return cb(responseMessage(0), 500);
                        }
                    });
            });
        }
    ], function final(errMessage, statusCode, statusMessage, result) {
        //res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        if (!!errMessage) {
            console.log(errMessage)
            return res.json({ statusMessage: errMessage, statusCode: statusCode });
        }
        console.log(result)
        return res.json({ statusMessage: statusMessage, statusCode: statusCode, result: result });
    });
});


module.exports = router;