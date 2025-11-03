import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ExclamationCircleFilled } from '@ant-design/icons';
import DangerButton from '../atoms/DangerButton';
import DefaultButton from '../atoms/DefaultButton';
import './DeleteModalCustom.css';

/**
 * DeleteModalCustom - Modal de eliminación 100% custom
 * 
 * Sin dependencias de Ant Design Modal
 * Controlado completamente por estado de React
 * Animaciones CSS puras
 * 
 * @component
 * @example
 * const [visible, setVisible] = useState(false);
 * 
 * <DeleteModalCustom
 *   visible={visible}
 *   title="¿Eliminar rol?"
 *   itemName="Administrador"
 *   onCancel={() => setVisible(false)}
 *   onConfirm={async () => {
 *     await deleteRole(id);
 *     setVisible(false);
 *   }}
 * />
 */
const DeleteModalCustom = ({
  visible = false,
  title = '¿Eliminar registro?',
  itemName,
  content,
  onCancel,
  onConfirm,
  okText = 'Eliminar',
  cancelText = 'Cancelar',
  loading = false,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  // Manejar ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && visible && !isLoading && !loading) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [visible, isLoading, loading]);

  const handleCancel = () => {
    if (!isLoading && !loading && onCancel) {
      onCancel();
    }
  };

  const handleConfirm = async () => {
    if (!onConfirm || isLoading || loading) return;

    setIsLoading(true);

    try {
      await onConfirm();
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading && !loading) {
      handleCancel();
    }
  };

  const modalContent = content || (
    itemName 
      ? `¿Estás seguro de eliminar "${itemName}"?`
      : '¿Estás seguro de eliminar este registro?'
  );

  const isProcessing = isLoading || loading;

  if (!visible) return null;

  return (
    <div 
      className={`delete-modal-overlay ${visible ? 'active' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`delete-modal-container ${visible ? 'active' : ''}`}>
        {/* Header */}
        <div className="delete-modal-header">
          <div className="delete-modal-title">
            <ExclamationCircleFilled className="delete-modal-icon" />
            <span>{title}</span>
          </div>
          {!isProcessing && (
            <button 
              className="delete-modal-close" 
              onClick={handleCancel}
              aria-label="Cerrar"
            >
              ×
            </button>
          )}
        </div>

        {/* Body */}
        <div className="delete-modal-body">
          <p>{modalContent}</p>
          {itemName && (
            <div className="delete-modal-warning">
              Esta acción no se puede deshacer
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="delete-modal-footer">
          <DefaultButton 
            onClick={handleCancel}
            disabled={isProcessing}
          >
            {cancelText}
          </DefaultButton>
          <DangerButton 
            onClick={handleConfirm}
            loading={isProcessing}
            disabled={isProcessing}
          >
            {okText}
          </DangerButton>
        </div>
      </div>
    </div>
  );
};

DeleteModalCustom.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  itemName: PropTypes.string,
  content: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  loading: PropTypes.bool,
};

export default DeleteModalCustom;
