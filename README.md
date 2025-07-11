# Frontend Pelindo

Aplikasi web untuk Sistem Manajemen Cargo & Logistics Pelabuhan Nusantara.

## 📋 Deskripsi

Aplikasi ini adalah form pengiriman barang dengan tema perusahaan pelabuhan yang memiliki fitur:

- **Form Input Dinamis**: Dropdown negara, pelabuhan, dan barang yang saling terhubung
- **Kalkulasi Otomatis**: Total harga dihitung otomatis berdasarkan harga dan discount
- **Validasi Form**: Validasi input dan required fields
- **Responsive Design**: Tampilan yang responsif untuk desktop dan mobile
- **Modern UI**: Desain modern dengan tema maritim/pelabuhan

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### Instalasi

1. **Clone atau ekstrak project ke folder yang sudah ada**
2. **Install dependencies**
   ```bash
   npm install
   ```
   atau
   ```bash
   yarn install
   ```

3. **Jalankan development server**
   ```bash
   npm start
   ```
   atau
   ```bash
   yarn start
   ```

4. **Buka browser** dan akses `http://localhost:3000`

## 📁 Struktur File

Berikut adalah file-file yang perlu Anda buat berdasarkan struktur folder yang sudah ada:

```
frontend_pelindo/
├── public/
│   └── index.html          # HTML template utama
├── src/
│   ├── App.css            # Styling khusus untuk form pelabuhan
│   ├── App.js             # Komponen utama dengan form
│   ├── index.css          # Global styles
│   └── index.js           # Entry point aplikasi
├── package.json           # Dependencies dan scripts
└── README.md             # Dokumentasi ini
```

## 🎨 Fitur Form

### 1. **NEGARA**
- Dropdown dengan pilihan negara (Indonesia, Singapore, Malaysia, dll.)
- Ketika negara dipilih, akan mem-filter pilihan pelabuhan

### 2. **PELABUHAN**
- Dropdown yang ter-filter berdasarkan negara yang dipilih
- Contoh: Jika pilih Indonesia, muncul Tanjung Perak, Tanjung Priok, Belawan

### 3. **BARANG**
- Dropdown dengan format "ID - NAMA (id_barang - nama_barang)"
- Setelah pilih barang, muncul deskripsi dalam box biru

### 4. **DISCOUNT**
- Input angka dengan simbol %
- Digunakan untuk kalkulasi total

### 5. **HARGA**
- Input angka dengan prefix "Rp"
- Digunakan untuk kalkulasi total

### 6. **TOTAL**
- Field read-only yang menampilkan hasil kalkulasi
- Formula: Total = Harga - (Harga × Discount / 100)
- Format: Rp. 1.000.000 (dengan pemisah ribuan)

## 🛠️ Teknologi yang Digunakan

- **React 18**: Library JavaScript untuk UI
- **CSS3**: Styling dengan gradient dan animasi
- **SVG Icons**: Ikon-ikon maritim untuk tema pelabuhan
- **Responsive Design**: CSS Grid dan Flexbox

## 🎯 Cara Implementasi

1. **Salin file CSS** ke `src/App.css`
2. **Salin file JavaScript** ke `src/App.js`
3. **Update file** `src/index.js` dan `src/index.css`
4. **Update** `package.json` jika diperlukan
5. **Update** `public/index.html` untuk title dan meta

## ⚙️ Kustomisasi

### Menambah Data Negara/Pelabuhan/Barang
Edit array `countries`, `ports`, dan `items` di file `App.js`:

```javascript
const countries = [
  { id: 'ID', name: 'Indonesia' },
  // tambah negara baru disini
];

const ports = [
  { id: 'tanjung-perak', name: 'Tanjung Perak', country: 'ID' },
  // tambah pelabuhan baru disini
];
```

### Mengubah Tema Warna
Edit variabel CSS di file `App.css` bagian atas untuk mengubah skema warna.

### Menambah Validasi
Edit fungsi `handleSubmit` di `App.js` untuk menambah validasi form.

## 🚢 Preview

Form akan menampilkan:
- Header dengan logo kapal dan judul "PELABUHAN INDONESIA"
- Form dengan background gradient biru laut
- Card putih transparan dengan shadow
- Button submit dengan efek hover
- Footer dengan informasi copyright

## 📱 Responsive

- **Desktop**: Layout 2 kolom (label | input)
- **Mobile**: Layout 1 kolom (label di atas input)
- **Tablet**: Menyesuaikan ukuran layar

## 🔧 Troubleshooting

1. **Error saat npm start**: Pastikan semua dependencies terinstall
2. **CSS tidak muncul**: Pastikan import CSS benar di App.js
3. **Form tidak responsif**: Check CSS media queries

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue atau hubungi tim development.

---

**Happy Coding! ⚓**