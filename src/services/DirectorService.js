const pool = require('../config/db')

class DirectorService {

  async obtenerTodos() {
    const { rows } = await pool.query(`
      SELECT id, nombre, nacionalidad
      FROM directores
      ORDER BY nombre
    `)
    return rows
  }

  async obtenerConPeliculas(id) {
    // 1. Obtener director.
    const { rows: directorRows } = await pool.query(
      `SELECT id, nombre, nacionalidad
       FROM directores
       WHERE id = $1`,
      [id]
    )

    if (directorRows.length === 0) {
      throw new AppError('Director no encontrado', 404)
    }

    const director = directorRows[0]

    // 2. Obtener películas del director
    const { rows: peliculas } = await pool.query(
      `SELECT id, titulo, anio, nota
       FROM peliculas
       WHERE director_id = $1
       ORDER BY anio DESC`,
      [id]
    )

    return {
      ...director,
      peliculas
    }
  }
}

module.exports = new DirectorService()
