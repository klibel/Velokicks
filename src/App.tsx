import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar } from './components/NavBar';
import { HeroCarousel } from './components/HeroCarousel';
import { PopularProducts } from './components/PopularProducts';
import { Catalog } from './components/Catalog';
import { Footer } from './components/Footer';
import { ProductDetail } from './components/ProductDetails';
import { CartPanel } from './components/CartPanel';
import { CheckoutPage } from './components/CheckoutPage';
import { useFetchShoes } from './hooks/useFetchShoes';
import { gsap } from 'gsap';
import type { Shoe } from './types/shoe';

interface CartItem {
  shoe: Shoe;
  quantity: number;
}
// ... Todos tus imports se mantienen idénticos arriba

export default function App() {
  const { shoes, loading, error } = useFetchShoes();
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('velokicks_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [currentView, setCurrentView] = useState<'home' | 'checkout'>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Shoe | null>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.shoe.price * item.quantity), 0), [cart]);

  useEffect(() => {
    localStorage.setItem('velokicks_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const baseTitle = 'Velokicks | Calzado deportivo premium y carrito de compras';
    const baseDescription = 'Velokicks es tu tienda online de calzado deportivo premium: zapatillas para running, fútbol y entrenamiento con carrito persistente y checkout seguro.';

    let title = baseTitle;
    let description = baseDescription;

    if (currentView === 'checkout') {
      title = 'Checkout seguro | Velokicks';
      description = 'Finaliza tu compra de calzado deportivo premium con un checkout ágil y seguro en Velokicks.';
    }

    if (selectedProduct) {
      title = `${selectedProduct.name} - ${selectedProduct.brand} | Velokicks`;
      description = `Compra ${selectedProduct.name} de ${selectedProduct.brand} en Velokicks, con envío rápido y carrito persistente.`;
    }

    document.title = title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', description);
    }
  }, [currentView, selectedProduct]);

  const addToCart = (shoe: Shoe) => {
    setCart(prev => {
      const existing = prev.find(item => item.shoe.id === shoe.id);
      if (existing) {
        return prev.map(item => item.shoe.id === shoe.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { shoe, quantity: 1 }];
    });
  };

  const changeCartQuantity = (shoeId: number, delta: number) => {
    setCart(prev => prev.flatMap(item => {
      if (item.shoe.id !== shoeId) return [item];
      const nextQuantity = item.quantity + delta;
      if (nextQuantity <= 0) return [];
      return [{ ...item, quantity: nextQuantity }];
    }));
  };

  const removeFromCart = (shoeId: number) => {
    setCart(prev => prev.filter(item => item.shoe.id !== shoeId));
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const openHome = () => {
    setCurrentView('home');
  };

  const openCheckout = () => {
    setIsCartOpen(false);
    setSelectedProduct(null);
    setCurrentView('checkout');
  };

  const filteredShoes = shoes.filter((shoe) => {
    const query = searchTerm.toLowerCase().trim();
    return (
      shoe.name.toLowerCase().includes(query) ||
      shoe.brand.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (!loading && shoes.length > 0 && !selectedProduct) {
      gsap.fromTo(titleRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(textRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, [loading, shoes, selectedProduct]);

  if (currentView === 'checkout') {
    return <CheckoutPage onBack={openHome} />;
  }

  return (
    <div style={styles.appContainer}>
      
      {/* RENDERIZADO CONDICIONAL DE CONTENIDO DEBAJO DEL DRAWER GLOBAL */}
      {selectedProduct ? (
        <ProductDetail 
          product={selectedProduct} 
          allShoes={shoes} // ⚡ Pasamos toda la lista para las recomendaciones
          cartCount={cartCount} // ⚡ Pasamos el contador de ítems para el carrito local del navbar
          onCartNavigate={openCart} // ⚡ Función para desplegar el panel de compras desde el detalle
          onBack={() => setSelectedProduct(null)}
          onAddToCart={(shoe) => {
            addToCart(shoe);
            gsap.fromTo('nav button svg', { scale: 0.7 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
          }}  
          onProductSelect={(shoe) => setSelectedProduct(shoe)} // ⚡ El hook de actualización mágica sin recargar
        />
      ) : (
        <>
          <Navbar 
            cartCount={cartCount}
            onCartClick={openCart}
            onSearchSubmit={(query) => {
              setSearchTerm(query);
              const catalogSection = document.getElementById('shop-catalog');
              if (catalogSection) {
                catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />

          <main style={styles.mainContent}>
            {loading && (
              <div style={styles.centerSection}>
                <p style={styles.loadingText}>INICIALIZANDO CATÁLOGO DEPORTIVO...</p>
              </div>
            )}

            {error && (
              <div style={styles.centerSection}>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}
            
            {!loading && !error && (
              <>
                <section style={styles.heroSection} className="hero-split">
                  <div style={styles.heroLeft}>
                    <h1 ref={titleRef} style={styles.heroTitle}>VELOKICKS LAB.</h1>
                    <p ref={textRef} style={styles.heroSubtitle}>
                      Diseño aerodinámico e ingeniería de vanguardia para deportistas de alto rendimiento. Explora siluetas optimizadas para velocidad y control.
                    </p>
                  </div>
                  <div style={styles.heroRight}>
                    <HeroCarousel shoes={shoes} />
                  </div>
                </section>

                <PopularProducts 
                  shoes={shoes} 
                  onAddToCart={(product) => {
                    addToCart(product);
                    gsap.fromTo('nav button svg', { scale: 0.7 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
                  }}
                  onProductClick={(prod) => setSelectedProduct(prod)}
                />
              </>
            )}

            <div id="shop-catalog">
              <Catalog 
                shoes={filteredShoes} 
                onAddToCart={(product) => {
                  addToCart(product);
                  gsap.fromTo('nav button svg', { scale: 0.7 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
                }}
                onProductClick={(prod) => setSelectedProduct(prod)}
                currentQuery={searchTerm}
                onResetSearch={() => setSearchTerm('')}
              />
            </div>
          </main>
          
          <div id="app-footer">
            <Footer />
          </div>
        </>
      )}
      
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        cartCount={cartCount}
        totalPrice={cartTotal}
        onIncrease={(shoeId) => changeCartQuantity(shoeId, 1)}
        onDecrease={(shoeId) => changeCartQuantity(shoeId, -1)}
        onRemove={removeFromCart}
        onProceed={openCheckout}
      />
    </div>
  );
}

// ... Tus estilos abajo se mantienen exactamente iguales

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: { width: '100%', minHeight: '100vh', backgroundColor: '#ffffff', position: 'relative' },
  mainContent: { width: '100%' },
  centerSection: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  loadingText: { fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: '#000000' },
  errorText: { fontSize: '14px', fontWeight: 600, color: '#FF5722' },
  heroSection: { width: '100%', height: '55vh', display: 'flex', backgroundColor: '#000000', overflow: 'hidden' },
  heroLeft: { width: '50%', height: '100%', padding: '0 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
  heroRight: { width: '50%', height: '100%' },
  heroTitle: { fontSize: '52px', fontWeight: 900, letterSpacing: '-1px', color: '#ffffff', lineHeight: '1.1', marginBottom: '15px' },
  heroSubtitle: { fontSize: '15px', color: '#aaaaaa', maxWidth: '480px', lineHeight: '1.6' }
};