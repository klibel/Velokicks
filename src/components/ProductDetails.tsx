import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { PopularProducts } from './PopularProducts';
import { Footer } from './Footer';
import type { Shoe } from '../types/shoe';

type ProductDetailShoe = Shoe & { description?: string };

interface ProductDetailProps {
  product: ProductDetailShoe;
  allShoes: Shoe[];
  onBack: () => void;
  onCartNavigate: () => void;
  cartCount: number;
  onAddToCart: (product: Shoe) => void;
  // ⚡ NUEVA PROP: Para cambiar el producto actual desde el carrusel sin recargar
  onProductSelect: (product: Shoe) => void; 
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  allShoes, 
  onBack, 
  onCartNavigate,
  cartCount,
  onAddToCart,
  onProductSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Animación de entrada fluida cada vez que el producto cambia
  useEffect(() => {
    // Scroll suave hacia arriba para simular cambio de página sin saltos bruscos
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Crear una línea de tiempo para sincronizar la transformación de datos
    const tl = gsap.timeline();

    tl.fromTo(imageRef.current,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power4.out' }
    );

    tl.fromTo(infoRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.5' // Se superpone ligeramente con la imagen para mayor dinamismo
    );

    return () => {
      tl.kill();
    };
  }, [product]); // ⚡ Se ejecuta limpiamente cada vez que cambia el ID o datos del producto

  // LÓGICA DE ZOOM ESTILO AMAZON CON GSAP
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    gsap.to(imageRef.current, {
      scale: 1.8,
      transformOrigin: `${x}% ${y}%`,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      transformOrigin: 'center center',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  // Transición animada al seleccionar un recomendado
  const handleSelectRecommended = (selectedShoe: Shoe) => {
    // 1. Animación de salida rápida de los datos viejos
    gsap.to([imageRef.current, infoRef.current], {
      opacity: 0,
      y: -15,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        // 2. Pasamos los datos al estado de la app de forma reactiva
        onProductSelect(selectedShoe);
      }
    });
  };

  return (
    <div ref={containerRef} style={styles.pageWrapper}>
      {/* NAVBAR MINIMALISTA SOLO LOGO */}
      <nav style={styles.minimalNav}>
        <div style={styles.navRow}>
          <h1 style={styles.logo} onClick={onBack}>VELOKICKS.</h1>
          <button onClick={onCartNavigate} style={styles.cartButton}>
            <FiShoppingCart size={20} color="black" />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* CONTENEDOR PRINCIPAL */}
      <div style={styles.mainView} className="detail-main-split">
        
        {/* ZONA IZQUIERDA: BOTÓN REGRESAR E IMAGEN GIGANTE */}
        <div style={styles.leftColumn}>
          <button onClick={onBack} style={styles.backBtn} className="back-btn-hover">
            <FiArrowLeft size={18} style={{ marginRight: '8px' }} />
            <span>REGRESAR AL CATÁLOGO</span>
          </button>
          
          <div 
            style={styles.imageContainer} 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="detail-image-box"
          >
            <img 
              ref={imageRef}
              src={product.imageURL} 
              alt={product.name} 
              style={styles.hugeImage}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";
              }}
            />
          </div>
        </div>

        {/* ZONA DERECHA: INFORMACIÓN Y COMPRA */}
        <div ref={infoRef} style={styles.rightColumn} className="detail-info-box">
          <div>
            <span style={styles.brandTag}>{product.brand.toUpperCase()}</span>
            <h2 style={styles.productTitle}>{product.name}</h2>
            <p style={styles.priceTag}>${product.price.toLocaleString()}</p>
            
            <div style={styles.divider} />
            
            <p style={styles.description}>
              {product.description || 
                "Silueta premium optimizada con sistemas de amortiguación reactiva de última generación. Ajuste ergonómico de alta precisión diseñado para máxima estabilidad en movimientos dinámicos."}
            </p>
          </div>

          <button 
            onClick={() => {
              onAddToCart(product);
              gsap.fromTo('.cart-action-btn-detail', { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'bounce.out' });
            }}
            style={styles.addToCartBtn}
            className="premium-cart-btn cart-action-btn-detail"
          >
            <FiShoppingCart size={18} style={{ marginRight: '10px' }} />
            AGREGAR AL CARRITO
          </button>
        </div>
      </div>

      {/* SECCIÓN DE RECOMENDADOS */}
      <div style={styles.recommendationsSection}>
        <div style={styles.recHeader}>
          <h3 style={styles.recTitle}>SILUETAS RECOMENDADAS</h3>
          <p style={styles.recSubtitle}>Completa tu rotación con lo más buscado en el laboratorio</p>
        </div>
        
        {/* 
          Asegúrate de que en tu componente PopularProducts, el botón de "Ver detalles" o la tarjeta 
          ejecute la función que le pases en `onProductSelect` (o la prop encargada de la navegación).
        */}
        <PopularProducts 
          shoes={allShoes.filter(item => item.id !== product.id)} // Evita recomendar el mismo zapato que ya estás viendo
          onAddToCart={(shoe) => {
            onAddToCart(shoe);
          }}
          
          onProductClick={handleSelectRecommended} // Aquí está la magia para cambiar el producto sin recargar 
        />
      </div>

      <Footer />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  minimalNav: {
    width: '100%',
    height: '75px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 50px',
  },
  navRow: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '20px', fontWeight: 900, letterSpacing: '2px', color: '#000000', cursor: 'pointer' },
  cartButton: { position: 'relative', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' },
  cartBadge: { position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#FF5722', color: '#ffffff', fontSize: '10px', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  mainView: {
    width: '100%',
    height: 'calc(100vh - 75px)', // Ocupa el 100% restante exacto de la vista
    display: 'flex',
    backgroundColor: '#ffffff',
  },
  leftColumn: {
    width: '55%',
    height: '100%',
    padding: '40px 50px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    borderRight: '1px solid #f5f5f5',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '1px',
    color: '#000000',
    cursor: 'pointer',
    marginBottom: '20px',
    width: 'max-content',
    transition: 'color 0.2s',
  },
  imageContainer: {
    width: '100%',
    flex: 1,
    overflow: 'hidden', // Importante para ocultar el excedente del zoom estilo Amazon
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    cursor: 'zoom-in',
  },
  hugeImage: {
    maxWidth: '85%',
    maxHeight: '85%',
    objectFit: 'contain',
    transition: 'transform 0.1s ease-out', // Suaviza micro-movimientos
  },
  
  rightColumn: {
    width: '45%',
    height: '100%',
    padding: '60px 50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandTag: { color: '#FF5722', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', display: 'block', marginBottom: '8px' },
  productTitle: { fontSize: '38px', fontWeight: 900, letterSpacing: '-1px', color: '#000000', lineHeight: '1.1', marginBottom: '10px' },
  priceTag: { fontSize: '24px', fontWeight: 800, color: '#000000' },
  divider: { width: '100%', height: '1px', backgroundColor: '#eeeeee', margin: '30px 0' },
  description: { fontSize: '14px', color: '#666666', lineHeight: '1.7', maxWidth: '460px' },
  addToCartBtn: {
    width: '100%',
    height: '55px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    fontSize: '13px',
    fontWeight: 800,
    letterSpacing: '1px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  
  recommendationsSection: {
    width: '100%',
    padding: '80px 0 20px 0',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #f0f0f0',
  },
  recHeader: { padding: '0 50px', marginBottom: '10px' },
  recTitle: { fontSize: '22px', fontWeight: 900, letterSpacing: '1px' },
  recSubtitle: { fontSize: '13px', color: '#888888', marginTop: '4px' }
};