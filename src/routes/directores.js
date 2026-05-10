
// src/routes/directores.js
const { Router } = require('express')
const {
  listarDirectores,
  obtenerDirectorConPeliculas
} = require('../controllers/directorController')

const router = Router()

router.get('/', listarDirectores)
router.get('/:id/peliculas', obtenerDirectorConPeliculas)

module.exports = router
