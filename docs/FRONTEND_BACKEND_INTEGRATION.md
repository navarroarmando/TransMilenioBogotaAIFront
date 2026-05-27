# Documentación de Integración Frontend-Backend
## Sistema de Soporte a Decisiones - TransMilenio Bogotá

Este documento explica el funcionamiento del frontend para facilitar la integración con el backend.

---

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Autenticación y Autorización](#autenticación-y-autorización)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [Tipos de Datos y Contratos](#tipos-de-datos-y-contratos)
7. [Servicios y APIs](#servicios-y-apis)
8. [Estado Global](#estado-global)
9. [Navegación y Rutas](#navegación-y-rutas)
10. [Endpoints Requeridos del Backend](#endpoints-requeridos-del-backend)

---

## 🏗️ Arquitectura General

### Patrón Arquitectónico
- **Container/Presenter Pattern**: Separación de lógica de negocio y presentación
- **Custom Hooks**: Reutilización de lógica de estado y efectos
- **Repository Pattern**: Abstracción del acceso a datos
- **Context API**: Manejo de estado global (Auth, Theme)

### Flujo de Datos
```
Usuario → Componente UI → Custom Hook → Servicio → Backend
                ↓
            Context API (Estado Global)
```

---

## 💻 Tecnologías Utilizadas

- **React 18+**: Framework de UI
- **TypeScript**: Tipado estático
- **TailwindCSS**: Estilos y diseño
- **React Router**: Navegación
- **Lucide React**: Iconos
- **Zod**: Validación de esquemas

---

## 📁 Estructura del Proyecto

```
src/
├── auth/
│   ├── components/
│   │   ├── Login.tsx          # Pantalla de inicio de sesión
│   │   ├── Register.tsx       # Pantalla de registro
│   │   └── ProtectedRoute.tsx # Ruta protegida
│   ├── context/
│   │   └── AuthContext.tsx    # Contexto de autenticación
│   ├── services/
│   │   ├── AuthService.ts    # Interfaz de servicio de auth
│   │   └── MockAuthService.ts # Implementación mock
│   └── types/
│       └── auth.types.ts      # Tipos de autenticación
├── components/
│   └── layout/
│       ├── MainLayout.tsx     # Layout principal
│       ├── Header.tsx         # Encabezado
│       └── Sidebar.tsx        # Barra lateral
├── contexts/
│   └── ThemeContext.tsx      # Contexto de tema claro/oscuro
├── hooks/
│   ├── useAuth.ts            # Hook de autenticación
│   ├── useDashboardData.ts   # Hook de datos del dashboard
│   ├── useDataManagement.ts  # Hook de gestión de datos
│   ├── useHistory.ts         # Hook de historial
│   └── useReports.ts         # Hook de informes
├── pages/
│   ├── Dashboard/            # Módulo de Dashboard
│   ├── DataManagement/       # Módulo de Gestión de Datos
│   ├── OptimizationEngine/   # Módulo de Motor de Optimización
│   ├── Results/              # Módulo de Resultados
│   ├── History/              # Módulo de Historial
│   └── Reports/              # Módulo de Informes
├── services/
│   ├── mock/
│   │   └── optimizationMock.ts # Datos mock de optimización
│   └── types/
│       └── optimization.types.ts # Tipos de optimización
└── App.tsx                   # Componente principal de la aplicación
```

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

#### Login
```
1. Usuario ingresa credenciales (email, password)
2. Validación con Zod (email válido, password >= 6 caracteres)
3. Llamada a AuthContext.login(credentials)
4. AuthStrategy.login() → Backend
5. Backend retorna: { success, user, token }
6. Guardar token y user en localStorage
7. Redirigir a /dashboard
```

#### Registro
```
1. Usuario ingresa datos (name, email, password, confirmPassword)
2. Validación: contraseñas coinciden, password >= 6 caracteres
3. Llamada a AuthContext.register(name, email, password)
4. AuthStrategy.register() → Backend
5. Backend retorna: { success, user, token }
6. Guardar token y user en localStorage
7. Redirigir a /dashboard
```

#### Logout
```
1. Usuario hace clic en "Cerrar Sesión"
2. Llamada a AuthContext.logout()
3. Eliminar token y user de localStorage
4. Redirigir a /login
```

### Tipos de Autenticación

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  city: string; // "TransMilenio Bogotá"
  createdAt: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
}
```

### Rutas Protegidas
- Todas las rutas excepto `/login` y `/register` requieren autenticación
- `ProtectedRoute` verifica si el usuario está autenticado
- Si no está autenticado, redirige a `/login`

---

## 📊 Módulos del Sistema

### 1. Dashboard

**Propósito**: Vista general del sistema con KPIs y alertas

**Componentes**:
- `Dashboard.tsx`: Contenedor principal
- `DashboardKPIs.tsx`: Tarjetas de KPIs
- `DashboardMap.tsx`: Mapa de rutas (placeholder)
- `AlertsPanel.tsx`: Panel de alertas
- `QuickActions.tsx`: Acciones rápidas

**KPIs Mostrados**:
- Demanda Atendida
- Tiempo de Viaje Promedio
- Cobertura
- Utilización de Flota

**Datos Requeridos del Backend**:
```typescript
interface KPIs {
  total_demand_served: number;
  avg_travel_time_min: number;
  coverage_pct: number;
  fleet_utilization: number;
}

interface DashboardData {
  kpis: KPIs;
  routes: Route[];
}
```

**Endpoint Sugerido**: `GET /api/dashboard`

---

### 2. Gestión de Datos (Data Management)

**Propósito**: Carga y validación de archivos GTFS y matrices de demanda

**Componentes**:
- `DataManagement.tsx`: Contenedor principal
- `GTFSUpload.tsx`: Carga de archivos GTFS/KMZ
- `DemandUpload.tsx`: Carga de matrices de demanda
- `DataPreview.tsx`: Vista previa de datos cargados
- `ValidationReport.tsx`: Reporte de validación

**Flujo de Carga de Archivos**:
```
1. Usuario selecciona archivo (.zip, .txt, .kmz para GTFS)
2. Validación de tipo de archivo
3. Llamada a uploadFile(file, type)
4. Backend procesa y valida archivo
5. Backend retorna: { success, file, status, errors }
6. Mostrar estado en DataPreview
7. Generar ValidationReport
```

**Tipos de Archivos**:
- GTFS: `.zip`, `.txt`, `.kmz`
- Demanda: `.csv`, `.xlsx`

**Datos Requeridos del Backend**:
```typescript
interface UploadedFile {
  id: string;
  name: string;
  type: 'gtfs' | 'demand';
  size: number;
  uploadedAt: string;
  status: 'valid' | 'invalid' | 'processing';
  errors?: string[];
  warnings?: string[];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

**Endpoints Sugeridos**:
- `POST /api/data/upload` - Cargar archivo
- `GET /api/data/files` - Listar archivos
- `DELETE /api/data/files/:id` - Eliminar archivo
- `POST /api/data/validate` - Validar datos

---

### 3. Motor de Optimización (Optimization Engine)

**Propósito**: Configuración y ejecución de algoritmos de optimización

**Componentes**:
- `OptimizationEngine.tsx`: Contenedor principal
- `OperationalParams.tsx`: Parámetros operativos
- `GAParams.tsx`: Parámetros del algoritmo genético
- `FitnessSliders.tsx`: Pesos de función de fitness
- `ProgressIndicator.tsx`: Indicador de progreso
- `ExecutionLogs.tsx`: Logs de ejecución

**Parámetros Operativos**:
```typescript
interface OperationalParams {
  service_hours_start: number;      // Hora inicio servicio (ej: 5)
  service_hours_end: number;        // Hora fin servicio (ej: 23)
  morning_peak_start: number;       // Inicio pico mañana (ej: 6)
  morning_peak_end: number;         // Fin pico mañana (ej: 9)
  afternoon_peak_start: number;     // Inicio pico tarde (ej: 17)
  afternoon_peak_end: number;       // Fin pico tarde (ej: 19)
  bus_capacity: number;             // Capacidad del bus (ej: 80)
  max_travel_time_min: number;     // Tiempo máximo viaje (min)
  min_stops: number;                // Mínimo de paradas
  max_stops: number;                // Máximo de paradas
  min_distance_km: number;          // Distancia mínima (km)
  max_distance_km: number;          // Distancia máxima (km)
  stop_radius_m: number;            // Radio de parada (m)
  target_coverage_pct: number;      // Cobertura objetivo (%)
  time_windows: number;             // Franjas horarias
}
```

**Parámetros del Algoritmo Genético**:
```typescript
interface GAParams {
  population_size: number;          // Tamaño de población
  generations: number;              // Generaciones
  mutation_rate: number;            // Tasa de mutación (0-1)
  crossover_rate: number;            // Tasa de crossover (0-1)
  elitism_count: number;            // Cantidad de élite
  tournament_size: number;          // Tamaño de torneo
  min_route_length: number;         // Longitud mínima de ruta
  max_route_length: number;         // Longitud máxima de ruta
  distance_bias_km: number;         // Bias de distancia (km)
  enable_dijkstra: boolean;         // Habilitar Dijkstra
}
```

**Pesos de Fitness**:
```typescript
interface FitnessWeights {
  efficiency: number;   // Eficiencia (0-100)
  coverage: number;     // Cobertura (0-100)
  equity: number;       // Equidad (0-100)
  economy: number;      // Economía (0-100)
  speed: number;        // Velocidad (0-100)
  transfers: number;    // Transferencias (0-100)
}
```

**Flujo de Optimización**:
```
1. Usuario configura parámetros operativos
2. Usuario configura parámetros GA
3. Usuario ajusta pesos de fitness
4. Usuario hace clic en "Ejecutar Optimización"
5. Validación de parámetros
6. Envío de parámetros al backend
7. Backend ejecuta algoritmo genético
8. Backend retorna: { executionId, status, progress }
9. Actualizar ProgressIndicator
10. Mostrar logs en ExecutionLogs
11. Al completar, redirigir a Results
```

**Endpoints Sugeridos**:
- `POST /api/optimization/start` - Iniciar optimización
- `GET /api/optimization/status/:id` - Verificar estado
- `GET /api/optimization/logs/:id` - Obtener logs
- `POST /api/optimization/cancel/:id` - Cancelar optimización

---

### 4. Resultados (Results)

**Propósito**: Visualización y análisis de resultados de optimización

**Componentes**:
- `Results.tsx`: Contenedor principal
- `KPITable.tsx`: Tabla de KPIs
- `RoutesList.tsx`: Lista de rutas optimizadas
- `ComparisonMap.tsx`: Mapa comparativo

**Datos Mostrados**:
```typescript
interface OptimizationResults {
  execution_id: string;
  timestamp: string;
  params: OptimizationParams;
  routes: Route[];
  kpis: KPIs;
  comparison: {
    before: KPIs;
    after: KPIs;
    variation: Record<string, number>;
  };
}

interface Route {
  id: string;
  name: string;
  stops: Stop[];
  total_distance_km: number;
  total_travel_time_min: number;
  demand_served: number;
  fitness_score: number;
}
```

**Comparación Antes/Después**:
- KPIs antes de optimización
- KPIs después de optimización
- Variación porcentual de cada KPI

**Endpoints Sugeridos**:
- `GET /api/results/:executionId` - Obtener resultados
- `GET /api/results/:executionId/routes` - Obtener rutas
- `GET /api/results/:executionId/comparison` - Obtener comparación

---

### 5. Historial (History)

**Propósito**: Registro de todas las ejecuciones de optimización

**Componentes**:
- `History.tsx`: Contenedor principal
- Tabla de ejecuciones con filtros

**Datos Mostrados**:
```typescript
interface Execution {
  id: string;
  timestamp: string;
  params: OptimizationParams;
  results: OptimizationResults;
  status: 'completed' | 'failed' | 'under_review' | 'applied' | 'discarded';
  duration_seconds: number;
}
```

**Estados de Ejecución**:
- `completed`: Ejecución completada exitosamente
- `failed`: Ejecución falló
- `under_review`: En revisión
- `applied`: Solución aplicada
- `discarded`: Solución descartada

**Acciones Disponibles**:
- Ver detalles de ejecución
- Generar informe (navega a Reports con executionId seleccionado)

**Endpoints Sugeridos**:
- `GET /api/history` - Listar todas las ejecuciones
- `GET /api/history/:id` - Obtener detalles de ejecución
- `PATCH /api/history/:id/status` - Actualizar estado

---

### 6. Informes (Reports)

**Propósito**: Generación y descarga de informes de optimización

**Componentes**:
- `Reports.tsx`: Contenedor principal

**Funcionalidades**:
- Selección de ejecución del historial
- Generación de informe PDF
- Generación de hoja de cálculo Excel
- Opciones de exportación (KPIs, rutas, comparación, gráficos)

**Flujo de Generación de Informe**:
```
1. Usuario selecciona ejecución del historial
2. Usuario selecciona tipo de informe (PDF/Excel)
3. Usuario configura opciones de exportación
4. Llamada a generatePDF() o generateExcel()
5. Backend genera informe
6. Usuario descarga archivo
```

**Opciones de Exportación**:
- Incluir KPIs
- Incluir rutas detalladas
- Incluir comparación antes/después
- Incluir gráficos

**Endpoints Sugeridos**:
- `POST /api/reports/pdf` - Generar PDF
- `POST /api/reports/excel` - Generar Excel
- `GET /api/reports/:id` - Obtener informe

---

## 📝 Tipos de Datos y Contratos

### Tipos Principales

```typescript
// optimization.types.ts
export interface OperationalParams {
  service_hours_start: number;
  service_hours_end: number;
  morning_peak_start: number;
  morning_peak_end: number;
  afternoon_peak_start: number;
  afternoon_peak_end: number;
  bus_capacity: number;
  max_travel_time_min: number;
  min_stops: number;
  max_stops: number;
  min_distance_km: number;
  max_distance_km: number;
  stop_radius_m: number;
  target_coverage_pct: number;
  time_windows: number;
}

export interface GAParams {
  population_size: number;
  generations: number;
  mutation_rate: number;
  crossover_rate: number;
  elitism_count: number;
  tournament_size: number;
  min_route_length: number;
  max_route_length: number;
  distance_bias_km: number;
  enable_dijkstra: boolean;
}

export interface FitnessWeights {
  efficiency: number;
  coverage: number;
  equity: number;
  economy: number;
  speed: number;
  transfers: number;
}

export interface OptimizationParams {
  operational: OperationalParams;
  ga: GAParams;
  fitness_weights: FitnessWeights;
}

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  stratum: number;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  total_distance_km: number;
  total_travel_time_min: number;
  demand_served: number;
  fitness_score: number;
}

export interface KPIs {
  total_demand_served: number;
  avg_travel_time_min: number;
  total_distance_km: number;
  coverage_pct: number;
  equity_score: number;
  operating_cost: number;
  fleet_utilization: number;
}

export interface OptimizationResults {
  execution_id: string;
  timestamp: string;
  params: OptimizationParams;
  routes: Route[];
  kpis: KPIs;
  comparison: {
    before: KPIs;
    after: KPIs;
    variation: Record<string, number>;
  };
}

export interface Execution {
  id: string;
  timestamp: string;
  params: OptimizationParams;
  results: OptimizationResults;
  status: 'completed' | 'failed' | 'under_review' | 'applied' | 'discarded';
  duration_seconds: number;
}
```

---

## 🔌 Servicios y APIs

### Patrón de Servicio

```typescript
// Interfaz de servicio
interface AuthStrategy {
  login(credentials: Credentials): Promise<AuthResult>;
  register(name: string, email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}

// Implementación actual (Mock)
export class MockAuthStrategy implements AuthStrategy {
  async login(credentials: Credentials): Promise<AuthResult> {
    // Implementación mock
  }
  
  async register(name: string, email: string, password: string): Promise<AuthResult> {
    // Implementación mock
  }
  
  async logout(): Promise<void> {
    // Implementación mock
  }
  
  async refreshToken(): Promise<string> {
    // Implementación mock
  }
}
```

**Para Integración con Backend**:
- Reemplazar `MockAuthStrategy` con `ApiAuthStrategy`
- Implementar llamadas HTTP reales
- Manejar errores de red
- Implementar refresh token automático

---

## 🌐 Estado Global

### AuthContext

**Propósito**: Manejar estado de autenticación global

**Estado**:
```typescript
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}
```

**Uso**:
```typescript
const { user, isAuthenticated, login, logout, register } = useAuth();
```

### ThemeContext

**Propósito**: Manejar tema claro/oscuro

**Estado**:
```typescript
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
```

**Uso**:
```typescript
const { isDark, toggleTheme } = useTheme();
```

---

## 🧭 Navegación y Rutas

### Rutas de la Aplicación

```typescript
// Rutas públicas
/login          - Pantalla de inicio de sesión
/register       - Pantalla de registro

// Rutas protegidas
/dashboard      - Dashboard principal
/data-management - Gestión de datos
/optimization   - Motor de optimización
/results        - Resultados de optimización
/history        - Historial de ejecuciones
/reports        - Informes
```

### Navegación Programática

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navegación básica
navigate('/dashboard');

// Navegación con estado
navigate('/reports', { state: { selectedExecutionId: '123' } });

// Navegación con reemplazo
navigate('/dashboard', { replace: true });
```

### Navegación con Links

```typescript
import { Link } from 'react-router-dom';

<Link to="/register">Regístrate</Link>
```

---

## 🔗 Endpoints Requeridos del Backend

### Autenticación

#### POST /api/auth/login
**Descripción**: Iniciar sesión

**Request**:
```json
{
  "email": "admin@siva.gov",
  "password": "admin123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "admin@siva.gov",
    "name": "Administrador",
    "city": "TransMilenio Bogotá",
    "createdAt": "2026-05-26T00:00:00Z"
  },
  "token": "jwt-token-here"
}
```

#### POST /api/auth/register
**Descripción**: Registrar nuevo usuario

**Request**:
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "2",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "city": "TransMilenio Bogotá",
    "createdAt": "2026-05-26T00:00:00Z"
  },
  "token": "jwt-token-here"
}
```

#### POST /api/auth/logout
**Descripción**: Cerrar sesión

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true
}
```

---

### Dashboard

#### GET /api/dashboard
**Descripción**: Obtener datos del dashboard

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "kpis": {
    "total_demand_served": 150000,
    "avg_travel_time_min": 45,
    "coverage_pct": 85,
    "fleet_utilization": 0.75
  },
  "routes": []
}
```

---

### Gestión de Datos

#### POST /api/data/upload
**Descripción**: Cargar archivo (GTFS o Demanda)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request**:
```
file: {archivo}
type: "gtfs" | "demand"
```

**Response**:
```json
{
  "success": true,
  "file": {
    "id": "file-123",
    "name": "transmilenio-gtfs.zip",
    "type": "gtfs",
    "size": 1024000,
    "uploadedAt": "2026-05-26T00:00:00Z",
    "status": "processing"
  }
}
```

#### GET /api/data/files
**Descripción**: Listar archivos cargados

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "files": [
    {
      "id": "file-123",
      "name": "transmilenio-gtfs.zip",
      "type": "gtfs",
      "size": 1024000,
      "uploadedAt": "2026-05-26T00:00:00Z",
      "status": "valid"
    }
  ]
}
```

#### DELETE /api/data/files/:id
**Descripción**: Eliminar archivo

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true
}
```

#### POST /api/data/validate
**Descripción**: Validar datos cargados

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "fileId": "file-123"
}
```

**Response**:
```json
{
  "isValid": true,
  "errors": [],
  "warnings": []
}
```

---

### Motor de Optimización

#### POST /api/optimization/start
**Descripción**: Iniciar optimización

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "operational": {
    "service_hours_start": 5,
    "service_hours_end": 23,
    "morning_peak_start": 6,
    "morning_peak_end": 9,
    "afternoon_peak_start": 17,
    "afternoon_peak_end": 19,
    "bus_capacity": 80,
    "max_travel_time_min": 60,
    "min_stops": 10,
    "max_stops": 30,
    "min_distance_km": 5,
    "max_distance_km": 25,
    "stop_radius_m": 300,
    "target_coverage_pct": 85,
    "time_windows": 4
  },
  "ga": {
    "population_size": 100,
    "generations": 500,
    "mutation_rate": 0.1,
    "crossover_rate": 0.8,
    "elitism_count": 10,
    "tournament_size": 5,
    "min_route_length": 10,
    "max_route_length": 30,
    "distance_bias_km": 15,
    "enable_dijkstra": true
  },
  "fitness_weights": {
    "efficiency": 30,
    "coverage": 25,
    "equity": 20,
    "economy": 15,
    "speed": 5,
    "transfers": 5
  }
}
```

**Response**:
```json
{
  "executionId": "exec-123",
  "status": "running",
  "message": "Optimización iniciada"
}
```

#### GET /api/optimization/status/:id
**Descripción**: Verificar estado de optimización

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "executionId": "exec-123",
  "status": "running",
  "progress": 45,
  "currentGeneration": 225,
  "totalGenerations": 500
}
```

#### GET /api/optimization/logs/:id
**Descripción**: Obtener logs de ejecución

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "logs": [
    {
      "timestamp": "2026-05-26T00:00:00Z",
      "level": "info",
      "message": "Iniciando optimización..."
    },
    {
      "timestamp": "2026-05-26T00:00:01Z",
      "level": "info",
      "message": "Generación 1 completada"
    }
  ]
}
```

#### POST /api/optimization/cancel/:id
**Descripción**: Cancelar optimización

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "message": "Optimización cancelada"
}
```

---

### Resultados

#### GET /api/results/:executionId
**Descripción**: Obtener resultados de optimización

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "execution_id": "exec-123",
  "timestamp": "2026-05-26T00:00:00Z",
  "params": { /* parámetros usados */ },
  "routes": [
    {
      "id": "route-1",
      "name": "Ruta 1",
      "stops": [],
      "total_distance_km": 15.5,
      "total_travel_time_min": 45,
      "demand_served": 5000,
      "fitness_score": 0.85
    }
  ],
  "kpis": {
    "total_demand_served": 150000,
    "avg_travel_time_min": 42,
    "total_distance_km": 2500,
    "coverage_pct": 88,
    "equity_score": 0.75,
    "operating_cost": 5000000,
    "fleet_utilization": 0.82
  },
  "comparison": {
    "before": { /* KPIs antes */ },
    "after": { /* KPIs después */ },
    "variation": {
      "coverage_pct": 3.5,
      "avg_travel_time_min": -6.7
    }
  }
}
```

---

### Historial

#### GET /api/history
**Descripción**: Listar todas las ejecuciones

**Headers**:
```
Authorization: Bearer {token}
```

**Query Params**:
- `status`: Filtrar por estado (opcional)
- `startDate`: Filtrar por fecha inicio (opcional)
- `endDate`: Filtrar por fecha fin (opcional)

**Response**:
```json
{
  "executions": [
    {
      "id": "exec-123",
      "timestamp": "2026-05-26T00:00:00Z",
      "params": { /* parámetros */ },
      "results": { /* resultados */ },
      "status": "completed",
      "duration_seconds": 120
    }
  ]
}
```

#### GET /api/history/:id
**Descripción**: Obtener detalles de ejecución

**Headers**:
```
Authorization: Bearer {token}
```

**Response**: (Mismo que GET /api/results/:executionId)

#### PATCH /api/history/:id/status
**Descripción**: Actualizar estado de ejecución

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "status": "applied"
}
```

**Response**:
```json
{
  "success": true
}
```

---

### Informes

#### POST /api/reports/pdf
**Descripción**: Generar informe PDF

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "executionId": "exec-123",
  "options": {
    "includeKPIs": true,
    "includeRoutes": true,
    "includeComparison": true,
    "includeCharts": false
  }
}
```

**Response**:
```json
{
  "success": true,
  "reportId": "report-123",
  "downloadUrl": "/api/reports/download/report-123"
}
```

#### POST /api/reports/excel
**Descripción**: Generar hoja de cálculo Excel

**Headers**:
```
Authorization: Bearer {token}
```

**Request**: (Mismo que PDF)

**Response**: (Mismo que PDF)

#### GET /api/reports/download/:id
**Descripción**: Descargar informe

**Headers**:
```
Authorization: Bearer {token}
```

**Response**: Archivo (PDF o Excel)

---

## 🎨 Diseño y Estilos

### Paleta de Colores

- **#002E5E**: Azul oscuro (primary dark)
- **#015EB0**: Azul medio (primary light)
- **#3EA32A**: Verde (accent)
- **#FFFFFF**: Blanco (fondo claro)
- **#1a1a2e**: Gris oscuro (fondo oscuro)

### Tema Claro/Oscuro

- **Claro**: Fondo blanco, texto oscuro
- **Oscuro**: Fondo gris oscuro, texto claro
- **Toggle**: Botón en Header para cambiar tema

### Componentes Reutilizables

- **Botones**: Gradientes, sombras, efectos hover
- **Inputs**: Bordes, focus rings, validación
- **Tarjetas**: Sombras, bordes, hover effects
- **Tablas**: Estilos elaborados, colores de estado

---

## 🚀 Flujo Completo de Usuario

### 1. Registro y Login
```
Usuario → /register → Completar formulario → Backend → /login
Usuario → /login → Ingresar credenciales → Backend → /dashboard
```

### 2. Carga de Datos
```
Usuario → /data-management → Cargar GTFS → Backend → Validar → Cargar Demanda → Backend → Validar
```

### 3. Optimización
```
Usuario → /optimization → Configurar parámetros → Ejecutar → Backend → Progreso → /results
```

### 4. Análisis de Resultados
```
Usuario → /results → Ver KPIs → Ver rutas → Comparar antes/después
```

### 5. Historial
```
Usuario → /history → Ver ejecuciones → Seleccionar → Generar informe → /reports
```

### 6. Informes
```
Usuario → /reports → Seleccionar ejecución → Configurar opciones → Generar PDF/Excel → Descargar
```

---

## 📞 Contacto y Soporte

Para dudas sobre la integración frontend-backend, contactar al equipo de desarrollo frontend.

---

**Última actualización**: 26 de mayo de 2026
**Versión**: 1.0.0
