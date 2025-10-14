

import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useMemo, useRef } from 'react';
import { companyService } from '../services/companyService';

/**
 * Hook para obtener el usuario logueado y la información de la empresa
 * @returns { user, empresa }
 */
export function useAuthInfo() {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [empresaLoading, setEmpresaLoading] = useState(false);
  const prevUserIdRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const fetchEmpresa = async () => {
      if (user?.id_company) {
        setEmpresaLoading(true);
        try {
          const data = await companyService.getCompanyById(user.id_company);
          if (!cancelled) {
            setEmpresa(data);
          }
        } catch (e) {
          if (!cancelled) {
            setEmpresa(null);
          }
        } finally {
          if (!cancelled) {
            setEmpresaLoading(false);
          }
        }
      } else {
        if (!cancelled) {
          setEmpresa(null);
          setEmpresaLoading(false);
        }
      }
    };

    // Solo hacer fetch si el ID de la empresa cambió o es la primera vez
    const currentUserId = user?.id;
    const currentCompanyId = user?.id_company;
    
    if (!isInitializedRef.current || currentUserId !== prevUserIdRef.current) {
      isInitializedRef.current = true;
      prevUserIdRef.current = currentUserId;
      fetchEmpresa();
    }

    // Función de limpieza para cancelar operaciones pendientes
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.id_company]);

  // Memoizar userInfo para evitar recreaciones innecesarias
  const userInfo = useMemo(() => {
    if (!user) return null;
    return { ...user, empresa };
  }, [user, empresa]);

  return { userInfo, empresaLoading };
}
