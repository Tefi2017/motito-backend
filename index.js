console.log('El script Node.js ha comenzado a ejecutarse.');

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3001;

// Configuración de middlewares
app.use(cors()); // Permite solicitudes de diferentes orígenes (necesario para el frontend)
app.use(express.json()); // Habilita el parsing de JSON en el cuerpo de las solicitudes

// Inicialización de la base de datos SQLite
// Se conecta a 'motito.db' en el mismo directorio donde se ejecuta el script.
// Si el archivo no existe, SQLite lo creará.
const db = new sqlite3.Database('./motito.db', (err) => {
  // Manejo de errores durante la conexión a la base de datos
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    // Es buena práctica salir del proceso si la base de datos no se conecta
    process.exit(1);
  }
  console.log('Base de datos conectada correctamente.');
});

// Crear tabla 'motos' si no existe
// Define la estructura de la tabla con id, titulo, descripcion, precio e imagen.
db.run(`
  CREATE TABLE IF NOT EXISTS motos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    descripcion TEXT,
    precio REAL,
    imagen TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creando la tabla motos:', err.message);
    process.exit(1);
  }
  console.log('Tabla "motos" verificada/creada.');
});

// NUEVA RUTA: Ruta GET para la raíz (/)
// Esto devolverá un mensaje de bienvenida cuando se acceda a http://localhost:3001/
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Motos! Accede a /motos para ver los datos.');
});


// Ruta GET: Obtener todas las motos
// Responde con una lista de todas las motos almacenadas en la base de datos.
app.get('/motos', (req, res) => {
  db.all('SELECT * FROM motos', [], (err, rows) => {
    if (err) {
      // Si hay un error, envía una respuesta de error 500
      return res.status(500).json({ error: err.message });
    }
    // Si no hay errores, envía las filas como respuesta JSON
    res.json(rows);
  });
});

// Ruta POST: Agregar una nueva moto
// Recibe los datos de la moto en el cuerpo de la solicitud (JSON).
app.post('/motos', (req, res) => {
  // Desestructura los campos de la solicitud
  const { titulo, descripcion, precio, imagen } = req.body;

  // Validación básica de los datos de entrada
  if (!titulo || !descripcion || !precio || !imagen) {
    return res.status(400).json({ error: 'Todos los campos (titulo, descripcion, precio, imagen) son obligatorios.' });
  }

  // Inserta la nueva moto en la base de datos
  db.run(
    `INSERT INTO motos (titulo, descripcion, precio, imagen) VALUES (?, ?, ?, ?)`,
    [titulo, descripcion, precio, imagen],
    function (err) { // Usamos 'function' para acceder a 'this.lastID'
      if (err) {
        // Si hay un error durante la inserción, envía una respuesta de error 500
        return res.status(500).json({ error: err.message });
      }
      // Si la inserción es exitosa, devuelve el ID de la nueva moto
      res.status(201).json({ id: this.lastID, message: 'Moto agregada correctamente.' });
    }
  );
});

// Inicia el servidor Express en el puerto especificado
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error al iniciar el servidor en el puerto ${PORT}:`, err);
    // Si el puerto ya está en uso u otro error de escucha
    if (err.code === 'EADDRINUSE') {
      console.error(`El puerto ${PORT} ya está en uso. Intenta con otro puerto.`);
    }
    process.exit(1); // Salir del proceso si el servidor no puede iniciar
  }
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
  console.log('Presiona Ctrl+C para detener el servidor.');
});