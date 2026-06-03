import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FiSearch, FiShoppingCart, FiX, FiMenu } from 'react-icons/fi';

interface NavbarProps {
  cartCount: number;
  onSearchSubmit: (query: string) => void;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onSearchSubmit, onCartClick }) => {
  const [isExpandedPC, setIsExpandedPC] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [isMenuOpenMobile, setIsMenuOpenMobile] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  
  const searchContainerRefPC = useRef<HTMLFormElement>(null);
  const inputRefPC = useRef<HTMLInputElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // 1. Scroll Suave compartido a secciones
  const scrollToSection = (id: string) => {
    setIsMenuOpenMobile(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 2. Control del Buscador Expansivo en PC (GSAP)
  useEffect(() => {
    if (window.innerWidth > 768) {
      if (isExpandedPC) {
        gsap.to(searchContainerRefPC.current, { width: '280px', duration: 0.4, ease: 'power3.out' });
        inputRefPC.current?.focus();
      } else {
        gsap.to(searchContainerRefPC.current, { width: '40px', duration: 0.3, ease: 'power2.inOut' });
      }
    }
  }, [isExpandedPC]);

  // 3. Control del Modal Apple en Móvil (GSAP)
  useEffect(() => {
    if (isSearchOpenMobile) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(mobileModalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpenMobile]);

  // 4. Control del Menú Desplegable Móvil (GSAP height: auto simulado)
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMenuOpenMobile) {
        gsap.fromTo(mobileMenuRef.current, 
          { height: 0, opacity: 0 }, 
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      } else {
        gsap.to(mobileMenuRef.current, { height: 0, opacity: 0, duration: 0.2, ease: 'power2.in' });
      }
    }
  }, [isMenuOpenMobile]);

  // Submit de búsquedas (PC y Móvil)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localQuery);
    setIsSearchOpenMobile(false);
    setIsExpandedPC(false);
    scrollToSection('shop-catalog');
  };

  return (
    <>
      <nav style={styles.navBar} className="main-navbar">
        {/* LOGO */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={styles.logoRow}>
          <h1 style={styles.logo}>VELOKICKS.</h1>
        </div>

        {/* LINKS DE PC */}
        <div style={styles.menuLinks} className="nav-links-desktop">
          <span onClick={() => scrollToSection('shop-catalog')} style={styles.navLink} className="hover-link">PRODUCTOS</span>
          <span onClick={() => scrollToSection('app-footer')} style={styles.navLink} className="hover-link">CONTACTO</span>
        </div>

        {/* ACCIONES DE LA DERECHA */}
        <div style={styles.actionsRow}>
          
          {/* BUSCADOR EXPANSIVO (SOLO SE MUESTRA EN PC) */}
          <form 
            ref={searchContainerRefPC} 
            onSubmit={handleSearchSubmit} 
            style={styles.searchFormPC}
            className={`navbar-search-form-pc ${isExpandedPC ? 'is-active-pc' : ''}`}
          >
            <input
              ref={inputRefPC}
              type="text"
              placeholder="Buscar calzado..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              style={styles.navInputPC}
            />
            <button 
              type="button" 
              onClick={() => setIsExpandedPC(!isExpandedPC)} 
              style={styles.iconBtn}
            >
              {isExpandedPC ? <FiX size={16} onClick={() => { setLocalQuery(''); onSearchSubmit(''); }} /> : <FiSearch size={18} />}
            </button>
          </form>

          {/* LUPA DISPARADORA (SOLO EN MÓVIL) */}
          <button 
            onClick={() => setIsSearchOpenMobile(true)} 
            style={styles.iconBtn} 
            className="mobile-only-action"
          >
            <FiSearch size={20} color="#000000" />
          </button>

          {/* CARRITO */}
          <button onClick={onCartClick} style={{ ...styles.cartContainer, background: 'none', border: 'none', cursor: 'pointer' }}>
            <FiShoppingCart size={20} color="#000000" />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>

          {/* MENÚ HAMBURGUESA (SOLO EN MÓVIL) */}
          <button 
            onClick={() => setIsMenuOpenMobile(!isMenuOpenMobile)} 
            style={styles.iconBtn} 
            className="mobile-only-action"
          >
            {isMenuOpenMobile ? <FiX size={22} color="#000000" /> : <FiMenu size={22} color="#000000" />}
          </button>
        </div>
      </nav>

      {/* MENÚ DESPLEGABLE MÓVIL (HEIGHT: AUTO) */}
      <div ref={mobileMenuRef} style={styles.mobileMenuDropdown} className="mobile-menu-dropdown">
        <div onClick={() => scrollToSection('shop-catalog')} style={styles.mobileMenuLink}>PRODUCTOS</div>
        <div onClick={() => scrollToSection('app-footer')} style={styles.mobileMenuLink}>CONTACTO</div>
      </div>

      {/* MODAL SEARCH FULLSCREEN ESTILO APPLE (SOLO MÓVIL) */}
      {isSearchOpenMobile && (
        <div ref={mobileModalRef} style={styles.appleModal} className="search-backdrop-blur">
          <button onClick={() => setIsSearchOpenMobile(false)} style={styles.closeAppleBtn}>
            <FiX size={24} />
          </button>

          <div style={styles.appleModalContent}>
            <span style={styles.appleMeta}>BUSCADOR GLOBAL</span>
            <form onSubmit={handleSearchSubmit} style={styles.appleForm}>
              <input 
                ref={mobileInputRef}
                type="text" 
                placeholder="Escribe Nike, Adidas, Retro..." 
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                style={styles.appleInput}
              />
              <button type="submit" style={styles.appleSubmitBtn}>
                <FiSearch size={22} />
              </button>
            </form>
            <p style={styles.appleHelp}>Presiona buscar para filtrar el catálogo.</p>
          </div>
        </div>
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navBar: {
    width: '100%', height: '75px', backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { fontSize: '20px', fontWeight: 900, letterSpacing: '2px', color: '#000000', cursor: 'pointer' },
  menuLinks: { display: 'flex', gap: '35px' },
  navLink: { fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#000000', cursor: 'pointer' },
  actionsRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' },
  
  // Buscador PC
  searchFormPC: {
    position: 'relative', display: 'flex', alignItems: 'center', height: '38px',
    backgroundColor: '#f5f5f5', padding: '0 10px', border: '1px solid #e5e5e5', overflow: 'hidden'
  },
  navInputPC: { width: '100%', height: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: '#000000' },
  
  // Carrito
  cartContainer: { position: 'relative', display: 'flex', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#FF5722', color: '#ffffff', fontSize: '10px', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  // Menú desplegable Móvil
  mobileMenuDropdown: {
    position: 'fixed', top: '75px', left: 0, width: '100%', backgroundColor: '#ffffff',
    borderBottom: '1px solid #eee', zIndex: 99, overflow: 'hidden', display: 'none', flexDirection: 'column'
  },
  mobileMenuLink: { padding: '18px 24px', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', borderBottom: '1px solid #fafafa', color: '#000000' },

  // Modal Apple Móvil
  appleModal: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.97)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
  },
  closeAppleBtn: { position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#000000', cursor: 'pointer' },
  appleModalContent: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column' },
  appleMeta: { color: '#FF5722', fontSize: '10px', fontWeight: 800, letterSpacing: '2px', marginBottom: '10px' },
  appleForm: { display: 'flex', alignItems: 'center', borderBottom: '2px solid #000000', paddingBottom: '8px', position: 'relative' },
  appleInput: { width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '20px', fontWeight: 700, color: '#000000', paddingRight: '40px' },
  appleSubmitBtn: { position: 'absolute', right: 0, background: 'none', border: 'none', color: '#000000' },
  appleHelp: { color: '#888888', fontSize: '12px', marginTop: '12px' }
};