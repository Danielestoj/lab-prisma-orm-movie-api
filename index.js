// index.js
require('dotenv').config()
require('./src/config/db') // Esto ejecuta el pool.connect de verificación
const peliculaService = require('./src/services/PeliculaService')
const express = require('express')
const authRouter = require('./src/routes/auth')

const peliculasRouter = require('./src/routes/peliculas')

const app = express()
const PORT = process.env.PORT || 3000

const favoritosRouter = require('./src/routes/favoritos')

// Middleware global
app.use(express.json())

// Rutas
app.use('/api/peliculas', peliculasRouter)

// Ruta de estadísticas (no pertenece a peliculasRouter, pero podrías moverla también)
app.get('/api/estadisticas', async (req, res, next) => {
  try {
    const stats = await peliculaService.obtenerEstadisticas()
    res.json(stats)
  } catch (err) {
    next(err)
  }
})

// Rutas de directores
app.use('/api/directores', require('./src/routes/directores'))

// Rutas de autenticación
app.use('/api/auth', authRouter)

// Rutas de favoritos 
app.use('/api/favoritos', favoritosRouter)

// 404 global
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` })
})

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err)

  res.status(err.statusCode || 500).json({
    error: err.message || 'Error interno del servidor'
  })
})


// Al final de index.js.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
  })
}

module.exports = app