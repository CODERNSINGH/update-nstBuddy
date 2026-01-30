import bcrypt from 'bcryptjs';

// Simple authentication middleware
export const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const token = authHeader.substring(7);

        // Simple token validation (email:uniqueKey base64 encoded)
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            const [email, uniqueKey] = decoded.split(':');

            if (!email || !uniqueKey) {
                return res.status(401).json({ error: 'Invalid token format' });
            }

            // Store admin info in request for use in routes
            req.admin = { email, uniqueKey };
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
