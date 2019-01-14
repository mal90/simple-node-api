const express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
var db;
//var CONFIG = require('./config.json');
const port=process.env.PORT || 3000;

console.log("process.....");
console.log(process.env.port);

var userName = process.env.UNAME;
var passWord = process.env.PWORD;
var dbName = process.env.DBNAME;


var URL = 'mongodb://' + userName + ':' + passWord + '@ds161190.mlab.com:61190/' + dbName;
console.log(URL);

app.use('/', express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect(URL);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

app.listen(port, () => {
    console.log('listening on 3000');
})

app.get('/api/products', (req, res) => {
    db.collection('products').find().toArray(function (err, results) {
        console.log(results)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
    })
})

app.post('/api/product/add', (req, res) => {
    db.collection('products').find({ id: req.body.id }).toArray(function (err, result) {
        console.log(result);
        if (result.length == 0) {
            db.collection('products').save(req.body, (err, result) => {
                if (err)
                    return console.log(err);
                console.log('saved to database');
                res.end();
            })
        } else {
            db.collection('products', function (err, collection) {
                collection.remove({ id: req.body.id });
                db.collection('products').save(req.body, (err, result) => {
                    if (err)
                        return console.log(err);
                    console.log('exisiting ad updated in the database');
                    res.end();
                })
            });
        }
    })
})