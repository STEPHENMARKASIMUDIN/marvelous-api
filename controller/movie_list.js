const router = require('express').Router()
const async = require('async')
const jsftp = require('jsftp')

router.get('/', (req, res) => {
    async.waterfall([
        getList = (cb) => {
            try {
                //1 = '215'
                //2 = '216'
                //3 = '217'
                const ftp = new jsftp({
                    host: '192.168.0.0',
                    port: req.query.port,
                    user: 'CONTROL',
                    pass: '123456789',
                    debugMode: true,
                })
                ftp.ls(req.query.path, (err, res) => {
                    if (err) {
                        console.log(err)
                        cb(err, 401, 'Error')
                    }

                    return cb(null, 200, 'Success', res.sort(function (a, b) {
                        // Use toUpperCase() to ignore character casing
                        const genreA = a.name.toUpperCase();
                        const genreB = b.name.toUpperCase();

                        let comparison = 0;
                        if (genreA > genreB) {
                            comparison = 1;
                        } else if (genreA < genreB) {
                            comparison = -1;
                        }
                        return comparison;

                    }))
                });
                ftp.keepAlive(false)
            }
            catch (e) {
                cb(e, 500, 'Error')
            }
        }
    ], (err, statusCode, statusMessage, result) => {
        if (!!err) {
            return res.json(err, statusCode, statusMessage)
        }
        return res.json({ statusCode: statusCode, statusMessage: statusMessage, result: result })
    })
})

module.exports = router