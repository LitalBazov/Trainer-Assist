const jwt = require('jsonwebtoken');
const { JWT_SECRET, AUTH_MAX_AGE } = process.env;

const generateToken = async (user) => {
    return jwt.sign(
        {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            age:user.age,
            city:user.city,
            phone:user.phone,
            role: user.role,
            profilePicture: user.profilePicture,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

const refreshAuthTokenCookie = async (req, res, next) => {
    //1. get the existing token from cookie
    //2. no ? next()
    //3. verify token and extract user data
    //4. create a new token
    //5. add it to cookie
    //6. (both have 15 minutes expiry time, starting now)

    const token = req.cookies.token;
    if (!token) {
        console.log('no token cookie to refresh');
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const newToken = await generateToken(decoded);
        res.cookie('token', newToken, {
            httpOnly: false,
            maxAge: AUTH_MAX_AGE,
        });
        next();
    } catch(error) {
        return res.status(401).json({error: 'Invalid token'});
    }

}

module.exports = { generateToken, refreshAuthTokenCookie };