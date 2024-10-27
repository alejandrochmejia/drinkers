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
    
    if (!req.cookies || !req.cookies.otp) {
        console.log("No se encontró la cookie otp");
        return res.redirect('/login');
    }

    const otpCookie = req.cookies.otp;

    const otp = Boolean(otpCookie);

    if (otp === undefined || otp === null || otp === false) {
        console.log("OTP no válido");
        return res.redirect('/login');
    }

    next();
};

export default {
    authenticateJWT,
    authenticateOTP
};