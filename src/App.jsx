import React, { useState, useEffect, useRef, useMemo, forwardRef, useCallback, useImperativeHandle, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity, useAnimationControls, animate } from 'framer-motion';
import { gsap } from 'gsap';
import { Globe, Compass, Leaf, ShieldCheck, Heart, Menu, X, ArrowRight, Camera, Video, Share2, MessageCircle, Sparkles, Award, CheckCircle, Star, MapPin, Calendar, Clock, Plane, HelpCircle, ChevronDown, Check, Mail, Phone, Send, User, Move, Waves, ShoppingBag } from 'lucide-react';

// === IMPORT ASSETS GAMBAR LOKAL DARI SRC/ ===
import logoWeb from './LogoWeb.png';
import imgKamparBono from './kamparbono.jpeg';
import imgKamparKiri from './kamparkiri.jpeg';
import imgRimbangBaling from './rimbangbaling.jpeg';
import imgAmigurumi from './amigurumi.jpeg';
import imgSyalTenun from './syal tenun.jpeg';

import './App.css';

// ============================================================================
// REACT BITS ACCORDION GALLERY COMPONENT
// ============================================================================
const ACCORDION_ITEMS = [
  { image: imgKamparBono, label: 'Kampar Bono Wave' },
  { image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=900&q=80', label: 'Tesso Nilo Elephants' },
  { image: imgRimbangBaling, label: 'Rimbang Baling Eco-Lodge' },
  { image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=900&q=80', label: 'Hutan Hujan Gambut' },
  { image: imgKamparKiri, label: 'Sungai Kampar Kiri' }
];

const AccordionGallery = ({
  items = ACCORDION_ITEMS,
  defaultIndex = 2,
  accentColor = '#D4AF37',
  overlayColor = '#0f172a',
  textColor = '#ffffff',
  height = 420,
  gap = 12,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 6,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = ''
}) => {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const tlRef = useRef(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    animate => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [active, count, expandRatio, duration, ease, vertical, tilt, parallax, grayscale, showLabels, stagger, prefersReduced]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);

  const handleEnter = i => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i, e) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
      }}
      role="list"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <div
            key={i}
            ref={el => (panelRefs.current[i] = el)}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            role="listitem"
            tabIndex={0}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={el => (mediaRefs.current[i] = el)}>
                <img src={item.image} alt={item.label || ''} draggable="false" />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={el => (barRefs.current[i] = el)} />
                <span className="ag-panel__text" ref={el => (textRefs.current[i] = el)}>
                  {item.label}
                </span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// ACETERNITY UI 3D GLOBE COMPONENT
// ============================================================================
const DEFAULT_EARTH_TEXTURE = "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE = "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function Marker({ marker, radius, onClick, onHover }) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const imageGroupRef = useRef();
  const { camera } = useThree();

  const surfacePosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.001);
  }, [marker.lat, marker.lng, radius]);

  const topPosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.18);
  }, [marker.lat, marker.lng, radius]);

  const lineHeight = topPosition.distanceTo(surfacePosition);

  useFrame(() => {
    if (!imageGroupRef.current) return;
    const worldPos = new THREE.Vector3();
    imageGroupRef.current.getWorldPosition(worldPos);

    const markerDirection = worldPos.clone().normalize();
    const cameraDirection = camera.position.clone().normalize();
    const dot = markerDirection.dot(cameraDirection);

    setIsVisible(dot > 0.1);
  });

  const { lineCenter, lineQuaternion } = useMemo(() => {
    const center = surfacePosition.clone().lerp(topPosition, 0.5);
    const direction = topPosition.clone().sub(surfacePosition).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    return { lineCenter: center, lineQuaternion: quaternion };
  }, [surfacePosition, topPosition]);

  return (
    <group visible={isVisible}>
      <mesh position={lineCenter} quaternion={lineQuaternion}>
        <cylinderGeometry args={[0.003, 0.003, lineHeight, 8]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : "#94a3b8"} transparent opacity={hovered ? 0.9 : 0.6} />
      </mesh>

      <mesh position={surfacePosition} quaternion={lineQuaternion}>
        <coneGeometry args={[0.015, 0.04, 8]} />
        <meshBasicMaterial color={marker.isHub ? "#f97316" : "#ef4444"} />
      </mesh>

      <group ref={imageGroupRef} position={topPosition}>
        <Html transform center sprite distanceFactor={10} style={{ pointerEvents: isVisible ? "auto" : "none", opacity: isVisible ? 1 : 0 }}>
          <div
            className={`country-pill-badge ${marker.isHub ? 'hub-pill' : ''} ${hovered ? 'hovered' : ''}`}
            onMouseEnter={() => { setHovered(true); onHover?.(marker); }}
            onMouseLeave={() => { setHovered(false); onHover?.(null); }}
            onClick={() => onClick?.(marker)}
          >
            <span className="pill-flag">{marker.flag}</span>
            <span className="pill-label">{marker.label}</span>
          </div>
        </Html>
      </group>
    </group>
  );
}

function RotatingGlobe({ config, markers, onMarkerClick, onMarkerHover }) {
  const [earthTexture, bumpTexture] = useTexture([config.textureUrl, config.bumpMapUrl]);

  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 8;
    }
  }, [earthTexture, bumpTexture]);

  const geometry = useMemo(() => new THREE.SphereGeometry(config.radius, 64, 64), [config.radius]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}`}
          marker={marker}
          radius={config.radius}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

function Scene({ markers, config, onMarkerClick, onMarkerHover }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.5);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight position={[config.radius * 5, config.radius * 2, config.radius * 5]} intensity={config.pointLightIntensity} color="#ffffff" />
      <directionalLight position={[-config.radius * 3, config.radius, -config.radius * 2]} intensity={config.pointLightIntensity * 0.3} color="#88ccff" />

      <RotatingGlobe config={config} markers={markers} onMarkerClick={onMarkerClick} onMarkerHover={onMarkerHover} />

      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        rotateSpeed={0.5}
        autoRotate={config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

const defaultConfig = {
  radius: 2,
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  bumpScale: 1,
  autoRotateSpeed: 0.5,
  enableZoom: false,
  enablePan: false,
  ambientIntensity: 0.7,
  pointLightIntensity: 1.5,
};

function Globe3D({ markers = [], config = {}, onMarkerClick, onMarkerHover }) {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  return (
    <div className="globe-canvas-wrapper">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 0, mergedConfig.radius * 3.5] }}
      >
        <Suspense fallback={null}>
          <Scene markers={markers} config={mergedConfig} onMarkerClick={onMarkerClick} onMarkerHover={onMarkerHover} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const GLOBAL_MARKERS = [
  { lat: 0.5104, lng: 101.4383, label: "Pekanbaru, Riau", flag: "🇮🇩", isHub: true },
  { lat: 1.3521, lng: 103.8198, label: "Singapore", flag: "🇸🇬" },
  { lat: 3.1390, lng: 101.6869, label: "Kuala Lumpur", flag: "🇲🇾" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo", flag: "🇯🇵" },
  { lat: -33.8688, lng: 151.2093, label: "Sydney", flag: "🇦🇺" },
  { lat: 51.5074, lng: -0.1278, label: "London", flag: "🇬🇧" },
  { lat: 48.8566, lng: 2.3522, label: "Paris", flag: "🇫🇷" },
  { lat: 40.7128, lng: -74.0060, label: "New York", flag: "🇺🇸" },
];

// ============================================================================
// ACETERNITY UI DRAGGABLE CARD GALLERY COMPONENT
// ============================================================================
function DraggableCardItem({ title, image, className }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });

  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        top: -200,
        left: -300,
        right: 300,
        bottom: 200,
      });
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = cardRef.current?.getBoundingClientRect() ?? { width: 0, height: 0, left: 0, top: 0 };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      onDragStart={() => { document.body.style.cursor = "grabbing"; }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";
        controls.start({ rotateX: 0, rotateY: 0, transition: { type: "spring", ...springConfig } });
        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();
        animate(info.point.x, info.point.x + currentVelocityX * 0.2, {
          duration: 0.6,
          type: "spring",
          stiffness: 50,
          damping: 15,
        });
        animate(info.point.y, info.point.y + currentVelocityY * 0.2, {
          duration: 0.6,
          type: "spring",
          stiffness: 50,
          damping: 15,
        });
      }}
      style={{ rotateX, rotateY, willChange: "transform" }}
      animate={controls}
      whileHover={{ scale: 1.05, zIndex: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`draggable-card-item ${className}`}
    >
      <img src={image} alt={title} className="draggable-card-img" draggable={false} />
      <h3 className="draggable-card-title">{title}</h3>
    </motion.div>
  );
}

function DraggableCardGallery() {
  const galleryItems = [
    { title: "Ombak Bono Sungai Kampar", image: imgKamparBono, className: "pos-1" },
    { title: "TN Tesso Nilo Elephant", image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80", className: "pos-2" },
    { title: "Rimbang Baling Eco-Lodge", image: imgRimbangBaling, className: "pos-3" },
    { title: "Hutan Hujan Gambut Riau", image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80", className: "pos-4" },
    { title: "Sungai Kampar Kiri", image: imgKamparKiri, className: "pos-5" }
  ];

  return (
    <div className="draggable-gallery-container glass-card">
      <div className="gallery-instruction-badge">
        <Move size={14} /> Klik & Geser Foto Polaroid Di Bawah!
      </div>
      <div className="gallery-cards-wrapper">
        {galleryItems.map((item, i) => (
          <DraggableCardItem key={i} title={item.title} image={item.image} className={item.className} />
        ))}
      </div>
    </div>
  );
}

// --- KOMPONEN REACT BITS: ROTATINGTEXT ---
function RotatingText({ texts }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [texts]);

  return (
    <span className="rotating-badge-highlight">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// --- KOMPONEN HEADING SECTION ANIMATED ---
function SectionHeading({ subtitle, title }) {
  return (
    <div className="section-header">
      <span>{subtitle}</span>
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="section-title-text"
      >
        {title}
      </motion.h2>
    </div>
  );
}

// Data Paket Wisata Alam Riau (Menggunakan Gambar Lokal)
const TOUR_PACKAGES = [
  {
    id: 1,
    name: "Kampar Bono River Surfing Expedition",
    category: "Extreme Eco-Adventure",
    priceIDR: 4500000,
    priceUSD: 295,
    badge: "World Famous Wave",
    image: imgKamparBono,
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
    image: imgRimbangBaling,
    description: "Menyusuri sungai hulu dengan perahu tradisional (Pancung), menginap di eco-lodge kayu ramah lingkungan, dan mempelajari kearifan adat masyarakat Kampar Kiri.",
    location: "Suaka Margasatwa Rimbang Baling",
    duration: "3 Hari 2 Malam",
    certification: "Zero Plastic & Local Powered"
  }
];

// Data Eco Merchandise Add-ons (Menggunakan Gambar Lokal)
const ECO_MERCHANDISE = [
  {
    id: 101,
    name: "Handmade Amigurumi Mascot",
    category: "Community Craft",
    priceIDR: 120000,
    priceUSD: 8,
    badge: "Handmade",
    image: imgAmigurumi,
    description: "Gantungan kunci rajut buatan tangan pengrajin lokal Riau bertema gajah & konservasi."
  },
  {
    id: 102,
    name: "Kopi Liberika Gambut Riau (250g)",
    category: "Local Organic Food",
    priceIDR: 85000,
    priceUSD: 6,
    badge: "100% Organic",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",
    description: "Biji kopi organik pilihan hasil budidaya ramah lingkungan masyarakat gambut Riau."
  },
  {
    id: 103,
    name: "Syal Tenun Adat Melayu Riau",
    category: "Cultural Heritage",
    priceIDR: 250000,
    priceUSD: 16,
    badge: "Traditional Weave",
    image: imgSyalTenun,
    description: "Kain tenun motif tradisional buatan penenun perempuan desa adat Kampar Kiri."
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

// Data Itinerary Timeline 3 Hari
const ITINERARY_DAYS = [
  {
    day: "Hari 1",
    title: "Kedatangan & Cultural Welcome",
    time: "09:00 - 18:00 WIB",
    location: "Pekanbaru • Basecamp Ekowisata",
    coords: "0.5104° N, 101.4383° E",
    description: "Penjemputan eksklusif di Bandara Sultan Syarif Kasim II Pekanbaru. Perjalanan darat ke basecamp ekowisata, dilanjutkan dengan makan siang hidangan Melayu tradisional dan briefing keselamatan."
  },
  {
    day: "Hari 2",
    title: "Ekspedisi Utama & Petualangan Alam",
    time: "06:00 - 17:00 WIB",
    location: "Teluk Meranti (Bono) / TN Tesso Nilo",
    coords: "0.1652° N, 102.5831° E",
    description: "Aksi utama! Mengarungi ombak Bono bersama tim rescue, atau jungle trekking di Taman Nasional Tesso Nilo bersama tim patroli konservasi gajah Sumatra."
  },
  {
    day: "Hari 3",
    title: "Aksi Konservasi & Kepulangan",
    time: "08:00 - 15:00 WIB",
    location: "Kawasan Gambut & Airport Pekanbaru",
    coords: "0.4520° N, 101.4420° E",
    description: "Program aksi nyata penanaman bibit pohon di lahan gambut, serah terima sertifikat karbon netral, dan pengantaran kembali ke Bandara Pekanbaru."
  }
];

// Data FAQ Accordion
const FAQ_DATA = [
  {
    q: "Kapan waktu terbaik untuk menyaksikan fenomena ombak Bono di Sungai Kampar?",
    a: "Puncak ombak Bono terbesar terjadi saat bulan purnama dan bulan mati (biasanya terjadi antara bulan September hingga Desember dan Maret hingga April)."
  },
  {
    q: "Apakah paket wisata ini aman untuk wisatawan yang belum berpengalaman?",
    a: "Sangat aman! Setiap ekspedisi didampingi oleh pemandu lokal berlisensi, tim medis darurat, serta perahu penyelamat (rescue boat) berstandar keselamatan internasional."
  },
  {
    q: "Bagaimana sistem kontribusi dana konservasi dari setiap pemesanan?",
    a: "25% dari total biaya pendaftaran secara otomatis dialokasikan langsung untuk dana operasional patroli hutan adat dan pemeliharaan habitat satwa gajah Sumatra."
  },
  {
    q: "Fasilitas apa saja yang sudah termasuk dalam paket harga tur?",
    a: "Harga sudah mencakup penjemputan airport, transportasi lokal, penginapan eco-lodge, makan 3x sehari, peralatan keselamatan, izin masuk kawasan konservasi, dan sertifikat aksi hijau."
  }
];

// Komponen Stateful Button Aceternity UI
function StatefulButton({ children, onClick, className = "" }) {
  const [status, setStatus] = useState('idle');

  const handleClick = async (e) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('loading');
    if (onClick) {
      await onClick(e);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    setStatus('success');
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={status === 'loading'}
      className={`stateful-btn ${status} ${className}`}
    >
      {status === 'idle' && (
        <span className="btn-state-content">
          {children}
        </span>
      )}

      {status === 'loading' && (
        <span className="btn-state-content">
          <span className="spinner-loader"></span>
          <span>Memproses...</span>
        </span>
      )}

      {status === 'success' && (
        <span className="btn-state-content">
          <CheckCircle size={18} />
          <span>Pesan Terkirim!</span>
        </span>
      )}
    </button>
  );
}

// Komponen 3D Card Aceternity UI
function ThreeDCard({ item, formatPrice, onSelectTour }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -15;
    const rotY = ((x - centerX) / centerX) * 15;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      className="card-container-3d"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="card-body-3d"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
        }}
      >
        <div 
          className="layer-translateZ flex-between" 
          style={{ transform: isHovered ? 'translateZ(40px)' : 'translateZ(0px)' }}
        >
          <span className="category-tag">{item.category}</span>
          <span className="product-badge-3d">{item.badge}</span>
        </div>

        <h3 
          className="card-title-3d layer-translateZ"
          style={{ transform: isHovered ? 'translateZ(60px)' : 'translateZ(0px)' }}
        >
          {item.name}
        </h3>

        <div 
          className="card-image-3d layer-translateZ"
          style={{ 
            transform: isHovered ? 'translateZ(100px)' : 'translateZ(0px)',
            boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.3)' : '0 8px 20px rgba(0,0,0,0.12)'
          }}
        >
          <img src={item.image} alt={item.name} />
        </div>

        <p 
          className="card-desc-3d layer-translateZ"
          style={{ transform: isHovered ? 'translateZ(45px)' : 'translateZ(0px)' }}
        >
          {item.description}
        </p>

        <div 
          className="card-footer-3d layer-translateZ"
          style={{ transform: isHovered ? 'translateZ(70px)' : 'translateZ(0px)' }}
        >
          <div>
            <small>Mulai Dari</small>
            <div className="price-tag">{formatPrice(item.priceUSD, item.priceIDR)}</div>
          </div>
          <button className="btn-buy" onClick={() => onSelectTour(item)}>
            <Compass size={16} /> Pesan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  
  const [activeDay, setActiveDay] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const formatPrice = (usd, idr) => {
    return currency === 'USD' ? `$${usd} USD` : `Rp ${idr.toLocaleString('id-ID')}`;
  };

  const closeModal = () => {
    setSelectedTour(null);
    setBookingSubmitted(false);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="app-container">
      {/* FLOATING DIRECT WHATSAPP BOOKING BUTTON */}
      <a 
        href="https://wa.me/628123456789?text=Halo%20Riau%20Eco-Adventure!%20Saya%20ingin%20konsultasi%20paket%20wisata%20dan%20custom%20itinerary." 
        target="_blank" 
        rel="noreferrer" 
        className="floating-wa-btn"
        title="Chat WhatsApp Konsultan Ekowisata"
      >
        <MessageCircle size={22} />
        <span className="wa-text-pop">Chat Konsultan</span>
      </a>

      {/* NAVBAR */}
      <header className="glass-card nav-header">
        <div className="nav-content">
          <div className="brand-logo">
            <img 
              src={logoWeb} 
              alt="Riau Eco-Adventure Logo" 
              className="navbar-logo-img" 
            />
          </div>

          <nav className="desktop-nav">
            <a href="#hero">Beranda</a>
            <a href="#bento">Komitmen Kami</a>
            <a href="#gallery">Galeri Alam</a>
            <a href="#products">Paket Wisata</a>
            <a href="#merch">Souvenir</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Kontak</a>
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

      {/* HERO SECTION WITH BONO TIDE TRACKER WIDGET */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <div className="tide-tracker-pill">
            <span className="pulse-dot"></span>
            <Waves size={15} />
            <span>Prediksi Ombak Bono Puncak: <strong>12 September 2026 (Bulan Purnama)</strong></span>
          </div>

          <div className="hero-glass-card">
            <span className="hero-badge">
              <Leaf size={14} /> Preserving Riau's Rainforests & Indigenous Rivers
            </span>

            <h1 className="hero-heading-wrapper">
              Wild Riau Expeditions, <br />
              <span className="hero-heading-sub">Designed for </span>
              <RotatingText
                texts={['Global Eco-Travelers.', 'Nature Explorers.', 'Wild Adventurers.', 'Sumatra Voyagers.']}
              />
            </h1>

            <p className="hero-desc">
              Menghubungkan wisatawan dunia dengan keajaiban alam Riau — mulai dari ombak sungai Bono, habitat gajah Sumatra, hingga keasrian hutan hujan yang terlindungi.
            </p>
            <div className="hero-buttons">
              <a href="#products" className="btn-primary">
                Jelajahi Paket Tur <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID VALUE PROPOSITION SECTION */}
      <section id="bento" className="bento-section">
        <SectionHeading 
          subtitle="Prinsip Ekowisata" 
          title="Mengapa Memilih Riau Eco-Adventure?" 
        />

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
              Setiap pemesanan tur langsung mendanai unit patroli penyelamatkan hutan hujan serta fasilitas sanitasi dan pendidikan desa di pelosok Riau.
            </p>
          </div>
        </div>

        {/* BADGE BAR */}
        <div className="badge-bar-container glass-card">
          <div className="badge-item"><ShieldCheck size={20} /> Certified River Rescue</div>
          <div className="badge-item"><Leaf size={20} /> 100% Carbon Neutral</div>
          <div className="badge-item"><Award size={20} /> Ethical Wildlife Partner</div>
          <div className="badge-item"><Heart size={20} /> Fair Community Fund</div>
        </div>
      </section>

      {/* IMPACT COUNTER SECTION */}
      <section className="impact-counter-section">
        <div className="impact-grid">
          <div className="impact-card glass-card">
            <h3>1,250+</h3>
            <p>Hektar Hutan Gambut Terlindungi</p>
          </div>
          <div className="impact-card glass-card">
            <h3>85+</h3>
            <p>Pemandu Adat & Pemuda Lokal Diberdayakan</p>
          </div>
          <div className="impact-card glass-card">
            <h3>300+</h3>
            <p>Pohon Tertanam per Bulan</p>
          </div>
          <div className="impact-card glass-card">
            <h3>100%</h3>
            <p>Bebas Sampah Plastik Sekali Pakai</p>
          </div>
        </div>
      </section>

      {/* GALERI FOTO DRAGGABLE CARD ACETERNITY UI & REACT BITS ACCORDION GALLERY */}
      <section id="gallery" className="gallery-section">
        <SectionHeading 
          subtitle="Potret Keindahan Alam" 
          title="Galeri Visual Ekspedisi Riau" 
        />
        <DraggableCardGallery />

        {/* REACT BITS ACCORDION GALLERY */}
        <div style={{ marginTop: '40px' }}>
          <AccordionGallery />
        </div>
      </section>

      {/* ECO-ITINERARY TIMELINE WITH DYNAMIC MAP MARKER PREVIEW */}
      <section id="itinerary" className="itinerary-section">
        <SectionHeading 
          subtitle="Gambaran Pengalaman" 
          title="Rencana Perjalanan 3 Hari Ekspedisi" 
        />

        <div className="itinerary-tabs">
          {ITINERARY_DAYS.map((dayItem, index) => (
            <button 
              key={index} 
              className={`tab-btn ${activeDay === index ? 'active' : ''}`}
              onClick={() => setActiveDay(index)}
            >
              {dayItem.day}
            </button>
          ))}
        </div>

        <div className="itinerary-card glass-card">
          <div className="itinerary-header">
            <span className="itinerary-time"><Clock size={16} /> {ITINERARY_DAYS[activeDay].time}</span>
            <h3>{ITINERARY_DAYS[activeDay].title}</h3>
          </div>
          <p className="itinerary-desc">{ITINERARY_DAYS[activeDay].description}</p>
          
          <div className="itinerary-location-box">
            <MapPin size={16} className="pin-icon-animated" />
            <div>
              <strong>Lokasi Fokus:</strong> {ITINERARY_DAYS[activeDay].location}
              <small className="coords-tag">({ITINERARY_DAYS[activeDay].coords})</small>
            </div>
          </div>
        </div>
      </section>

      {/* TOUR PACKAGES SECTION */}
      <section id="products" className="products-section">
        <SectionHeading 
          subtitle="Katalog Ekspedisi" 
          title="Paket Wisata Alam Unggulan Riau" 
        />

        <div className="products-grid">
          {TOUR_PACKAGES.map((item) => (
            <ThreeDCard 
              key={item.id} 
              item={item} 
              formatPrice={formatPrice} 
              onSelectTour={setSelectedTour} 
            />
          ))}
        </div>
      </section>

      {/* ECO-MERCHANDISE CROSS-SELLING SECTION WITH 3D TILT CARD */}
      <section id="merch" className="merch-section">
        <SectionHeading 
          subtitle="Pemberdayaan Komunitas Adat" 
          title="Oleh-Oleh & Kerajinan Ramah Lingkungan" 
        />

        <div className="products-grid">
          {ECO_MERCHANDISE.map((merch) => (
            <ThreeDCard 
              key={merch.id} 
              item={merch} 
              formatPrice={formatPrice} 
              onSelectTour={(item) => {
                window.open(
                  `https://wa.me/628123456789?text=Halo!%20Saya%20berminat%20membeli%20suvenir%20${encodeURIComponent(item.name)}`,
                  '_blank'
                );
              }} 
            />
          ))}
        </div>
      </section>

      {/* MAP & LOGISTICS GUIDE SECTION WITH ACETERNITY 3D GLOBE */}
      <section className="logistics-section">
        <SectionHeading 
          subtitle="Aksesibilitas Wisatawan" 
          title="Lokasi & Panduan Penerbangan" 
        />

        <div className="logistics-grid glass-card">
          <div className="logistics-info">
            <div className="logistics-item">
              <Plane size={24} className="logistics-icon" />
              <div>
                <h4>Akses Penerbangan Internasional</h4>
                <p>Hanya 1 jam penerbangan langsung dari Singapura (SIN) atau Kuala Lumpur (KUL) menuju Bandara Internasional Sultan Syarif Kasim II Pekanbaru (PKU).</p>
              </div>
            </div>
            <div className="logistics-item">
              <Compass size={24} className="logistics-icon" />
              <div>
                <h4>Layanan Antar-Jemput Eksklusif</h4>
                <p>Tim perwakilan Riau Eco-Adventure akan menyambut kedatangan Anda di pintu kedatangan bandara dengan kendaraan privat ber-AC.</p>
              </div>
            </div>
          </div>

          <div className="logistics-globe-container">
            <Globe3D markers={GLOBAL_MARKERS} />
            <div className="globe-caption">
              <strong>Pekanbaru, Riau (Hub Ekspedisi)</strong>
              <small>Klik & Tarik Pakai Mouse Untuk Memutar Bola Dunia 3D</small>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS MARQUEE */}
      <section id="testimonials" className="testimonials-section">
        <SectionHeading 
          subtitle="Ulasan Wisatawan Dunia" 
          title="Pengalaman Tak Terlupakan di Alam Riau" 
        />

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

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="faq-section">
        <SectionHeading 
          subtitle="Informasi Penting" 
          title="Pertanyaan Sering Diajukan" 
        />

        <div className="faq-container">
          {FAQ_DATA.map((faq, index) => (
            <div key={index} className="faq-item glass-card">
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`faq-icon ${openFaq === index ? 'rotate' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact" className="contact-section">
        <SectionHeading 
          subtitle="Hubungi Konsultan Kami" 
          title="Diskusi Rencana Ekspedisi Anda" 
        />

        <div className="contact-container glass-card">
          <div className="contact-info">
            <h3>Ada Pertanyaan Khusus?</h3>
            <p>Tim konsultan ekowisata kami siap membantu mengatur custom itinerary, paket rombongan/travel agent, atau menyesuaikan jadwal ekspedisi Anda.</p>
            
            <div className="contact-details">
              <div className="contact-detail-item">
                <Mail size={20} className="contact-icon" />
                <span>hello@riauecoadventure.id</span>
              </div>
              <div className="contact-detail-item">
                <Phone size={20} className="contact-icon" />
                <span>+62 812 3456 7890 (WhatsApp Available)</span>
              </div>
              <div className="contact-detail-item">
                <MapPin size={20} className="contact-icon" />
                <span>Pekanbaru & Teluk Meranti, Riau, Indonesia</span>
              </div>
              
              <div className="contact-detail-item">
                <Camera size={20} className="contact-icon" />
                <a 
                  href="https://www.instagram.com/wisataalamriau.id/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="contact-social-link"
                >
                  @wisataalamriau.id
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-box">
            {!contactSubmitted ? (
              <form className="contact-form">
                <div className="form-group">
                  <label><User size={14} /> Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama Anda..." required />
                </div>

                <div className="form-group">
                  <label><Mail size={14} /> Email Kontak</label>
                  <input type="email" placeholder="nama@email.com" required />
                </div>

                <div className="form-group">
                  <label><Compass size={14} /> Topik Konsultasi</label>
                  <select>
                    <option>Konsultasi Custom Itinerary</option>
                    <option>Pertanyaan Paket Ekspedisi Bono</option>
                    <option>Reservasi Konservasi Gajah TN Tesso Nilo</option>
                    <option>Kerjasama Travel Agent / Corporate</option>
                  </select>
                </div>

                <div className="form-group">
                  <label><MessageCircle size={14} /> Pesan / Pertanyaan Anda</label>
                  <textarea rows="4" placeholder="Tuliskan tanggal rencana ekspedisi atau pertanyaan Anda..." required></textarea>
                </div>

                <StatefulButton 
                  onClick={async () => {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    setContactSubmitted(true);
                  }}
                >
                  <Send size={14} /> Kirim Pesan Konsultasi
                </StatefulButton>
              </form>
            ) : (
              <div className="contact-success-box">
                <CheckCircle size={48} className="success-icon" />
                <h3>Pesan Konsultasi Terkirim!</h3>
                <p>Terima kasih telah menghubungi Riau Eco-Adventure. Konsultan ekowisata kami akan membalas pesan Anda via email / WhatsApp dalam 1x24 jam.</p>
                <button className="btn-primary" onClick={() => setContactSubmitted(false)}>Kirim Pesan Lain</button>
              </div>
            )}
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

                  <form className="order-form">
                    <h4>Formulir Reservasi & Custom Itinerary</h4>
                    <input type="text" placeholder="Nama Lengkap / Visitor Name" required />
                    <input type="email" placeholder="Email untuk Konfirmasi Booking" required />
                    <input type="date" required />
                    
                    <StatefulButton 
                      onClick={async () => {
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        setBookingSubmitted(true);
                      }}
                    >
                      Cek Ketersediaan Tanggal & Booking
                    </StatefulButton>
                  </form>
                </div>
              </div>
            ) : (
              <div className="modal-success">
                <CheckCircle size={48} className="success-icon" />
                <h3>Permintaan Reservasi Terkirim!</h3>
                <p>
                  Terima kasih! Tim konsultan Riau Eco-Adventure akan menghubungi Anda via email dengan rincian itinerary dan instruksi penjemputan dari Bandara Sultan Syarif Kasim II Pekanbaru.
                </p>
                <button className="btn-primary" onClick={closeModal}>Tutup</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER EXTENDED */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <img src={logoWeb} alt="Riau Eco-Adventure Logo" className="footer-logo-img" />
              <p className="footer-about">
                Platform digitalisasi ekowisata unggulan Provinsi Riau. Menghubungkan wisatawan mancanegara dengan keajaiban alam Bono, konservasi gajah, dan suaka hutan hujan.
              </p>
            </div>

            <div className="footer-col">
              <h4>Navigasi Cepat</h4>
              <ul className="footer-links">
                <li><a href="#hero">Beranda</a></li>
                <li><a href="#bento">Komitmen Eco</a></li>
                <li><a href="#gallery">Galeri Visual</a></li>
                <li><a href="#products">Paket Ekspedisi</a></li>
                <li><a href="#faq">Pertanyaan Umum (FAQ)</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Informasi Kontak</h4>
              <ul className="footer-contact-list">
                <li><Mail size={16} /> hello@riauecoadventure.id</li>
                <li><Phone size={16} /> +62 812 3456 7890 (WA)</li>
                <li><MapPin size={16} /> Pekanbaru & Teluk Meranti, Riau</li>
                <li><Clock size={16} /> Senin - Minggu: 08.00 - 20.00 WIB</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Ikuti Media Sosial</h4>
              <p className="footer-social-desc">Dapatkan pembaruan foto dan jadwal fenomena ombak Bono setiap bulan.</p>
              <div className="social-links">
                <a 
                  href="https://www.instagram.com/wisataalamriau.id/" 
                  target="_blank" 
                  rel="noreferrer" 
                  title="Instagram Wisata Alam Riau"
                  className="social-btn instagram"
                >
                  <Camera size={18} />
                </a>
                <a href="https://www.youtube.com/@KamarTravel" target="_blank" rel="noreferrer" className="social-btn"><Video size={18} /></a>
                <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="social-btn"><MessageCircle size={18} /></a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Riau Eco-Adventure Heritage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}