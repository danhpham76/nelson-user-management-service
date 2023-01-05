const express = require('express');
const bodyParser = require('body-parser');
const userlogin = require('./lambda_src/userlogin');
const updateuser = require('./lambda_src/updateuser');
const confirmuser = require('./lambda_src/confirmuser');
const pretokengenerator = require('./lambda_src/preauthtokengenerator');
const listusers = require('./lambda_src/listusers');
const roles = require ('./lambda_src/roles');

const port = 8080;
var app = express();
app.use(bodyParser.json());

app.post('/localtest/pretokengenerator', function (req, res) {
    console.log('Testing pre token generator');
    pretokengenerator.handler(req.body).then(function (ret) {
        res.send(ret);
    }).catch(function (err) {
        console.log(err);
    }).finally(function () {
        res.send();
    });
});

app.get('/api/management/secure/site-host', function (req, res) {
    res.send(`localhost:${port}`);
});

app.post('/api/user/login', function (req, res) {
    console.log(`Login function accessed with data: ${req.body}`);
    userlogin.handler({ body: JSON.stringify(req.body) }).then(function (ret) {
        res.statusCode = ret.statusCode;
        var respBody = JSON.parse(ret.body);
        res.send(respBody);
    }).catch(function (error) {
        console.log(error);
    }).finally(function () {
        res.send();
    });
});

app.post('/api/user/logout', function (req, res) { res.send(); });

app.post('/api/user/user', function (req, res) {
    console.log(`User update function accessed with data: ${req.body}`);
    updateuser.handler({ body: JSON.stringify(req.body) }).then(function (ret) {
        res.statusCode = 200;
        res.send(JSON.parse(ret.body));
    }).catch(function (err) {
        console.log(err);
    }).finally(function () {
        res.send();
    });
});

app.post('/api/user/confirmuser', function (req, res) {
    console.log(`Confirm user function accessed with data: ${req.body}`);
    confirmuser.handler({ body: JSON.stringify(req.body) }).then(function (ret) {
        res.statusCode = 200;
        res.send(JSON.parse(ret.body));
    }).catch(function (err) {
        console.log(err);
    }).finally(function () {
        res.send();
    });
});

app.get('/api/user/listusers', function (req, res) {
    console.log(`List users function accessed with data:`);
    console.log(req.query);
    listusers.handler({ queryStringParameters: req.query }).then(function (ret) {
        res.statusCode = 200;
        res.send(JSON.parse(ret.body));
    }).catch(function (err) {
        console.log(err);
    }).finally(function () {
        res.send();
    });
});

app.get('/api/user/roles', function (req, res) {
    console.log(`List roles function accessed`);
    roles.handler().then(function (ret) {
        res.statusCode = 200;
        res.send(JSON.parse(ret.body));
    }).catch(function (err) {
        console.log(err);
    });
});

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});