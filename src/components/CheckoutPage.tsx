import React, { useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiCreditCard, FiSmartphone, FiCheckCircle, FiLock } from 'react-icons/fi';
import { FaPaypal } from 'react-icons/fa';
import { gsap } from 'gsap';

interface CheckoutPageProps {
  onBack: () => void;
}

type PaymentMethod = 'card' | 'paypal' | 'mobile';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack }) => {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const loadingBarRef = useRef<HTMLDivElement | null>(null);
  const successContentRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    paypalEmail: '',
    phone: '',
    idNumber: '',
    bank: '0102',
    reference: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/^(\d{2})/, '$1/');
    } else if (name === 'cardName') {
      formattedValue = value.toUpperCase();
    } else if (name === 'reference') {
      formattedValue = value.replace(/\D/g, '');
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
  };

  useEffect(() => {
    if (!isProcessing) return;

    const currentBar = loadingBarRef.current;

    if (currentBar) {
      const animation = gsap.fromTo(
        currentBar,
        { width: '0%' },
        {
          width: '100%',
          duration: 2.2,
          ease: 'power2.inOut',
          onComplete: () => {
            setIsProcessing(false);
            setIsSuccess(true);
            localStorage.removeItem('velokicks_cart');

            setTimeout(() => {
              if (successContentRef.current) {
                gsap.fromTo(
                  successContentRef.current,
                  { scale: 0.8, opacity: 0 },
                  { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
                );
              }
            }, 50);
          }
        }
      );

      return () => {
        animation.kill();
      };
    } else {
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        localStorage.removeItem('velokicks_cart');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  useEffect(() => {
    setIsFlipped(false);
  }, [method]);

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <div style={styles.logoBlockLeft}>
          <h1 style={styles.logo}>VELOKICKS.</h1>
        </div>
        <div style={styles.logoBlockRight}>
          <span style={styles.subtitle}><FiLock size={10} style={{ marginRight: 4 }} /> SECURE CHECKOUT</span>
        </div>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.checkoutLayout}>
          
          {isSuccess ? (
            <div ref={successContentRef} style={styles.successCard}>
              <FiCheckCircle size={64} color="#000000" />
              <h2 style={styles.successTitle}>¡ORDEN PROCESADA CON ÉXITO!</h2>
              <p style={styles.successDescription}>
                Tu pago simulado ha sido aprobado con éxito. Las siluetas seleccionadas han sido reservadas en el almacén de distribución.
              </p>
              <button type="button" onClick={() => window.location.reload()} style={styles.successBtn}>
                VOLVER AL INICIO
              </button>
            </div>
          ) : (
            <div style={styles.responsiveGrid}>
              
              {/* COLUMNA IZQUIERDA: FORMULARIO */}
              <div style={styles.formSection}>
                <h2 style={styles.sectionTitle}>MÉTODO DE PAGO</h2>
                
                {/* SELECTOR */}
                <div style={styles.methodSelector}>
                  <button 
                    type="button"
                    onClick={() => setMethod('card')}
                    style={{ ...styles.methodTab, ...(method === 'card' ? styles.activeTab : {}) }}
                  >
                    <FiCreditCard size={16} />
                    <span>TARJETA</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setMethod('paypal')}
                    style={{ ...styles.methodTab, ...(method === 'paypal' ? styles.activeTab : {}) }}
                  >
                    <FaPaypal size={14} />
                    <span>PAYPAL</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setMethod('mobile')}
                    style={{ ...styles.methodTab, ...(method === 'mobile' ? styles.activeTab : {}) }}
                  >
                    <FiSmartphone size={16} />
                    <span>PAGO MÓVIL</span>
                  </button>
                </div>

                {/* FORMULARIO MAESTRO */}
                <form onSubmit={handleProcessPayment} style={styles.formContainer}>
                  
                  {method === 'card' && (
                    <div style={styles.inputsGrid}>
                      <div style={{ ...styles.inputBox, width: '100%' }}>
                        <label style={styles.label}>NÚMERO DE TARJETA</label>
                        <input type="text" name="cardNumber" placeholder="4000 1234 5678 9010" maxLength={19} required value={formData.cardNumber} onFocus={() => setIsFlipped(false)} onChange={handleInputChange} style={styles.input} />
                      </div>
                      <div style={{ ...styles.inputBox, width: '100%' }}>
                        <label style={styles.label}>TITULAR DE LA TARJETA</label>
                        <input type="text" name="cardName" placeholder="EJ. APELLIDO NOMBRE" required value={formData.cardName} onFocus={() => setIsFlipped(false)} onChange={handleInputChange} style={styles.input} />
                      </div>
                      <div style={{ ...styles.inputBox, width: '48%' }}>
                        <label style={styles.label}>EXPIRACIÓN</label>
                        <input type="text" name="expiry" placeholder="MM/AA" maxLength={5} required value={formData.expiry} onFocus={() => setIsFlipped(false)} onChange={handleInputChange} style={styles.input} />
                      </div>
                      <div style={{ ...styles.inputBox, width: '48%' }}>
                        <label style={styles.label}>CVV</label>
                        <input type="password" name="cvv" placeholder="•••" maxLength={3} required value={formData.cvv} onFocus={() => setIsFlipped(true)} onChange={handleInputChange} style={styles.input} />
                      </div>
                    </div>
                  )}

                  {method === 'paypal' && (
                    <div style={styles.inputsGrid}>
                      <div style={{ ...styles.inputBox, width: '100%' }}>
                        <label style={styles.label}>CORREO ELECTRÓNICO PAYPAL</label>
                        <input type="email" name="paypalEmail" placeholder="tu-usuario@correo.com" required value={formData.paypalEmail} onChange={handleInputChange} style={styles.input} />
                      </div>
                      <p style={styles.infoText}>Al completar la orden, se abrirá de manera simulada la autenticación tokenizada de PayPal.</p>
                    </div>
                  )}

                  {method === 'mobile' && (
                    <div style={styles.inputsGrid}>
                      <div style={{ ...styles.inputBox, width: '48%' }}>
                        <label style={styles.label}>BANCO DESTINO</label>
                        <select name="bank" value={formData.bank} onChange={handleInputChange} style={styles.select}>
                          <option value="0102">BANCO DE VENEZUELA</option>
                          <option value="0105">MERCANTIL</option>
                          <option value="0108">PROVINCIAL</option>
                          <option value="0134">BANESCO</option>
                        </select>
                      </div>
                      <div style={{ ...styles.inputBox, width: '48%' }}>
                        <label style={styles.label}>CÉDULA DE IDENTIDAD</label>
                        <input type="text" name="idNumber" placeholder="V-12345678" required value={formData.idNumber} onChange={handleInputChange} style={styles.input} />
                      </div>
                      <div style={{ ...styles.inputBox, width: '100%' }}>
                        <label style={styles.label}>TELÉFONO EMISOR</label>
                        <input type="tel" name="phone" placeholder="04121234567" maxLength={11} required value={formData.phone} onChange={handleInputChange} style={styles.input} />
                      </div>
                      <div style={{ ...styles.inputBox, width: '100%' }}>
                        <label style={styles.label}>NÚMERO DE REFERENCIA (ÚLTIMOS 6 DÍGITOS)</label>
                        <input type="text" name="reference" placeholder="123456" maxLength={6} required value={formData.reference} onChange={handleInputChange} style={styles.input} />
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={isProcessing} style={{ ...styles.submitBtn, ...(isProcessing ? styles.disabledBtn : {}) }}>
                    {isProcessing ? 'PROCESANDO TRANSACCIÓN...' : 
                     method === 'card' ? 'CONFIRMAR Y PAGAR TARJETA' : 
                     method === 'paypal' ? 'LOGUEAR WITH PAYPAL' : 'CONFIRMAR PAGO MÓVIL'}
                  </button>
                </form>

                <div style={styles.navigationFooter}>
                  <button type="button" onClick={onBack} style={styles.backButtonAction}>
                    <FiArrowLeft size={14} /> VOLVER AL SHOPPING
                  </button>
                </div>
              </div>

              {/* COLUMNA DERECHA: TARJETA 3D */}
              <div style={styles.statusSection}>
                <h3 style={styles.statusTitle}>VISTA PREVIA DEL PAGO</h3>
                
                <div style={styles.cardContainer3D}>
                  <div style={{...styles.cardFlipInner, transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}>
                    {/* FRONTAL */}
                    <div style={styles.cardFront}>
                      <div style={styles.cardHeader}>
                        <div style={styles.cardChipRealist}>
                          <div style={styles.chipLineHorizontal} />
                          <div style={styles.chipLineVertical} />
                          <div style={styles.chipInnerCore} />
                        </div>
                        <span style={styles.cardTypeLabel}>PREMIUM LAB</span>
                      </div>
                      <div style={styles.cardNumberDisplay}>
                        {formData.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div style={styles.cardFooterDisplay}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={styles.cardMiniLabel}>TITULAR</span>
                          <span style={styles.cardHolderText}>{formData.cardName || 'Nombre del Titular'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={styles.cardMiniLabel}>EXP</span>
                          <span style={styles.cardHolderText}>{formData.expiry || 'MM/AA'}</span>
                        </div>
                      </div>
                    </div>
                    {/* REVERSO */}
                    <div style={styles.cardBack}>
                      <div style={styles.blackMagneticStrip} />
                      <div style={styles.cvvSignatureBar}>
                        <div style={styles.whiteStripPattern} />
                        <span style={styles.cvvTextDisplay}>{formData.cvv || '•••'}</span>
                      </div>
                      <p style={styles.cardBackLegalText}>Esta tarjeta virtual responde de manera tridimensional a foco de seguridad.</p>
                    </div>
                  </div>
                </div>

                <div style={styles.statusCard}>
                  <p style={styles.statusText}>
                    {method === 'card' && 'Simulador de Tarjeta de Crédito activo. Ingrese datos estructurados para simular el cobro electrónico.'}
                    {method === 'paypal' && 'Simulador de PayPal activo. Se requiere un correo válido para inicializar el checkout express.'}
                    {method === 'mobile' && 'Simulador de Pago Móvil Interbancario activo. Valide los últimos 6 dígitos de la referencia para conciliar.'}
                  </p>
                  
                  {isProcessing && (
                    <div style={styles.loaderContainer}>
                      <span style={styles.loaderLabel}>AUTENTICANDO TRANSACCIÓN...</span>
                      <div style={styles.loaderTrack}>
                        <div ref={loadingBarRef} style={styles.loaderBar} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: { 
    width: '100%', 
    minHeight: '100vh',
    backgroundColor: '#ffffff', 
    display: 'flex', 
    flexDirection: 'column', 
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '20px 5%', // Reducido un poco verticalmente para optimizar espacio móvil
    borderBottom: '1px solid #f2f2f2', 
    flexWrap: 'wrap', 
    gap: '15px',
    
    // ⚡ CONTROL ABSOLUTO FIXED PARA MÓVILES
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#ffffff', 
    zIndex: 1200 // Se eleva el zIndex para asegurar que ruede por encima de la tarjeta 3D
  },
  logoBlockLeft: { display: 'flex', justifyContent: 'flex-start' },
  logoBlockRight: { display: 'flex', justifyContent: 'flex-end' },
  logo: { fontSize: '20px', fontWeight: 900, letterSpacing: '3px', margin: 0, color: '#000000' },
  subtitle: { fontSize: '10px', fontWeight: 800, color: '#000000', letterSpacing: '1.5px', display: 'flex', alignItems: 'center' },
  
  mainContent: { 
    flex: 1, 
    width: '100%', 
    padding: '110px 5% 40px 5%', // ⚡ COLCHÓN DE ESPACIO: 110px arriba evita que el header fixed tape los inputs y títulos
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },
  checkoutLayout: { width: '100%', maxWidth: '1140px' },
  
  responsiveGrid: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '48px', 
    width: '100%' 
  },
  
  formSection: { flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '280px' },
  sectionTitle: { fontSize: '13px', fontWeight: 900, letterSpacing: '1.5px', margin: 0, color: '#000000' },
  
  methodSelector: { 
    display: 'flex', 
    gap: '8px', 
    width: '100%', 
    backgroundColor: '#f5f5f5', 
    padding: '4px', 
    borderRadius: '8px'
  },
  methodTab: { 
    flex: '1 1 0', 
    height: '42px', 
    backgroundColor: 'transparent', 
    border: 'none', 
    color: '#666666', 
    fontSize: '11px', 
    fontWeight: 700, 
    letterSpacing: '0.5px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px', 
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease-in-out'
  },
  activeTab: { 
    backgroundColor: '#ffffff', 
    color: '#000000',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
    fontWeight: 800
  },
  
  formContainer: { width: '100%', paddingTop: '10px' },
  inputsGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px 4%', width: '100%' },
  inputBox: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#111111' },
  input: { 
    height: '46px', 
    border: '1px solid #e5e5e5', 
    padding: '0 14px', 
    fontSize: '14px', 
    backgroundColor: '#ffffff', 
    outline: 'none', 
    borderRadius: '6px', 
    transition: 'border-color 0.2s ease',
    width: '100%'
  },
  select: { 
    height: '46px', 
    border: '1px solid #e5e5e5', 
    padding: '0 14px', 
    fontSize: '13px', 
    fontWeight: 600, 
    backgroundColor: '#ffffff', 
    outline: 'none', 
    cursor: 'pointer', 
    borderRadius: '6px',
    width: '100%'
  },
  infoText: { fontSize: '12px', color: '#666666', lineHeight: '1.6', margin: '10px 0 0 0' },
  
  submitBtn: { 
    width: '100%', 
    height: '50px', 
    backgroundColor: '#000000', 
    color: '#ffffff', 
    border: 'none', 
    fontSize: '12px', 
    fontWeight: 800, 
    letterSpacing: '1.5px', 
    cursor: 'pointer', 
    marginTop: '28px',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  disabledBtn: { backgroundColor: '#555555', cursor: 'not-allowed', boxShadow: 'none' },

  navigationFooter: { width: '100%', marginTop: '15px', borderTop: '1px solid #f2f2f2', paddingTop: '24px' },
  backButtonAction: { 
    border: 'none', 
    background: 'transparent', 
    color: '#666666', 
    fontSize: '11px', 
    fontWeight: 700, 
    letterSpacing: '1px', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '8px 0',
    transition: 'color 0.2s ease'
  },

  statusSection: { flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '280px' },
  statusTitle: { fontSize: '13px', fontWeight: 900, letterSpacing: '1.5px', margin: 0, color: '#000000' },
  
  cardContainer3D: { width: '100%', height: '250px', perspective: '1200px' },
  cardFlipInner: { width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' },
  
  cardFront: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', backgroundColor: '#000000', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' },
  cardBack: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', backgroundColor: '#0c0c0c', borderRadius: '16px', transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', gap: '15px', color: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', paddingTop: '24px' },
  
  cardChipRealist: { width: '40px', height: '30px', backgroundColor: '#e5c158', borderRadius: '6px', position: 'relative', border: '1px solid #c9a63b', overflow: 'hidden' },
  chipLineHorizontal: { position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', backgroundColor: '#aa871e' },
  chipLineVertical: { position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%', backgroundColor: '#aa871e' },
  chipInnerCore: { position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%', border: '1px solid #aa871e', borderRadius: '3px' },

  cardTypeLabel: { fontSize: '9px', fontWeight: 800, letterSpacing: '2px', color: '#aaaaaa' },
  cardNumberDisplay: { fontSize: '17px', fontWeight: 700, letterSpacing: '3px', margin: '20px 0', color: '#ffffff', fontFamily: 'monospace', width: '100%', textAlign: 'center' },
  cardFooterDisplay: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardMiniLabel: { fontSize: '8px', color: '#777777', letterSpacing: '1px', marginBottom: '2px' },
  cardHolderText: { fontSize: '12px', fontWeight: 700, letterSpacing: '1px' },
  
  blackMagneticStrip: { width: '100%', height: '40px', backgroundColor: '#000000' },
  cvvSignatureBar: { width: '85%', height: '36px', backgroundColor: '#ffffff', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px' },
  whiteStripPattern: { flex: 1, height: '100%', background: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #e5e5e5 10px, #e5e5e5 20px)' },
  cvvTextDisplay: { color: '#000000', fontWeight: 700, fontSize: '13px', fontStyle: 'italic', fontFamily: 'monospace' },
  cardBackLegalText: { fontSize: '7px', color: '#555555', textAlign: 'center', padding: '0 30px', margin: 0 },

  statusCard: { border: '1px solid #f0f0f0', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fafafa' },
  statusText: { fontSize: '12px', lineHeight: '1.6', color: '#666666', margin: 0 },
  
  loaderContainer: { display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' },
  loaderLabel: { fontSize: '10px', fontWeight: 800, color: '#000000', letterSpacing: '1px' },
  loaderTrack: { width: '100%', height: '3px', backgroundColor: '#e5e5e5', position: 'relative', overflow: 'hidden', borderRadius: '2px' },
  loaderBar: { position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#000000', width: '0%' },

  successCard: { width: '100%', maxWidth: '500px', margin: '40px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '1px solid #000000', borderRadius: '12px', padding: '48px 32px', backgroundColor: '#ffffff', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' },
  successTitle: { fontSize: '18px', fontWeight: 900, letterSpacing: '1px', margin: '24px 0 12px 0' },
  successDescription: { fontSize: '13px', lineHeight: '1.6', color: '#666666', marginBottom: '28px' },
  successBtn: { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', border: 'none', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', cursor: 'pointer', borderRadius: '6px' }
};