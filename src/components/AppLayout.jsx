import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Badge, Switch, Drawer } from 'antd';
import { STORAGE_BASE_URL } from '../utils/apiClient';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined,
  CarOutlined,
  TeamOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  SecurityScanOutlined,
  BankOutlined,
  FieldTimeOutlined,
  TagOutlined,
  DollarOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
// ✅ FASE 3: Path aliases + Zustand
import { useAuth } from '@stores/authStore';
import { useAuthInfo } from '@hooks/useAuthInfo';
import { useTheme } from '@stores/themeStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { permissionService } from '../services/permissionService';
import { preloadRoute } from '../utils/preloadRoutes';

// ✅ OPTIMIZACIÓN: Definir importaciones para preload anticipado
const routeImports = {
  '/dashboard': () => import('../features/dashboard').then(m => ({ default: m.Dashboard })),
  '/usuarios': () => import('../features/usuarios').then(m => ({ default: m.UserList })),
  '/roles': () => import('../features/roles'),
    '/companies': () => import('../features/empresas'),
  '/registros': () => import('../features/registros'),
  '/ingresos': () => import('../features/ingresos').then(m => ({ default: m.IngresoList })),
  // ✅ MIGRADO A FEATURES: Tolerancias ahora usa arquitectura modular
  '/tolerancias': () => import('../features/configuracion/tolerancias').then(m => ({ default: m.ToleranceList })),
  '/tipos-vehiculo': () => import('../features/vehicleTypes').then(m => ({ default: m.VehicleTypeListSimple })),
  '/vehiculos': () => import('../features/vehiculos').then(m => ({ default: m.VehicleListSimple })),
    '/owners': () => import('../features/propietarios'),
  '/reportes': () => import('../features/reportes'),
  '/salidas': () => import('../features/salidas'),
  '/observaciones': () => import('../features/observaciones').then(m => ({ default: m.ObservacionesList })),
};

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const { user, logout } = useAuth();
  const { userInfo } = useAuthInfo();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ OPTIMIZACIÓN: useCallback - Detectar si estamos en dispositivo móvil
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // ✅ OPTIMIZACIÓN: useCallback - Cargar permisos del usuario
  const loadUserPermissions = useCallback(async () => {
    if (user?.id) {
      try {
        const response = await permissionService.getUserPermissions(user.id);
        if (response.success) {
          let permsData = response.data;
          
          // Manejar diferentes estructuras de respuesta
          if (permsData && typeof permsData === 'object' && !Array.isArray(permsData)) {
            const possibleArrayKeys = ['permissions', 'data', 'items'];
            for (const key of possibleArrayKeys) {
              if (Array.isArray(permsData[key])) {
                permsData = permsData[key];
                break;
              }
            }
          }
          
          const permsArray = Array.isArray(permsData) ? permsData : [];
          const permissionSlugs = permsArray.map(p => p.slug || p);
          setUserPermissions(permissionSlugs);
        }
      } catch (error) {
        console.error('Error al cargar permisos:', error);
        setUserPermissions([]);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    loadUserPermissions();
  }, [loadUserPermissions]);

  // ✅ OPTIMIZACIÓN: useCallback - Verificar permisos
  const hasPermission = useCallback((permissionSlug) => {
    // SUPERUSUARIO (idrol === 1) tiene todos los permisos
    if (userInfo?.idrol === 1) return true;
    // Verificar si el usuario tiene el permiso específico
    return userPermissions.includes(permissionSlug);
  }, [userInfo?.idrol, userPermissions]);

  // ✅ OPTIMIZACIÓN: useCallback - Manejar navegación con preload
  const handleMobileNavigation = useCallback((path) => {
    navigate(path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [navigate, isMobile]);

  // ✅ OPTIMIZACIÓN: useCallback - Precargar ruta al hacer hover
  const handleMenuHover = useCallback((path) => {
    const importFn = routeImports[path];
    if (importFn) {
      // Precargar el componente de forma silenciosa
      preloadRoute(importFn, path).catch(err => {
        console.warn(`Error precargando ${path}:`, err);
      });
    }
  }, []);

  // ✅ OPTIMIZACIÓN: useMemo - Menu items con preload en hover
  // IMPORTANTE: Incluir userInfo en dependencias para recalcular cuando cambia el usuario
  const allMenuItems = useMemo(() => [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => handleMobileNavigation('/dashboard'),
      onMouseEnter: () => handleMenuHover('/dashboard'),
      permission: 'dashboard.view',
    },
    {
      key: '/usuarios',
      icon: <TeamOutlined />,
      label: 'Usuarios',
      onClick: () => handleMobileNavigation('/usuarios'),
      onMouseEnter: () => handleMenuHover('/usuarios'),
      permission: 'users.view',
    },
    {
      key: '/roles',
      icon: <SecurityScanOutlined />,
      label: 'Roles',
      onClick: () => handleMobileNavigation('/roles'),
      onMouseEnter: () => handleMenuHover('/roles'),
      permission: 'roles.view',
    },
    {
      key: '/registros',
      icon: <FileTextOutlined />,
      label: 'Registros',
      onClick: () => handleMobileNavigation('/registros'),
      onMouseEnter: () => handleMenuHover('/registros'),
      permission: 'registros.view',
    },
    {
      key: '/ingresos',
      icon: <DollarOutlined />,
      label: 'Ingresos',
      onClick: () => handleMobileNavigation('/ingresos'),
      onMouseEnter: () => handleMenuHover('/ingresos'),
      permission: 'ingresos.view',
    },
    {
      key: '/tolerancias',
      icon: <FieldTimeOutlined />,
      label: 'Tolerancias',
      onClick: () => handleMobileNavigation('/tolerancias'),
      onMouseEnter: () => handleMenuHover('/tolerancias'),
      permission: 'tolerancias.view',
    },
    {
      key: '/tipos-vehiculo',
      icon: <TagOutlined />,
      label: 'Tipos de Vehículo',
      onClick: () => handleMobileNavigation('/tipos-vehiculo'),
      onMouseEnter: () => handleMenuHover('/tipos-vehiculo'),
      permission: 'tipos-vehiculo.view',
    },
    {
      key: '/vehiculos',
      icon: <CarOutlined />,
      label: 'Vehículos',
      onClick: () => handleMobileNavigation('/vehiculos'),
      onMouseEnter: () => handleMenuHover('/vehiculos'),
      permission: 'vehiculos.view',
    },
    {
      key: '/reportes',
      icon: <BarChartOutlined />,
      label: 'Reportes',
      onClick: () => handleMobileNavigation('/reportes'),
      onMouseEnter: () => handleMenuHover('/reportes'),
      permission: 'reportes.view',
    },
    {
      key: '/salidas',
      icon: <FieldTimeOutlined />,
      label: 'Salidas',
      onClick: () => handleMobileNavigation('/salidas'),
      onMouseEnter: () => handleMenuHover('/salidas'),
      permission: 'salidas.view',
    },
    {
      key: '/observaciones',
      icon: <FileTextOutlined />,
      label: 'Observaciones',
      onClick: () => handleMobileNavigation('/observaciones'),
      onMouseEnter: () => handleMenuHover('/observaciones'),
      permission: 'observaciones.view',
    }
  ], [handleMobileNavigation, handleMenuHover, userInfo]);

  // ✅ OPTIMIZACIÓN: useMemo - All menu items con empresas incluido
  const allMenuItemsWithCompany = useMemo(() => {
    const items = [...allMenuItems];
    // Solo SUPERUSUARIO (idrol === 1) puede ver 'Empresas'
    if (userInfo?.idrol === 1) {
      items.splice(11, 0, {
        key: '/empresas',
        icon: <BankOutlined />,
        label: 'Empresas',
        onClick: () => handleMobileNavigation('/empresas'),
        onMouseEnter: () => handleMenuHover('/empresas'),
        permission: null, // Sin permiso específico, solo para SUPERUSUARIO
      });
    }
    return items;
  }, [allMenuItems, userInfo?.idrol, handleMobileNavigation, handleMenuHover]);

  // ✅ OPTIMIZACIÓN: useMemo - Filtrar items del menú según permisos
  // IMPORTANTE: Incluir userPermissions para recalcular cuando cambien los permisos
  const menuItems = useMemo(() => {
    return allMenuItemsWithCompany.filter(item => {
      // Si no tiene permiso específico (como Empresas), mostrar solo para SUPERUSUARIO
      if (!item.permission) {
        return userInfo?.idrol === 1;
      }
      // Verificar si tiene el permiso requerido
      return hasPermission(item.permission);
    });
  }, [allMenuItemsWithCompany, userInfo?.idrol, hasPermission, userPermissions]);

  // ✅ OPTIMIZACIÓN: useCallback - Handlers del user menu
  const handleProfile = useCallback(() => {
    navigate('/perfil');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // ✅ OPTIMIZACIÓN: useMemo - Items del dropdown del usuario
  const userMenuItems = useMemo(() => [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
      onClick: handleProfile,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: handleLogout,
      danger: true,
    },
  ], [handleProfile, handleLogout]);

  // ✅ OPTIMIZACIÓN: useMemo - Estilos (evita recrear objetos en cada render)
  const headerStyle = useMemo(() => ({
    padding: '0 24px',
    background: isDarkMode ? '#001529' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }), [isDarkMode]);

  const siderStyle = useMemo(() => ({
    background: isDarkMode ? '#001529' : '#ffffff',
  }), [isDarkMode]);

  const contentStyle = useMemo(() => ({
    margin: isMobile ? '16px' : '24px',
    padding: isMobile ? '16px' : '24px',
    minHeight: '80vh',
    background: isDarkMode ? '#141414' : '#ffffff',
    borderRadius: '8px',
    overflow: 'auto',
  }), [isDarkMode, isMobile]);

  // ✅ OPTIMIZACIÓN: useCallback - Handlers de menú
  const handleToggleCollapsed = useCallback(() => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setCollapsed(!collapsed);
    }
  }, [isMobile, mobileMenuOpen, collapsed]);

  // ✅ OPTIMIZACIÓN: useMemo - Company logo
  const companyLogo = useMemo(() => 
    userInfo?.empresa?.data?.logo, 
    [userInfo?.empresa?.data?.logo]
  );

  // ✅ Componente del menú (sin memo porque usa variables del scope padre)
  const MenuComponent = () => {
    return (
      <div>
        {/* Logo/Brand */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
          padding: collapsed && !isMobile ? '0' : '0 24px',
          borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
        }}>
          <CarOutlined style={{ 
            fontSize: '24px', 
            color: '#1890ff',
            marginRight: collapsed && !isMobile ? 0 : '12px'
          }} />
          {(!collapsed || isMobile) && (
            <Text strong style={{ 
              fontSize: '18px',
              color: isDarkMode ? '#fff' : '#1890ff'
            }}>
              Cochera 2025
            </Text>
          )}
        </div>

        {/* Logo de empresa arriba del menú, solo en desktop */}
        {!isMobile && (
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              margin: '18px 0 8px 0',
              padding: 0,
            }}
          >
            <img
              src={companyLogo ? `${STORAGE_BASE_URL}/${userInfo.empresa.data.logo}` : `${STORAGE_BASE_URL}/companies/garage.png`}
              alt="Logo empresa"

              style={{
                width: '80%',
                maxWidth: 120,
                maxHeight: 60,
                objectFit: 'contain',
                borderRadius: 8,
                border: '1px solid #eee',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0)',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>
        )}

        {/* Menú de navegación */}
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            borderRight: 0,
            height: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        />
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar para desktop */}
      {!isMobile && (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={siderStyle}
          width={280}
          collapsedWidth={80}
        >
          <MenuComponent />
        </Sider>
      )}

      {/* Drawer para móvil */}
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          bodyStyle={{ padding: 0 }}
          width={280}
          style={{
            zIndex: 1001,
          }}
        >
          <div style={{ background: isDarkMode ? '#001529' : '#ffffff', height: '100%' }}>
            <MenuComponent />
          </div>
        </Drawer>
      )}

      <Layout>
        <Header style={headerStyle}>
          {/* Botón de colapsar menú */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={handleToggleCollapsed}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </div>

          {/* Controles del header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Switch de tema */}
            <Space>
              <SunOutlined style={{ color: isDarkMode ? '#666' : '#1890ff' }} />
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                style={{
                  backgroundColor: isDarkMode ? '#1890ff' : '#f0f0f0',
                }}
              />
              <MoonOutlined style={{ color: isDarkMode ? '#1890ff' : '#666' }} />
            </Space>

            {/* Notificaciones */}
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px' }}
              />
            </Badge>

            {/* Dropdown del usuario */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer', padding: '8px' }}>
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: '#1890ff',
                  }}
                />
                <div style={{ display: !isMobile ? 'block' : 'none' }}>
                  <Text strong style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    {user?.name || 'Usuario'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content style={contentStyle}>
         {children}
        </Content>
      </Layout>
    </Layout>
  );
};

// ✅ OPTIMIZACIÓN: React.memo - Evitar re-renders innecesarios del layout completo
export default memo(AppLayout);