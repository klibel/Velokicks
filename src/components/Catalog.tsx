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
  const productsPerPage = 8; // Cambia este número si quieres mostrar 12, 16, etc.

  // Guardar una lista mezclada aleatoriamente que solo cambie si cambian los zapatos base
  const randomizedShoes = useMemo(() => {
    if (currentQuery) return shoes; // Si busca algo, respetamos el orden del filtro
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
    console.log(`Redirigiendo a /product/${shoe.id}`);
    // Aquí irá tu lógica de navegación futura: navigate(`/product/${shoe.id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Hacemos scroll suave al inicio del catálogo para comodidad del usuario
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
          {/* Rejilla de Productos con nueva distribución vertical */}
          <div ref={gridRef} style={styles.productsGrid} className="catalog-products-grid">
            {currentProducts.map((shoe) => (
              <div key={shoe.id} className="catalog-card-premium" style={styles.card}>
                
                {/* Zona de Imagen (Arriba) */}
                <div style={styles.imageSection} onClick={() => handleViewProduct(shoe)}>
                  <img 
                    src={shoe.imageURL || 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop'} 
                    alt={shoe.name} 
                    style={styles.image} 
                  />
                  {/* Capa decorativa de acción rápida */}
                  <div className="card-overlay-view">
                    <FiEye size={22} color="#ffffff" />
                    <span>VER DETALLES</span>
                  </div>
                </div>
                
                {/* Zona de Información (Abajo) */}
                <div style={styles.infoSection}>
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
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  catalogSection: { width: '100%', backgroundColor: '#ffffff', padding: '80px 50px', display: 'flex', flexDirection: 'column' },
  catalogHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' },
  title: { fontSize: '24px', fontWeight: 900, color: '#000000', letterSpacing: '2px' },
  subtitle: { fontSize: '14px', color: '#666666', marginTop: '4px' },
  filterBadge: { display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', padding: '6px 14px' },
  badgeText: { fontSize: '12px', fontWeight: 600, color: '#000000', marginRight: '10px' },
  resetInlineBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#FF5722', display: 'flex', alignItems: 'center' },
  
  // Grid simétrico de CSS real
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '30px 20px',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    display: 'flex',
    flexDirection: 'column', // Forzamos flujo de arriba a abajo
    height: '380px', // Tamaño unificado exacto para PC
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
  },
  imageSection: { 
    width: '100%', 
    height: '60%', // Ocupa la mayor parte proporcional arriba
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden', 
    backgroundColor: '#fcfcfc',
    position: 'relative',
    cursor: 'pointer'
  },
  image: { width: '85%', height: '85%', objectFit: 'contain', transition: 'transform 0.4s ease' },
  infoSection: { 
    width: '100%', 
    height: '40%', 
    padding: '15px', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between',
    backgroundColor: '#ffffff'
  },
  brandTag: { fontSize: '10px', fontWeight: 800, color: '#ffffff', letterSpacing: '1px' },
  productName: { fontSize: '14px', fontWeight: 700, color: '#000000', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' },
  footerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5', paddingTop: '10px' },
  priceTag: { fontSize: '16px', fontWeight: 800, color: '#000000' },
  buyBtn: { backgroundColor: '#000000', color: '#ffffff', border: 'none', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease' },
  
  // Paginación
  paginationContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '50px', width: '100%' },
  pageBtn: { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, border: '1px solid', cursor: 'pointer', transition: 'all 0.2s ease' },

  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', width: '100%' },
  emptyText: { fontSize: '15px', color: '#666666', marginBottom: '20px' },
  resetMainBtn: { backgroundColor: '#000000', color: '#ffffff', border: 'none', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }
};