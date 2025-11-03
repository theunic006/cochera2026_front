# 🎨 Guía de Componentes: Botones y Modales

## 📋 Índice
1. [Botones Especializados (Atoms)](#botones-especializados)
2. [Modales Especializados (Organisms)](#modales-especializados)
3. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🔘 Botones Especializados (Atoms)

### **1. PrimaryButton** - Azul (Acciones principales)
```jsx
import PrimaryButton from '@components/atoms/PrimaryButton';

<PrimaryButton onClick={handleSave} loading={saving} icon={<SaveOutlined />}>
  Guardar
</PrimaryButton>
```

**Uso recomendado:**
- ✅ Guardar formularios
- ✅ Crear registros
- ✅ Confirmar acciones principales
- ✅ Enviar datos

---

### **2. SuccessButton** - Verde (Acciones positivas)
```jsx
import SuccessButton from '@components/atoms/SuccessButton';

<SuccessButton onClick={handleApprove} showIcon>
  Aprobar
</SuccessButton>
```

**Uso recomendado:**
- ✅ Aprobar solicitudes
- ✅ Marcar como completado
- ✅ Activar elementos
- ✅ Confirmar éxito

**Props especiales:**
- `showIcon` - Muestra icono de check automáticamente

---

### **3. WarningButton** - Naranja (Acciones de advertencia)
```jsx
import WarningButton from '@components/atoms/WarningButton';

<WarningButton onClick={handleSuspend} showIcon>
  Suspender
</WarningButton>
```

**Uso recomendado:**
- ✅ Suspender usuarios
- ✅ Pausar procesos
- ✅ Advertir cambios importantes
- ✅ Acciones reversibles pero importantes

**Props especiales:**
- `showIcon` - Muestra icono de advertencia automáticamente

---

### **4. DangerButton** - Rojo (Acciones destructivas)
```jsx
import DangerButton from '@components/atoms/DangerButton';

<DangerButton onClick={handleDelete} showIcon loading={deleting}>
  Eliminar
</DangerButton>
```

**Uso recomendado:**
- ✅ Eliminar registros
- ✅ Cancelar suscripciones
- ✅ Rechazar solicitudes
- ✅ Acciones irreversibles

**Props especiales:**
- `showIcon` - Muestra icono de eliminar automáticamente

---

### **5. DefaultButton** - Gris (Acciones secundarias)
```jsx
import DefaultButton from '@components/atoms/DefaultButton';

<DefaultButton onClick={handleCancel}>
  Cancelar
</DefaultButton>
```

**Uso recomendado:**
- ✅ Cancelar acciones
- ✅ Cerrar modales
- ✅ Volver atrás
- ✅ Acciones neutras

---

## 📱 Props Comunes de Botones

Todos los botones soportan las mismas props:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onClick` | function | - | Función al hacer clic |
| `loading` | boolean | false | Muestra spinner de carga |
| `disabled` | boolean | false | Deshabilita el botón |
| `icon` | ReactNode | - | Icono personalizado |
| `size` | 'large' \| 'middle' \| 'small' | 'middle' | Tamaño del botón |
| `htmlType` | 'button' \| 'submit' \| 'reset' | 'button' | Tipo HTML |
| `block` | boolean | false | Ocupa todo el ancho |
| `ghost` | boolean | false | Estilo outline |
| `className` | string | '' | Clase CSS adicional |
| `style` | object | {} | Estilos inline |

---

## 🪟 Modales Especializados (Organisms)

### **1. AlertModal** - Alertas con diferentes tipos

#### **AlertModal.success()** - Verde
```jsx
import AlertModal from '@components/organisms/AlertModal';

AlertModal.success({
  title: 'Éxito',
  content: 'El rol fue creado correctamente',
  onOk: () => console.log('Usuario confirmó')
});
```

#### **AlertModal.error()** - Rojo
```jsx
AlertModal.error({
  title: 'Error',
  content: 'No se pudo conectar con el servidor',
});
```

#### **AlertModal.warning()** - Naranja
```jsx
AlertModal.warning({
  title: 'Advertencia',
  content: 'Este cambio afectará a 15 usuarios',
});
```

#### **AlertModal.info()** - Azul
```jsx
AlertModal.info({
  title: 'Información',
  content: 'El sistema se actualizará en 5 minutos',
});
```

#### **AlertModal.confirm()** - Confirmación genérica
```jsx
AlertModal.confirm({
  title: '¿Continuar?',
  content: '¿Deseas aplicar estos cambios?',
  onOk: () => handleApply(),
  onCancel: () => console.log('Cancelado')
});
```

---

### **2. DeleteModal** - Modal de eliminación

#### **DeleteModal.show()** - Eliminación simple
```jsx
import DeleteModal from '@components/organisms/DeleteModal';

const handleDelete = (role) => {
  DeleteModal.show({
    title: '¿Eliminar rol?',
    itemName: role.descripcion, // Se formatea automáticamente
    onConfirm: async () => {
      await deleteRole(role.id);
    },
    onCancel: () => console.log('Cancelado')
  });
};
```

**Ventajas:**
- ✅ Formatea automáticamente el contenido con `itemName`
- ✅ Botón de eliminar en rojo con tipo `danger`
- ✅ Icono de advertencia incluido
- ✅ Tema oscuro respetado

#### **DeleteModal.showMultiple()** - Eliminación múltiple
```jsx
DeleteModal.showMultiple({
  title: '¿Eliminar roles seleccionados?',
  count: selectedRoles.length,
  onConfirm: async () => {
    await deleteMultipleRoles(selectedRoles);
  }
});
```

#### **DeleteModal.showCustom()** - Modal personalizado con React
```jsx
const [visible, setVisible] = useState(false);
const [deleting, setDeleting] = useState(false);

<DeleteModal.showCustom
  visible={visible}
  title="¿Eliminar rol?"
  itemName={selectedRole?.descripcion}
  loading={deleting}
  onConfirm={async () => {
    setDeleting(true);
    await deleteRole(selectedRole.id);
    setDeleting(false);
    setVisible(false);
  }}
  onCancel={() => setVisible(false)}
/>
```

---

### **3. FormModal** - Modal de formulario (Ya existente, mejorado)

```jsx
import FormModal from '@components/organisms/FormModal';
import RoleFormFields from './RoleFormFields';

<FormModal
  visible={modalVisible}
  title="Crear Nuevo Rol"
  onCancel={() => setModalVisible(false)}
  onSubmit={handleSubmit}
  initialValues={initialValues}
  confirmLoading={loading}
  okText="Crear"
  width={600}
>
  <RoleFormFields />
</FormModal>
```

---

## 💡 Ejemplos de Uso Completos

### **Ejemplo 1: CRUD de Roles**
```jsx
import { useState } from 'react';
import { 
  PrimaryButton, 
  DangerButton, 
  DefaultButton 
} from '@components/atoms';
import { DeleteModal, FormModal, AlertModal } from '@components/organisms';

const RoleList = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreate = () => {
    setModalVisible(true);
  };

  const handleDelete = (role) => {
    DeleteModal.show({
      itemName: role.descripcion,
      onConfirm: async () => {
        try {
          await deleteRole(role.id);
          AlertModal.success({
            title: 'Rol eliminado',
            content: `El rol "${role.descripcion}" fue eliminado correctamente`
          });
        } catch (error) {
          AlertModal.error({
            title: 'Error',
            content: error.message
          });
        }
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      await createRole(values);
      setModalVisible(false);
      AlertModal.success({
        title: 'Rol creado',
        content: 'El rol fue creado correctamente'
      });
    } catch (error) {
      AlertModal.error({
        title: 'Error al crear rol',
        content: error.message
      });
    }
  };

  return (
    <>
      <PrimaryButton onClick={handleCreate}>
        Nuevo Rol
      </PrimaryButton>

      <FormModal
        visible={modalVisible}
        title="Crear Rol"
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      >
        <RoleFormFields />
      </FormModal>
    </>
  );
};
```

---

### **Ejemplo 2: Botones de Acción**
```jsx
import { 
  SuccessButton, 
  WarningButton, 
  DangerButton 
} from '@components/atoms';

const UserActions = ({ user }) => {
  return (
    <Space>
      <SuccessButton 
        onClick={() => handleApprove(user.id)}
        showIcon
        size="small"
      >
        Aprobar
      </SuccessButton>

      <WarningButton 
        onClick={() => handleSuspend(user.id)}
        showIcon
        size="small"
      >
        Suspender
      </WarningButton>

      <DangerButton 
        onClick={() => handleDelete(user.id)}
        showIcon
        size="small"
      >
        Eliminar
      </DangerButton>
    </Space>
  );
};
```

---

### **Ejemplo 3: Confirmaciones Múltiples**
```jsx
import { AlertModal, DeleteModal } from '@components/organisms';

const handleBulkDelete = (selectedItems) => {
  if (selectedItems.length === 0) {
    AlertModal.warning({
      title: 'Sin selección',
      content: 'Por favor selecciona al menos un elemento'
    });
    return;
  }

  DeleteModal.showMultiple({
    count: selectedItems.length,
    onConfirm: async () => {
      try {
        await deleteBulk(selectedItems);
        AlertModal.success({
          title: 'Eliminación completada',
          content: `${selectedItems.length} elementos eliminados`
        });
      } catch (error) {
        AlertModal.error({
          title: 'Error en eliminación',
          content: error.message
        });
      }
    }
  });
};
```

---

## 🎨 Personalización de Colores

### **Colores por defecto:**
```javascript
PrimaryButton:  #1890ff (Azul Ant Design)
SuccessButton:  #52c41a (Verde)
WarningButton:  #faad14 (Naranja)
DangerButton:   #ff4d4f (Rojo)
DefaultButton:  #d9d9d9 (Gris)
```

### **Personalizar colores:**
```jsx
<SuccessButton 
  style={{ 
    backgroundColor: '#00c853', 
    borderColor: '#00c853' 
  }}
>
  Verde personalizado
</SuccessButton>
```

---

## 🌙 Soporte de Tema Oscuro

Todos los componentes soportan automáticamente el tema oscuro de la aplicación:

- ✅ Modales con fondo oscuro
- ✅ Botones con contraste adecuado
- ✅ Iconos con colores visibles
- ✅ Sin configuración adicional necesaria

---

## 📦 Resumen de Imports

```jsx
// Botones
import { 
  PrimaryButton,
  SuccessButton,
  WarningButton,
  DangerButton,
  DefaultButton 
} from '@components/atoms';

// Modales
import { 
  AlertModal,
  DeleteModal,
  FormModal 
} from '@components/organisms';

// Uso
<PrimaryButton onClick={handleSave}>Guardar</PrimaryButton>
<DeleteModal.show({ itemName: 'Rol', onConfirm: handleDelete }) />
<AlertModal.success({ content: 'Operación exitosa' }) />
```

---

## 🚀 Ventajas de usar estos componentes

1. **Consistencia:** Todos los botones y modales se ven iguales
2. **Mantenibilidad:** Un solo lugar para actualizar estilos
3. **Accesibilidad:** Props estandarizadas y documentadas
4. **Tema oscuro:** Soportado automáticamente
5. **Reutilización:** Importar y usar en cualquier módulo
6. **TypeScript ready:** PropTypes incluidos para autocompletado

---

**Fecha:** 3 de noviembre de 2025  
**Componentes creados:** 5 botones + 2 modales  
**Total de archivos:** 7 componentes nuevos
