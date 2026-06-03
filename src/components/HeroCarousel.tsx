import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { Shoe } from '../types/shoe';

interface CarouselProps {
  shoes: Shoe[];
}

export const HeroCarousel: React.FC<CarouselProps> = ({ shoes }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lógica técnica: Intercalamos los modelos para cumplir el flujo de rondas solicitado
  const sequentialShoes = React.useMemo(() => {
    const brands = ['NIKE', 'ADIDAS', 'PUMA'];
    const poolByBrand: { [key: string]: Shoe[] } = {};

    // Agrupamos hasta 2 modelos válidos por marca
    brands.forEach(brand => {
      poolByBrand[brand] = shoes
        .filter(s => s.brand.toUpperCase() === brand && s.imageURL)
        .slice(0, 2);
    });

    const orderedList: Shoe[] = [];
    const maxModels = 2; // Cantidad de opciones por marca

    // Intercalamos: Primero la opción 1 de todas las marcas, luego la opción 2
    for (let round = 0; round < maxModels; round++) {
      brands.forEach(brand => {
        if (poolByBrand[brand]?.[round]) {
          orderedList.push(poolByBrand[brand][round]);
        }
      });
    }

    return orderedList;
  }, [shoes]);

  useEffect(() => {
    if (sequentialShoes.length <= 1) return;

    const interval = setInterval(() => {
      // Animación de salida fluida con GSAP
      gsap.to(cardRef.current, {
        opacity: 0,
        x: 50,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setActiveIndex((prev) => (prev + 1) % sequentialShoes.length);
          
          // Animación de entrada imponente
          gsap.fromTo(cardRef.current,
            { opacity: 0, x: -50, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
          );
        }
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [sequentialShoes]);

  // Manejador del error 403 para evitar parches vacíos
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Reemplaza por una bota genérica de Unsplash que no tenga bloqueos si el servidor original responde 403
    e.currentTarget.src = 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop';
  };

  if (sequentialShoes.length === 0) return null;

  const currentShoe = sequentialShoes[activeIndex];

  return (
    <div style={styles.carouselContainer}>
      <div ref={cardRef} style={styles.card}>
        <div style={styles.imageWrapper}>
          <img 
            src={currentShoe?.imageURL} 
            alt={currentShoe?.name} 
            onError={handleImageError} 
            style={styles.image} 
          />
        </div>
        <div style={styles.info}>
          <span style={styles.brand}>{currentShoe?.brand}</span>
          <h3 style={styles.name}>{currentShoe?.name}</h3>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  carouselContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fondo blanco completo del 50% derecho
    padding: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0', // Bordes simétricos rígidos solicitados
    padding: '5px',
    width: '100%',
    maxWidth: '350px', // Tamaño único controlado para que se vea premium
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '1/1', // Cuadrado perfecto estricto
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    marginBottom: '15px',
  },
  image: {
    maxWidth: '95%',
    maxHeight: '95%',
    objectFit: 'contain',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: '1px solid #f0f0f0',
    padding: '15px',
  },
  brand: {
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '2px',
    color: '#FF5722', // Color de acento deportivo
  },
  name: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#000000',
    marginTop: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};