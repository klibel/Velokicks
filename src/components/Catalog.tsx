import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiShoppingCart, FiRefreshCw, FiEye } from 'react-icons/fi';
import type { Shoe } from '../types/shoe';

gsap.registerPlugin(ScrollTrigger);

interface CatalogProps {
  shoes: Shoe[];
  onAddToCart: (shoe: Shoe) => void;
  onProductClick?: (shoe: Shoe) => void;
  currentQuery: string;
  onResetSearch: () => void;
}

export const Catalog: React.FC<CatalogProps> = ({ shoes, onAddToCart, onProductClick, currentQuery, onResetSearch }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Guardar una lista mezclada aleatoriamente que solo cambie si cambian los zapatos base
  const randomizedShoes = useMemo(() => {
    if (currentQuery) return shoes; 
    return [...shoes].sort(() => Math.random() - 0.5);
  }, [shoes, currentQuery]);

  // Calcular índices para rebanar el array por páginas
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = randomizedShoes.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Total de páginas necesarias
  const totalPages = Math.ceil(randomizedShoes.length / productsPerPage);

  // Resetear a la página 1 si se ejecuta una nueva búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [currentQuery]);

  // Animación GSAP al cambiar de página o de filtros
  useEffect(() => {
    const cards = gridRef.current?.children;
    if (cards && cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          }
        }
      );
    }
  }, [currentPage, shoes]);

  const handleViewProduct = (shoe: Shoe) => {
    onProductClick?.(shoe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section ref={catalogRef} id="shop-catalog" style={styles.catalogSection} className="catalog-container-media">
      
      {/* Encabezado */}
      <div style={styles.catalogHeader}>
        <div>
          <h2 style={styles.title}>NUESTRO CATÁLOGO</h2>
          <p style={styles.subtitle}>Explora las siluetas disponibles ({randomizedShoes.length})</p>
        </div>

        {currentQuery && (
          <div style={styles.filterBadge}>
            <span style={styles.badgeText}>Resultados para: "{currentQuery}"</span>
            <button onClick={onResetSearch} style={styles.resetInlineBtn}>
              <FiRefreshCw size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Renderizado de la tienda */}
      {randomizedShoes.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No encontramos ningún modelo que coincida con tu búsqueda.</p>
          <button onClick={onResetSearch} style={styles.resetMainBtn}>
            Ver todos los productos
          </button>
        </div>
      ) : (
        <>
          {/* ⚡ Rejilla de Productos con Clase CSS Responsiva */}
          <div ref={gridRef} style={styles.productsGrid} className="responsive-catalog-grid">
            {currentProducts.map((shoe) => (
            <div key={shoe.id} className="catalog-card-premium responsive-catalog-card" style={styles.card}>
              
              {/* ⚡ Añadida clase: responsive-img-section */}
              <div style={styles.imageSection} className="responsive-img-section" onClick={() => handleViewProduct(shoe)}>
                <img 
                  src={shoe.imageURL || 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop'} 
                  alt={shoe.name} 
                  style={styles.image} 
                />
                <div className="card-overlay-view">
                  <FiEye size={22} color="#ffffff" />
                  <span>VER DETALLES</span>
                </div>
              </div>
              
              {/* ⚡ Añadida clase: responsive-info-section */}
              <div style={styles.infoSection} className="responsive-info-section">
                <div onClick={() => handleViewProduct(shoe)} style={{ cursor: 'pointer' }}>
                  <span style={styles.brandTag}>{shoe.brand.toUpperCase()}</span>
                  <h3 style={styles.productName}>{shoe.name}</h3>
                </div>
                
                <div style={styles.footerRow}>
                  <span style={styles.priceTag}>${shoe.price}</span>
                  <button 
                    onClick={() => onAddToCart(shoe)} 
                    style={styles.buyBtn} 
                    className="premium-cart-btn"
                  >
                    <FiShoppingCart size={15} />
                  </button>
                </div>
              </div>

            </div>
          ))}
          </div>

          {/* Componente de Paginación Dinámica */}
          {totalPages > 1 && (
            <div style={styles.paginationContainer} className="pagination-box">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    ...styles.pageBtn,
                    backgroundColor: currentPage === page ? '#000000' : '#ffffff',
                    color: currentPage === page ? '#ffffff' : '#000000',
                    borderColor: currentPage === page ? '#000000' : '#e0e0e0',
                  }}
                  className={`page-number-btn ${currentPage === page ? 'active-page' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

     {/* ⚡ MEDIA QUERIES ACTUALIZADOS CON TRANSICIÓN A TARJETA HORIZONTAL (2 y 1 columna) */}
      <style>{`
        /* Por defecto en PC grandes: 4 columnas */
        .responsive-catalog-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        /* Laptops / Pantallas medianas (Máx 1100px): 3 columnas */
        @media (max-width: 1100px) {
          .responsive-catalog-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* ==================================================================
           ⚡ TABLETS (Máx 800px): 2 Columnas + Transformación a Tarjeta Horizontal
           ================================================================== */
        @media (max-width: 800px) {
          .responsive-catalog-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px 15px !important;
          }
          .catalog-container-media {
            padding: 50px 20px !important;
          }

          /* Forzamos que la tarjeta pase de columna a fila */
          .responsive-catalog-card {
            flex-direction: row !important;
            height: 180px !important; /* Altura fija compacta para el formato horizontal */
          }

          /* La imagen ahora toma el 50% del ancho y el 100% del alto */
          .responsive-catalog-card .responsive-img-section {
            width: 50% !important;
            height: 100% !important;
          }

          /* La información toma el 50% restante y se alinea horizontalmente */
          .responsive-catalog-card .responsive-info-section {
            width: 50% !important;
            height: 100% !important;
            padding: 12px !important;
          }
        }

        /* ==================================================================
           ⚡ MOBILE (Máx 500px): 1 Columna (Mantiene el formato horizontal premium)
           ================================================================== */
        @media (max-width: 500px) {
          .responsive-catalog-grid {
            grid-template-columns: repeat(1, 1fr) !important;
            gap: 12px !important;
          }
          .responsive-catalog-card {
            height: 150px !important; /* Un poco más baja en móviles para optimizar espacio */
          }
        }
      `}</style>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  catalogSection: { width: '100%', backgroundColor: '#ffffff', padding: '80px 50px', display: 'flex', flexDirection: 'column', transition: 'padding 0.3s' },
  catalogHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' },
  title: { fontSize: '24px', fontWeight: 900, color: '#000000', letterSpacing: '2px' },
  subtitle: { fontSize: '14px', color: '#666666', marginTop: '4px' },
  filterBadge: { display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', padding: '6px 14px' },
  badgeText: { fontSize: '12px', fontWeight: 600, color: '#000000', marginRight: '10px' },
  resetInlineBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#FF5722', display: 'flex', alignItems: 'center' },
  
  // ⚡ El layout estructural base se hereda, pero la cantidad de columnas ahora la maneja el CSS inyectado
  productsGrid: {
    gap: '30px 20px',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    display: 'flex',
    flexDirection: 'column',
    height: '380px', 
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
  },
  imageSection: { 
    width: '100%', 
    height: '60%', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden', 
    backgroundColor: '#fcfcfc',
    position: 'relative',
    cursor: 'pointer'
  },
  image: { width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s ease' },
  infoSection: { 
    width: '100%', 
    height: '40%', 
    padding: '15px', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between',
    backgroundColor: '#ffffff'
  },
  brandTag: { fontSize: '10px', fontWeight: 800, color: '#888888', letterSpacing: '1px' }, // Nota: Cambié a gris suave por contraste, cámbialo a #ffffff si usabas fondo oscuro en la etiqueta
  productName: { fontSize: '14px', fontWeight: 700, color: '#000000', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' },
  footerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5', paddingTop: '10px' },
  priceTag: { fontSize: '16px', fontWeight: 800, color: '#000000' },
  buyBtn: { backgroundColor: '#000000', color: '#ffffff', border: 'none', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease' },
  
  paginationContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '50px', width: '100%' },
  pageBtn: { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, border: '1px solid', cursor: 'pointer', transition: 'all 0.2s ease' },

  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', width: '100%' },
  emptyText: { fontSize: '15px', color: '#666666', marginBottom: '20px' },
  resetMainBtn: { backgroundColor: '#000000', color: '#ffffff', border: 'none', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }
};