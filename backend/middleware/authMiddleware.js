const { supabase } = require('../config/supabase');

// Oturum kontrolü middleware'i
exports.isAuthenticated = (req, res, next) => {
    const sessionToken = req.cookies.sessionToken;
    
    if (sessionToken && req.app.locals.activeSessions && req.app.locals.activeSessions[sessionToken]) {
        return next();
    }
    
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({
            success: false,
            message: 'Oturum açmanız gerekiyor'
        });
    }
    
    res.redirect('/pages/login.html');
};

// Oturum açmamış kullanıcılar için middleware
exports.isNotAuthenticated = (req, res, next) => {
    const sessionToken = req.cookies.sessionToken;
    
    if (!sessionToken || !req.app.locals.activeSessions || !req.app.locals.activeSessions[sessionToken]) {
        return next();
    }
    
    if (req.path.startsWith('/api/')) {
        return res.status(403).json({
            success: false,
            message: 'Zaten oturum açmışsınız'
        });
    }
    
    res.redirect('/');
}; 