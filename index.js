console.log('El script Node.js ha comenzado a ejecutarse.');

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necesario en Render
  },
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Motos con PostgreSQL!');
});

// Ruta GET: Obtener todas las motos
app.get('/motos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM motos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta POST: Agregar una nueva moto
app.post('/motos', async (req, res) => {
  const { titulo, descripcion, precio, imagen } = req.body;

  if (!titulo || !descripcion || !precio || !imagen) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO motos (titulo, descripcion, precio, imagen) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [titulo, descripcion, precio, imagen]
    );
    res.status(201).json({ id: result.rows[0].id, message: 'Moto agregada correctamente.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
