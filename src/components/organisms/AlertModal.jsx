import { Modal } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * AlertModal Organism - Modal de alertas con diferentes tipos
 * 
 * @component
 * @example
 * AlertModal.success({
 *   title: 'Éxito',
 *   content: 'Operación completada correctamente'
 * });
 */
const AlertModal = {
  /**
   * Modal de éxito (verde)
   */
  success: ({
    title = 'Éxito',
    content,
    onOk,
    okText = 'Aceptar',
    centered = true,
    ...rest
  }) => {
    return Modal.success({
      title,
      content,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      okText,
      centered,
      okButtonProps: {
        style: {
          backgroundColor: '#52c41a',
          borderColor: '#52c41a',
        }
      },
      onOk,
      ...rest,
    });
  },

  /**
   * Modal de error (rojo)
   */
  error: ({
    title = 'Error',
    content,
    onOk,
    okText = 'Aceptar',
    centered = true,
    ...rest
  }) => {
    return Modal.error({
      title,
      content,
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      okText,
      centered,
      okButtonProps: {
        danger: true,
      },
      onOk,
      ...rest,
    });
  },

  /**
   * Modal de advertencia (naranja)
   */
  warning: ({
    title = 'Advertencia',
    content,
    onOk,
    okText = 'Aceptar',
    centered = true,
    ...rest
  }) => {
    return Modal.warning({
      title,
      content,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      okText,
      centered,
      okButtonProps: {
        style: {
          backgroundColor: '#faad14',
          borderColor: '#faad14',
          color: '#fff',
        }
      },
      onOk,
      ...rest,
    });
  },

  /**
   * Modal de información (azul)
   */
  info: ({
    title = 'Información',
    content,
    onOk,
    okText = 'Aceptar',
    centered = true,
    ...rest
  }) => {
    return Modal.info({
      title,
      content,
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      okText,
      centered,
      okButtonProps: {
        type: 'primary',
      },
      onOk,
      ...rest,
    });
  },

  /**
   * Modal de confirmación genérico
   */
  confirm: ({
    title = '¿Está seguro?',
    content,
    onOk,
    onCancel,
    okText = 'Confirmar',
    cancelText = 'Cancelar',
    okType = 'primary',
    centered = true,
    icon,
    ...rest
  }) => {
    return Modal.confirm({
      title,
      content,
      icon: icon || <ExclamationCircleOutlined style={{ color: '#1890ff' }} />,
      okText,
      cancelText,
      okType,
      centered,
      onOk,
      onCancel,
      ...rest,
    });
  },
};

// PropTypes para documentación
AlertModal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  centered: PropTypes.bool,
};

export default AlertModal;
