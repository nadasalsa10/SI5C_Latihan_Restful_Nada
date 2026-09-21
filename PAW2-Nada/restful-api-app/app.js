	const express = require('express');//impor express
	const app = express();//instansiasi
	const PORT = 3000;//port yang akan digunakan
	
    // Data sementara (disimpan di memori, hilang saat server restart)
    let mahasiswa = [
        { id: 1, nama: 'Andi', jurusan: 'Sistem Informasi' },
        { id: 2, nama: 'Budi', jurusan: 'Informatika' }
    ];
    let nextId = 3; // penghitung id untuk data baru

    //route
	app.get('/', (req, res) => {
	  res.send('Server Express.js berjalan pada PORT 3000! nodeemon');
	});
	
    // GET /mahasiswa -> seluruh data, bisa difilter: /mahasiswa?jurusan=Informatika
    app.get('/mahasiswa', (req, res) => {
    const { jurusan } = req.query;

  if (jurusan) {
    const hasil = mahasiswa.filter((m) => m.jurusan === jurusan);
    return res.json(hasil);
  }

  res.json(mahasiswa);
})

    // GET /mahasiswa/:id -> menampilkan satu data berdasarkan id
    app.get('/mahasiswa/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = mahasiswa.find((m) => m.id === id);

    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
    });

   //menjalankan aplikasi pada port 3000
	app.listen(PORT, () => {
	  console.log(`Server berjalan di http://localhost:${PORT}`);
	});