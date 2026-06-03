import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiInstagram, FiGithub, FiMail, FiPhone } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLDivElement>(null);
  const gridItemsRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = gridItemsRef.current?.children;
    const bottomBar = bottomBarRef.current;

    if (items) {
      // Animación en cascada (stagger) para los 4 bloques principales del footer
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%', // Se activa cuando el footer asoma un 10% en pantalla
          }
        }
      );
    }

    if (bottomBar) {
      // Animación sutil de revelado para la barra de créditos final
      gsap.fromTo(bottomBar,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          }
        }
      );
    }
  }, []);

  return (
    <footer ref={footerRef} style={styles.footerContainer} className="footer-section">
      <div ref={gridItemsRef} style={styles.gridContainer} className="footer-grid">
        
        {/* Bloque 1: Identidad */}
        <div style={styles.block}>
          <h3 style={styles.brandLogo}>VELOKICKS.</h3>
          <p style={styles.description}>
            Elevando tu estilo urbano con las mejores siluetas de calzado del mercado. Rendimiento y diseño sin límites.
          </p>
        </div>

        {/* Bloque 2: Ayuda y Soporte */}
        <div style={styles.block}>
          <h4 style={styles.blockTitle}>AYUDA</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}><a href="#tracking" style={styles.link}>Seguimiento de Envíos</a></li>
            <li style={styles.listItem}><a href="#returns" style={styles.link}>Devoluciones y Garantía</a></li>
            <li style={styles.listItem}><a href="#faq" style={styles.link}>Preguntas Frecuentes</a></li>
          </ul>
        </div>

        {/* Bloque 3: Zona de Contacto */}
        <div style={styles.block}>
          <h4 style={styles.blockTitle}>CONTACTO</h4>
          <ul style={styles.list}>
            <li style={styles.contactItem}>
              <FiPhone size={14} style={styles.icon} /> <span>0412-1040377</span>
            </li>
            <li style={styles.contactItem}>
              <FiMail size={14} style={styles.icon} /> <span>klibel.a.romero@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Bloque 4: Redes Sociales */}
        <div style={styles.block}>
          <h4 style={styles.blockTitle}>SÍGUENOS</h4>
          <div style={styles.socialBox}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={styles.socialIcon} className="social-btn">
              <FiInstagram size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={styles.socialIcon} className="social-btn">
              <FiGithub size={18} />
            </a>
          </div>
        </div>

      </div>

      {/* Barra de Créditos Inferior */}
      <div ref={bottomBarRef} style={styles.bottomBar} className="footer-bottom">
        <p>&copy; {currentYear} VELOKICKS. Todos los derechos reservados.</p>
        <p style={styles.creatorTag}>
          Crafted by <a href="https://github.com" target="_blank" rel="noreferrer" style={styles.creatorLink}>Klibel's Code</a>
        </p>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footerContainer: {
    width: '100%',
    backgroundColor: '#000000',
    borderTop: '1px solid #1a1a1a',
    padding: '60px 50px 30px 50px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1.5fr 1fr',
    gap: '40px',
    paddingBottom: '40px',
    borderBottom: '1px solid #111111',
  },
  block: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandLogo: { color: '#ffffff', fontSize: '22px', fontWeight: 900, letterSpacing: '2px', marginBottom: '15px' },
  description: { color: '#888888', fontSize: '13px', lineHeight: '1.6', maxWidth: '280px' },
  blockTitle: { color: '#ffffff', fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '20px' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { marginBottom: '10px' },
  link: { color: '#888888', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s ease' },
  contactItem: { display: 'flex', alignItems: 'center', color: '#888888', fontSize: '13px', marginBottom: '12px' },
  icon: { marginRight: '10px', color: '#FF5722' },
  socialBox: { display: 'flex', gap: '15px' },
  socialIcon: { color: '#ffffff', backgroundColor: '#111111', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #222222', transition: 'all 0.3s ease' },
  bottomBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '25px', color: '#555555', fontSize: '12px' },
  creatorTag: { fontSize: '12px' },
  creatorLink: { color: '#888888', textDecoration: 'none', fontWeight: 600 }
};