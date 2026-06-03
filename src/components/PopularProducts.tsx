import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiEye } from 'react-icons/fi';
import type { Shoe } from '../types/shoe';

gsap.registerPlugin(ScrollTrigger);

interface PopularProductsProps {
  shoes: Shoe[];
  onAddToCart: (shoe: Shoe) => void;
  onProductClick?: (shoe: Shoe) => void;
}

export const PopularProducts: React.FC<PopularProductsProps> = ({ shoes, onAddToCart, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const baseShoes = React.useMemo(() => {
    return shoes.filter(s => s.imageURL && s.price > 0).slice(0, 12);
  }, [shoes]);

  const extendedShoes = React.useMemo(() => {
    if (baseShoes.length === 0) return [];
    return [...baseShoes, ...baseShoes.slice(0, 4)];
  }, [baseShoes]);

  // Detectar si es móvil para limpiar el DOM de elementos innecesarios
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    if (baseShoes.length === 0) return;

    gsap.fromTo(titleRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: titleRef.current, start: 'top 85%' } }
    );
  }, [baseShoes]);

  const nextSlide = () => {
    if (currentIndex === baseShoes.length) {
      if (cardsContainerRef.current) cardsContainerRef.current.style.transition = 'none';
      setCurrentIndex(0);
      setTimeout(() => {
        if (cardsContainerRef.current) cardsContainerRef.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        setCurrentIndex(4);
      }, 50);
    } else {
      setCurrentIndex(prev => prev + 4);
    }
  };

  const prevSlide = () => {
    if (currentIndex === 0) {
      if (cardsContainerRef.current) cardsContainerRef.current.style.transition = 'none';
      setCurrentIndex(baseShoes.length);
      setTimeout(() => {
        if (cardsContainerRef.current) {
          cardsContainerRef.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
          setCurrentIndex(baseShoes.length - 4);
        }
      }, 50);
    } else {
      setCurrentIndex(prev => prev - 4);
    }
  };

  if (extendedShoes.length === 0) return null;

  return (
    <section style={styles.sectionContainer} className="popular-section">
      <div style={styles.headerRow}>
        <h2 ref={titleRef} style={styles.sectionTitle}>PRODUCTOS POPULARES</h2>
        
        {/* Renderizado Condicional: Adiós botones en Mobile */}
        {!isMobile && (
          <div style={styles.arrowBox}>
            <button onClick={prevSlide} style={styles.arrowBtn}><FiChevronLeft size={20} /></button>
            <button onClick={nextSlide} style={styles.arrowBtn}><FiChevronRight size={20} /></button>
          </div>
        )}
      </div>

      <div style={styles.sliderWindow} className="slider-wrapper-mobile">
        <div 
          ref={cardsContainerRef}
          style={{
            ...styles.cardsGrid,
            transform: isMobile ? 'none' : `translateX(-${(currentIndex / 4) * 100}%)`
          }}
          className="popular-grid"
        >
          {(isMobile ? baseShoes : extendedShoes).map((shoe, index) => (
            <div key={`${shoe.id}-${index}`} style={{ ...styles.cardWrapper, cursor: onProductClick ? 'pointer' : 'default' }} className="card-hover-box" onClick={() => onProductClick?.(shoe)}>
              <div style={styles.card}>
                
                {/* SECCIÓN DE IMAGEN CON OVERLAY TRANSPARENTE EN HOVER Y BOTÓN "VER" */}
                <div style={styles.imageSection} className="image-hover-container">
                  <img src={shoe.imageURL} alt={shoe.name} style={styles.image} />
                  
                  {/* Capa oscura con opción interactiva */}
                  <div style={styles.imageOverlay} className="view-overlay">
                    <div style={styles.viewBadge}>
                      <FiEye size={20} />
                      <span style={styles.viewText}>VER DETALLES</span>
                    </div>
                  </div>
                </div>
                
                <div style={styles.infoSection}>
                  <div>
                    <span style={styles.brandTag}>{shoe.brand}</span>
                    <h3 style={styles.productName}>{shoe.name}</h3>
                  </div>
                  
                  <div style={styles.footerRow}>
                    <span style={styles.priceTag}>${shoe.price}</span>
                    <button
                      onClick={(event) => {
                        event.stopPropagation(); // Evita que se dispare el click de la card completa
                        onAddToCart(shoe);
                      }}
                      style={styles.buyBtn}
                      className="premium-cart-btn"
                    >
                      <FiShoppingCart size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estilos CSS Inyectados para controlar las transiciones fluidas del Hover */}
      <style>{`
        .image-hover-container {
          position: relative;
        }
        .view-overlay {
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .card-hover-box:hover .view-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sectionContainer: {
    width: '100%',
    maxHeight: 'auto',
    backgroundColor: '#000000',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', width: '100%' },
  sectionTitle: { fontSize: '22px', fontWeight: 900, color: '#ffffff', letterSpacing: '2px' },
  arrowBox: { display: 'flex', gap: '10px' },
  arrowBtn: { backgroundColor: 'transparent', border: '1px solid #333333', color: '#ffffff', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease' },
  sliderWindow: { width: '100%', overflow: 'visible' },
  cardsGrid: { display: 'flex', gap: '20px', width: '100%', transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)', willChange: 'transform' },
  cardWrapper: { flex: '0 0 calc(25% - 15px)', height: '220px', position: 'relative' },
  card: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#ffffff', border: '1px solid #1c1c1c', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)', display: 'flex', padding: '15px', transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)' },
  imageSection: { width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: '#ffffff', position: 'relative' },
  image: { width: '100%', height: '100%', objectFit: 'contain' },
  
  // NUEVOS ESTILOS PARA EL OVERLAY PREMIUM TRASPARENTE
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(8px)',
    transition: 'opacity 0.3s ease', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // Permite que el click traspase al contenedor principal de la card
  },
  viewBadge: {
    backgroundColor: '#00000000',
    color: '#ffffff',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '1px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  viewText: {
    fontWeight: 800,
  },

  infoSection: { width: '50%', height: '100%', paddingLeft: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  brandTag: { fontSize: '10px', fontWeight: 800, color: '#FF5722', letterSpacing: '1px' },
  productName: { fontSize: '13px', fontWeight: 700, color: '#000000', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  footerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '10px' },
  priceTag: { fontSize: '15px', fontWeight: 800, color: '#000000' },
  buyBtn: { backgroundColor: '#000000', color: '#ffffff', border: 'none', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }
};