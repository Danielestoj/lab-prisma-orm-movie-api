const jwt = require('jsonwebtoken')
const AppError = require('../../utils/AppError')

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  // 1. Falta header Authorization
  if (!authHeader) {
    return next(new AppError('Token no proporcionado', 401))
  }

  // 2. Formato incorrecto
  const [bearer, token] = authHeader.split(' ')
  if (bearer !== 'Bearer' || !token) {
    return next(new AppError('Formato de token inválido', 401))
  }

  try {
    // 3. Verificar token con fallback para Jest
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'test-secret')
    req.usuario = payload
    next()

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401))
    }
    return next(new AppError('Token inválido', 401))
  }
}

module.exports = verificarToken
