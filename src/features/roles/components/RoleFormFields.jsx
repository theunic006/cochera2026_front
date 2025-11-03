import { Form, Space } from 'antd';
import Input from '../../../components/atoms/Input';
import Switch from '../../../components/atoms/Switch';
import { SecurityScanOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

/**
 * RoleFormFields - Campos del formulario de rol
 * Componente puro sin lógica de estado
 */
const RoleFormFields = () => {
  return (
    <>
      <Form.Item
        label="Nombre del rol"
        name="name"
        rules={[
          { required: true, message: 'El nombre del rol es requerido' },
          { max: 255, message: 'El nombre no puede exceder 255 caracteres' },
          { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
          { 
            pattern: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s-_]+$/, 
            message: 'Solo se permiten letras, espacios, guiones y guiones bajos' 
          },
        ]}
      >
        <Input
          prefix={<SecurityScanOutlined style={{ color: '#722ed1' }} />}
          placeholder="Ej: Administrador, Usuario, Moderador"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="Estado del rol"
        name="is_active"
        valuePropName="checked"
        extra="Los roles suspendidos no aparecerán en las opciones de asignación"
      >
        <Switch
          checkedChildren={
            <Space>
              <SafetyCertificateOutlined />
              Activo
            </Space>
          }
          unCheckedChildren="Suspendido"
          style={{ backgroundColor: '#722ed1' }}
        />
      </Form.Item>
    </>
  );
};

export default RoleFormFields;
