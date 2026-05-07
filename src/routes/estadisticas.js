const express = require('express')
const router = express.Router()
const db = require('../data/peliculas')

router.get('/', (req, res) => {
  const peliculas = db.getAll()
  const conNota = peliculas.filter(p => p.nota !== null)

  if (conNota.length === 0) {
    return res.json({ media: null, total: peliculas.length, conNota: 0 })
  }

  const suma = conNota.reduce((acc, p) => acc + p.nota, 0)
  const media = (suma / conNota.length).toFixed(2)

  res.json({
    media: Number(media),
    total: peliculas.length,
    conNota: conNota.length
  })
})

router.get('/directores', estadisticasDirectores)
router.get('/generos', estadisticasGeneros)

module.exports = router
