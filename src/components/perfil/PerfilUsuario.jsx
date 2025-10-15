import React, { useEffect, useState, useCallback } from "react";
import { userService } from "../../services/userService";
import printerService from "../../services/printerService";
import ConfigImpresora from "./ConfigImpresora";
import UserForm from "../users/UserForm";
import { STORAGE_BASE_URL } from '../../utils/apiClient';

import { 
  Card, 
  Avatar, 
  Button, 
  Spin, 
  Alert, 
  Row, 
  Col, 
  Typography, 
  Divider, 
  Space,
  Tag,
  Statistic,
  Badge
} from "antd";
import { 
  UserOutlined, 
  EditOutlined, 
  BankOutlined, 
  MailOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SettingOutlined,
  StarOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import AppLayout from "../AppLayout";
import { useTheme } from "../../context/ThemeContext";

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installedPrinters, setInstalledPrinters] = useState([]);
  const [loadingPrinters, setLoadingPrinters] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { Title, Text, Paragraph } = Typography;
  const { isDarkMode } = useTheme();
  const isDark = isDarkMode;

  // Función para obtener impresoras desde el endpoint (memorizada)
  const loadPrinters = useCallback(async () => {
    setLoadingPrinters(true);
    try {
      const response = await printerService.getPrinters();
      
      if (response && response.success && response.data && Array.isArray(response.data)) {
        // Mapear los datos del endpoint al formato del Select
        const printers = response.data.map((printer, index) => {
          return {
            value: printer.name,
            label: printer.name
          };
        });

        // Agregar opción de no configurar
        printers.push({ value: 'Ninguna', label: '❌ Vacio' });
        
        setInstalledPrinters(printers);
      } else {
        console.log('⚠️ No se encontraron impresoras en la respuesta');
        setInstalledPrinters([
          { value: 'Ninguna', label: '❌ Vacio' }
        ]);
      }
    } catch (error) {
      console.error('🚨 Error al cargar impresoras:', error.message);
      
      // Fallback con impresoras comunes para poder probar
      const fallbackPrinters = [
        { value: 'Microsoft Print to PDF', label: 'Microsoft Print to PDF' },
        { value: 'T20', label: 'T20' },
        { value: 'Ninguna', label: '❌ Vacio' }
      ];
      
      setInstalledPrinters(fallbackPrinters);
      console.log('🔄 Usando datos de fallback debido a error');
    } finally {
      setLoadingPrinters(false);
    }
  }, []); // Dependencias vacías - solo se crea una vez

  // useEffect para cargar datos iniciales
  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones si el componente se desmonta
    
    const fetchUsuario = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      try {
        const id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : 1;
        const response = await userService.getUserById(id);
        if (response.success && response.data && isMounted) {
          setUsuario(response.data.data || response.data);
        } else if (isMounted) {
          setError("No se pudo obtener la información del usuario");
        }
      } catch (err) {
        if (isMounted) {
          setError("Error al conectar con el servidor");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const loadPrintersOnce = async () => {
      // NO cargar impresoras al inicio - solo cuando se necesiten
      console.log('🚫 Carga automática de impresoras deshabilitada para optimización');
    };

    // Solo ejecutar la carga del usuario
    fetchUsuario();
    // NO ejecutar loadPrintersOnce(); para optimización

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Dependencias vacías - solo se ejecuta una vez al montar

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Funciones para manejar el modal de editar perfil
  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCancelEditProfile = () => {
    setShowEditProfile(false);
  };

  // Funciones para manejar cambio de contraseña
  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordModal(false);
  };

  const handleSuccessPasswordChange = (updatedUserData) => {
    setShowPasswordModal(false);
    // No necesita actualizar datos del usuario, solo la contraseña
  };

  const handleSuccessEditProfile = (updatedUserData) => {
    // Actualizar el estado del usuario con los nuevos datos
    const updatedUser = {
      ...usuario,
      ...updatedUserData,
      // Preservar datos anidados que no se editan
      role: usuario.role,
      company: usuario.company
    };
    
    setUsuario(updatedUser);
    
    // Actualizar también el localStorage si existe
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedStoredUser = {
          ...parsedUser,
          name: updatedUserData.name || parsedUser.name,
          email: updatedUserData.email || parsedUser.email
        };
        localStorage.setItem("user", JSON.stringify(updatedStoredUser));
        console.log('✅ Usuario actualizado en localStorage y estado local');
      }
    } catch (error) {
      console.error('⚠️ Error al actualizar localStorage:', error);
    }
    
    setShowEditProfile(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Spin size="large" />
          <div style={{ marginLeft: 16, color: isDark ? '#fff' : '#000' }}>
            Cargando perfil...
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div style={{ padding: '40px 24px', maxWidth: 600, margin: '0 auto' }}>
          <Alert type="error" message={error} showIcon />
        </div>
      </AppLayout>
    );
  }

  if (!usuario) return null;

  // Datos del usuario con valores por defecto
  const name = usuario?.name || "Sin nombre";
  const email = usuario?.email || "Sin correo";
  const estado = usuario?.estado || "ACTIVO";
  const created_at = usuario?.created_at || "";
  const role = usuario?.role || {};
  const company = usuario?.company || {};

  // Colores del tema consistentes con ThemeContext
  const colors = {
    bg: isDark ? "#141414" : "#f5f5f5",
    cardBg: isDark ? "#1f1f1f" : "#ffffff",
    sidebarBg: isDark ? "#141414" : "#f6f8fa",
    border: isDark ? "#303030" : "#d9d9d9",
    text: isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.88)",
    textSecondary: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
    accent: "#1890ff"
  };

  return (
    <AppLayout>
      <div style={{ 
        background: colors.bg, 
        minHeight: 'calc(100vh - 64px)',
        padding: '24px 16px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            {/* Sidebar izquierdo - Información principal */}
            <Col xs={24} md={8} lg={6}>
              <Card
                style={{
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12
                }}
                styles={{ body: { padding: 24 } }}
              >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Badge 
                    status={estado === 'ACTIVO' ? 'success' : estado === 'SUSPENDIDO' ? 'error' : 'warning'}
                    offset={[-8, 8]}
                  >
                    <Avatar 
                      size={120} 
                      icon={<UserOutlined />}
                      style={{ 
                        background: isDark ? '#6f42c1' : '#6f42c1',
                        border: `4px solid ${colors.cardBg}`,
                        boxShadow: '0 0 0 2px ' + colors.border
                      }}
                    />
                  </Badge>
                  
                  <Title 
                    level={2} 
                    style={{ 
                      color: colors.text, 
                      marginTop: 16, 
                      marginBottom: 4 
                    }}
                  >
                    {name}
                  </Title>
                  
                  <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                    {role.descripcion || "Usuario"}
                  </Text>
                  
                  <div style={{ marginTop: 16 }}>
                    <Tag 
                      color={estado === 'ACTIVO' ? 'success' : estado === 'SUSPENDIDO' ? 'error' : 'warning'}
                      style={{ fontSize: 12 }}
                    >
                      {estado}
                    </Tag>
                  </div>
                </div>

                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    size="large"
                    style={{ 
                      width: '100%',
                      background: colors.accent,
                      borderColor: colors.accent,
                      height: '48px',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}
                    onClick={handleEditProfile}
                  >
                    Editar perfil
                  </Button>
                </Space>

                <Divider style={{ borderColor: colors.border }} />
                
                {/* Información de contacto y rol */}
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MailOutlined style={{ color: colors.textSecondary }} />
                    <Text style={{ color: colors.text, fontSize: 14 }}>{email}</Text>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined style={{ color: colors.textSecondary }} />
                    <Text style={{ color: colors.text, fontSize: 14 }}>
                      {role.descripcion || "Sin rol"}
                    </Text>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarOutlined style={{ color: colors.textSecondary }} />
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                      Registrado {formatDate(created_at)}
                    </Text>
                  </div>
                </Space>
              </Card>

              {/* Componente de configuración de impresoras */}
              <ConfigImpresora 
                company={company}
                usuario={usuario}
                setUsuario={setUsuario}
                colors={colors}
                installedPrinters={installedPrinters}
                loadingPrinters={loadingPrinters}
                loadPrinters={loadPrinters}
              />
            </Col>

            {/* Contenido principal */}
            <Col xs={24} md={16} lg={18}>
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                
                {/* Estadísticas rápidas - Estilo similar a UserList */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={12} sm={6}>
                    <Card
                      style={{
                        background: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 12,
                        textAlign: 'center'
                      }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <Statistic
                        title="Sesiones activas"
                        value={42}
                        prefix={<StarOutlined style={{ color: colors.accent }} />}
                        valueStyle={{ color: colors.text, fontSize: '24px', fontWeight: 'bold' }}
                        titleStyle={{ color: colors.textSecondary, fontSize: '12px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card
                      style={{
                        background: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 12,
                        textAlign: 'center'
                      }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <Statistic
                        title="Último acceso"
                        value="Hoy"
                        prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
                        valueStyle={{ color: colors.text, fontSize: '24px', fontWeight: 'bold' }}
                        titleStyle={{ color: colors.textSecondary, fontSize: '12px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card
                      style={{
                        background: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 12,
                        textAlign: 'center'
                      }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <Statistic
                        title="Proyectos"
                        value={8}
                        prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                        valueStyle={{ color: colors.text, fontSize: '24px', fontWeight: 'bold' }}
                        titleStyle={{ color: colors.textSecondary, fontSize: '12px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card
                      style={{
                        background: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 12,
                        textAlign: 'center'
                      }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <Statistic
                        title="Estado"
                        value={estado === 'ACTIVO' ? 'Activo' : estado}
                        prefix={<CheckCircleOutlined style={{ color: estado === 'ACTIVO' ? '#52c41a' : '#faad14' }} />}
                        valueStyle={{ color: colors.text, fontSize: '22px', fontWeight: 'bold' }}
                        titleStyle={{ color: colors.textSecondary, fontSize: '12px' }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Información completa de la empresa */}
                {company && (company.nombre || company.id) && (
                  <Card
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar size={32} icon={<BankOutlined />} style={{ background: colors.accent }} />
                        <span style={{ color: colors.text, fontSize: 18, fontWeight: 600 }}>
                          Información de la empresa
                        </span>
                      </div>
                    }
                    style={{
                      background: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12
                    }}
                    styles={{ 
                      header: { 
                        background: colors.sidebarBg, 
                        borderBottom: `1px solid ${colors.border}`,
                        borderRadius: '12px 12px 0 0'
                      },
                      body: { padding: 24 }
                    }}
                  >
                    <Row gutter={[32, 24]} align="middle">
                      <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                        {company.logo && (
                          <img
                            src={`${STORAGE_BASE_URL}/${company.logo}`}
                            alt="Logo empresa"
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: 'contain',
                              borderRadius: 12,
                              background: '#fff',
                              border: '2px solid #eee',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              marginBottom: 16
                            }}
                          />
                        )}
                        <Title level={3} style={{ color: colors.text, margin: 0 }}>
                          {company.nombre || "Sin nombre"}
                        </Title>
                        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                          {company.descripcion || "Sin descripción"}
                        </Text>
                      </Col>
                      <Col xs={24} md={16}>
                        <Row gutter={[24, 16]}>
                          <Col xs={24} sm={12}>
                            <div style={{ marginBottom: 16 }}>
                              <Text strong style={{ color: colors.text, display: 'block', marginBottom: 4 }}>
                                Ubicación
                              </Text>
                              <Text style={{ color: colors.textSecondary }}>{company.ubicacion || "No especificada"}</Text>
                            </div>
                          </Col>
                          <Col xs={24} sm={12}>
                            <div style={{ marginBottom: 16 }}>
                              <Text strong style={{ color: colors.text, display: 'block', marginBottom: 4 }}>
                                Estado
                              </Text>
                              <Tag color={company.estado === 'activo' ? 'success' : 'warning'}>
                                {company.estado || "No especificado"}
                              </Tag>
                            </div>
                          </Col>
                          <Col xs={24} sm={12}>
                            <div style={{ marginBottom: 16 }}>
                              <Text strong style={{ color: colors.text, display: 'block', marginBottom: 4 }}>
                                Capacidad
                              </Text>
                              <Text style={{ color: colors.textSecondary }}>
                                {company.capacidad !== undefined ? `${company.capacidad} vehículos` : "No especificada"}
                              </Text>
                            </div>
                          </Col>
                          <Col xs={24} sm={12}>
                            <div style={{ marginBottom: 16 }}>
                              <Text strong style={{ color: colors.text, display: 'block', marginBottom: 4 }}>
                                ID Empresa
                              </Text>
                              <Text style={{ color: colors.textSecondary }}>{company.id || "No disponible"}</Text>
                            </div>
                          </Col>
                          <Col xs={24} sm={12}>
                            <div style={{ marginBottom: 16 }}>
                              <Text strong style={{ color: colors.text, display: 'block', marginBottom: 4 }}>
                                Impresora Entrada
                              </Text>
                              <Text style={{ color: colors.textSecondary }}>{company.imp_input || "No configurada"}</Text>
                            </div>
                          </Col>
                          <Col xs={24} sm={12}>
                            <div style={{ marginBottom: 16 }}>
                              <Text strong style={{ color: colors.text, display: 'block', marginBottom: 4 }}>
                                Impresora Salida
                              </Text>
                              <Text style={{ color: colors.textSecondary }}>{company.imp_output || "No configurada"}</Text>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                )}

                {/* Lista de usuarios de la empresa */}
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar size={32} icon={<TeamOutlined />} style={{ background: '#722ed1' }} />
                      <span style={{ color: colors.text, fontSize: 18, fontWeight: 600 }}>
                        Mi equipo de trabajo
                      </span>
                    </div>
                  }
                  extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Tag color="success" style={{ margin: 0 }}>
                        1 usuario activo
                      </Tag>
                    </div>
                  }
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12
                  }}
                  styles={{ 
                    header: { 
                      background: colors.sidebarBg, 
                      borderBottom: `1px solid ${colors.border}`,
                      borderRadius: '12px 12px 0 0'
                    },
                    body: { padding: 24 }
                  }}
                >
                  {/* Usuario actual - Estilo mejorado */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 16, 
                    padding: 16, 
                    background: colors.sidebarBg, 
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <Avatar size={48} icon={<UserOutlined />} style={{ background: colors.accent }} />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ color: colors.text, display: 'block', fontSize: '16px' }}>
                        {name}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: '14px', display: 'block' }}>
                        {email}
                      </Text>
                      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag color="purple" size="small">
                          {role.descripcion || "Sin rol"}
                        </Tag>
                        <Tag color={estado === 'ACTIVO' ? 'success' : 'warning'} size="small">
                          {estado}
                        </Tag>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <Text style={{ color: colors.textSecondary, fontSize: '12px' }}>
                        Registrado
                      </Text>
                      <Text style={{ color: colors.text, fontSize: '13px', fontWeight: 500 }}>
                        {formatDate(created_at)}
                      </Text>
                    </div>
                  </div>
                </Card>

                {/* Actividad reciente */}
                <Card
                  title={
                    <span style={{ color: colors.text, fontSize: 18, fontWeight: 600 }}>
                      Actividad reciente
                    </span>
                  }
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12
                  }}
                  styles={{ 
                    header: { 
                      background: colors.sidebarBg, 
                      borderBottom: `1px solid ${colors.border}`,
                      borderRadius: '12px 12px 0 0'
                    },
                    body: { padding: 24 }
                  }}
                >
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div style={{ padding: 16, background: colors.sidebarBg, borderRadius: 8 }}>
                      <Text style={{ color: colors.text }}>
                        🎉 Perfil actualizado exitosamente
                      </Text>
                      <br />
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        Hace 2 horas
                      </Text>
                    </div>
                    
                    <div style={{ padding: 16, background: colors.sidebarBg, borderRadius: 8 }}>
                      <Text style={{ color: colors.text }}>
                        🔐 Inicio de sesión desde nueva ubicación
                      </Text>
                      <br />
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        Ayer a las 14:30
                      </Text>
                    </div>
                    
                    <div style={{ padding: 16, background: colors.sidebarBg, borderRadius: 8 }}>
                      <Text style={{ color: colors.text }}>
                        ⚙️ Configuración de cuenta actualizada
                      </Text>
                      <br />
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        Hace 3 días
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* Modal para editar perfil - Mejorado con mejor integración */}
      <UserForm
        visible={showEditProfile}
        onCancel={handleCancelEditProfile}
        onSuccess={handleSuccessEditProfile}
        isProfileEdit={true}
        currentUser={usuario}
        isDark={isDark}
        key={`profile-edit-${usuario?.id}`} // Key para forzar re-render cuando cambie el usuario
      />

      {/* Modal para cambiar solo contraseña */}
      <UserForm
        visible={showPasswordModal}
        onCancel={handleCancelPasswordChange}
        onSuccess={handleSuccessPasswordChange}
        isProfileEdit={true}
        currentUser={usuario}
        isDark={isDark}
        passwordOnly={true} // Nueva prop para solo mostrar campos de contraseña
        key={`password-change-${usuario?.id}`}
      />
    </AppLayout>
  );
};

export default PerfilUsuario;
