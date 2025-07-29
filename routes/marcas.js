// backend/routes/marcas.js
const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, descripcion FROM marcas ORDER BY descripcion')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener marcas' })
  }
})

module.exports = router
