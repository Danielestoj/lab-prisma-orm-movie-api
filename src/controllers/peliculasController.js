// src/controllers/peliculasController.js
const db = require('../data/peliculas')
const peliculaService = require('../services/PeliculaService')


// GET /api/peliculas/ modificado con paginación, filtrado por género y búsqueda por título/director
const listarPeliculas = async (req, res, next) => {
  try {
    const pagina = Number(req.query.pagina) || 1
    const limite = Number(req.query.limite) || 10
    const genero = req.query.genero || null
    const buscar = req.query.buscar || null

    const resultado = await peliculaService.obtenerPaginadas({
      pagina,
      limite,
      genero,
      buscar
    })

    res.json(resultado)
  } catch (err) {
    next(err)
  }
}




// GET /api/peliculas/:id
// Ejemplo: antes era (req, res, next) =>
// Ahora debe ser async (req, res, next) =>
const obtenerPelicula = async (req, res, next) => {
  try {
    const pelicula = await peliculaService.obtenerPorId(Number(req.params.id))
    res.json(pelicula)
  } catch (err) {
    next(err)
  }
}

// POST /api/peliculas
const crearPelicula = (req, res) => {
  const { titulo, director_id, anio, genero_id, nota } = req.body

  if (!titulo || !director_id || !anio || !genero_id) {
    return res.status(400).json({
      error: 'Los campos titulo, director_id, anio y genero_id son obligatorios'
    })
  }

  if (nota !== undefined && (nota < 0 || nota > 10)) {
    return res.status(400).json({ error: 'La nota debe estar entre 0 y 10' })
  }

  const nueva = db.create({
    titulo,
    director_id,
    anio: Number(anio),
    genero_id,
    nota: nota !== undefined ? Number(nota) : null
  })

  res.status(201).json(nueva)
}
// POST /api/peliculas/:id/calificar
const calificarPelicula = async (req, res, next) => {
  try {
    const peliculaId = Number(req.params.id)
    const resultado = await peliculaService.calificar(peliculaId, req.body)
    res.json(resultado)
  } catch (err) {
    next(err)
  }
}


// PUT /api/peliculas/:id
const actualizarPelicula = (req, res) => {
  const id = Number(req.params.id)
  const { titulo, director_id, anio, genero_id, nota } = req.body

  if (!titulo || !director_id || !anio || !genero_id) {
    return res.status(400).json({
      error: 'PUT requiere todos los campos: titulo, director_id, anio, genero_id'
    })
  }

  const actualizada = db.update(id, { titulo, director_id, anio: Number(anio), genero_id, nota: nota ? Number(nota) : null })

  if (!actualizada) {
    return res.status(404).json({ error: 'Película no encontrada' })
  }

  res.json(actualizada)
}

// DELETE /api/peliculas/:id
const eliminarPelicula = (req, res) => {
  const id = Number(req.params.id)
  const eliminada = db.delete(id)

  if (!eliminada) {
    return res.status(404).json({ error: 'Película no encontrada' })
  }

  res.json({ mensaje: 'Película eliminada', pelicula: eliminada })
}

// GET /api/estadisticas
const obtenerEstadisticas = (req, res) => {
  res.json(db.getStats())
}

// GET /api/peliculas/:id/resenas
const listarResenas = (req, res) => {
  const peliculaId = Number(req.params.id)
  const pelicula = db.getById(peliculaId)

  if (!pelicula) {
    return res.status(404).json({ error: 'Película no encontrada' })
  }

  const resenas = db.getResenas(peliculaId)
  res.json({ pelicula: pelicula.titulo, resenas })
}

// POST /api/peliculas/:id/resenas
const crearResena = (req, res) => {
  const peliculaId = Number(req.params.id)
  const pelicula = db.getById(peliculaId)

  if (!pelicula) {
    return res.status(404).json({ error: 'Película no encontrada' })
  }

  const { autor, texto, puntuacion } = req.body

  if (!autor || !texto || puntuacion === undefined) {
    return res.status(400).json({
      error: 'Los campos autor, texto y puntuacion son obligatorios'
    })
  }

  if (puntuacion < 1 || puntuacion > 10) {
    return res.status(400).json({ error: 'La puntuacion debe ser entre 1 y 10' })
  }

  const nueva = db.createResena(peliculaId, {
    autor,
    texto,
    puntuacion: Number(puntuacion)
  })

  res.status(201).json(nueva)
}

// PATCH /api/peliculas/:id
const actualizarParcial = (req, res) => {
  const id = Number(req.params.id)
  const pelicula = db.getById(id)

  if (!pelicula) {
    return res.status(404).json({ error: 'Película no encontrada' })
  }

  const { titulo, director_id, anio, genero_id, nota } = req.body

  // Validación opcional de nota
  if (nota !== undefined && (nota < 0 || nota > 10)) {
    return res.status(400).json({ error: 'La nota debe estar entre 0 y 10' })
  }

  // Construimos un objeto solo con los campos enviados
  const camposActualizados = {}

  if (titulo !== undefined) camposActualizados.titulo = titulo
  if (director_id !== undefined) camposActualizados.director_id = director_id
  if (anio !== undefined) camposActualizados.anio = Number(anio)
  if (genero_id !== undefined) camposActualizados.genero_id = genero_id
  if (nota !== undefined) camposActualizados.nota = nota !== null ? Number(nota) : null

  const actualizada = db.update(id, {
    ...pelicula,
    ...camposActualizados
  })

  res.json(actualizada)
}

// GET /api/estadisticas/directores
const estadisticasDirectores = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        d.nombre AS director,
        COUNT(p.id) AS num_peliculas,
        ROUND(AVG(p.nota), 2) AS nota_media,
        MAX(p.nota) AS nota_maxima,
        MIN(p.nota) AS nota_minima
      FROM directores d
      JOIN peliculas p ON p.director_id = d.id
      GROUP BY d.id, d.nombre
      HAVING COUNT(p.id) >= 1
      ORDER BY nota_media DESC
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/generos
const estadisticasGeneros = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      WITH stats AS (
        SELECT
          g.nombre AS genero,
          COUNT(p.id) AS num_peliculas,
          ROUND(AVG(p.nota), 2) AS nota_media,
          COUNT(r.id) AS total_resenas
        FROM generos g
        LEFT JOIN peliculas p ON p.genero_id = g.id
        LEFT JOIN resenas r ON r.pelicula_id = p.id
        GROUP BY g.id, g.nombre
      )
      SELECT *, RANK() OVER (ORDER BY nota_media DESC NULLS LAST) AS ranking
      FROM stats
      ORDER BY ranking
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}




module.exports = {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  calificarPelicula,
  eliminarPelicula,
  obtenerEstadisticas,
  listarResenas,
  crearResena,
  actualizarParcial,
  estadisticasDirectores,
  estadisticasGeneros
}