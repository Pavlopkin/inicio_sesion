const res = require('express/lib/response')

function getRoot(req, res) {
    res.sendFile(__dirname + '/views/index.html')
}

function getLogin(req, res) {
    if(req.isAuthenticated()) {
        const user = req.user

        res.send('login-ok')
    } else {
        res.sendFile(__dirname + '/views/login.html')
    }
}

function postLogin(req, res) {
    console.log(req.user)

    res.sendFile(__dirname + '/views/index.html')
}

function getSignup(req, res) {
    res.sendFile(__dirname + '/views/signup.html')
}

function getFailsignup(req, res) {
    res.send('Fail signup')
}

function postSignup(req, res) {
    console.log(req.user)

    res.sendFile(__dirname + '/views/index.html')
}

function getLogout(req, res) {
    req.logout();
    res.sendFile(__dirname + '/views/logout.html')
}


module.exports = {
    getRoot,
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    getFailsignup,
    getLogout
}