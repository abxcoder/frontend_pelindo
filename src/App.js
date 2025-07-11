// App.js - Komponen Utama dengan API Integration
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Base URL untuk API
const API_BASE_URL = 'http://localhost:8080/api/v1';

function App() {
  const [formData, setFormData] = useState({
    negara: '',
    pelabuhan: '',
    barang: '',
    description: '',
    discount: '',
    harga: '',
    total: ''
  });

  // State untuk data dari API
  const [countries, setCountries] = useState([]);
  const [ports, setPorts] = useState([]);
  const [items, setItems] = useState([]);

  // State untuk loading
  const [loading, setLoading] = useState({
    countries: false,
    ports: false,
    items: false
  });

  // State untuk error handling
  const [error, setError] = useState(null);

  // Fetch countries saat component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch countries dari API
  const fetchCountries = async () => {
    setLoading(prev => ({ ...prev, countries: true }));
    setError(null);

    try {
      console.log('Fetching countries from:', `${API_BASE_URL}/negaras`);

      const response = await fetch(`${API_BASE_URL}/negaras`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.status === 'success' && result.data && Array.isArray(result.data)) {
        // Filter data yang valid menggunakan field names yang benar
        const validCountries = result.data.filter(country =>
            country &&
            country.nama_negara &&
            country.nama_negara.trim() !== '' &&
            country.kode_negara &&
            country.kode_negara.trim() !== '' &&
            country.id_negara &&
            country.id_negara !== 0
        );

        console.log('Valid countries:', validCountries);

        if (validCountries.length > 0) {
          setCountries(validCountries);
        } else {
          console.warn('No valid countries found, using fallback data');
          // Fallback data untuk development jika API return data kosong
          setCountries([
            { id_negara: 1, nama_negara: 'Indonesia', kode_negara: 'ID' },
            { id_negara: 2, nama_negara: 'Afghanistan', kode_negara: 'AF' },
            { id_negara: 3, nama_negara: 'Singapore', kode_negara: 'SG' }
          ]);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch countries - Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError(`Gagal memuat data negara: ${err.message}. Menggunakan data fallback.`);

      // Fallback data untuk development
      setCountries([
        { id_negara: 1, nama_negara: 'Indonesia', kode_negara: 'ID' },
        { id_negara: 2, nama_negara: 'Afghanistan', kode_negara: 'AF' },
        { id_negara: 3, nama_negara: 'Singapore', kode_negara: 'SG' },
        { id_negara: 4, nama_negara: 'Malaysia', kode_negara: 'MY' },
        { id_negara: 5, nama_negara: 'Thailand', kode_negara: 'TH' }
      ]);
    } finally {
      setLoading(prev => ({ ...prev, countries: false }));
    }
  };

  // Fetch ports berdasarkan negara
  const fetchPorts = async (countryId) => {
    if (!countryId) return;

    setLoading(prev => ({ ...prev, ports: true }));
    setPorts([]);

    try {
      console.log('Fetching ports from:', `${API_BASE_URL}/pelabuhans?id_negara=${countryId}`);

      const response = await fetch(`${API_BASE_URL}/pelabuhans?id_negara=${countryId}`);
      const result = await response.json();

      console.log('Ports API Response:', result);

      if (result.status === 'success' && result.data && Array.isArray(result.data)) {
        // Filter data yang valid menggunakan field names yang benar
        const validPorts = result.data.filter(port =>
            port &&
            port.nama_pelabuhan &&
            port.nama_pelabuhan.trim() !== '' &&
            port.id_pelabuhan
        );
        setPorts(validPorts);
        console.log('Valid ports:', validPorts);
      } else {
        throw new Error(result.message || 'Failed to fetch ports');
      }
    } catch (err) {
      console.error('Error fetching ports:', err);
      setError('Gagal memuat data pelabuhan');
      // Fallback data
      setPorts([
        { id_pelabuhan: "1", nama_pelabuhan: 'Tanjung Perak', id_negara: countryId.toString() },
        { id_pelabuhan: "2", nama_pelabuhan: 'Tanjung Priok', id_negara: countryId.toString() }
      ]);
    } finally {
      setLoading(prev => ({ ...prev, ports: false }));
    }
  };

  // Fetch items berdasarkan pelabuhan
  const fetchItems = async (portId) => {
    if (!portId) return;

    setLoading(prev => ({ ...prev, items: true }));
    setItems([]);

    try {
      console.log('Fetching items from:', `${API_BASE_URL}/barangs?id_pelabuhan=${portId}`);

      const response = await fetch(`${API_BASE_URL}/barangs?id_pelabuhan=${portId}`);
      const result = await response.json();

      console.log('Items API Response:', result);

      if (result.status === 'success' && result.data && Array.isArray(result.data)) {
        // Filter data yang valid menggunakan field names yang benar
        const validItems = result.data.filter(item =>
            item &&
            item.nama_barang &&
            item.nama_barang.trim() !== '' &&
            item.harga &&
            item.harga > 0
        );
        setItems(validItems);
        console.log('Valid items:', validItems);
      } else {
        throw new Error(result.message || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Gagal memuat data barang');
      // Fallback data
      setItems([
        {
          id_barang: 1,
          nama_barang: 'BAJU',
          id_pelabuhan: parseInt(portId),
          harga: 152000,
          description: 'Merk Camp Wolver bahan tebal casual',
          diskon: 5
        }
      ]);
    } finally {
      setLoading(prev => ({ ...prev, items: false }));
    }
  };

  // Fungsi untuk menghitung total (useCallback untuk mencegah re-render)
  const calculateTotal = useCallback(() => {
    const harga = parseFloat(formData.harga) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const total = harga - (harga * discount / 100);
    return total;
  }, [formData.harga, formData.discount]);

  // Update total ketika harga atau discount berubah
  useEffect(() => {
    const total = calculateTotal();
    setFormData(prev => ({
      ...prev,
      total: total.toLocaleString('id-ID')
    }));
  }, [calculateTotal]);

  // Handler untuk mengubah input
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler untuk reset pelabuhan ketika negara berubah
  const handleCountryChange = (value) => {
    const selectedCountry = countries.find(country => country.id_negara === parseInt(value));

    setFormData(prev => ({
      ...prev,
      negara: value,
      pelabuhan: '',
      barang: '',
      description: '',
      discount: '',
      harga: '',
      total: ''
    }));

    // Reset data pelabuhan dan barang
    setPorts([]);
    setItems([]);

    // Fetch pelabuhan berdasarkan negara yang dipilih
    if (selectedCountry) {
      fetchPorts(selectedCountry.id_negara);
    }
  };

  // Handler untuk reset barang ketika pelabuhan berubah
  const handlePortChange = (value) => {
    const selectedPort = ports.find(port => port.id_pelabuhan === value);

    setFormData(prev => ({
      ...prev,
      pelabuhan: value,
      barang: '',
      description: '',
      discount: '',
      harga: '',
      total: ''
    }));

    // Reset data barang
    setItems([]);

    // Fetch barang berdasarkan pelabuhan yang dipilih
    if (selectedPort) {
      fetchItems(selectedPort.id_pelabuhan);
    }
  };

  // Handler untuk auto-fill data ketika barang dipilih
  const handleItemChange = (value) => {
    const selectedItem = items.find(item => item.id_barang === parseInt(value));

    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        barang: value,
        description: selectedItem.description || `${selectedItem.nama_barang}`,
        discount: selectedItem.diskon ? selectedItem.diskon.toString() : '0',
        harga: selectedItem.harga.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        barang: value,
        description: '',
        discount: '',
        harga: '',
        total: ''
      }));
    }
  };

  // Handler untuk submit form
  const handleSubmit = () => {
    // Validasi form
    if (!formData.negara || !formData.pelabuhan || !formData.barang || !formData.harga) {
      alert('Mohon lengkapi semua field yang diperlukan!');
      return;
    }

    // Siapkan data untuk dikirim
    const submitData = {
      negara: parseInt(formData.negara),
      pelabuhan: formData.pelabuhan,
      barang: parseInt(formData.barang),
      description: formData.description,
      discount: parseFloat(formData.discount) || 0,
      harga: parseFloat(formData.harga),
      total: calculateTotal()
    };

    console.log('Form submitted:', submitData);
    alert('Data berhasil disubmit!');
  };

  return (
      <div className="port-container">
        {/* Error Message */}
        {error && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: '#ef4444',
              color: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              zIndex: 1000,
              maxWidth: '400px'
            }}>
              <button
                  onClick={() => setError(null)}
                  style={{
                    float: 'right',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.2rem',
                    cursor: 'pointer'
                  }}
              >
                ×
              </button>
              {error}
            </div>
        )}

        {/* Header */}
        <div className="port-header">
          <div className="port-header-content">
            <div className="port-header-title">
              <svg className="port-header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12V7a1 1 0 011-1h4l3 3h5a1 1 0 011 1v2M5 12l1.5 6h11l1.5-6M5 12h14" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9V6" />
                <circle cx="8" cy="20" r="1" />
                <circle cx="16" cy="20" r="1" />
              </svg>
              <div>
                <h1 className="port-title">PT PELABUHAN INDONESIA</h1>
                <p className="port-subtitle">Sistem Manajemen Cargo & Logistics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="port-form-container">
          <div className="port-form-card">
            <div className="port-form-header">
              <svg className="port-form-header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="port-form-title">Form Pengiriman Barang</h2>
            </div>

            <div className="port-form-content">
              {/* Negara */}
              <div className="port-form-group">
                <div className="port-form-label">
                  <svg className="port-form-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <label className="port-form-label-text">NEGARA</label>
                </div>
                <div>
                  {loading.countries ? (
                      <div className="port-loading">
                        <div className="port-loading-spinner"></div>
                        <span style={{marginLeft: '10px'}}>Memuat negara...</span>
                      </div>
                  ) : (
                      <select
                          value={formData.negara}
                          onChange={(e) => handleCountryChange(e.target.value)}
                          className="port-form-select"
                          required
                      >
                        <option value="">Pilih Negara</option>
                        {countries && countries.length > 0 && countries.map(country => (
                            <option key={country.id_negara} value={country.id_negara}>
                              {country.kode_negara} - {country.nama_negara}
                            </option>
                        ))}
                      </select>
                  )}
                </div>
              </div>

              <div className="port-form-group">
                <div className="port-form-label">
                  <svg className="port-form-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <label className="port-form-label-text">PELABUHAN</label>
                </div>
                <div>
                  {loading.ports ? (
                      <div className="port-loading">
                        <div className="port-loading-spinner"></div>
                        <span style={{marginLeft: '10px'}}>Memuat pelabuhan...</span>
                      </div>
                  ) : (
                      <select
                          value={formData.pelabuhan}
                          onChange={(e) => handlePortChange(e.target.value)}
                          className="port-form-select"
                          required
                          disabled={!formData.negara || loading.ports}
                      >
                        <option value="">
                          {!formData.negara ? 'Pilih negara terlebih dahulu' : 'Pilih Pelabuhan'}
                        </option>
                        {ports && ports.length > 0 && ports.map(port => (
                            <option key={port.id_pelabuhan} value={port.id_pelabuhan}>
                              {port.nama_pelabuhan}
                            </option>
                        ))}
                      </select>
                  )}
                </div>
              </div>

              {/* Barang */}
              <div className="port-form-group">
                <div className="port-form-label">
                  <svg className="port-form-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <label className="port-form-label-text">BARANG</label>
                </div>
                <div>
                  {loading.items ? (
                      <div className="port-loading">
                        <div className="port-loading-spinner"></div>
                        <span style={{marginLeft: '10px'}}>Memuat barang...</span>
                      </div>
                  ) : (
                      <select
                          value={formData.barang}
                          onChange={(e) => handleItemChange(e.target.value)}
                          className="port-form-select"
                          required
                          disabled={!formData.pelabuhan || loading.items}
                      >
                        <option value="">
                          {!formData.pelabuhan ? 'Pilih pelabuhan terlebih dahulu' : 'Pilih Barang'}
                        </option>
                        {items && items.length > 0 && items.map(item => (
                            <option key={item.id_barang} value={item.id_barang}>
                              {item.id_barang} - {item.nama_barang ? item.nama_barang.trim() : 'Unknown'}
                            </option>
                        ))}
                      </select>
                  )}
                  {formData.description && (
                      <div className="port-description-box">
                        <p className="port-description-text">
                          <strong>Deskripsi:</strong> {formData.description}
                        </p>
                      </div>
                  )}
                </div>
              </div>

              {/* Discount */}
              <div className="port-form-group">
                <div className="port-form-label">
                  <svg className="port-form-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  <label className="port-form-label-text">DISCOUNT</label>
                </div>
                <div className="port-form-input-wrapper">
                  <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      className="port-form-input has-suffix"
                      placeholder="Discount otomatis terisi"
                      min="0"
                      max="100"
                      step="0.01"
                      readOnly={!!formData.barang}
                  />
                  <span className="port-form-input-suffix">%</span>
                </div>
              </div>

              {/* Harga */}
              <div className="port-form-group">
                <div className="port-form-label">
                  <svg className="port-form-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <label className="port-form-label-text">HARGA</label>
                </div>
                <div className="port-form-input-wrapper">
                  <span className="port-form-input-prefix">Rp</span>
                  <input
                      type="number"
                      value={formData.harga}
                      onChange={(e) => handleInputChange('harga', e.target.value)}
                      className="port-form-input has-prefix readonly"
                      placeholder="Harga otomatis terisi"
                      min="0"
                      step="0.01"
                      readOnly={!!formData.barang}
                  />
                </div>
              </div>

              {/* Total */}
              <div className="port-form-group">
                <div className="port-form-label">
                  <svg className="port-form-label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <label className="port-form-label-text">TOTAL</label>
                </div>
                <div>
                  <div className="port-form-input-wrapper">
                    <span className="port-form-input-prefix">Rp</span>
                    <input
                        type="text"
                        value={formData.total}
                        readOnly
                        className="port-form-input has-prefix readonly"
                        placeholder="Total otomatis dihitung"
                    />
                  </div>
                  <p className="port-helper-text">
                    Total = Harga - (Harga × Discount / 100), format: Rp. 1.000.000
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="port-submit-section">
                <button
                    onClick={handleSubmit}
                    className="port-submit-button"
                >
                  <div className="port-submit-button-content">
                    <svg className="port-submit-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Kirim Barang
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="port-footer">
          <div className="port-footer-content">
            <svg className="port-footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p>© 2025 Pelabuhan Nusantara - Connecting Islands, Moving Commerce</p>
          </div>
          <p className="port-footer-text">Sistem Terintegrasi untuk Manajemen Pelabuhan Modern</p>
        </div>
      </div>
  );
}

export default App;