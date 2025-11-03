# Botones de Colores Sólidos - Guía de Uso

## 📚 Resumen

Se han creado **7 nuevos botones atoms** con colores sólidos para expandir la paleta de acciones disponibles en la aplicación. Estos botones se integran perfectamente con `ActionButtons` molecule.

---

## 🎨 Botones Disponibles

### 1. **PurpleButton** - Morado (#722ed1)
**Uso:** Acciones premium, especiales o destacadas
```jsx
import { PurpleButton } from '@components/atoms';

<PurpleButton onClick={handlePremium} icon={<CrownOutlined />}>
  Upgrade Premium
</PurpleButton>
```

### 2. **PinkButton** - Rosado (#eb2f96)
**Uso:** Favoritos, me gusta, promociones
```jsx
import { PinkButton } from '@components/atoms';

<PinkButton onClick={handleFavorite} icon={<HeartOutlined />}>
  Favorito
</PinkButton>
```

### 3. **CyanButton** - Cian (#13c2c2)
**Uso:** Información, enlaces, visualización
```jsx
import { CyanButton } from '@components/atoms';

<CyanButton onClick={handleInfo} icon={<InfoCircleOutlined />}>
  Ver detalles
</CyanButton>
```

### 4. **YellowButton** - Amarillo (#faad14)
**Uso:** Destacar, promociones especiales
**Nota:** Usa texto oscuro para mejor contraste
```jsx
import { YellowButton } from '@components/atoms';

<YellowButton onClick={handlePromo} icon={<StarOutlined />}>
  Promoción
</YellowButton>
```

### 5. **MagentaButton** - Magenta (#c41d7f)
**Uso:** Acciones creativas, funciones premium
```jsx
import { MagentaButton } from '@components/atoms';

<MagentaButton onClick={handleSpecial} icon={<StarFilled />}>
  Premium
</MagentaButton>
```

### 6. **DarkGreenButton** - Verde Oscuro (#389e0d)
**Uso:** Confirmaciones importantes, activaciones
```jsx
import { DarkGreenButton } from '@components/atoms';

<DarkGreenButton onClick={handleConfirm} icon={<CheckCircleOutlined />}>
  Confirmar
</DarkGreenButton>
```

### 7. **IndigoButton** - Índigo (#2f54eb)
**Uso:** Acciones profesionales, ejecución
```jsx
import { IndigoButton } from '@components/atoms';

<IndigoButton onClick={handleExecute} icon={<ThunderboltOutlined />}>
  Ejecutar
</IndigoButton>
```

---

## 🔧 Integración con ActionButtons

Los nuevos botones están completamente integrados en `ActionButtons` molecule a través de la prop `extraActions`:

### Ejemplo Completo

```jsx
import ActionButtons from '@components/molecules/ActionButtons';
import { 
  EditOutlined, 
  DeleteOutlined,
  StarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const columns = [
  {
    title: 'Acciones',
    key: 'actions',
    render: (_, record) => (
      <ActionButtons
        onEdit={() => handleEdit(record)}
        onDelete={() => handleDelete(record)}
        extraActions={[
          {
            icon: <StarOutlined />,
            onClick: () => handleFavorite(record),
            tooltip: 'Marcar como favorito',
            color: 'purple'
          },
          {
            icon: <HeartOutlined />,
            onClick: () => handleLike(record),
            tooltip: 'Me gusta',
            color: 'pink'
          },
          {
            icon: <CheckCircleOutlined />,
            onClick: () => handleActivate(record),
            tooltip: 'Activar',
            color: 'darkGreen'
          },
          {
            icon: <InfoCircleOutlined />,
            onClick: () => handleInfo(record),
            tooltip: 'Ver información',
            color: 'cyan'
          }
        ]}
      />
    ),
  },
];
```

---

## 🎯 Colores Disponibles en extraActions

| Color | Valor | Botón | Uso Recomendado |
|-------|-------|-------|-----------------|
| `'default'` | Gris | DefaultButton | Acciones secundarias |
| `'primary'` | Azul | PrimaryButton | Acciones principales |
| `'success'` | Verde | SuccessButton | Confirmaciones |
| `'warning'` | Naranja | WarningButton | Advertencias |
| `'danger'` | Rojo | DangerButton | Eliminar, rechazar |
| `'purple'` | Morado | PurpleButton | Premium, especial |
| `'pink'` | Rosado | PinkButton | Favoritos, likes |
| `'cyan'` | Cian | CyanButton | Información |
| `'yellow'` | Amarillo | YellowButton | Destacar |
| `'magenta'` | Fucsia | MagentaButton | Creativo |
| `'darkGreen'` | Verde oscuro | DarkGreenButton | Activar |
| `'indigo'` | Índigo | IndigoButton | Ejecutar |

---

## 📝 Ejemplo de Tabla con Múltiples Acciones de Colores

```jsx
import { Table } from 'antd';
import ActionButtons from '@components/molecules/ActionButtons';
import {
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const UserTable = () => {
  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 250,
      render: (_, record) => (
        <ActionButtons
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record)}
          extraActions={[
            // Marcar como premium (morado)
            {
              icon: <StarOutlined />,
              onClick: () => handlePremium(record),
              tooltip: 'Marcar como premium',
              color: 'purple',
              disabled: record.isPremium
            },
            // Favorito (rosado)
            {
              icon: <HeartOutlined />,
              onClick: () => handleFavorite(record),
              tooltip: 'Agregar a favoritos',
              color: 'pink'
            },
            // Activar/Desactivar (verde oscuro o rojo)
            record.active ? {
              icon: <CloseCircleOutlined />,
              onClick: () => handleDeactivate(record),
              tooltip: 'Desactivar usuario',
              color: 'danger'
            } : {
              icon: <CheckCircleOutlined />,
              onClick: () => handleActivate(record),
              tooltip: 'Activar usuario',
              color: 'darkGreen'
            },
            // Ver detalles (cian)
            {
              icon: <EyeOutlined />,
              onClick: () => handleView(record),
              tooltip: 'Ver detalles completos',
              color: 'cyan'
            },
            // Descargar reporte (índigo)
            {
              icon: <DownloadOutlined />,
              onClick: () => handleDownload(record),
              tooltip: 'Descargar reporte',
              color: 'indigo'
            }
          ]}
        />
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};
```

---

## 🚀 Ventajas

✅ **12 colores disponibles** para acciones personalizadas
✅ **Integración perfecta** con ActionButtons molecule
✅ **Atomic Design compliant** - Todos son atoms puros
✅ **PropTypes validados** para type safety
✅ **Tooltips automáticos** en ActionButtons
✅ **Estados de loading y disabled** incluidos
✅ **Estilos consistentes** con Ant Design

---

## 📦 Resumen de Archivos Creados

```
src/components/atoms/
├── PurpleButton.jsx      (53 líneas)
├── PinkButton.jsx        (50 líneas)
├── CyanButton.jsx        (50 líneas)
├── YellowButton.jsx      (52 líneas)
├── MagentaButton.jsx     (50 líneas)
├── DarkGreenButton.jsx   (50 líneas)
└── IndigoButton.jsx      (50 líneas)

Total: 7 nuevos atoms, ~355 líneas
```

## 🔄 Archivos Modificados

- `src/components/atoms/index.js` - Agregados 7 exports
- `src/components/molecules/ActionButtons.jsx` - Refactorizado para soportar 12 colores

---

## 🎨 Paleta Visual

| Botón | Color Hex | Preview |
|-------|-----------|---------|
| Purple | #722ed1 | 🟣 Morado |
| Pink | #eb2f96 | 🌸 Rosado |
| Cyan | #13c2c2 | 🔵 Cian |
| Yellow | #faad14 | 🟡 Amarillo |
| Magenta | #c41d7f | 🎀 Fucsia |
| DarkGreen | #389e0d | 🟢 Verde oscuro |
| Indigo | #2f54eb | 🔷 Índigo |
