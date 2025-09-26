import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Space,
  Typography,
  Alert,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  MailOutlined
} from '@ant-design/icons';
import { ownerService } from '../../services/ownerService';

const { Title } = Typography;

const OwnerForm = ({ visible, onCancel, onSuccess, editingOwner = null }) => {
  console.log('OwnerForm renderizado - visible:', visible, 'editingOwner:', editingOwner);
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Determinar si es edición o creación
  const isEditing = !!editingOwner;

  // Efecto para llenar el formulario al editar
  useEffect(() => {
    if (visible) {
      if (isEditing && editingOwner) {
        // Llenar formulario con datos del propietario a editar
        form.setFieldsValue({
          nombres: editingOwner.nombres,
          apellidos: editingOwner.apellidos,
          documento: editingOwner.documento,
          telefono: editingOwner.telefono,
          email: editingOwner.email,
          direccion: editingOwner.direccion,
        });
      } else {
        // Limpiar formulario para crear nuevo propietario
        form.resetFields();
      }
      // Limpiar errores previos
      setErrors({});
    }
  }, [visible, isEditing, editingOwner, form]);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (values) => {
    console.log('🔥 handleSubmit llamado con valores:', values);
    console.log('🔥 isEditing:', isEditing);
    
    setLoading(true);
    setErrors({});
    
    try {
      let response;
      
      if (isEditing) {
        // Actualizar propietario existente
        console.log('🔥 Actualizando propietario:', editingOwner.id);
        response = await ownerService.updateOwner(editingOwner.id, values);
        message.success('Propietario actualizado exitosamente');
      } else {
        // Crear nuevo propietario
        console.log('🔥 Creando nuevo propietario');
        response = await ownerService.createOwner(values);
        console.log('🔥 Respuesta del servicio:', response);
        message.success('Propietario creado exitosamente');
      }

      // Si fue exitoso, llamar onSuccess y cerrar modal
      if (response && response.success) {
        console.log('🔥 Creación exitosa, cerrando modal');
        form.resetFields();
        onSuccess();
      } else {
        console.log('🔥 Respuesta no exitosa:', response);
      }
    } catch (error) {
      console.error('🔥 Error saving owner:', error);
      console.log('🔥 Error completo:', JSON.stringify(error, null, 2));
      
      // Manejar errores de validación del servidor
      if (error.errors && Object.keys(error.errors).length > 0) {
        console.log('🔥 Errores de validación:', error.errors);
        setErrors(error.errors);
        message.error('Por favor corrige los errores en el formulario');
      } else {
        console.log('🔥 Error general:', error.message);
        message.error(error.message || 'Error al guardar propietario');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar cancelación del modal
   */
  const handleCancel = () => {
    form.resetFields();
    setErrors({});
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? 'Editar Propietario' : 'Crear Nuevo Propietario'}
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={null}
    >
      {/* Mostrar errores generales si existen */}
      {Object.keys(errors).length > 0 && (
        <Alert
          message="Errores en el formulario"
          description="Por favor corrige los siguientes errores:"
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        disabled={loading}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nombres"
              name="nombres"
              rules={[
                { required: true, message: 'Los nombres son obligatorios' },
                { min: 2, message: 'Los nombres deben tener al menos 2 caracteres' },
                { max: 100, message: 'Los nombres no pueden exceder 100 caracteres' }
              ]}
              validateStatus={errors.nombres ? 'error' : ''}
              help={errors.nombres ? errors.nombres[0] : ''}
            >
              <Input
                placeholder="Ingrese los nombres"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="Apellidos"
              name="apellidos"
              rules={[
                { required: true, message: 'Los apellidos son obligatorios' },
                { min: 2, message: 'Los apellidos deben tener al menos 2 caracteres' },
                { max: 100, message: 'Los apellidos no pueden exceder 100 caracteres' }
              ]}
              validateStatus={errors.apellidos ? 'error' : ''}
              help={errors.apellidos ? errors.apellidos[0] : ''}
            >
              <Input
                placeholder="Ingrese los apellidos"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Documento"
              name="documento"
              rules={[
                { required: true, message: 'El documento es obligatorio' },
                { 
                  pattern: /^[0-9]+$/,
                  message: 'El documento debe contener solo números'
                },
                { min: 6, message: 'El documento debe tener al menos 6 dígitos' },
                { max: 20, message: 'El documento no puede exceder 20 dígitos' }
              ]}
              validateStatus={errors.documento ? 'error' : ''}
              help={errors.documento ? errors.documento[0] : ''}
            >
              <Input
                placeholder="Número de documento"
                prefix={<IdcardOutlined />}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="Teléfono"
              name="telefono"
              rules={[
                { required: true, message: 'El teléfono es obligatorio' },
                { 
                  pattern: /^[0-9\-\+\(\)\s]+$/,
                  message: 'Formato de teléfono inválido'
                },
                { min: 7, message: 'El teléfono debe tener al menos 7 caracteres' },
                { max: 20, message: 'El teléfono no puede exceder 20 caracteres' }
              ]}
              validateStatus={errors.telefono ? 'error' : ''}
              help={errors.telefono ? errors.telefono[0] : ''}
            >
              <Input
                placeholder="Número de teléfono"
                prefix={<PhoneOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'El email es obligatorio' },
            { type: 'email', message: 'Formato de email inválido' },
            { max: 150, message: 'El email no puede exceder 150 caracteres' }
          ]}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email ? errors.email[0] : ''}
        >
          <Input
            placeholder="Correo electrónico"
            prefix={<MailOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Dirección"
          name="direccion"
          rules={[
            { required: true, message: 'La dirección es obligatoria' },
            { min: 10, message: 'La dirección debe tener al menos 10 caracteres' },
            { max: 200, message: 'La dirección no puede exceder 200 caracteres' }
          ]}
          validateStatus={errors.direccion ? 'error' : ''}
          help={errors.direccion ? errors.direccion[0] : ''}
        >
          <Input.TextArea
            placeholder="Dirección completa"
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                backgroundColor: '#722ed1',
                borderColor: '#722ed1'
              }}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default OwnerForm;