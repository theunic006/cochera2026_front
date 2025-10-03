

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
  const [empresaLoading, setEmpresaLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      if (user?.id_company) {
        setEmpresaLoading(true);
        try {
          const data = await companyService.getCompanyById(user.id_company);
          setEmpresa(data);
          setUserInfo({ ...user, empresa: data });
        } catch (e) {
          setEmpresa(null);
          setUserInfo({ ...user, empresa: null });
        } finally {
          setEmpresaLoading(false);
        }
      } else {
        setEmpresa(null);
        setUserInfo({ ...user, empresa: null });
        setEmpresaLoading(false);
      }
    };
    fetchEmpresa();
  }, [user?.id_company]);

  return { userInfo, empresaLoading };
}
