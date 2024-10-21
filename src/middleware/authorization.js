
import jwt from 'jsonwebtoken'

const JWT_KEY = process.env.JWT_KEY

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.sendStatus(403);
    }

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

export default authenticateJWT;