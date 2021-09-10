'use strict';

const lodash = require('lodash');
const port = 3000;
const express = require('express');

const app = express();
app.use(express.json());

// Your code starts here.
// Placeholders for all requests are provided for your convenience.
var users = [{
    user_id: '313152ac-dbc6-4214-90ea-cbcb4a73522f',
    login: 'login',
    password: 'password',
}];
var articles = [];
const { uuid } = require('uuidv4');
app.post('/api/user', (req, res) => {
    if(!req.body.login || !req.body.password) {
        return res.sendStatus(400)
    }
    console.log(uuid(), req.login, req.password)
    users.push({
        user_id: uuid(),
        login: req.body.login,
        password: req.body.password,
    });
    console.log(users)
    return res.sendStatus(201)
});

app.post('/api/authenticate', (req, res) => {
    if(!req.body) {
        return res.sendStatus(400)
    }
    let user = users.find(elem => elem.login === req.body.login);
    if(!user) {
        return res.send(404)
    }
    if(user.password === req.body.password) {
        user.token = uuid();
        console.log(users)
        return res.send({"token": user.token})
    } else {
        return res.send(401)
    }
});

app.post('/api/logout', (req, res) => {
    if(!req.header("token")){
        return res.sendStatus(401)
    }
    let token = req.header("token")
    let user = users.find(elem => elem.token === token)
    user.token = "";
    res.send(200)
});

app.post('/api/articles', (req, res) => {
    if(!req.header("token")){
        return res.sendStatus(401)
    }
    let token = req.header("token")
    let user = users.find(elem => elem.token === token)
    if(!user) {
        return res.sendStatus(401)
    }
    articles.push({
        article_id: uuid(),
        user_id: user.user_id,
        title: req.body.title,
        content: req.body.content,
        visibility: req.body.visibility,
    })
    return res.sendStatus(201)
});

app.get('/api/articles', (req, res) => {
    if(!req.header("token")){
        return res.sendStatus(401)
    }
    let token = req.header("token")
    let user = users.find(elem => elem.token === token)
    if(!user) {
        return res.sendStatus(401)
    }
    return res.send(articles.find(elem => elem.user_id === user.user_id))
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
