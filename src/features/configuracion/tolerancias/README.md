# 📁 Features: Configuración - Tolerancias

## 🎯 Descripción
Módulo de gestión de tolerancias de tiempo para el sistema de cochera.

## 📂 Estructura
```
features/configuracion/tolerancias/
├── components/
│   ├── ToleranceList.jsx       # Lista principal con tabla y estadísticas
│   └── ToleranceForm.jsx       # Formulario crear/editar
├── services/
│   └── toleranceService.js     # API calls
└── index.js                    # Barrel exports
```

## 🔗 Dependencias

### Internas (Proyecto)
- `components/AppLayout.jsx` - Layout principal
- `components/common/TableBase.jsx` - Tabla reutilizable
- `hooks/useDebounce.js` - Debounce para búsquedas
- `utils/apiClient.js` - Cliente API base
- `utils/apiHelpers.js` - Helpers para respuestas API

### Externas (NPM)
- `react` - Framework
- `antd` - Componentes UI
- `@ant-design/icons` - Iconos

## 🚀 Uso

### Importar componentes
```javascript
import { ToleranceList, ToleranceForm } from '@/features/configuracion/tolerancias';
```

### Importar servicio
```javascript
import { toleranceService } from '@/features/configuracion/tolerancias';
```

## 📊 API Endpoints
- `GET /tolerancias?page={page}&per_page={perPage}` - Listar con paginación
- `GET /tolerancias/{id}` - Obtener por ID
- `POST /tolerancias` - Crear
- `PUT /tolerancias/{id}` - Actualizar
- `DELETE /tolerancias/{id}` - Eliminar
- `GET /tolerancias/search?q={query}` - Buscar
- `GET /tolerancias/by-empresa?id_empresa={id}` - Por empresa

## ✅ Optimizaciones Aplicadas
- ✅ `useCallback` en todos los handlers
- ✅ `useMemo` en columnas de tabla
- ✅ `useDebounce` en búsqueda
- ✅ Paginación server-side
- ✅ Error handling consistente
- ✅ Loading states

## 🔄 Migración desde componentes antiguos
**Antes:** `src/components/tolerances/`
**Ahora:** `src/features/configuracion/tolerancias/`

### Cambios en imports:
```javascript
// ❌ Antes
import { ToleranceList } from './components/tolerances';
import { toleranceService } from './services/toleranceService';

// ✅ Ahora
import { ToleranceList } from './features/configuracion/tolerancias';
import { toleranceService } from './features/configuracion/tolerancias';
```

## 📝 Notas
- Módulo completamente autocontenido
- Sin dependencias circulares
- Fácil de mantener y testear
- Preparado para expansión futura
