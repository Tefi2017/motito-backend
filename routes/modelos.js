const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

router.get('/', async (req, res) => {
  const { idMarca } = req.query
  try {
    const result = await pool.query(
      'SELECT id, descripcion FROM modelos WHERE id_marca = $1 ORDER BY descripcion',
      [idMarca]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener modelos' })
  }
})

module.exports = router
