import React, { useState } from 'react';
import { Globe, ShoppingBag, Leaf, ShieldCheck, Heart, Menu, X, ArrowRight, Camera, Video, Share2, MessageCircle, Sparkles, Award, CheckCircle } from 'lucide-react';
import './App.css';

// Data Produk Kuliner Riau
const PRODUCTS = [
  {
    id: 1,
    name: "Royal Bolu Kemojo (Retort Export Pack)",
    category: "Melayu Heritage Cake",
    priceIDR: 120000,
    priceUSD: 8,
    badge: "Shelf-Stable 12 Months",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    description: "Kue tradisional khas Melayu Riau beraroma pandan suji alami. Dikemas dengan teknologi retort sterilisasi modern tanpa pengawet sintesis, siap diekspor ke mancanegara.",
    origin: "Pekanbaru, Riau",
    shelfLife: "12 Bulan (Suhu Ruang)",
    certification: "Halal MUI, BPOM, HACCP Export Grade"
  },
  {
    id: 2,
    name: "Meranti Sagu Crisps",
    category: "Gluten-Free Superfood",
    priceIDR: 45000,
    priceUSD: 3,
    badge: "Eco-Friendly Farmed",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80",
    description: "Camilan renyah dari olahan pati sagu terbaik Kepulauan Meranti Riau. Sumber serat alami, bebas gluten, dan aman untuk gaya hidup sehat konsumen global.",
    origin: "Selatpanjang, Kepulauan Meranti",
    shelfLife: "8 Bulan",
    certification: "Gluten-Free Certified, Organic Local"
  },
  {
    id: 3,
    name: "Peatland Liberica Roasted Beans",
    category: "Specialty Peatland Coffee",
    priceIDR: 185000,
    priceUSD: 12,
    badge: "Sustainable Peatland",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
    description: "Biji kopi Liberika unik yang tumbuh di lahan gambut Riau. Menghasilkan cita rasa buah nangka (jackfruit notes) dan tingkat keasaman rendah yang diminati pasar Eropa.",
    origin: "Desa Kedabu Rapat, Meranti",
    shelfLife: "12 Bulan (Sealed Bag)",
    certification: "Fair Trade, Specialty Coffee Grade 1"
  }
];

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Format Mata Uang
  const formatPrice = (usd, idr) => {
    return currency === 'USD' ? `$${usd} USD` : `Rp ${idr.toLocaleString('id-ID')}`;
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderSubmitted(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setOrderSubmitted(false);
  };

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <header className="glass-card nav-header">
        <div className="nav-content">
          <div className="brand-logo">
            <div className="logo-box">R</div>
            <div>
              <h1 className="brand-title">Riau Gourmet</h1>
              <span className="brand-sub">HERITAGE</span>
            </div>
          </div>

          <nav className="desktop-nav">
            <a href="#hero">Beranda</a>
            <a href="#bento">Keunggulan</a>
            <a href="#products">Koleksi Ekspor</a>
          </nav>

          <div className="nav-actions">
            <div className="currency-switch">
              <button 
                onClick={() => setCurrency('IDR')} 
                className={currency === 'IDR' ? 'active' : ''}>
                🇮🇩 IDR
              </button>
              <button 
                onClick={() => setCurrency('USD')} 
                className={currency === 'USD' ? 'active' : ''}>
                🌎 USD
              </button>
            </div>

            <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            <Leaf size={14} /> Empowering 80+ Local Artisans in Riau
          </span>
          <h2 className="hero-title">
            Authentic Taste of Riau, <br />
            <span className="highlight-text">Crafted for Global Gourmet.</span>
          </h2>
          <p className="hero-desc">
            Mengangkat kelezatan kuliner tradisional Melayu Riau dan komoditas sagu/kopi gambut lokal ke panggung internasional melalui teknologi pengemasan ekspor dan kepastian mutu.
          </p>
          <div className="hero-buttons">
            <a href="#products" className="btn-primary">
              Jelajahi Produk <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* BENTO GRID SECTION */}
      <section id="bento" className="bento-section">
        <div className="section-header">
          <span>Keunggulan Strategis</span>
          <h2>Mengapa Riau Gourmet Layak Standar Global?</h2>
        </div>

        <div className="bento-grid">
          <div className="bento-card bento-large glass-card">
            <div className="bento-icon-box">
              <ShieldCheck size={24} />
            </div>
            <span className="bento-tag">Inovasi Teknologi Pangan</span>
            <h3>Teknologi Retort Packaging (Awet 12 Bulan)</h3>
            <p>
              Kuliner basah khas Melayu seperti Bolu Kemojo kini diproses dengan teknik sterilisasi bertemperatur tinggi. Produk tetap segar dan higienis tanpa menggunakan pengawet kimiawi, siap didistribusikan ke jaringan ritel global.
            </p>
          </div>

          <div className="bento-card glass-card">
            <div className="bento-icon-box">
              <Leaf size={24} />
            </div>
            <span className="bento-tag">Eco-Friendly</span>
            <h3>Sustainable Peatland Coffee</h3>
            <p>
              Budi daya Kopi Liberika yang membantu menjaga kelembapan ekosistem lahan gambut Riau serta mencegah kebakaran hutan.
            </p>
          </div>

          <div className="bento-card glass-card">
            <div className="bento-icon-box">
              <Sparkles size={24} />
            </div>
            <span className="bento-tag">Tren Pasar Sehat</span>
            <h3>Gluten-Free Meranti Sagu</h3>
            <p>
              Mengolah pati sagu Kepulauan Meranti menjadi camilan sehat serat tinggi untuk memenuhi permintaan pasar makanan bebas gluten di Eropa dan Amerika.
            </p>
          </div>

          <div className="bento-card bento-large glass-card">
            <div className="bento-icon-box">
              <Award size={24} />
            </div>
            <span className="bento-tag">Dampak Sosial Ekonomi</span>
            <h3>Pemberdayaan Petani & UMKM Lokal 3.5x Lebih Sejahtera</h3>
            <p>
              Model bisnis langsung ke konsumen (*Direct-to-Consumer Export*) memotong rantai tengkulak. Keuntungan penjualan dialokasikan langsung untuk peningkatan taraf hidup keluarga petani sagu dan pembuat kue tradisional di Riau.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section id="products" className="products-section">
        <div className="section-header">
          <span>Katalog Utama</span>
          <h2>Kuliner Riau Kualitas Ekspor</h2>
        </div>

        <div className="products-grid">
          {PRODUCTS.map((item) => (
            <div key={item.id} className="product-card">
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.name} />
                <span className="product-badge">{item.badge}</span>
              </div>
              <div className="card-body">
                <span className="category-tag">{item.category}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="card-footer">
                  <div>
                    <small>Harga Ekspor</small>
                    <div className="price-tag">{formatPrice(item.priceUSD, item.priceIDR)}</div>
                  </div>
                  <button className="btn-buy" onClick={() => setSelectedProduct(item)}>
                    <ShoppingBag size={16} /> Pesan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL POPUP PRODUCT ORDER */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={20} />
            </button>

            {!orderSubmitted ? (
              <div className="modal-body">
                <div className="modal-image">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="modal-details">
                  <span className="modal-badge">{selectedProduct.badge}</span>
                  <h2>{selectedProduct.name}</h2>
                  <div className="modal-price">{formatPrice(selectedProduct.priceUSD, selectedProduct.priceIDR)}</div>
                  <p className="modal-desc">{selectedProduct.description}</p>

                  <div className="modal-specs">
                    <div><strong>Asal Daerah:</strong> {selectedProduct.origin}</div>
                    <div><strong>Daya Tahan:</strong> {selectedProduct.shelfLife}</div>
                    <div><strong>Sertifikasi:</strong> {selectedProduct.certification}</div>
                  </div>

                  <form className="order-form" onSubmit={handleOrderSubmit}>
                    <h4>Simulasi Permintaan Sampel Ekspor</h4>
                    <input type="text" placeholder="Nama Lengkap / Buyers Name" required />
                    <input type="email" placeholder="Email Kontak" required />
                    <select>
                      <option>Tujuan Pengiriman: Domestik (Indonesia)</option>
                      <option>Tujuan Pengiriman: Ekspor (International Cargo)</option>
                    </select>
                    <button type="submit" className="btn-submit-order">
                      Kirim Inquiry Sampel
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="modal-success">
                <CheckCircle size={48} className="success-icon" />
                <h3>Inquiry Ekspor Terkirim!</h3>
                <p>
                  Terima kasih. Permintaan sampel produk <strong>{selectedProduct.name}</strong> telah diteruskan ke sistem logistik Riau Gourmet Heritage.
                </p>
                <button className="btn-primary" onClick={closeModal}>Tutup</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="footer-content">
          <div>
            <h3>Riau Gourmet Heritage</h3>
            <p>Digitalisasi Kuliner Unggulan Daerah - Pekanbaru & Kepulauan Meranti, Riau.</p>
          </div>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><Camera size={20} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"><Video size={20} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><Share2 size={20} /></a>
            <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer"><MessageCircle size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}