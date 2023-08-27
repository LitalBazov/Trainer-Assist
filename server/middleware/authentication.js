const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = process.env;

const authenticateUser = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({error: 'Unauthorized'});
    };

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        
        next();
    } catch(error) {
        return res.status(401).json({error: 'Invalid token'})
    }
};

const authorizeUser = (roles) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (!roles.includes(role)) {
            return res.status(403).json({error: 'Forbidden'});
        }

        next();
    }
};

module.exports = { authenticateUser, authorizeUser };