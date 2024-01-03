const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {

        const decodedToken = jwt.verify(token.split(' ')[1], secret);
        console.log("decodedToken == ", decodedToken);
        req.userId = decodedToken.id; // Assuming the user ID is stored as 'id' in the token payload
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = verifyToken;