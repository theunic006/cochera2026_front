import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Button,
  Typography,
  Space,
  Form,
  Select,
  message
} from 'antd';
import {
  PrinterOutlined,
  SaveOutlined,
  EditOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { companyService } from '../../services/companyService';

const { Title, Text } = Typography;

const ConfigImpresora = ({ 
  company, 
  usuario, 
  setUsuario, 
  colors, 
  installedPrinters, 
  loadingPrinters, 
  loadPrinters 
}) => {
  const [editingPrinters, setEditingPrinters] = useState(false);
  const [printersLoaded, setPrintersLoaded] = useState(false);
  const [cacheTime, setCacheTime] = useState(null);
  const [form] = Form.useForm();

  // Cache de 5 minutos para las impresoras
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

  // Función para cargar impresoras solo cuando se necesiten
  const handleLoadPrintersOnEdit = async () => {
    const now = Date.now();
    const shouldRefresh = !printersLoaded || !cacheTime || (now - cacheTime) > CACHE_DURATION;
    
    if (shouldRefresh) {
      await loadPrinters();
      setPrintersLoaded(true);
      setCacheTime(now);
    }
  };

  // Función para guardar configuración de impresoras
  const handleSavePrinters = async (values) => {
    try {
      // Verificar token
      const token = localStorage.getItem('access_token');
      if (!company.id) {
        message.error('No se puede actualizar: ID de empresa no encontrado');
        return;
      }

      // Preparar datos para actualizar solo las impresoras
      const updateData = {
        imp_input: values.imp_input || null,
        imp_output: values.imp_output || null
      };

      // Usar el nuevo método específico para impresoras
      const response = await companyService.updatePrinters(company.id, updateData);

      if (response.success) {
        // Actualizar el estado local del usuario con las nuevas impresoras
        setUsuario(prev => ({
          ...prev,
          company: {
            ...prev.company,
            imp_input: values.imp_input,
            imp_output: values.imp_output
          }
        }));

        setEditingPrinters(false);

      } else {
        message.error('Error al guardar la configuración de impresoras');
        console.error('❌ Error en la respuesta:', response);
      }
    } catch (err) {
      console.error('🚨 Error al guardar impresoras:', err);
      
      if (err.response?.status === 401) {
        message.error('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (err.response?.status === 419) {
        message.error('Error de token CSRF. Refresca la página e intenta nuevamente.');
      } else {
        message.error('Error al conectar con el servidor: ' + (err.message || 'Error desconocido'));
      }
    }
  };

  // No mostrar el componente si no hay empresa
  if (!company || (!company.nombre && !company.id)) {
    return null;
  }

  return (
    <Card
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        marginTop: 16
      }}
      styles={{ body: { padding: 16 } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Avatar 
          size={24} 
          icon={<PrinterOutlined />}
          style={{ background: colors.accent }}
        />
        <Title level={5} style={{ color: colors.text, margin: 0, fontSize: 14 }}>
          Configurar Impresoras
          {cacheTime && (
            <span style={{ 
              fontSize: 10, 
              color: colors.textSecondary, 
              marginLeft: 8,
              fontWeight: 'normal'
            }}>
            </span>
          )}
        </Title>
        <Button 
          type="text" 
          size="small" 
          icon={editingPrinters ? <SaveOutlined /> : <EditOutlined />}
          onClick={async () => {
            if (editingPrinters) {
              form.submit();
            } else {
              // Cargar impresoras solo cuando se necesiten
              await handleLoadPrintersOnEdit();
              setEditingPrinters(true);
              form.setFieldsValue({
                imp_input: company.imp_input || '',
                imp_output: company.imp_output || ''
              });
            }
          }}
          style={{ marginLeft: 'auto', color: colors.accent }}
        />
      </div>
      
      {editingPrinters ? (
        <Form
          form={form}
          onFinish={handleSavePrinters}
          layout="vertical"
          size="small"
        >
          <Form.Item 
            name="imp_input" 
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: colors.text, fontSize: 12 }}>Impresora para Tiket:</Text>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<ReloadOutlined />}
                  loading={loadingPrinters}
                  onClick={async () => {
                    console.log('🔄 Refrescando impresoras manualmente...');
                    await loadPrinters();
                    setPrintersLoaded(true);
                    setCacheTime(Date.now());
                  }}
                  style={{ padding: 0, minWidth: 'auto', color: colors.accent }}
                  title="Refrescar lista de impresoras"
                />
              </div>
            }
            style={{ marginBottom: 12 }}
          >
            <Select
              placeholder="Seleccionar impresora"
              style={{ width: '100%' }}
              options={installedPrinters}
              loading={loadingPrinters}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          
          <Form.Item 
            name="imp_output" 
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: colors.text, fontSize: 12 }}>Impresora para Boleta:</Text>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<ReloadOutlined />}
                  loading={loadingPrinters}
                  onClick={async () => {
                    console.log('🔄 Refrescando impresoras manualmente...');
                    await loadPrinters();
                    setPrintersLoaded(true);
                    setCacheTime(Date.now());
                  }}
                  style={{ padding: 0, minWidth: 'auto', color: colors.accent }}
                  title="Refrescar lista de impresoras"
                />
              </div>
            }
            style={{ marginBottom: 12 }}
          >
            <Select
              placeholder="Seleccionar impresora"
              style={{ width: '100%' }}
              options={installedPrinters}
              loading={loadingPrinters}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              type="primary" 
              htmlType="submit"
              size="small"
              icon={<SaveOutlined />}
              style={{ flex: 1 }}
            >
              Guardar
            </Button>
            <Button 
              size="small"
              onClick={() => {
                setEditingPrinters(false);
                form.resetFields();
              }}
              style={{ flex: 1 }}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      ) : (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <div>
            <Text style={{ color: colors.textSecondary, fontSize: 12, display: 'block' }}>
              Impresora Entrada:
            </Text>
            <Text strong style={{ color: colors.text, fontSize: 13 }}>
              {company.imp_input || "No configurada"}
            </Text>
          </div>
          <div>
            <Text style={{ color: colors.textSecondary, fontSize: 12, display: 'block' }}>
              Impresora Salida:
            </Text>
            <Text strong style={{ color: colors.text, fontSize: 13 }}>
              {company.imp_output || "No configurada"}
            </Text>
          </div>
        </Space>
      )}
    </Card>
  );
};

export default ConfigImpresora;