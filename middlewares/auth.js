const isLogin = async (req, res, next) => {
    try {
        if (req.session.user) {
            // user is logged in → allow access
            return next();
        } else {
            // not logged in → redirect
            return res.redirect('/');
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (!req.session.user) {
            // not logged in → allow access (e.g. login/register page)
            return next();
        } else {
            // logged in → redirect to dashboard
            return res.redirect('/dashboard');
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    isLogin,
    isLogout
};
