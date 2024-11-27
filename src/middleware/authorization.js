import jwt from 'jsonwebtoken';
import bycript from 'bcryptjs';

const JWT_KEY = process.env.JWT_KEY;

const authenticateJWT = (req, res, next) => {


    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    });
};

const authenticateOTP = (req, res, next) => {
    const otp = req.cookies.otp;
    if(Boolean(otp)) next();
    else res.redirect('/login');
};

export default {
    authenticateJWT,
    authenticateOTP
};