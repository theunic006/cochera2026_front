# 📚 GUÍA DE USO - COMPONENTES FASE 2

## 🎨 Loading States (Skeleton Components)

### TableSkeleton

Muestra un skeleton mientras carga una tabla.

```javascript
import { TableSkeleton } from '@/components/common';

const IngresoList = () => {
  const [loading, setLoading] = useState(true);
  const [ingresos, setIngresos] = useState([]);

  if (loading) {
    return <TableSkeleton rows={10} columns={5} />;
  }

  return <Table dataSource={ingresos} />;
};
```

**Props:**
- `rows` (number): Cantidad de filas del skeleton (default: 5)
- `columns` (number): Cantidad de columnas (default: 4)

---

### FormSkeleton

Muestra un skeleton mientras carga un formulario.

```javascript
import { FormSkeleton } from '@/components/common';

const UserForm = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <FormSkeleton fields={8} />;
  }

  return <Form>...</Form>;
};
```

**Props:**
- `fields` (number): Cantidad de campos del formulario (default: 6)

---

### CardSkeleton

Muestra un skeleton para tarjetas (usado en Dashboard, grids, etc.)

```javascript
import { CardSkeleton } from '@/components/common';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        <Col span={8}><CardSkeleton hasImage lines={3} /></Col>
        <Col span={8}><CardSkeleton hasImage lines={3} /></Col>
        <Col span={8}><CardSkeleton hasImage lines={3} /></Col>
      </Row>
    );
  }

  return <ActualCards />;
};
```

**Props:**
- `hasImage` (boolean): Mostrar skeleton de imagen (default: false)
- `lines` (number): Líneas de contenido (default: 3)

---

### DashboardSkeleton

Skeleton completo para el dashboard.

```javascript
import { DashboardSkeleton } from '@/components/common';

const Dashboard = () => {
  const { loading, stats } = useDashboardData();

  if (loading) {
    return <DashboardSkeleton />;
  }

  return <ActualDashboard stats={stats} />;
};
```

---

## 🛡️ Error Boundaries

### ListErrorBoundary

Envuelve componentes de lista para manejar errores.

```javascript
import { ListErrorBoundary } from '@/components/common';

const App = () => {
  return (
    <ListErrorBoundary listName="ingresos">
      <IngresoList />
    </ListErrorBoundary>
  );
};
```

**Props:**
- `listName` (string): Nombre de la lista para mensajes personalizados

---

### FormErrorBoundary

Envuelve formularios para manejar errores.

```javascript
import { FormErrorBoundary } from '@/components/common';

const CreateIngresoPage = () => {
  return (
    <FormErrorBoundary formName="Crear Ingreso">
      <IngresoForm />
    </FormErrorBoundary>
  );
};
```

**Props:**
- `formName` (string): Nombre del formulario

---

### DashboardErrorBoundary

Envuelve el dashboard completo.

```javascript
import { DashboardErrorBoundary } from '@/components/common';

const DashboardPage = () => {
  return (
    <DashboardErrorBoundary>
      <Dashboard />
    </DashboardErrorBoundary>
  );
};
```

---

### BaseErrorBoundary (Personalizado)

Error boundary base con props personalizables.

```javascript
import { BaseErrorBoundary } from '@/components/common';

const MyComponent = () => {
  const handleError = (error, errorInfo) => {
    // Enviar a Sentry, LogRocket, etc.
    console.error('Error capturado:', error);
  };

  return (
    <BaseErrorBoundary
      title="Error Personalizado"
      subtitle="Descripción del error"
      onError={handleError}
      showHomeButton={true}
      showResetButton={true}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      <MyChildComponent />
    </BaseErrorBoundary>
  );
};
```

**Props:**
- `title` (string): Título del mensaje de error
- `subtitle` (string): Subtítulo/descripción
- `onError` (function): Callback cuando ocurre error
- `onReset` (function): Callback al hacer reset
- `showHomeButton` (boolean): Mostrar botón "Ir al Inicio"
- `showResetButton` (boolean): Mostrar botón "Intentar de Nuevo"
- `showDetails` (boolean): Mostrar detalles técnicos del error
- `customAction` (ReactNode): Botón de acción personalizado

---

## 📖 Ejemplo Completo: IngresoList con Todo

```javascript
import React, { useState, useEffect } from 'react';
import { 
  TableSkeleton, 
  ListErrorBoundary 
} from '@/components/common';
import { ingresoService } from '@/services';

const IngresoListContainer = () => {
  return (
    <ListErrorBoundary listName="Lista de Ingresos">
      <IngresoList />
    </ListErrorBoundary>
  );
};

const IngresoList = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ingresoService.getAll();
        setIngresos(data);
      } catch (error) {
        // El error será capturado por ListErrorBoundary
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mostrar skeleton mientras carga
  if (loading) {
    return <TableSkeleton rows={10} columns={6} />;
  }

  return (
    <Table
      dataSource={ingresos}
      columns={columns}
      rowKey="id"
    />
  );
};

export default IngresoListContainer;
```

---

## 📖 Ejemplo Completo: Dashboard con Todo

```javascript
import React, { useState, useEffect } from 'react';
import { 
  DashboardSkeleton, 
  DashboardErrorBoundary 
} from '@/components/common';

const DashboardContainer = () => {
  return (
    <DashboardErrorBoundary>
      <Dashboard />
    </DashboardErrorBoundary>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        // El error será capturado por DashboardErrorBoundary
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard">
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Statistic title="Ingresos" value={stats.ingresos} />
        </Col>
        {/* ... más stats */}
      </Row>
    </div>
  );
};

export default DashboardContainer;
```

---

## 🎯 Mejores Prácticas

### 1. **Siempre usar skeleton en cargas > 300ms**
```javascript
// ❌ MAL: Mostrar nada o spinner genérico
if (loading) return <Spin />;

// ✅ BIEN: Mostrar skeleton específico
if (loading) return <TableSkeleton rows={8} columns={5} />;
```

### 2. **Error Boundaries en cada sección crítica**
```javascript
// ✅ BIEN: Envolver cada sección
<ListErrorBoundary listName="Ingresos">
  <IngresoList />
</ListErrorBoundary>

<FormErrorBoundary formName="Crear Usuario">
  <UserForm />
</FormErrorBoundary>
```

### 3. **No mostrar skeleton en cargas rápidas**
```javascript
const [loading, setLoading] = useState(true);
const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);

useEffect(() => {
  // Mostrar skeleton solo si tarda más de 300ms
  const timer = setTimeout(() => {
    if (loading) {
      setShouldShowSkeleton(true);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [loading]);

if (loading && shouldShowSkeleton) {
  return <TableSkeleton />;
}
```

---

## 🚀 Próximos Pasos

Después de implementar estos componentes:

1. ✅ **Reemplazar Spin genéricos** por skeletons específicos
2. ✅ **Envolver componentes críticos** con Error Boundaries
3. ✅ **Testear errores** en desarrollo (lanzar errores intencionales)
4. ⏳ **Continuar con Code Splitting** (lazy loading de rutas)
5. ⏳ **Bundle Analysis** (optimizar dependencias)

---

**Documentación generada:** 6 de noviembre de 2025  
**Versión:** 1.0  
**Estado:** Quick Wins - Fase 2 en progreso 🚀
