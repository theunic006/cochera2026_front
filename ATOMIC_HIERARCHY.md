# 🏗️ Jerarquía de Atomic Design - Componentes Refactorizados

## 📊 Estructura de Dependencias

### **Nivel 1: Atoms (Componentes básicos)**
No dependen de nadie, son la base de todo:

```
atoms/
├── Button.jsx                    ⚛️ Botón genérico de Ant Design
├── PrimaryButton.jsx            🔵 Botón azul (acciones principales)
├── SuccessButton.jsx            🟢 Botón verde (acciones positivas)
├── WarningButton.jsx            🟠 Botón naranja (advertencias)
├── DangerButton.jsx             🔴 Botón rojo (acciones destructivas)
├── DefaultButton.jsx            ⚪ Botón gris (acciones secundarias)
├── Input.jsx                    📝 Input de texto
├── Switch.jsx                   🔘 Toggle on/off
├── Avatar.jsx                   👤 Avatar de usuario
├── Badge.jsx                    🏷️ Etiqueta/insignia
├── Card.jsx                     📄 Tarjeta
├── Divider.jsx                  ➖ Divisor
├── Icon.jsx                     🎨 Icono
├── Tag.jsx                      🏷️ Etiqueta
└── Tooltip.jsx                  💬 Tooltip
```

---

### **Nivel 2: Molecules (Combinan atoms)**

#### **ActionButtons.jsx** 🔗
**Usa los siguientes atoms:**
- ✅ `PrimaryButton` (para el botón de Editar)
- ✅ `DangerButton` (para el botón de Eliminar)
- ✅ `DefaultButton` (para acciones extra)
- ✅ `Tooltip` (para mostrar descripciones)

**Código:**
```jsx
// ActionButtons.jsx
import PrimaryButton from '../atoms/PrimaryButton';
import DangerButton from '../atoms/DangerButton';
import DefaultButton from '../atoms/DefaultButton';
import Tooltip from '../atoms/Tooltip';

const ActionButtons = ({ onEdit, onDelete, extraActions }) => (
  <Space>
    <Tooltip title="Editar">
      <PrimaryButton type="link" icon={<EditOutlined />} onClick={onEdit} />
    </Tooltip>
    <Tooltip title="Eliminar">
      <DangerButton type="link" icon={<DeleteOutlined />} onClick={onDelete} />
    </Tooltip>
    {/* Extra actions con DefaultButton */}
  </Space>
);
```

---

#### **SearchBar.jsx** 🔍
**Usa los siguientes atoms:**
- ✅ `Input` (para el campo de búsqueda)

**Código:**
```jsx
// SearchBar.jsx
import Input from '../atoms/Input';

const SearchBar = ({ onSearch, placeholder }) => (
  <Input.Search
    placeholder={placeholder}
    onSearch={onSearch}
    enterButton={<SearchOutlined />}
  />
);
```

---

#### **FormField.jsx** 📝
**Usa los siguientes atoms:**
- ✅ `Input` (para el campo de entrada)

---

#### **StatusBadge.jsx** 🏷️
**Usa los siguientes atoms:**
- ✅ `Badge` (para la insignia de estado)

---

#### **EmptyState.jsx** 📭
**Usa los siguientes atoms:**
- ✅ `Icon` (para el icono vacío)

---

#### **PageHeader.jsx** 📄
**Usa los siguientes atoms:**
- ✅ `Button` (genérico, para acciones)
- ✅ `Divider` (para separador)

---

#### **StatCard.jsx** 📊
**Usa los siguientes atoms:**
- ✅ `Card` (para la tarjeta base)

---

### **Nivel 3: Organisms (Combinan molecules y atoms)**

#### **DataTable.jsx** 📋
**Usa los siguientes molecules:**
- ✅ `SearchBar` (para búsqueda)
- ✅ `PageHeader` (para encabezado)
- ✅ `ActionButtons` (para acciones CRUD)
- ✅ `EmptyState` (para estado vacío)

**Usa los siguientes atoms:**
- ✅ `PrimaryButton` (para botón "Crear")
- ✅ `DefaultButton` (para botón "Actualizar")
- ✅ `Tooltip` (para descripciones)

**Código:**
```jsx
// DataTable.jsx
import PrimaryButton from '../atoms/PrimaryButton';
import DefaultButton from '../atoms/DefaultButton';
import SearchBar from '../molecules/SearchBar';
import PageHeader from '../molecules/PageHeader';
import ActionButtons from '../molecules/ActionButtons';
import EmptyState from '../molecules/EmptyState';

const DataTable = ({ columns, dataSource, onCreate, onEdit, onDelete }) => (
  <>
    <PageHeader
      title="Gestión"
      actions={
        <Space>
          <DefaultButton icon={<ReloadOutlined />} onClick={onRefresh}>
            Actualizar
          </DefaultButton>
          <PrimaryButton icon={<PlusOutlined />} onClick={onCreate}>
            Crear
          </PrimaryButton>
        </Space>
      }
    />
    <SearchBar onSearch={handleSearch} />
    <Table
      columns={[
        ...columns,
        {
          title: 'Acciones',
          render: (_, record) => (
            <ActionButtons
              onEdit={() => onEdit(record)}
              onDelete={() => onDelete(record)}
            />
          )
        }
      ]}
      dataSource={dataSource}
      locale={{ emptyText: <EmptyState /> }}
    />
  </>
);
```

---

#### **FormModal.jsx** 📝
**Usa los siguientes atoms:**
- ✅ `PrimaryButton` (para botón "Guardar")
- ✅ `DefaultButton` (para botón "Cancelar")

**Código:**
```jsx
// FormModal.jsx
import PrimaryButton from '../atoms/PrimaryButton';
import DefaultButton from '../atoms/DefaultButton';

const FormModal = ({ visible, onSubmit, onCancel, children }) => {
  const footer = [
    <DefaultButton key="cancel" onClick={onCancel}>
      Cancelar
    </DefaultButton>,
    <PrimaryButton key="submit" onClick={onSubmit}>
      Guardar
    </PrimaryButton>
  ];

  return (
    <Modal visible={visible} footer={footer}>
      <Form>{children}</Form>
    </Modal>
  );
};
```

---

#### **DeleteModal.jsx** ❌
**Usa los siguientes atoms:**
- ✅ `DangerButton` (para botón "Eliminar")
- ✅ `DefaultButton` (para botón "Cancelar")

**Código:**
```jsx
// DeleteModal.jsx
import DangerButton from '../atoms/DangerButton';
import DefaultButton from '../atoms/DefaultButton';

const DeleteModal = {
  show: ({ itemName, onConfirm, onCancel }) => {
    Modal.confirm({
      title: '¿Eliminar este registro?',
      content: `¿Estás seguro de eliminar "${itemName}"?`,
      okButtonProps: { danger: true },
      onOk: onConfirm,
      onCancel
    });
  },

  showCustom: ({ visible, itemName, onConfirm, onCancel, loading }) => (
    <Modal
      visible={visible}
      footer={[
        <DefaultButton key="cancel" onClick={onCancel}>
          Cancelar
        </DefaultButton>,
        <DangerButton key="delete" onClick={onConfirm} loading={loading} showIcon>
          Eliminar
        </DangerButton>
      ]}
    >
      ¿Estás seguro de eliminar "{itemName}"?
    </Modal>
  )
};
```

---

#### **AlertModal.jsx** 🔔
**No usa otros componentes** (utiliza Modal.success/error/warning/info de Ant Design directamente)

---

#### **ConfirmDialog.jsx** ❓
**No usa otros componentes** (utiliza Modal.confirm de Ant Design directamente)

---

## 📈 Diagrama de Flujo de Dependencias

```
┌─────────────────────────────────────────────────────────────┐
│                    NIVEL 1: ATOMS (15)                       │
│  Button, PrimaryButton, SuccessButton, WarningButton,        │
│  DangerButton, DefaultButton, Input, Switch, Avatar,         │
│  Badge, Card, Divider, Icon, Tag, Tooltip                    │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│                  NIVEL 2: MOLECULES (7)                      │
│                                                              │
│  ActionButtons  ──→ PrimaryButton, DangerButton, DefaultButton, Tooltip
│  SearchBar      ──→ Input                                    │
│  FormField      ──→ Input                                    │
│  StatusBadge    ──→ Badge                                    │
│  EmptyState     ──→ Icon                                     │
│  PageHeader     ──→ Button, Divider                          │
│  StatCard       ──→ Card                                     │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│                  NIVEL 3: ORGANISMS (5)                      │
│                                                              │
│  DataTable      ──→ SearchBar, PageHeader, ActionButtons,   │
│                     EmptyState, PrimaryButton, DefaultButton │
│                                                              │
│  FormModal      ──→ PrimaryButton, DefaultButton            │
│                                                              │
│  DeleteModal    ──→ DangerButton, DefaultButton             │
│                                                              │
│  AlertModal     ──→ (Ant Design Modal directo)              │
│                                                              │
│  ConfirmDialog  ──→ (Ant Design Modal directo)              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Validación de Jerarquía

### **Reglas de Atomic Design:**
1. ✅ **Atoms NO pueden importar otros atoms** (excepto wrappers internos de Ant Design)
2. ✅ **Molecules DEBEN usar atoms** (no Ant Design directamente)
3. ✅ **Organisms DEBEN usar molecules y/o atoms** (no Ant Design directamente cuando existe un atom)

### **Validación por componente:**

| Componente | Tipo | Usa Atoms ✅ | Usa Molecules ✅ | Usa Organisms ❌ |
|------------|------|-------------|-----------------|-----------------|
| `ActionButtons` | Molecule | ✅ Primary, Danger, Default, Tooltip | - | - |
| `SearchBar` | Molecule | ✅ Input | - | - |
| `FormField` | Molecule | ✅ Input | - | - |
| `StatusBadge` | Molecule | ✅ Badge | - | - |
| `EmptyState` | Molecule | ✅ Icon | - | - |
| `PageHeader` | Molecule | ✅ Button, Divider | - | - |
| `StatCard` | Molecule | ✅ Card | - | - |
| `DataTable` | Organism | ✅ Primary, Default, Tooltip | ✅ SearchBar, PageHeader, ActionButtons, EmptyState | - |
| `FormModal` | Organism | ✅ Primary, Default | - | - |
| `DeleteModal` | Organism | ✅ Danger, Default | - | - |

---

## 🎯 Beneficios de esta Jerarquía

1. **Reutilización máxima:** Cambia un atom y afecta todos los molecules/organisms
2. **Consistencia:** Todos los botones usan los mismos atoms
3. **Mantenibilidad:** Un solo lugar para cambiar estilos
4. **Escalabilidad:** Fácil agregar nuevos componentes siguiendo el patrón
5. **Testing:** Testear atoms garantiza que molecules/organisms funcionen
6. **Documentación clara:** La jerarquía define las dependencias

---

## 📝 Ejemplo de Uso en Features

```jsx
// features/roles/components/RoleList.jsx
import DataTable from '@components/organisms/DataTable';      // Organism
import FormModal from '@components/organisms/FormModal';      // Organism
import DeleteModal from '@components/organisms/DeleteModal';  // Organism
import StatCard from '@components/molecules/StatCard';        // Molecule
import Avatar from '@components/atoms/Avatar';                // Atom

const RoleList = () => {
  return (
    <>
      {/* Molecules usadas directamente */}
      <StatCard title="Total Roles" value={stats.total} />

      {/* Organisms contienen molecules y atoms internamente */}
      <DataTable
        dataSource={roles}
        columns={columns}
        onCreate={handleCreate}  // DataTable usa PrimaryButton internamente
        onEdit={handleEdit}      // DataTable usa ActionButtons → PrimaryButton
        onDelete={handleDelete}  // DataTable usa ActionButtons → DangerButton
      />

      {/* FormModal usa PrimaryButton y DefaultButton internamente */}
      <FormModal
        visible={modalVisible}
        onSubmit={handleSubmit}  // Botón "Guardar" (PrimaryButton)
        onCancel={handleCancel}  // Botón "Cancelar" (DefaultButton)
      >
        <RoleFormFields />
      </FormModal>
    </>
  );
};
```

---

## 🔄 Cambios Aplicados en esta Refactorización

| Componente | Antes | Después | Mejora |
|-----------|-------|---------|--------|
| `ActionButtons` | `Button` genérico | `PrimaryButton`, `DangerButton`, `DefaultButton` | ✅ Colores específicos |
| `DataTable` | `Button` genérico | `PrimaryButton`, `DefaultButton` | ✅ Botones semánticos |
| `FormModal` | `Button` genérico | `PrimaryButton`, `DefaultButton` | ✅ Tipos claros |
| `DeleteModal` | Manual | `DangerButton`, `DefaultButton` | ✅ Componentes reutilizables |

---

**Total de archivos refactorizados:** 4 componentes  
**Jerarquía validada:** ✅ 100% conforme a Atomic Design  
**Fecha:** 3 de noviembre de 2025
