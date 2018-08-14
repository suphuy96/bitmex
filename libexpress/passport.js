var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(false, {usename: "bitmex", password: "oneconnect"});
    // });
});
passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password1',
    passReqToCallback: true
}, function (req, username, password, done) {
    return done(null, {username: username, password: password});

}));
passport.use('local-signin', new LocalStrategy(
    function (username, password, done) {
        console.log(username)
        if (username == "bitmex" && password == "oneconnect12") {
            {
                return done(null, {id: "fsadf", usename: "bitmex", password: "oneconnect"});
            }
        } else
            return done(null, false, {message: "Incorrect password"});


    }
));
