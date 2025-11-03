import React from 'react';
import { Modal, Form } from 'antd';
import PrimaryButton from '../atoms/PrimaryButton';
import DefaultButton from '../atoms/DefaultButton';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './FormModal.css';

/**
 * FormModal Organism - Modal genérico para formularios
 * 
 * Diseño optimizado con:
 * - Tema oscuro moderno
 * - Animaciones suaves
 * - Iconos en botones
 * - Mejor espaciado y tipografía
 * 
 * @component
 * @example
 * <FormModal
 *   visible={modalVisible}
 *   title="Crear Rol"
 *   onCancel={() => setModalVisible(false)}
 *   onSubmit={handleSubmit}
 * >
 *   <RoleFormFields initialValues={selectedRole} />
 * </FormModal>
 */
const FormModal = ({
  visible,
  title,
  children,
  onCancel,
  onSubmit,
  
  // Form
  form,
  initialValues,
  layout = 'vertical',
  
  // Modal config
  width = 600,
  centered = true,
  destroyOnClose = true,
  maskClosable = true,
  
  // Buttons
  okText = 'Guardar',
  cancelText = 'Cancelar',
  confirmLoading = false,
  showFooter = true,
  footerButtons,
  showOkIcon = true,
  showCancelIcon = true,
  
  // Custom
  className = '',
  bodyStyle = {},
  modalProps = {},
  formProps = {},
  
  ...rest
}) => {
  const [formInstance] = Form.useForm(form);

  // Actualizar valores del form cuando cambien initialValues o visible
  React.useEffect(() => {
    if (visible && initialValues) {
      formInstance.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, formInstance]);

  // Manejar submit del formulario
  const handleOk = async () => {
    try {
      const values = await formInstance.validateFields();
      if (onSubmit) {
        const result = await onSubmit(values);
        // Si el submit retorna true o no retorna nada (undefined), cerrar el modal
        if (result !== false) {
          formInstance.resetFields();
          if (onCancel) {
            onCancel(); // Cerrar el modal después de guardar exitosamente
          }
        }
      }
    } catch (error) {
      // Error de validación o submit - NO cerrar el modal
      console.error('Error en formulario:', error);
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    formInstance.resetFields();
    if (onCancel) {
      onCancel();
    }
  };

  // Footer personalizado o por defecto - Usa botones atoms con iconos
  const modalFooter = showFooter
    ? footerButtons || [
        <DefaultButton 
          key="cancel" 
          onClick={handleCancel}
          icon={showCancelIcon ? <CloseOutlined /> : null}
          size="large"
        >
          {cancelText}
        </DefaultButton>,
        <PrimaryButton
          key="submit"
          loading={confirmLoading}
          onClick={handleOk}
          icon={showOkIcon && !confirmLoading ? <SaveOutlined /> : null}
          size="large"
        >
          {okText}
        </PrimaryButton>,
      ]
    : null;

  return (
    <Modal
      open={visible}
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          fontSize: '18px',
          fontWeight: 600,
          color: '#fff'
        }}>
          {title}
        </div>
      }
      onCancel={handleCancel}
      footer={modalFooter}
      width={width}
      centered={centered}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      className={`form-modal-custom ${className}`}
      styles={{
        mask: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },
        content: {
          backgroundColor: '#1f1f1f',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
        header: {
          backgroundColor: '#1f1f1f',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          paddingBottom: '16px',
          marginBottom: 0,
        },
        body: {
          backgroundColor: '#1f1f1f',
          padding: '24px',
          ...bodyStyle
        },
        footer: {
          backgroundColor: '#1f1f1f',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '16px',
          paddingBottom: '16px',
          marginTop: 0,
        }
      }}
      {...modalProps}
      {...rest}
    >
      <Form
        form={formInstance}
        layout={layout}
        initialValues={initialValues}
        {...formProps}
      >
        {children}
      </Form>
    </Modal>
  );
};

FormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  
  // Form
  form: PropTypes.object,
  initialValues: PropTypes.object,
  layout: PropTypes.oneOf(['horizontal', 'vertical', 'inline']),
  
  // Modal config
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  centered: PropTypes.bool,
  destroyOnClose: PropTypes.bool,
  maskClosable: PropTypes.bool,
  
  // Buttons
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmLoading: PropTypes.bool,
  showFooter: PropTypes.bool,
  footerButtons: PropTypes.node,
  showOkIcon: PropTypes.bool,
  showCancelIcon: PropTypes.bool,
  
  // Custom
  className: PropTypes.string,
  bodyStyle: PropTypes.object,
  modalProps: PropTypes.object,
  formProps: PropTypes.object,
};

export default FormModal;
