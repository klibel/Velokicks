import React, { useRef, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { gsap } from 'gsap';

// Declaramos la interfaz limpia aquí con todo lo que necesita usar el componente
interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFloating?: boolean; // Añadido como opcional por si no se pasa en todos lados
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, isFloating = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFloating && containerRef.current) {
      // Animación GSAP premium cuando el buscador se inyecta en el Navbar
      gsap.fromTo(containerRef.current,
        { y: -15, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isFloating]);

  const handleFocus = () => {
    gsap.to(inputRef.current, { 
      borderColor: '#FF5722', 
      backgroundColor: isFloating ? '#ffffff' : 'rgba(255,255,255,0.02)',
      duration: 0.3 
    });
  };

  const handleBlur = () => {
    gsap.to(inputRef.current, { 
      borderColor: isFloating ? '#e0e0e0' : '#333333', 
      backgroundColor: isFloating ? '#f5f5f5' : 'transparent',
      duration: 0.3 
    });
  };

  return (
    <div ref={containerRef} style={isFloating ? styles.floatingWrapper : styles.wrapper}>
      <FiSearch style={isFloating ? styles.floatingIcon : styles.icon} />
      <input
        ref={inputRef}
        type="text"
        placeholder="BUSCAR SILUETAS..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={isFloating ? styles.floatingInput : styles.input}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%', // Evita desbordamiento en mobile
    marginTop: '30px',
  },
  floatingWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
  input: {
    width: '100%',
    padding: '16px 20px 16px 50px',
    backgroundColor: 'transparent',
    border: '2px solid #333333',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '1px',
    borderRadius: '0px',
    outline: 'none',
  },
  floatingInput: {
    width: '280px', // Un poco más grande como solicitaste
    padding: '10px 16px 10px 42px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    color: '#000000',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '0px',
    outline: 'none',
  },
  icon: {
    position: 'absolute',
    left: '18px',
    color: '#666666',
    fontSize: '18px',
  },
  floatingIcon: {
    position: 'absolute',
    left: '14px',
    color: '#999999',
    fontSize: '16px',
    zIndex: 10,
  }
};