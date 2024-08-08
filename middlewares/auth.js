// middleware.js
function setUser(req, res, next) {
    // Assuming req.user contains the user information after authentication
    res.locals.user = req.user || null;
    next();
}

module.exports = setUser;
