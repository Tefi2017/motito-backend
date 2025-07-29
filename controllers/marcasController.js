// backend/controllers/marcasController.js
//para cargar el combo de marcas

const pool = require('../db/pool');

async function getMarcas(req, res) {
  try {
    const result = await pool.query('SELECT id, descripcion FROM marcas ORDER BY descripcion');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener marcas' });
  }
}

module.exports = { getMarcas };
