// controllers/mahasiswaController.js (Baris 1)

const Mahasiswa = require('../models/mahasiswaModels'); // ✅ Tambahkan huruf 's'

const mongoose = require('mongoose');

const mahasiswaSchema = new mongoose.Schema({
  npm: {
    type: String,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    required: true
  },
  prodi: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mahasiswa', mahasiswaSchema);