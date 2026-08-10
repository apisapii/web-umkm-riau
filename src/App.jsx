import React, { useState } from 'react';
import { Globe, Compass, Leaf, ShieldCheck, Heart, Menu, X, ArrowRight, Camera, Video, Share2, MessageCircle, Sparkles, Award, CheckCircle, Star, MapPin, Calendar } from 'lucide-react';
import './App.css';

// Data Paket Wisata Alam Riau
const TOUR_PACKAGES = [
  {
    id: 1,
    name: "Kampar Bono River Surfing Expedition",
    category: "Extreme Eco-Adventure",
    priceIDR: 4500000,
    priceUSD: 295,
    badge: "World Famous Wave",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
    description: "Merasakan sensasi menaklukkan ombak sungai 'Seven Ghosts' (Bono) di Teluk Meranti, Sungai Kampar. Didampingi pemandu lokal profesional dan perahu penyelamat.",
    location: "Teluk Meranti, Pelalawan",
    duration: "3 Hari 2 Malam",
    certification: "Certified Safety & River Guides"
  },
  {
    id: 2,
    name: "Tesso Nilo Elephant Conservation Safari",
    category: "Wildlife & Edu-Tourism",
    priceIDR: 3200000,
    priceUSD: 210,
    badge: "100% Ethical Wildlife",
    image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80",
    description: "Jelajah hutan hujan Sumatra, berinteraksi langsung dengan Gajah Sumatra dalam program konservasi, dan mendukung tim patroli pencegahan perambahan hutan.",
    location: "TN Tesso Nilo, Riau",
    duration: "2 Hari 1 Malam",
    certification: "Conservation Partner Approved"
  },
  {
    id: 3,
    name: "Rimbang Baling Rainforest Eco-Lodge",
    category: "Cultural & Forest Lodge",
    priceIDR: 2800000,
    priceUSD: 185,
    badge: "Carbon Neutral Trip",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    description: "Menyusuri sungai hulu dengan perahu tradisional (Pancung), menginap di *eco-lodge* kayu ramah lingkungan, dan mempelajari kearifan adat masyarakat Kampar Kiri.",
    location: "Suaka Margasatwa Rimbang Baling",
    duration: "3 Hari 2 Malam",
    certification: "Zero Plastic & Local Powered"
  }
];

// Data Ulasan Wisatawan Internasional
const REVIEWS = [
  {
    id: 1,
    name: "David Miller",
    country: "Sydney, Australia 🇦🇺",
    comment: "Riding the Bono river wave was the most surreal surfing experience of my life! Highly organized and safe.",
    product: "Kampar Bono Surfing Expedition"
  },
  {
    id: 2,
    name: "Elena Rostova",
    country: "Berlin, Germany 🇩🇪",
    comment: "Supporting elephant conservation while exploring pristine rainforest. Beautiful eco-lodge and warm local guides!",
    product: "Tesso Nilo Elephant Safari"
  },
  {
    id: 3,
    name: "Chloe Dubois",
    country: "Paris, France 🇫🇷",
    comment: "The river boat trip to Rimbang Baling was unforgettable. True sustainable tourism empowering local tribes.",
    product: "Rimbang Baling Eco-Lodge"
  }
];

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Format Mata Uang
  const formatPrice = (usd, idr) => {
    return currency === 'USD' ? `$${usd} USD` : `Rp ${idr.toLocaleString('id-ID')}`;
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  const closeModal = () => {
    setSelectedTour(null);
    setBookingSubmitted(false);
  };

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <header className="glass-card nav-header">
        <div className="nav-content">
          <div className="brand-logo">
            <div className="logo-box">R</div>
            <div>
              <h1 className="brand-title">Riau Eco-Adventure</h1>
              <span className="brand-sub">HERITAGE ECOTOURISM</span>
            </div>
          </div>

          <nav className="desktop-nav">
            <a href="#hero">Beranda</a>
            <a href="#bento">Komitmen Eco</a>
            <a href="#products">Paket Ekspedisi</a>
            <a href="#testimonials">Ulasan Wisatawan</a>
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
            <Leaf size={14} /> Preserving Riau's Rainforests & Indigenous Rivers
          </span>
          <h2 className="hero-title">
            Wild Riau Expeditions, <br />
            <span className="highlight-text">Designed for Global Eco-Travelers.</span>
          </h2>
          <p className="hero-desc">
            Menghubungkan wisatawan dunia dengan keajaiban alam Riau — mulai dari ombak sungai Bono, habitat gajah Sumatra, hingga keasrian hutan hujan yang terlindungi.
          </p>
          <div className="hero-buttons">
            <a href="#products" className="btn-primary">
              Jelajahi Paket Tur <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* BENTO GRID VALUE PROPOSITION SECTION */}
      <section id="bento" className="bento-section">
        <div className="section-header">
          <span>Prinsip Ekowisata</span>
          <h2>Mengapa Memilih Riau Eco-Adventure?</h2>
        </div>

        <div className="bento-grid">
          <div className="bento-card bento-large glass-card">
            <div className="bento-icon-box">
              <ShieldCheck size={24} />
            </div>
            <span className="bento-tag">Sertifikasi Internasional</span>
            <h3>100% Carbon-Neutral Travel & Ethical Wildlife</h3>
            <p>
              Seluruh perjalanan dikompensasi dengan program penanaman pohon di hutan gambut. Kami menerapkan standar etika ketat tanpa eksploitasi satwa liar.
            </p>
          </div>

          <div className="bento-card glass-card">
            <div className="bento-icon-box">
              <Compass size={24} />
            </div>
            <span className="bento-tag">Pemandu Adat</span>
            <h3>Native Rainforest Guides</h3>
            <p>
              Dipandu langsung oleh warga lokal dan pemuda pemudi adat yang mengenal navigasi hutan serta sejarah sungai secara mendalam.
            </p>
          </div>

          <div className="bento-card glass-card">
            <div className="bento-icon-box">
              <Sparkles size={24} />
            </div>
            <span className="bento-tag">Fenomena Langka</span>
            <h3>Home of 'Seven Ghosts' Tidal Bore</h3>
            <p>
              Akses eksklusif melihat dan mengarungi fenomena ombak Bono yang hanya ada di dua tempat di seluruh dunia.
            </p>
          </div>

          <div className="bento-card bento-large glass-card">
            <div className="bento-icon-box">
              <Award size={24} />
            </div>
            <span className="bento-tag">Dampak Komunitas</span>
            <h3>25% Biaya Tur untuk Dana Konservasi & Desa Adat</h3>
            <p>
              Setiap pemesanan tur langsung mendanai unit patroli penyelamatan hutan hujan serta fasilitas sanitasi dan pendidikan desa di pelosok Riau.
            </p>
          </div>
        </div>
      </section>

      {/* TOUR PACKAGES SECTION */}
      <section id="products" className="products-section">
        <div className="section-header">
          <span>Katalog Ekspedisi</span>
          <h2>Paket Wisata Alam Unggulan Riau</h2>
        </div>

        <div className="products-grid">
          {TOUR_PACKAGES.map((item) => (
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
                    <small>Mulai Dari / Orang</small>
                    <div className="price-tag">{formatPrice(item.priceUSD, item.priceIDR)}</div>
                  </div>
                  <button className="btn-buy" onClick={() => setSelectedTour(item)}>
                    <Compass size={16} /> Reservasi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS MARQUEE */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <span>Ulasan Wisatawan Dunia</span>
          <h2>Pengalaman Tak Terlupakan di Alam Riau</h2>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((rev, index) => (
              <div key={index} className="review-card glass-card">
                <div className="review-header">
                  <div>
                    <h4>{rev.name}</h4>
                    <span className="country-tag">{rev.country}</span>
                  </div>
                  <div className="stars">
                    <Star size={14} fill="#D4AF37" color="#D4AF37" />
                    <Star size={14} fill="#D4AF37" color="#D4AF37" />
                    <Star size={14} fill="#D4AF37" color="#D4AF37" />
                    <Star size={14} fill="#D4AF37" color="#D4AF37" />
                    <Star size={14} fill="#D4AF37" color="#D4AF37" />
                  </div>
                </div>
                <p>"{rev.comment}"</p>
                <small className="purchased-item">Booked: {rev.product}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL POPUP TOUR RESERVATION */}
      {selectedTour && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={20} />
            </button>

            {!bookingSubmitted ? (
              <div className="modal-body">
                <div className="modal-image">
                  <img src={selectedTour.image} alt={selectedTour.name} />
                </div>
                <div className="modal-details">
                  <span className="modal-badge">{selectedTour.badge}</span>
                  <h2>{selectedTour.name}</h2>
                  <div className="modal-price">{formatPrice(selectedTour.priceUSD, selectedTour.priceIDR)}</div>
                  <p className="modal-desc">{selectedTour.description}</p>

                  <div className="modal-specs">
                    <div><strong>Lokasi:</strong> {selectedTour.location}</div>
                    <div><strong>Durasi Tur:</strong> {selectedTour.duration}</div>
                    <div><strong>Jaminan Standar:</strong> {selectedTour.certification}</div>
                  </div>

                  <form className="order-form" onSubmit={handleBookingSubmit}>
                    <h4>Formulir Reservasi & Custom Itinerary</h4>
                    <input type="text" placeholder="Nama Lengkap / Visitor Name" required />
                    <input type="email" placeholder="Email untuk Konfirmasi Booking" required />
                    <input type="date" required />
                    <button type="submit" className="btn-submit-order">
                      Cek Ketersediaan Tanggal & Booking
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="modal-success">
                <CheckCircle size={48} className="success-icon" />
                <h3>Permintaan Reservasi Terkirim!</h3>
                <p>
                  Terima kasih! Tim konsultan Riau Eco-Adventure akan menghubungi Anda via email dengan rincian *itinerary* dan instruksi penjemputan dari Bandara Sultan Syarif Kasim II Pekanbaru.
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
            <h3>Riau Eco-Adventure Heritage</h3>
            <p>Platform Digitalisasi Ekowisata Unggulan Daerah - Provinsi Riau, Indonesia.</p>
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