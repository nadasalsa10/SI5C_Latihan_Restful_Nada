const Mahasiswa = require('../models/mahasiswaModel');
const Prodi = require('../models/prodiModel');
const { errorHttp } = require('../middlewares/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['nama', 'nim', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['nama', 'nim', 'alamat', 'prodiId', 'createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.create = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.create(req.body);
    res.status(201).json(mahasiswa);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  const filter = {};

  if (req.query.kota) {
    filter['alamat.kota'] = String(req.query.kota);
  }

  if (req.query.prodi) {
    const prodi = await Prodi.findOne({
      kode: String(req.query.prodi).toUpperCase(),
    });
    // Kode prodi tidak dikenal -> hasil kosong ($in: [] tidak cocok dengan apa pun)
    filter.prodiId = prodi ? prodi._id : { $in: [] };
  }

  // Projection: ?fields=nama,nim
  let select = '';
  if (req.query.fields) {
    const fields = String(req.query.fields).split(',').map((f) => f.trim());
    if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
      throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
    }
    select = fields.join(' ');
  }

  // Sorting: ?sort=nama&order=desc
  const sortField = FIELD_SORT.includes(req.query.sort) ? req.query.sort : 'createdAt';
  const arah = req.query.order === 'desc' ? -1 : 1;

  // Pagination: ?page=2&limit=10
  const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

  const query = Mahasiswa.find(filter)
    .select(select)
    .sort({ [sortField]: arah, _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // populate() hanya dipanggil bila prodiId memang diminta
  // (atau bila tidak ada pemilihan field)
  if (!select || select.split(' ').includes('prodiId')) {
    query.populate('prodiId', 'kode nama');
  }

  const [data, total] = await Promise.all([
    query,
    Mahasiswa.countDocuments(filter),
  ]);

  res.json({
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

exports.getById = async (req, res) => {
  const data = await Mahasiswa.findById(req.params.id).populate('prodiId', 'kode nama');
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await Mahasiswa.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after', runValidators: true }
  );
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await Mahasiswa.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.status(204).send();
};