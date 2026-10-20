module.exports = (req, res, next) => {
  // Cek apakah mengambil dari header 'x-api-key' atau 'api-key'
  const apiKey = req.headers['x-api-key'] || req.headers['api-key'];
  
  // Cek variabel .env yang digunakan
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'API key tidak valid' });
  }
  
  next();
};