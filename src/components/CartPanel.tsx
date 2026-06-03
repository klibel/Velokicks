import React, { useRef, useEffect } from 'react';
import type { Shoe } from '../types/shoe';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiX } from 'react-icons/fi';
import { gsap } from 'gsap';

export interface CartItem {
  shoe: Shoe;
  quantity: number;
}

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  cartCount: number;
  totalPrice: number;
  onIncrease: (shoeId: number) => void;
  onDecrease: (shoeId: number) => void;
  onRemove: (shoeId: number) => void;
  onProceed: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  isOpen,
  onClose,
  items,
  cartCount,
  totalPrice,
  onIncrease,
  onDecrease,
  onRemove,
  onProceed,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Animación de apertura y cierre con GSAP
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'flex', ease: 'power2.out' });
      gsap.fromTo(sidebarRef.current, 
        { x: '100%' }, 
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = 'unset';
      gsap.to(sidebarRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none', ease: 'power2.in' });
    }
  }, [isOpen]);

  return (
    <div 
      ref={overlayRef} 
      onClick={onClose} 
      style={styles.overlay} 
      className="cart-overlay-blur"
    >
      <div 
        ref={sidebarRef} 
        onClick={(e) => e.stopPropagation()} 
        style={styles.sidebarContainer}
        className="cart-sidebar-responsive"
      >
        {/* HEADER */}
        <header style={styles.header}>
          <div>
            <span style={styles.badge}>TU BOLSA ({cartCount})</span>
            <h2 style={styles.title}>Carrito</h2>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} className="hover-orange">
            <FiX size={22} />
          </button>
        </header>

        {/* LISTA DE ITEMS */}
        <div style={styles.itemsContainer}>
          {items.length === 0 ? (
            <div style={styles.emptyState}>
              <FiShoppingCart size={40} color="#cccccc" style={{ marginBottom: 12 }} />
              <p style={styles.emptyLabel}>Tu bolsa está vacía</p>
              <span style={styles.emptyText}>Explora el catálogo para agregar siluetas.</span>
            </div>
          ) : (
            items.map(({ shoe, quantity }) => (
              <article key={shoe.id} style={styles.itemRow}>
                <div style={styles.imageBox}>
                  <img 
                    src={shoe.imageURL || (shoe as any).image} 
                    alt={shoe.name} 
                    style={styles.itemImage}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80";
                    }}
                  />
                </div>
                
                <div style={styles.itemInfo}>
                  <div style={styles.metaRow}>
                    <span style={styles.itemBrand}>{shoe.brand.toUpperCase()}</span>
                    <button type="button" onClick={() => onRemove(shoe.id)} style={styles.deleteInlineBtn} className="hover-orange">
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                  <h3 style={styles.itemName}>{shoe.name}</h3>
                  
                  {/* PRECIO UNITARIO (Para saber cuánto cuesta un solo zapato) */}
                  <span style={styles.unitPriceLabel}>
                    ${shoe.price.toLocaleString()} c/u
                  </span>
                  
                  <div style={styles.controlsRow}>
                    {/* CONTROLES CANTIDAD */}
                    <div style={styles.qtyContainer}>
                      <button type="button" onClick={() => onDecrease(shoe.id)} style={styles.qtyBtn}><FiMinus size={11} /></button>
                      <span style={styles.qty}>{quantity}</span>
                      <button type="button" onClick={() => onIncrease(shoe.id)} style={styles.qtyBtn}><FiPlus size={11} /></button>
                    </div>
                    
                    {/* PRECIO ACUMULADO GENERAL (Suma total de las cantidades de este producto) */}
                    <div style={styles.priceContainer}>
                      <span style={styles.itemPrice}>${(shoe.price * quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* FOOTER FIJO ABAJO */}
        <footer style={styles.footer}>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Subtotal estimado</span>
            <strong style={styles.totalValue}>${totalPrice.toLocaleString()}</strong>
          </div>
          <p style={styles.taxNotice}>Impuestos y envíos calculados al finalizar la compra.</p>
          <button 
            type="button"
            onClick={onProceed} 
            style={styles.checkoutBtn} 
            disabled={items.length === 0}
            className="premium-cart-btn"
          >
            PROCEDER AL PAGO
          </button>
        </footer>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 999999,
    display: 'none', justifyContent: 'flex-end',
  },
  sidebarContainer: {
    width: '440px', height: '100%', backgroundColor: '#ffffff',
    display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
    position: 'relative',
  },
  header: {
    padding: '24px', borderBottom: '1px solid #f5f5f5',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  badge: { fontSize: '10px', fontWeight: 800, letterSpacing: '1.5px', color: '#FF5722', display: 'block', marginBottom: '4px' },
  title: { fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#000000', display: 'flex', alignItems: 'center', padding: 4 },
  
  itemsContainer: { flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column' },
  emptyState: { margin: 'auto 0', textAlign: 'center', padding: '40px 0' },
  emptyLabel: { fontSize: '15px', fontWeight: 700, color: '#000000', marginBottom: '4px' },
  emptyText: { fontSize: '12px', color: '#888888' },
  
  itemRow: { display: 'flex', gap: '16px', padding: '20px 0', borderBottom: '1px solid #f9f9f9', alignItems: 'center' },
  imageBox: { width: '85px', height: '85px', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', overflow: 'hidden' },
  itemImage: { maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' },
  
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemBrand: { fontSize: '9px', fontWeight: 800, letterSpacing: '1px', color: '#999999' },
  deleteInlineBtn: { background: 'none', border: 'none', color: '#aaaaaa', cursor: 'pointer', padding: '2px 4px' },
  itemName: { fontSize: '13px', fontWeight: 700, color: '#000000', margin: 0, lineHeight: '1.3' },
  
  // ⚡ NUEVO ESTILO: Estilizado minimalista para el costo unitario
  unitPriceLabel: { fontSize: '11px', fontWeight: 600, color: '#888888', marginTop: '2px' },
  
  controlsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' },
  qtyContainer: { display: 'flex', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: '4px' },
  qtyBtn: { width: '28px', height: '26px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' },
  qty: { fontSize: '12px', fontWeight: 700, minWidth: '20px', textAlign: 'center' },
  
  priceContainer: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  itemPrice: { fontSize: '14px', fontWeight: 800, color: '#000000' },
  
  footer: { padding: '24px', borderTop: '1px solid #f5f5f5', backgroundColor: '#ffffff' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  totalLabel: { fontSize: '13px', fontWeight: 600, color: '#666666' },
  totalValue: { fontSize: '22px', fontWeight: 900, color: '#000000' },
  taxNotice: { fontSize: '11px', color: '#999999', marginBottom: '20px' },
  checkoutBtn: {
    width: '100%', height: '52px', backgroundColor: '#000000', color: '#ffffff',
    border: 'none', fontWeight: 800, fontSize: '12px', letterSpacing: '1px',
    cursor: 'pointer', transition: 'all 0.3s'
  }
};