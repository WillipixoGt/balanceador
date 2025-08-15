// Servidor estático minimal, listo para balanceo
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000; // cambia por ENV: 3000, 3001, 3002...

app.disable('x-powered-by');
app.set('trust proxy', true); // útil detrás de Nginx/Apache

// Compresión gzip
app.use(compression());

// Servir /public con cache ligera
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: true,
  index: 'index.html'
}));

// Healthcheck para el balanceador
app.get('/health', (_, res) => res.type('text').send('ok'));

// (Opcional) info rápida
app.get('/version', (_, res) => {
  res.json({ name: 'mi-pagina', version: process.env.APP_VERSION || '1.0.0', port: PORT });
});

// Fallback a index.html (por si luego usas rutas en el front)
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para verificar qué nodo responde
app.get('/info', (req, res) => {
  res.json({
    ok: true,
    node: NODE_NAME,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor estático escuchando en http://localhost:${PORT}`);
});
