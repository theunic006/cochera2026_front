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
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useAuthInfo } from '../hooks/useAuthInfo';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  // Función para manejar navegación en móvil
  const handleMobileNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Mostrar solo 'Empresas' si el usuario es SUPERUSUARIO (idrol === 1)
  // Menú base sin 'Empresas'
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => handleMobileNavigation('/dashboard'),
    },
    {
      key: '/usuarios',
      icon: <TeamOutlined />,
      label: 'Usuarios',
      onClick: () => handleMobileNavigation('/usuarios'),
    },
    {
      key: '/roles',
      icon: <SecurityScanOutlined />,
      label: 'Roles',
      onClick: () => handleMobileNavigation('/roles'),
    },
    {
      key: '/registros',
      icon: <FileTextOutlined />,
      label: 'Registros',
      onClick: () => handleMobileNavigation('/registros'),
    },
    {
      key: '/ingresos',
      icon: <DollarOutlined />,
      label: 'Ingresos',
      onClick: () => handleMobileNavigation('/ingresos'),
    },
    {
      key: '/tolerancias',
      icon: <FieldTimeOutlined />,
      label: 'Tolerancias',
      onClick: () => handleMobileNavigation('/tolerancias'),
    },
    {
      key: '/tipos-vehiculo',
      icon: <TagOutlined />,
      label: 'Tipos de Vehículo',
      onClick: () => handleMobileNavigation('/tipos-vehiculo'),
    },
    {
      key: '/vehiculos',
      icon: <CarOutlined />,
      label: 'Vehículos',
      onClick: () => handleMobileNavigation('/vehiculos'),
    },
    {
      key: '/reportes',
      icon: <BarChartOutlined />,
      label: 'Reportes',
      onClick: () => handleMobileNavigation('/reportes'),
    },
    {
      key: '/salidas',
      icon: <FieldTimeOutlined />,
      label: 'Salidas',
      onClick: () => handleMobileNavigation('/salidas'),
    },
    {
      key: '/observaciones',
      icon: <FileTextOutlined />,
      label: 'Observaciones',
      onClick: () => handleMobileNavigation('/observaciones'),
    },
    {
      key: '/configuracion-impresora',
      icon: <SettingOutlined />,
      label: 'Configuración Impresora',
      onClick: () => handleMobileNavigation('/configuracion-impresora'),
    },
    {
      key: '/ventas-ejemplo',
      icon: <FileTextOutlined />,
      label: 'Ventas Ejemplo',
      onClick: () => handleMobileNavigation('/ventas-ejemplo'),
    }
  ];
  // Solo SUPERUSUARIO (idrol === 1) puede ver 'Empresas'
  if (userInfo?.idrol === 1) {
    menuItems.splice(11, 0, {
      key: '/empresas',
      icon: <BankOutlined />,
      label: 'Empresas',
      onClick: () => handleMobileNavigation('/empresas'),
    });
  }

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