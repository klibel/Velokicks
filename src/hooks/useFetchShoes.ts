import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Shoe } from '../types/shoe';

export const useFetchShoes = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Record<string, Shoe>>('https://raw.githubusercontent.com/iffi96/Shoe-store-data-json/master/data004.json')
      .then((response) => {
        // Transformamos el objeto indexado en un array plano de JavaScript
        const flatArray = Object.values(response.data);
        setShoes(flatArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shoes data:", err);
        setError("No se pudo cargar el catálogo deportivo.");
        setLoading(false);
      });
  }, []);

  return { shoes, loading, error };
};