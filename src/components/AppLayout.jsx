import { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { useAuthInfo } from '../hooks/useAuthInfo';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { permissionService } from '../services/permissionService';

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

  // Detectar si estamos en dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar permisos del usuario
  useEffect(() => {
    const loadUserPermissions = async () => {
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
    };

    loadUserPermissions();
  }, [user]);

  // Función para verificar si el usuario tiene un permiso
  const hasPermission = (permissionSlug) => {
    // SUPERUSUARIO (idrol === 1) tiene todos los permisos
    if (userInfo?.idrol === 1) return true;
    // Verificar si el usuario tiene el permiso específico
    return userPermissions.includes(permissionSlug);
  };

  // Función para manejar navegación en móvil
  const handleMobileNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Mostrar solo 'Empresas' si el usuario es SUPERUSUARIO (idrol === 1)
  // Menú base con permisos
  const allMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => handleMobileNavigation('/dashboard'),
      permission: 'dashboard.view',
    },
    {
      key: '/usuarios',
      icon: <TeamOutlined />,
      label: 'Usuarios',
      onClick: () => handleMobileNavigation('/usuarios'),
      permission: 'users.view',
    },
    {
      key: '/roles',
      icon: <SecurityScanOutlined />,
      label: 'Roles',
      onClick: () => handleMobileNavigation('/roles'),
      permission: 'roles.view',
    },
    {
      key: '/registros',
      icon: <FileTextOutlined />,
      label: 'Registros',
      onClick: () => handleMobileNavigation('/registros'),
      permission: 'registros.view',
    },
    {
      key: '/ingresos',
      icon: <DollarOutlined />,
      label: 'Ingresos',
      onClick: () => handleMobileNavigation('/ingresos'),
      permission: 'ingresos.view',
    },
    {
      key: '/tolerancias',
      icon: <FieldTimeOutlined />,
      label: 'Tolerancias',
      onClick: () => handleMobileNavigation('/tolerancias'),
      permission: 'tolerancias.view',
    },
    {
      key: '/tipos-vehiculo',
      icon: <TagOutlined />,
      label: 'Tipos de Vehículo',
      onClick: () => handleMobileNavigation('/tipos-vehiculo'),
      permission: 'tipos-vehiculo.view',
    },
    {
      key: '/vehiculos',
      icon: <CarOutlined />,
      label: 'Vehículos',
      onClick: () => handleMobileNavigation('/vehiculos'),
      permission: 'vehiculos.view',
    },
    {
      key: '/reportes',
      icon: <BarChartOutlined />,
      label: 'Reportes',
      onClick: () => handleMobileNavigation('/reportes'),
      permission: 'reportes.view',
    },
    {
      key: '/salidas',
      icon: <FieldTimeOutlined />,
      label: 'Salidas',
      onClick: () => handleMobileNavigation('/salidas'),
      permission: 'salidas.view',
    },
    {
      key: '/observaciones',
      icon: <FileTextOutlined />,
      label: 'Observaciones',
      onClick: () => handleMobileNavigation('/observaciones'),
      permission: 'observaciones.view',
    }
  ];

  // Solo SUPERUSUARIO (idrol === 1) puede ver 'Empresas'
  if (userInfo?.idrol === 1) {
    allMenuItems.splice(11, 0, {
      key: '/empresas',
      icon: <BankOutlined />,
      label: 'Empresas',
      onClick: () => handleMobileNavigation('/empresas'),
      permission: null, // Sin permiso específico, solo para SUPERUSUARIO
    });
  }

  // Filtrar items del menú según permisos del usuario
  const menuItems = allMenuItems.filter(item => {
    // Si no tiene permiso específico (como Empresas), mostrar solo para SUPERUSUARIO
    if (!item.permission) {
      return userInfo?.idrol === 1;
    }
    // Verificar si tiene el permiso requerido
    return hasPermission(item.permission);
  });

  // Items del dropdown del usuario
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
      onClick: () => navigate('/perfil'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: () => {
        logout();
        navigate('/login');
      },
      danger: true,
    },
  ];

  const headerStyle = {
    padding: '0 24px',
    background: isDarkMode ? '#001529' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const siderStyle = {
    background: isDarkMode ? '#001529' : '#ffffff',
  };

  const contentStyle = {
    margin: isMobile ? '16px' : '24px',
    padding: isMobile ? '16px' : '24px',
    minHeight: '80vh',
    background: isDarkMode ? '#141414' : '#ffffff',
    borderRadius: '8px',
    overflow: 'auto',
  };

  // Componente del menú para reutilizar
  const MenuComponent = () => {

  const companyLogo = userInfo?.empresa?.data?.logo;

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
              onClick={() => {
                if (isMobile) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
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

export default AppLayout;