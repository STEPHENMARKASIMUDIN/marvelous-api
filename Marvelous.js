const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const port = 1552
const movieList = require('./controller/movie_list')
const login = require('./controller/login')
const { join } = require('path')
app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', ['http://localhost:1551'])
    res.set('Access-Control-Allow-Methods', ['GET', 'POST',])
    res.set('Access-Control-Allow-Headers', ['Content-Type', 'OPTIONS'])
    next()
});
//controller here
app.use('/movieList', movieList)
app.use('/login', login)

//C:\Users\BOS CONTROL\AppData\Roaming\npm
app.use('/', express.static(join(__dirname, 'build')));


app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '/build/index.html'));
})


app.listen(port, (err) => {
    if (!!err) {
        return console.log(err);

    }
    console.log(`Server is listening to ${port}`)
});