var passport = require('passport');
var express = require('express');
var router = express.Router();
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login');
}
function isNotAuthenticated(req, res, next) {
    if(req.isAuthenticated())
    {
        res.render('index');
    }
    return next();
}

router.get('/login', isNotAuthenticated, function(req, res) {
    res.render('login');
});


router.post('/login', passport.authenticate('local-signin', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', isAuthenticated, function(req, res){
    req.logout();
    res.redirect('/login');
});

module.exports = router;
