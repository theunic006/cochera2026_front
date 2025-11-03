import { Modal } from 'antd';
import { ExclamationCircleOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * ConfirmDialog Organism - Diálogo de confirmación reutilizable
 * 
 * @component
 * @example
 * ConfirmDialog.show({
 *   title: '¿Eliminar registro?',
 *   content: 'Esta acción no se puede deshacer',
 *   onOk: handleDelete,
 * });
 */
const ConfirmDialog = {
  /**
   * Mostrar diálogo de confirmación genérico
   */
  show: ({
    title = '¿Está seguro?',
    content,
    onOk,
    onCancel,
    okText = 'Confirmar',
    cancelText = 'Cancelar',
    okType = 'primary',
    icon,
    ...rest
  }) => {
    return Modal.confirm({
      title,
      content,
      icon: icon || <QuestionCircleOutlined />,
      okText,
      cancelText,
      okType,
      onOk,
      onCancel,
      ...rest,
    });
  },

  /**
   * Mostrar diálogo de eliminación
   */
  delete: ({
    title = '¿Está seguro de eliminar este registro?',
    content = 'Esta acción no se puede deshacer.',
    onOk,
    onCancel,
    okText = 'Eliminar',
    cancelText = 'Cancelar',
    ...rest
  }) => {
    return Modal.confirm({
      title,
      content,
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      okText,
      cancelText,
      okType: 'danger',
      onOk,
      onCancel,
      centered: true,
      okButtonProps: {
        danger: true,
        type: 'primary',
      },
      cancelButtonProps: {
        type: 'default',
      },
      ...rest,
    });
  },

  /**
   * Mostrar diálogo de advertencia
   */
  warning: ({
    title = 'Advertencia',
    content,
    onOk,
    onCancel,
    okText = 'Continuar',
    cancelText = 'Cancelar',
    ...rest
  }) => {
    return Modal.warning({
      title,
      content,
      icon: <ExclamationCircleOutlined />,
      okText,
      cancelText,
      onOk,
      onCancel,
      ...rest,
    });
  },

  /**
   * Mostrar diálogo de información
   */
  info: ({
    title = 'Información',
    content,
    onOk,
    okText = 'Entendido',
    ...rest
  }) => {
    return Modal.info({
      title,
      content,
      icon: <InfoCircleOutlined />,
      okText,
      onOk,
      ...rest,
    });
  },

  /**
   * Mostrar diálogo de éxito
   */
  success: ({
    title = 'Éxito',
    content,
    onOk,
    okText = 'Aceptar',
    ...rest
  }) => {
    return Modal.success({
      title,
      content,
      okText,
      onOk,
      ...rest,
    });
  },

  /**
   * Mostrar diálogo de error
   */
  error: ({
    title = 'Error',
    content,
    onOk,
    okText = 'Aceptar',
    ...rest
  }) => {
    return Modal.error({
      title,
      content,
      okText,
      onOk,
      ...rest,
    });
  },
};

// PropTypes para documentación
ConfirmDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  okType: PropTypes.oneOf(['primary', 'danger', 'dashed', 'text', 'link']),
  icon: PropTypes.node,
};

export default ConfirmDialog;

/**
 * Ejemplos de uso:
 * 
 * // Confirmación genérica
 * ConfirmDialog.show({
 *   title: '¿Continuar?',
 *   content: 'Está a punto de realizar esta acción',
 *   onOk: () => console.log('Confirmado'),
 * });
 * 
 * // Confirmación de eliminación
 * ConfirmDialog.delete({
 *   onOk: async () => {
 *     await deleteRole(roleId);
 *     message.success('Rol eliminado');
 *   },
 * });
 * 
 * // Advertencia
 * ConfirmDialog.warning({
 *   title: 'Datos incompletos',
 *   content: 'Algunos campos están vacíos',
 * });
 * 
 * // Información
 * ConfirmDialog.info({
 *   content: 'Esta función estará disponible pronto',
 * });
 * 
 * // Éxito
 * ConfirmDialog.success({
 *   content: 'Operación completada correctamente',
 * });
 * 
 * // Error
 * ConfirmDialog.error({
 *   title: 'Error al guardar',
 *   content: 'No se pudo conectar con el servidor',
 * });
 */
