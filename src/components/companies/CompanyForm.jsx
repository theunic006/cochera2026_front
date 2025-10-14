import { useState, useEffect } from 'react';

import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Space, 
  message, 
  Alert,
  Row,
  Col,
  Switch,
  Select,
  Upload,
  InputNumber
} from 'antd';
import { BankOutlined, EnvironmentOutlined, FileTextOutlined, SafetyCertificateOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { companyService } from '../../services/companyService';
import { STORAGE_BASE_URL } from '../../utils/apiClient';
const { TextArea } = Input;
const CompanyForm = ({ visible, onCancel, onSuccess, editingCompany = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const isEditing = Boolean(editingCompany);

  // Efecto para manejar la visibilidad del modal y cargar datos
  useEffect(() => {
    if (visible) {
      if (isEditing && editingCompany) {
        // Llenar formulario con datos de la empresa a editar
        form.setFieldsValue({
          nombre: editingCompany.nombre,
          ubicacion: editingCompany.ubicacion || '',
          descripcion: editingCompany.descripcion || '',
          estado: editingCompany.estado || 'activo',
          capacidad: editingCompany.capacidad || '',
        });
        // Previsualizar logo existente si hay
        if (editingCompany.logo) {
          // Si el logo ya es una URL absoluta, úsala; si es relativa, anteponer la URL base
          const isAbsolute = editingCompany.logo.startsWith('http');
          setLogoPreview(
            isAbsolute
              ? editingCompany.logo
              : `${STORAGE_BASE_URL}/companies/${editingCompany.logo}`
          );
        } else {
          setLogoPreview(null);
        }
        setLogoFile(null);
      } else {
        // Limpiar formulario para crear nueva empresa
        form.resetFields();
        setLogoFile(null);
        setLogoPreview(null);
        // Valores por defecto para nueva empresa
        form.setFieldsValue({
          estado: 'activo', // Por defecto activo
        });
      }
      // Limpiar errores previos
      setErrors({});
    }
  }, [visible, isEditing, editingCompany, form]);

  // Validar archivo de imagen (solo jpg/png, <2MB)
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Solo se permiten imágenes JPG o PNG');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // Manejar cambio de archivo
  const handleLogoChange = (info) => {
    if (info.file.status === 'removed') {
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    const file = info.file.originFileObj;
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    setErrors({});

    try {
      let response;

      // Usar FormData para enviar archivos
      const formData = new FormData();
      formData.append('nombre', values.nombre.trim());
      formData.append('ubicacion', values.ubicacion?.trim() || '');
      formData.append('descripcion', values.descripcion?.trim() || '');
      formData.append('estado', values.estado);
      formData.append('capacidad', values.capacidad);
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Log para depuración
      console.log('Valores enviados al crear/editar empresa:', {
        nombre: values.nombre,
        ubicacion: values.ubicacion,
        descripcion: values.descripcion,
        estado: values.estado,
        capacidad: values.capacidad,
        logoFile,
        isEditing,
        id: editingCompany?.id
      });

      if (isEditing) {
        response = await companyService.updateCompany(editingCompany.id, formData, true);
      } else {
        response = await companyService.createCompany(formData, true);
      }

      if (response.success) {
        message.success(
          isEditing 
            ? `Empresa "${values.nombre}" actualizada correctamente`
            : `Empresa "${values.nombre}" creada correctamente`
        );
        form.resetFields();
        setLogoFile(null);
        setLogoPreview(null);
        onSuccess();
      } else {
        message.error(response.message || 'Error al procesar la empresa');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      if (error.type === 'validation' && error.errors) {
        setErrors(error.errors);
        message.error('Por favor, corrija los errores en el formulario');
      } else {
        message.error(error.message || 'Error al procesar la empresa');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la cancelación
  const handleCancel = () => {
    form.resetFields();
    setErrors({});
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
      maskClosable={!loading}
      centered
    >
      {/* Mostrar errores de validación si existen */}
      {Object.keys(errors).length > 0 && (
        <Alert
          style={{ marginBottom: 16 }}
          message="Errores de validación"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field}>
                  <strong>
                    {field === 'nombre' ? 'Nombre' : 
                     field === 'ubicacion' ? 'Ubicación' : 
                     field === 'descripcion' ? 'Descripción' : 
                     field === 'estado' ? 'Estado' : field}:
                  </strong>{' '}
                  {Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors}
                </li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          closable
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Nombre */}
            <Form.Item
              label="Nombre de la empresa"
              name="nombre"
              rules={[
                { required: true, message: 'El nombre de la empresa es obligatorio' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                { max: 255, message: 'El nombre no puede exceder 255 caracteres' },
              ]}
              validateStatus={errors.nombre ? 'error' : ''}
              help={errors.nombre ? (Array.isArray(errors.nombre) ? errors.nombre.join(', ') : errors.nombre) : ''}
            >
              <Input
                prefix={<BankOutlined style={{ color: '#1890ff' }} />}
                placeholder="Ej: Mercado de Flores, Tech Solutions SA"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Logo */}
            <Form.Item
              label="Logo de la empresa (JPG o PNG)"
              name="logo"
              valuePropName="fileList"
              getValueFromEvent={() => logoFile ? [logoFile] : []}
              extra="Solo imágenes JPG o PNG, máximo 2MB"
            >
              <Upload.Dragger
                name="logo"
                accept=".jpg,.jpeg,.png"
                beforeUpload={beforeUpload}
                showUploadList={false}
                customRequest={({ file, onSuccess }) => { setTimeout(() => onSuccess('ok'), 0); }}
                onChange={handleLogoChange}
                disabled={loading}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" style={{ maxWidth: 120, maxHeight: 120, margin: 8, display: 'block', objectFit: 'contain' }} />
                ) : (
                  <>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ color: '#1890ff', fontSize: 32 }} />
                    </p>
                    <p>Haz clic o arrastra una imagen aquí</p>
                  </>
                )}
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Capacidad */}
            <Form.Item
              label="Capacidad de vehículos en cochera"
              name="capacidad"
              rules={[
                { required: true, message: 'La capacidad es obligatoria' },
                { type: 'number', min: 1, message: 'Debe ser un número mayor a 0' },
              ]}
              validateStatus={errors.capacidad ? 'error' : ''}
              help={errors.capacidad ? (Array.isArray(errors.capacidad) ? errors.capacidad.join(', ') : errors.capacidad) : ''}
            >
              <InputNumber
                min={1}
                max={10000}
                style={{ width: '100%' }}
                placeholder="Ej: 50"
                size="large"
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Ubicación */}
            <Form.Item
              label="Ubicación"
              name="ubicacion"
              rules={[
                { required: true, message: 'La ubicación es obligatoria' },
                { min: 3, message: 'La ubicación debe tener al menos 3 caracteres' },
                { max: 255, message: 'La ubicación no puede exceder 255 caracteres' },
              ]}
              validateStatus={errors.ubicacion ? 'error' : ''}
              help={errors.ubicacion ? (Array.isArray(errors.ubicacion) ? errors.ubicacion.join(', ') : errors.ubicacion) : ''}
            >
              <Input
                prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                placeholder="Ej: Lima, Perú / Madrid, España"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Descripción */}
            <Form.Item
              label="Descripción"
              name="descripcion"
              rules={[
                { max: 1000, message: 'La descripción no puede exceder 1000 caracteres' },
              ]}
              validateStatus={errors.descripcion ? 'error' : ''}
              help={errors.descripcion ? (Array.isArray(errors.descripcion) ? errors.descripcion.join(', ') : errors.descripcion) : ''}
            >
              <TextArea
                placeholder="Descripción opcional de la empresa, sus actividades y características..."
                rows={4}
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Estado */}
            <Form.Item
              label="Estado de la empresa"
              name="estado"
              rules={[
                { required: true, message: 'El estado es obligatorio' },
              ]}
              extra="Las empresas inactivas o suspendidas no podrán acceder al sistema"
            >
              <Select
                placeholder="Seleccionar estado"
                size="large"
                style={{ width: '100%' }}
              >
                <Select.Option value="activo">
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                    Activo
                  </Space>
                </Select.Option>
                <Select.Option value="inactivo">
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#faad14' }} />
                    Inactivo
                  </Space>
                </Select.Option>
                <Select.Option value="suspendido">
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#ff4d4f' }} />
                    Suspendido
                  </Space>
                </Select.Option>
                <Select.Option value="pendiente">
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                    Pendiente
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Botones de acción */}
        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleCancel}
              disabled={loading}
              size="large"
            >
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              icon={isEditing ? <BankOutlined /> : <BankOutlined />}
              size="large"
              style={{ backgroundColor: '#1890ff' }}
            >
              {loading 
                ? (isEditing ? 'Actualizando...' : 'Creando...') 
                : (isEditing ? 'Actualizar Empresa' : 'Crear Empresa')
              }
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyForm;