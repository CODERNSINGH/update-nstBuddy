// Middleware to check if user is authenticated
export const authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized - Please log in' });
};

// Middleware to check if user is authenticated AND is an admin
export const authenticateAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized - Please log in' });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    next();
};

// Middleware to check Pro status (for future use)
export const checkProStatus = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized - Please log in' });
    }

    if (!req.user.isPro) {
        return res.status(403).json({ error: 'Pro subscription required' });
    }

    next();
};
