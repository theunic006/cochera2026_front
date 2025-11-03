/**
 * ✅ FASE 1: Índice de exportación de todos los hooks personalizados
 */

// Importar hooks para exportación default
import { useAuthInfo } from './useAuthInfo';
import { useDebounce } from './useDebounce';
import { useIngresoCalculations } from './useIngresoCalculations';

// Exportaciones individuales (named exports)
export { useAuthInfo } from './useAuthInfo';
export { useDebounce } from './useDebounce';
export { useIngresoCalculations } from './useIngresoCalculations';

// Exportación default (para imports: import hooks from './hooks')
export default {
  useAuthInfo,
  useDebounce,
  useIngresoCalculations
};
