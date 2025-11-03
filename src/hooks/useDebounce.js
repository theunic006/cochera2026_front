import { useState, useEffect } from 'react';

/**
 * Hook personalizado para implementar debounce en valores que cambian frecuentemente
 * 
 * @param {any} value - El valor a debounce (ej: término de búsqueda)
 * @param {number} delay - Milisegundos de espera antes de actualizar (default: 500ms)
 * @returns {any} - El valor debounced
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     // Solo se ejecuta 500ms después de que el usuario deje de escribir
 *     buscarIngresos(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer un timeout para actualizar el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Cancelar el timeout si el valor cambia antes de que se cumpla el delay
    // Esto previene múltiples ejecuciones cuando el usuario sigue escribiendo
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
