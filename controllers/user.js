const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Airbnb...!!!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message + " .Please try again...!!!");
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = (req, res) => {
    // passport is reset to session so it delete redirectUrl it give Empty undefined url
    // so we store redirectUrl it into passport-local ans passport not have to access of local  
    
    console.log('Redirecting to:', res.locals.redirectUrl);
    req.flash("success", "Welcome back to Airbnb...!!!");
    res.redirect(res.locals.redirectUrl || '/listings'); // Provide a fallback URL
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged out...!!!");
        res.redirect("/listings");
    });
}