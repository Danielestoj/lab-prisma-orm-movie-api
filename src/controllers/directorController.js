// src/controllers/directorController.js
const directorService = require('../services/DirectorService')

const listarDirectores = async (req, res, next) => {
  try {
    const directores = await directorService.obtenerTodos()
    res.json(directores)
  } catch (err) {
    next(err)
  }
}

const obtenerDirectorConPeliculas = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const director = await directorService.obtenerConPeliculas(id)
    res.json(director)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listarDirectores,
  obtenerDirectorConPeliculas
}
