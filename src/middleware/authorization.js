import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_KEY;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      console.error('No se proporcionó el encabezado de autorización');
      return res.redirect('/login');
  }

  const token = authHeader.split(' ')[1];


  if (!token) {
      console.error('No se encontró el token en el encabezado de autorización');
      return res.redirect('/login');
  }

  try {
      jwt.verify(token, JWT_KEY, (err, user) => {
          if (err) {
              console.error('Error al verificar el token:', err);
              return res.status(403).json({ mensaje: 'Token de autenticación inválido.' });
          }
          req.user = user;
          next();
      });
  } catch (error) {
      console.error('Error al verificar el token:', error);
      return res.status(400).json({ mensaje: 'Token no válido o formato incorrecto.' });
  }
};

export default authenticateJWT;