

import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { companyService } from '../services/companyService';

/**
 * Hook para obtener el usuario logueado y la información de la empresa
 * @returns { user, empresa }
 */
export function useAuthInfo() {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      if (user?.id_company) {
        try {
          const data = await companyService.getCompanyById(user.id_company);
          setEmpresa(data);
        } catch (e) {
          setEmpresa(null);
        }
      } else {
        setEmpresa(null);
      }
    };
    fetchEmpresa();
  }, [user?.id_company]);

  return { user, empresa };
}
