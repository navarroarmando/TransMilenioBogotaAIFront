# Guía Completa de Desarrollo - Frontend DSS SIVA

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Autenticación Simple](#autenticación-simple)
4. [Arquitectura del Frontend](#arquitectura-del-frontend)
5. [Estructura de Carpetas](#estructura-de-carpetas)
6. [Principios SOLID y Patrones de Diseño](#principios-solid-y-patrones-de-diseño)
7. [Datos Estáticos de Ejemplo](#datos-estáticos-de-ejemplo)
8. [Guía de Desarrollo por Módulo](#guía-de-desarrollo-por-módulo)
9. [Prompt Completo para Desarrollo](#prompt-completo-para-desarrollo)

---

## Visión General

**Objetivo:** Desarrollar el frontend del Sistema de Soporte a Decisiones (DSS) para optimización de rutas de transporte público SIVA Valledupar.

**Contexto Importante:**
- **NO existe backend todavía** - Se usarán datos estáticos de ejemplo (mock data)
- La arquitectura debe respetarse como si hubiera backend real
- Código limpio, mantenible y escalable
- **ENFOQUE PRINCIPAL:** Principios SOLID y patrones de diseño básicos e intermedios

**Módulos a Implementar:**
1. Dashboard - Vista general del sistema
2. Gestión de Datos - Carga y validación de datasets
3. Motor de Optimización - Configuración y ejecución del AG
4. Resultados - Visualización de rutas optimizadas
5. Editor de Rutas - Ajustes manuales con retroalimentación
6. Historial - Registro de ejecuciones
7. Informes - Exportación de resultados

---

## Stack Tecnológico

### Framework y Lenguaje
- **React 18+** con **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Build tool rápido y moderno

### UI Components
- **shadcn/ui** - Componentes modernos y accesibles (Radix UI + Tailwind)
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Iconos modernos y consistentes

### Estado y Datos
- **React Query (TanStack Query)** - Gestión de estado server-side y caché
- **Zustand** - Estado global client-side (opcional para estado simple)
- **React Hook Form** - Manejo de formularios con validación
- **Zod** - Validación de esquemas TypeScript-first

### Mapas y Visualización
- **React Leaflet** - Mapas interactivos
- **Leaflet** - Librería base de mapas
- **Recharts** - Gráficos de KPIs
- **D3.js** - Visualizaciones avanzadas (opcional)

### Routing
- **React Router v6** - Enrutamiento declarativo

### Utilidades
- **date-fns** - Manejo de fechas
- **clsx / tailwind-merge** - Manejo de clases condicionales
- **lodash-es** - Utilidades JavaScript (tree-shakeable)

---

## Autenticación Simple

### Stack de Autenticación

**Para desarrollo sin backend (mock):**
- **React Context API** - Gestión de estado de autenticación
- **localStorage** - Persistencia de sesión (mock)
- **Zod** - Validación de credenciales

**Para producción (con backend):**
- **JWT (JSON Web Tokens)** - Tokens de autenticación
- **React Query** - Gestión de estado server-side
- **HTTP interceptors** - Inyección de tokens en requests

### Patrones de Diseño en Autenticación

**1. Strategy Pattern** - Diferentes proveedores de autenticación
```typescript
// Estrategia de autenticación
interface AuthStrategy {
  login(credentials: Credentials): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}

// Implementación mock (localStorage)
class MockAuthStrategy implements AuthStrategy {
  async login(credentials: Credentials): Promise<AuthResult> {
    // Validación mock
    if (credentials.email === 'admin@siva.gov' && credentials.password === 'admin123') {
      const user: User = {
        id: '1',
        email: credentials.email,
        name: 'Administrador SIVA',
        city: 'Valledupar'
      };
      const token = 'mock-jwt-token-' + Date.now();
      
      // Guardar en localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return { success: true, user, token };
    }
    
    throw new Error('Credenciales inválidas');
  }
  
  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
  
  async refreshToken(): Promise<string> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No hay sesión activa');
    return token;
  }
}

// Implementación API (para producción)
class ApiAuthStrategy implements AuthStrategy {
  async login(credentials: Credentials): Promise<AuthResult> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response.json();
  }
  
  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  }
  
  async refreshToken(): Promise<string> {
    const response = await fetch('/api/auth/refresh');
    const data = await response.json();
    return data.token;
  }
}
```

**2. Singleton Pattern** - Context de autenticación
```typescript
// Context de autenticación (singleton por app)
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Provider que implementa el singleton
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authStrategy = useMemo(() => 
    process.env.NODE_ENV === 'development' 
      ? new MockAuthStrategy() 
      : new ApiAuthStrategy()
  , []);
  
  // Cargar sesión al montar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Error cargando sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSession();
  }, []);
  
  const login = useCallback(async (credentials: Credentials) => {
    const result = await authStrategy.login(credentials);
    setUser(result.user);
  }, [authStrategy]);
  
  const logout = useCallback(async () => {
    await authStrategy.logout();
    setUser(null);
  }, [authStrategy]);
  
  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto (Singleton access)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

**3. Observer Pattern** - React Router + Auth
```typescript
// Componente protegido que observa estado de autenticación
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return null; // Redirigirá por useEffect
  }
  
  return <>{children}</>;
};
```

### Estructura de Carpetas para Autenticación

```
src/
├── auth/                          # Módulo de autenticación
│   ├── components/                # Componentes de auth
│   │   ├── Login.tsx              # Formulario de login
│   │   ├── LogoutButton.tsx      # Botón de logout
│   │   └── ProtectedRoute.tsx     # Ruta protegida
│   ├── hooks/                     # Hooks de auth
│   │   └── useAuth.ts             # Hook principal de auth
│   ├── services/                  # Servicios de auth
│   │   ├── AuthService.ts        # Interface del servicio
│   │   ├── MockAuthService.ts     # Implementación mock
│   │   └── ApiAuthService.ts      # Implementación API (futuro)
│   ├── context/                   # Context de auth
│   │   └── AuthContext.tsx        # Context provider
│   └── types/                     # Tipos de auth
│       └── auth.types.ts          # Tipos TypeScript
```

### Tipos TypeScript

```typescript
// src/auth/types/auth.types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  city: string;
  createdAt?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Componente Login (Container/Presenter)

```typescript
// src/auth/components/Login.tsx

// Container
const LoginContainer = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = useCallback(async (credentials: Credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate]);
  
  return (
    <LoginPresenter 
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
};

// Presenter
interface LoginPresenterProps {
  onSubmit: (credentials: Credentials) => void;
  isLoading: boolean;
  error: string | null;
}

const LoginPresenter = ({ onSubmit, isLoading, error }: LoginPresenterProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Credentials>({
    resolver: zodResolver(loginSchema)
  });
  
  return (
    <div className="login-container">
      <Card className="login-card">
        <CardHeader>
          <CardTitle>Iniciar Sesión - DSS SIVA</CardTitle>
          <CardDescription>
            Sistema de Soporte a Decisiones - Valledupar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@siva.gov"
                {...register('email')}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>
            
            <div className="form-field">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>
            
            {error && (
              <div className="error-banner">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
            
            <Button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Credenciales de prueba: admin@siva.gov / admin123
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

// Schema de validación Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

export default LoginContainer;
```

### Integración con Routing

```typescript
// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/context/AuthContext';
import { ProtectedRoute } from './auth/components/ProtectedRoute';
import Login from './auth/components/Login';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="data-management" element={<DataManagement />} />
        <Route path="optimization" element={<OptimizationEngine />} />
        <Route path="results" element={<Results />} />
        <Route path="editor" element={<RouteEditor />} />
        <Route path="history" element={<History />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      {/* Ruta 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
```

### Header con Información de Usuario

```typescript
// src/components/layout/Header.tsx

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">DSS SIVA Valledupar</h1>
        <span className="city-badge">Valledupar</span>
      </div>
      
      <div className="header-right">
        {user && (
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <LogoutButton onLogout={logout} />
          </div>
        )}
      </div>
    </header>
  );
};
```

### Resumen de Autenticación

**Características:**
- ✅ Autenticación simple con email/password
- ✅ Persistencia de sesión con localStorage (mock)
- ✅ Protección de rutas con ProtectedRoute
- ✅ Validación de credenciales con Zod
- ✅ Context API para estado global (Singleton)
- ✅ Strategy Pattern para diferentes proveedores
- ✅ Observer Pattern para protección de rutas
- ✅ Container/Presenter en componente Login
- ✅ TypeScript estricto (no any)

**Credenciales de prueba (mock):**
- Email: `admin@siva.gov`
- Password: `admin123`

**Fácil migración a backend real:**
- Cambiar `MockAuthStrategy` por `ApiAuthStrategy`
- Reemplazar localStorage por cookies HTTP-only
- Agregar refresh tokens
- Implementar interceptors HTTP

---

## Arquitectura del Frontend

### Principios de Arquitectura

**1. Separación de Responsabilidades (SRP - Single Responsibility Principle)**
- Cada componente debe tener UNA sola razón para cambiar
- Separar lógica de presentación de lógica de negocio
- Componentes UI puros vs componentes contenedores

**2. Inversión de Dependencias (DIP - Dependency Inversion Principle)**
- Dependencias de abstracciones, no de implementaciones concretas
- Interfaces/Types para contratos de datos
- Services layer para llamadas API (aunque sean mock)

**3. Composición sobre Herencia**
- Componer componentes pequeños en componentes grandes
- Render props, compound patterns, children props

**4. Unidirectional Data Flow**
- Datos fluyen de arriba hacia abajo
- Eventos fluyen de abajo hacia arriba
- Estado elevado cuando es necesario

### Capas de la Aplicación

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (Components, Pages, UI)                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  (Hooks, Custom Hooks, Services)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│           Data Access Layer             │
│  (API Clients, Mock Services, Stores)   │
└─────────────────────────────────────────┘
```

---

## Estructura de Carpetas

```
frontend/
├── public/                          # Archivos estáticos
│   └── images/
├── src/
│   ├── assets/                      # Recursos estáticos
│   │   ├── icons/
│   │   └── images/
│   ├── components/                   # Componentes UI reutilizables
│   │   ├── ui/                      # Componentes base (shadcn/ui)
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── input/
│   │   │   ├── select/
│   │   │   ├── slider/
│   │   │   ├── table/
│   │   │   └── ...
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── maps/                    # Componentes de mapas
│   │   │   ├── RouteMap.tsx
│   │   │   ├── ComparisonMap.tsx
│   │   │   └── EditorMap.tsx
│   │   ├── charts/                  # Componentes de gráficos
│   │   │   ├── KPICard.tsx
│   │   │   ├── LineChart.tsx
│   │   │   └── BarChart.tsx
│   │   └── common/                  # Componentes comunes
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   ├── pages/                        # Páginas principales
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DashboardKPIs.tsx
│   │   │   └── DashboardMap.tsx
│   │   ├── DataManagement/
│   │   │   ├── DataManagement.tsx
│   │   │   ├── GTFSUpload.tsx
│   │   │   ├── DemandUpload.tsx
│   │   │   └── DataPreview.tsx
│   │   ├── OptimizationEngine/
│   │   │   ├── OptimizationEngine.tsx
│   │   │   ├── OperationalParams.tsx
│   │   │   ├── GAParams.tsx
│   │   │   ├── FitnessSliders.tsx
│   │   │   └── ExecutionLogs.tsx
│   │   ├── Results/
│   │   │   ├── Results.tsx
│   │   │   ├── ComparisonMap.tsx
│   │   │   ├── KPITable.tsx
│   │   │   └── RoutesList.tsx
│   │   ├── RouteEditor/
│   │   │   ├── RouteEditor.tsx
│   │   │   ├── EditorMap.tsx
│   │   │   └── MetricsPanel.tsx
│   │   ├── History/
│   │   │   ├── History.tsx
│   │   │   ├── ExecutionList.tsx
│   │   │   └── ExecutionDetails.tsx
│   │   └── Reports/
│   │       ├── Reports.tsx
│   │       ├── ReportPreview.tsx
│   │       └── ExportOptions.tsx
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useOptimization.ts
│   │   ├── useDataManagement.ts
│   │   ├── useRouteEditor.ts
│   │   ├── useHistory.ts
│   │   └── useReports.ts
│   ├── services/                     # Servicios de datos (API/Mock)
│   │   ├── api/                      # Clientes API (para futuro backend)
│   │   │   ├── optimizationApi.ts
│   │   │   ├── dataApi.ts
│   │   │   ├── evaluationApi.ts
│   │   │   └── reportsApi.ts
│   │   ├── mock/                     # Datos mock (para desarrollo sin backend)
│   │   │   ├── optimizationMock.ts
│   │   │   ├── dataMock.ts
│   │   │   ├── evaluationMock.ts
│   │   │   └── reportsMock.ts
│   │   └── types/                    # Tipos compartidos
│   │       ├── optimization.types.ts
│   │       ├── data.types.ts
│   │       ├── evaluation.types.ts
│   │       └── common.types.ts
│   ├── store/                        # Estado global (Zustand opcional)
│   │   ├── optimizationStore.ts
│   │   ├── dataStore.ts
│   │   └── uiStore.ts
│   ├── lib/                          # Utilidades y helpers
│   │   ├── utils.ts                  # Funciones utilitarias
│   │   ├── cn.ts                     # Classnames merge (tailwind-merge)
│   │   ├── validation.ts             # Validaciones
│   │   └── constants.ts              # Constantes de la aplicación
│   ├── config/                       # Configuración
│   │   ├── api.config.ts             # Configuración API
│   │   └── app.config.ts             # Configuración app
│   ├── types/                        # Tipos globales
│   │   └── index.ts                  # Export de tipos
│   ├── App.tsx                       # Componente principal
│   ├── main.tsx                      # Entry point
│   └── vite-env.d.ts                 # Tipos Vite
├── .env.example                      # Variables de entorno ejemplo
├── .eslintrc.cjs                     # Configuración ESLint
├── .prettierrc                       # Configuración Prettier
├── tsconfig.json                     # Configuración TypeScript
├── tailwind.config.js                # Configuración Tailwind
├── vite.config.ts                    # Configuración Vite
└── package.json                      # Dependencias
```

---

## Principios SOLID y Patrones de Diseño

### ⚠️ IMPORTANTE: ENFOQUE PRINCIPAL

**Esta sección es CRÍTICA. Todo el código debe seguir estrictamente estos principios.**

### 1. Single Responsibility Principle (SRP)

**Definición:** Una clase o componente debe tener una sola razón para cambiar.

**Aplicación en React:**

❌ **MAL - Componente con múltiples responsabilidades:**
```typescript
const Dashboard = () => {
  // 1. Obtiene datos
  const { data } = useOptimizationData();
  
  // 2. Procesa datos
  const processedData = processData(data);
  
  // 3. Renderiza UI
  return <div>{/* UI */}</div>;
};
```

✅ **BIEN - Responsabilidades separadas:**
```typescript
// Hook para obtener datos (responsabilidad 1)
const useDashboardData = () => {
  const { data } = useOptimizationData();
  return { data };
};

// Hook para procesar datos (responsabilidad 2)
const useProcessedData = (data: Data) => {
  const processedData = useMemo(() => processData(data), [data]);
  return { processedData };
};

// Componente solo para renderizar (responsabilidad 3)
const DashboardView = ({ data, processedData }: Props) => {
  return <div>{/* UI */}</div>;
};

// Componente contenedor que orquesta
const Dashboard = () => {
  const { data } = useDashboardData();
  const { processedData } = useProcessedData(data);
  return <DashboardView data={data} processedData={processedData} />;
};
```

### 2. Open/Closed Principle (OCP)

**Definición:** Entidades deben estar abiertas para extensión pero cerradas para modificación.

**Aplicación en React:**

✅ **BIEN - Componentes extensibles:**
```typescript
// Componente base cerrado para modificación
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return <div className={cn("card", className)}>{children}</div>;
};

// Extensible mediante composición
const KPICard = ({ title, value, trend }: KPICardProps) => {
  return (
    <Card className="kpi-card">
      <CardHeader title={title} />
      <CardBody value={value} trend={trend} />
    </Card>
  );
};
```

### 3. Liskov Substitution Principle (LSP)

**Definición:** Subtipos deben ser sustituibles por sus tipos base.

**Aplicación en React:**

✅ **BIEN - Componentes con contratos claros:**
```typescript
// Contrato base
interface MapComponentProps {
  routes: Route[];
  onRouteSelect: (routeId: string) => void;
  selectedRouteId?: string;
}

// Cualquier implementación debe cumplir el contrato
const RouteMap = ({ routes, onRouteSelect, selectedRouteId }: MapComponentProps) => {
  // Implementación específica
};

const ComparisonMap = ({ routes, onRouteSelect, selectedRouteId }: MapComponentProps) => {
  // Otra implementación específica
};

// Ambas son intercambiables
const MapContainer = ({ useComparison }: { useComparison: boolean }) => {
  const MapComponent = useComparison ? ComparisonMap : RouteMap;
  return <MapComponent routes={routes} onRouteSelect={onRouteSelect} />;
};
```

### 4. Interface Segregation Principle (ISP)

**Definición:** Clientes no deben depender de interfaces que no usan.

**Aplicación en React:**

❌ **MAL - Interface gigante:**
```typescript
interface Props {
  // 20 propiedades que no siempre se usan
  data?: any;
  loading?: boolean;
  error?: any;
  // ... más propiedades
}
```

✅ **BIEN - Interfaces segregadas:**
```typescript
// Interface para datos
interface DataProps {
  data: OptimizationData;
}

// Interface para estado de carga
interface LoadingProps {
  loading: boolean;
}

// Interface para errores
interface ErrorProps {
  error: Error | null;
}

// Componente solo usa lo que necesita
const DataDisplay = ({ data }: DataProps) => {
  return <div>{/* mostrar datos */}</div>;
};

const LoadingState = ({ loading }: LoadingProps) => {
  if (!loading) return null;
  return <Spinner />;
};
```

### 5. Dependency Inversion Principle (DIP)

**Definición:** Depender de abstracciones, no de implementaciones concretas.

**Aplicación en React:**

✅ **BIEN - Inyección de dependencias:**
```typescript
// Abstracción (interface/type)
interface DataService {
  fetchOptimizationResults(): Promise<OptimizationData>;
  saveOptimizationResults(data: OptimizationData): Promise<void>;
}

// Implementación concreta (mock para desarrollo)
class MockDataService implements DataService {
  async fetchOptimizationResults(): Promise<OptimizationData> {
    return mockData.optimizationResults;
  }
  
  async saveOptimizationResults(data: OptimizationData): Promise<void> {
    console.log('Guardando datos mock:', data);
  }
}

// Implementación concreta (API real para producción)
class ApiDataService implements DataService {
  async fetchOptimizationResults(): Promise<OptimizationData> {
    const response = await fetch('/api/optimization/results');
    return response.json();
  }
  
  async saveOptimizationResults(data: OptimizationData): Promise<void> {
    await fetch('/api/optimization/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

// Hook que depende de la abstracción
const useOptimizationData = (dataService: DataService) => {
  const [data, setData] = useState<OptimizationData | null>(null);
  
  useEffect(() => {
    dataService.fetchOptimizationResults().then(setData);
  }, [dataService]);
  
  return { data };
};

// Uso con inyección de dependencia
const App = () => {
  const dataService = useMemo(() => 
    process.env.NODE_ENV === 'development' 
      ? new MockDataService() 
      : new ApiDataService()
  , []);
  
  const { data } = useOptimizationData(dataService);
  
  return <Dashboard data={data} />;
};
```

---

### Patrones de Diseño a Implementar

### 1. Container/Presenter Pattern

Separa lógica de presentación de lógica de negocio.

```typescript
// Container (lógica de negocio)
const OptimizationEngineContainer = () => {
  const [params, setParams] = useState<OptimizationParams>(defaultParams);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const handleStart = useCallback(() => {
    setIsRunning(true);
    // Lógica de negocio
  }, [params]);
  
  const handleStop = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  return (
    <OptimizationEnginePresenter
      params={params}
      onParamsChange={setParams}
      isRunning={isRunning}
      onStart={handleStart}
      onStop={handleStop}
      logs={logs}
    />
  );
};

// Presenter (presentación pura)
const OptimizationEnginePresenter = ({
  params,
  onParamsChange,
  isRunning,
  onStart,
  onStop,
  logs
}: OptimizationEnginePresenterProps) => {
  return (
    <div className="optimization-engine">
      <OperationalParamsForm params={params} onChange={onParamsChange} />
      <GAParamsForm params={params} onChange={onParamsChange} />
      <FitnessSliders params={params} onChange={onParamsChange} />
      <ExecutionControls 
        isRunning={isRunning} 
        onStart={onStart} 
        onStop={onStop} 
      />
      <ExecutionLogs logs={logs} />
    </div>
  );
};
```

### 2. Custom Hooks Pattern

Encapsula lógica reutilizable.

```typescript
// Hook para gestión de formularios con validación
const useFormWithValidation = <T extends Record<string, any>>(
  initialValues: T,
  schema: z.ZodSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldError = result.error.errors.find(e => e.path[0] === field);
      setErrors(prev => ({ 
        ...prev, 
        [field]: fieldError?.message 
      }));
    }
  }, [values, schema]);
  
  const validate = useCallback(() => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const allErrors: Partial<Record<keyof T, string>> = {};
      result.error.errors.forEach(error => {
        allErrors[error.path[0] as keyof T] = error.message;
      });
      setErrors(allErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [values, schema]);
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    isValid: Object.keys(errors).length === 0
  };
};
```

### 3. Factory Pattern

Crea objetos complejos de manera consistente.

```typescript
// Factory para crear componentes de KPI
interface KPICardFactory {
  createKPI(type: KPIType): React.ReactNode;
}

class KPICardFactoryImpl implements KPICardFactory {
  createKPI(type: KPIType): React.ReactNode {
    switch (type) {
      case 'demand':
        return <DemandKPICard />;
      case 'coverage':
        return <CoverageKPICard />;
      case 'travel_time':
        return <TravelTimeKPICard />;
      default:
        return <DefaultKPICard />;
    }
  }
}

// Uso
const kpiFactory = new KPICardFactoryImpl();
const kpiCards = kpiTypes.map(type => kpiFactory.createKPI(type));
```

### 4. Strategy Pattern

Encapsula algoritmos intercambiables.

```typescript
// Estrategia de evaluación de rutas
interface RouteEvaluationStrategy {
  evaluate(route: Route): EvaluationResult;
}

class EfficiencyEvaluation implements RouteEvaluationStrategy {
  evaluate(route: Route): EvaluationResult {
    // Lógica de eficiencia
    return { score: route.demand / route.distance, metrics: {} };
  }
}

class CoverageEvaluation implements RouteEvaluationStrategy {
  evaluate(route: Route): EvaluationResult {
    // Lógica de cobertura
    return { score: route.coverage, metrics: {} };
  }
}

// Contexto que usa la estrategia
class RouteEvaluator {
  constructor(private strategy: RouteEvaluationStrategy) {}
  
  setStrategy(strategy: RouteEvaluationStrategy) {
    this.strategy = strategy;
  }
  
  evaluate(route: Route): EvaluationResult {
    return this.strategy.evaluate(route);
  }
}

// Uso
const evaluator = new RouteEvaluator(new EfficiencyEvaluation());
const result = evaluator.evaluate(route);
```

### 5. Observer Pattern (React Query)

React Query implementa este patrón para gestión de estado server-side.

```typescript
// Query (observable)
const { data, isLoading, error } = useQuery({
  queryKey: ['optimization', 'results'],
  queryFn: fetchOptimizationResults,
  staleTime: 5 * 60 * 1000, // 5 minutos
});

// Mutations (acciones que afectan datos)
const mutation = useMutation({
  mutationFn: saveOptimizationResults,
  onSuccess: () => {
    // Invalidar queries para refrescar datos
    queryClient.invalidateQueries({ queryKey: ['optimization'] });
  }
});
```

### 6. Repository Pattern

Abstrae el acceso a datos.

```typescript
// Interface del repositorio
interface OptimizationRepository {
  getResults(executionId: string): Promise<OptimizationResults>;
  saveResults(results: OptimizationResults): Promise<void>;
  getHistory(filters: HistoryFilters): Promise<Execution[]>;
}

// Implementación mock
class MockOptimizationRepository implements OptimizationRepository {
  async getResults(executionId: string): Promise<OptimizationResults> {
    return mockData.results[executionId];
  }
  
  async saveResults(results: OptimizationResults): Promise<void> {
    mockData.results[results.id] = results;
  }
  
  async getHistory(filters: HistoryFilters): Promise<Execution[]> {
    return mockData.history.filter(exec => 
      (!filters.status || exec.status === filters.status) &&
      (!filters.dateFrom || exec.date >= filters.dateFrom)
    );
  }
}

// Implementación API
class ApiOptimizationRepository implements OptimizationRepository {
  async getResults(executionId: string): Promise<OptimizationResults> {
    const response = await fetch(`/api/optimization/results/${executionId}`);
    return response.json();
  }
  
  async saveResults(results: OptimizationResults): Promise<void> {
    await fetch('/api/optimization/results', {
      method: 'POST',
      body: JSON.stringify(results)
    });
  }
  
  async getHistory(filters: HistoryFilters): Promise<Execution[]> {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`/api/history?${params}`);
    return response.json();
  }
}
```

### 7. Singleton Pattern (Configuración)

```typescript
// Configuración global (singleton)
class AppConfig {
  private static instance: AppConfig;
  
  private constructor() {
    this.apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
    this.mapCenter = { lat: 10.463, lng: -73.25 }; // Valledupar
    this.defaultZoom = 13;
  }
  
  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }
  
  readonly apiBaseUrl: string;
  readonly mapCenter: { lat: number; lng: number };
  readonly defaultZoom: number;
}

// Uso
const config = AppConfig.getInstance();
```

---

## Datos Estáticos de Ejemplo

### Contexto
Como NO hay backend todavía, usaremos datos mock que simulen las respuestas del API. Estos datos deben respetar la estructura que tendrá el API real.

### Estructura de Datos Mock

```typescript
// src/services/mock/optimizationMock.ts

export interface OperationalParams {
  service_hours_start: number;      // 4
  service_hours_end: number;        // 20
  morning_peak_start: number;       // 6
  morning_peak_end: number;         // 9
  afternoon_peak_start: number;     // 17
  afternoon_peak_end: number;       // 20
  bus_capacity: number;             // 80
  max_travel_time_min: number;      // 90
  min_stops: number;                // 2
  max_stops: number;                // 50
  min_distance_km: number;          // 2
  max_distance_km: number;          // 50
  stop_radius_m: number;            // 500
  target_coverage_pct: number;     // 95
}

export interface GAParams {
  population_size: number;          // 300
  generations: number;              // 300
  mutation_rate: number;           // 0.1
  crossover_rate: number;          // 0.8
  elitism_count: number;           // 2
  tournament_size: number;          // 5
  min_route_length: number;         // 15
  max_route_length: number;         // 60
  distance_bias_km: number;         // 30
  enable_dijkstra: boolean;         // true
}

export interface FitnessWeights {
  efficiency: number;               // 0.35
  coverage: number;                 // 0.25
  equity: number;                   // 0.20
  economy: number;                  // 0.10
  speed: number;                    // 0.05
  transfers: number;                // 0.05
}

export interface OptimizationParams {
  operational: OperationalParams;
  ga: GAParams;
  fitness_weights: FitnessWeights;
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

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  stratum: number;
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

// Datos mock
export const mockOperationalParams: OperationalParams = {
  service_hours_start: 4,
  service_hours_end: 20,
  morning_peak_start: 6,
  morning_peak_end: 9,
  afternoon_peak_start: 17,
  afternoon_peak_end: 20,
  bus_capacity: 80,
  max_travel_time_min: 90,
  min_stops: 2,
  max_stops: 50,
  min_distance_km: 2,
  max_distance_km: 50,
  stop_radius_m: 500,
  target_coverage_pct: 95
};

export const mockGAParams: GAParams = {
  population_size: 300,
  generations: 300,
  mutation_rate: 0.1,
  crossover_rate: 0.8,
  elitism_count: 2,
  tournament_size: 5,
  min_route_length: 15,
  max_route_length: 60,
  distance_bias_km: 30,
  enable_dijkstra: true
};

export const mockFitnessWeights: FitnessWeights = {
  efficiency: 0.35,
  coverage: 0.25,
  equity: 0.20,
  economy: 0.10,
  speed: 0.05,
  transfers: 0.05
};

export const mockStops: Stop[] = [
  { id: '1', name: 'Terminal Salida', lat: 10.463, lng: -73.25, demand: 1200, stratum: 2 },
  { id: '2', name: 'Centro', lat: 10.465, lng: -73.255, demand: 2500, stratum: 3 },
  { id: '3', name: 'Barrio Norte', lat: 10.468, lng: -73.26, demand: 800, stratum: 1 },
  { id: '4', name: 'Industrial', lat: 10.46, lng: -73.245, demand: 1500, stratum: 4 },
  { id: '5', name: 'Universidad', lat: 10.47, lng: -73.27, demand: 900, stratum: 2 },
  { id: '6', name: 'Hospital', lat: 10.462, lng: -73.252, demand: 600, stratum: 3 },
  { id: '7', name: 'Mercado', lat: 10.466, lng: -73.258, demand: 1100, stratum: 2 },
  { id: '8', name: 'Estadio', lat: 10.464, lng: -73.265, demand: 700, stratum: 3 }
];

export const mockRoutes: Route[] = [
  {
    id: 'R001',
    name: 'Ruta 1 - Circular Centro',
    stops: [mockStops[0], mockStops[1], mockStops[2], mockStops[5], mockStops[0]],
    total_distance_km: 12.5,
    total_travel_time_min: 45,
    demand_served: 4500,
    fitness_score: 0.85
  },
  {
    id: 'R002',
    name: 'Ruta 2 - Norte-Sur',
    stops: [mockStops[2], mockStops[1], mockStops[3], mockStops[6]],
    total_distance_km: 18.3,
    total_travel_time_min: 55,
    demand_served: 3800,
    fitness_score: 0.78
  },
  {
    id: 'R003',
    name: 'Ruta 3 - Universitaria',
    stops: [mockStops[4], mockStops[1], mockStops[5], mockStops[6]],
    total_distance_km: 15.7,
    total_travel_time_min: 48,
    demand_served: 3200,
    fitness_score: 0.82
  }
];

export const mockKPIsBefore: KPIs = {
  total_demand_served: 85000,
  avg_travel_time_min: 52,
  total_distance_km: 450,
  coverage_pct: 72,
  equity_score: 0.65,
  operating_cost: 18500000,
  fleet_utilization: 0.45
};

export const mockKPIsAfter: KPIs = {
  total_demand_served: 125000,
  avg_travel_time_min: 38,
  total_distance_km: 520,
  coverage_pct: 89,
  equity_score: 0.82,
  operating_cost: 16200000,
  fleet_utilization: 0.72
};

export const mockOptimizationResults: OptimizationResults = {
  execution_id: 'EXEC-2024-001',
  timestamp: '2024-01-15T10:30:00Z',
  params: {
    operational: mockOperationalParams,
    ga: mockGAParams,
    fitness_weights: mockFitnessWeights
  },
  routes: mockRoutes,
  kpis: mockKPIsAfter,
  comparison: {
    before: mockKPIsBefore,
    after: mockKPIsAfter,
    variation: {
      total_demand_served: 47.1,
      avg_travel_time_min: -26.9,
      total_distance_km: 15.6,
      coverage_pct: 23.6,
      equity_score: 26.2,
      operating_cost: -12.4,
      fleet_utilization: 60.0
    }
  }
};

export const mockHistory: Execution[] = [
  {
    id: 'EXEC-2024-001',
    timestamp: '2024-01-15T10:30:00Z',
    params: {
      operational: mockOperationalParams,
      ga: mockGAParams,
      fitness_weights: mockFitnessWeights
    },
    results: mockOptimizationResults,
    status: 'completed',
    duration_seconds: 180
  },
  {
    id: 'EXEC-2024-002',
    timestamp: '2024-01-14T14:20:00Z',
    params: {
      operational: { ...mockOperationalParams, bus_capacity: 100 },
      ga: { ...mockGAParams, population_size: 200 },
      fitness_weights: { ...mockFitnessWeights, efficiency: 0.40 }
    },
    results: mockOptimizationResults,
    status: 'under_review',
    duration_seconds: 145
  },
  {
    id: 'EXEC-2024-003',
    timestamp: '2024-01-13T09:15:00Z',
    params: {
      operational: mockOperationalParams,
      ga: mockGAParams,
      fitness_weights: mockFitnessWeights
    },
    results: mockOptimizationResults,
    status: 'applied',
    duration_seconds: 195
  }
];
```

---

## Guía de Desarrollo por Módulo

### Módulo 1: Dashboard

**Objetivo:** Vista general del sistema con KPIs actuales, mapa de rutas activas y alertas.

**Componentes:**
- `Dashboard.tsx` - Componente contenedor principal
- `DashboardKPIs.tsx` - Tarjetas de KPIs con tendencias
- `DashboardMap.tsx` - Mapa con rutas activas
- `AlertsPanel.tsx` - Panel de alertas de zonas problemáticas
- `QuickActions.tsx` - Accesos rápidos a última optimización

**Flujo de datos:**
1. Container obtiene datos de optimización más reciente (mock)
2. Procesa KPIs y alertas
3. Presenter renderiza componentes UI

**Patrones a aplicar:**
- Container/Presenter
- Custom Hooks (`useDashboardData`)
- Repository Pattern (para datos mock)

### Módulo 2: Gestión de Datos

**Objetivo:** Cargar y validar datasets (GTFS, matriz demanda).

**Componentes:**
- `DataManagement.tsx` - Componente contenedor
- `GTFSUpload.tsx` - Upload de archivo GTFS
- `DemandUpload.tsx` - Upload de matriz demanda
- `DataPreview.tsx` - Vista previa tabular
- `ValidationReport.tsx` - Reporte de validación

**Flujo de datos:**
1. Usuario selecciona archivo
2. Validación de formato y estructura
3. Vista previa de datos
4. Guardado en estado local (mock)

**Patrones a aplicar:**
- Strategy Pattern (diferentes validadores)
- Repository Pattern
- Custom Hooks (`useDataManagement`)

### Módulo 3: Motor de Optimización

**Objetivo:** Configurar parámetros y ejecutar algoritmo genético.

**Componentes:**
- `OptimizationEngine.tsx` - Componente contenedor
- `OperationalParams.tsx` - Formulario parámetros operativos
- `GAParams.tsx` - Formulario parámetros AG
- `FitnessSliders.tsx` - Sliders de objetivos (suman 100%)
- `ExecutionLogs.tsx` - Logs en tiempo real
- `ProgressIndicator.tsx` - Indicador de progreso

**Flujo de datos:**
1. Usuario configura parámetros operativos
2. Usuario configura parámetros AG
3. Usuario ajusta sliders de fitness (validación suma 100%)
4. Usuario inicia ejecución
5. Simulación de progreso con logs
6. Generación de resultados mock

**Patrones a aplicar:**
- Container/Presenter
- Custom Hooks (`useOptimization`)
- Observer Pattern (logs en tiempo real)
- Factory Pattern (creación de logs)

### Módulo 4: Resultados

**Objetivo:** Visualizar rutas optimizadas con comparación antes/después.

**Componentes:**
- `Results.tsx` - Componente contenedor
- `ComparisonMap.tsx` - Mapa comparativo (actual vs propuesta)
- `KPITable.tsx` - Tabla KPIs antes/después/variación
- `RoutesList.tsx` - Lista de rutas generadas
- `RouteDetail.tsx` - Detalle de ruta individual

**Flujo de datos:**
1. Recibe resultados de optimización
2. Renderiza mapa con capas (actual + propuesta)
3. Calcula variaciones de KPIs
4. Permite seleccionar ruta para enviar al editor

**Patrones a aplicar:**
- Container/Presenter
- Custom Hooks (`useResults`)
- Strategy Pattern (diferentes visualizaciones)

### Módulo 5: Editor de Rutas

**Objetivo:** Ajustes manuales de rutas con retroalimentación en tiempo real.

**Componentes:**
- `RouteEditor.tsx` - Componente contenedor
- `EditorMap.tsx` - Mapa interactivo con paradas editables
- `MetricsPanel.tsx` - Panel de métricas en tiempo real
- `StopEditor.tsx` - Editor de paradas individuales
- `ActionButtons.tsx` - Botones aprobar/restaurar

**Flujo de datos:**
1. Usuario selecciona ruta desde Resultados
2. Mapa muestra paradas de la ruta
3. Usuario arrastra/agrega paradas
4. Sistema evalúa cambios en tiempo real (mock)
5. Alertas si métricas empeoran
6. Usuario aprueba o restaura

**Patrones a aplicar:**
- Container/Presenter
- Custom Hooks (`useRouteEditor`)
- Observer Pattern (evaluación en tiempo real)
- Command Pattern (undo/restore)

### Módulo 6: Historial

**Objetivo:** Registro de todas las ejecuciones con filtros y comparación.

**Componentes:**
- `History.tsx` - Componente contenedor
- `ExecutionList.tsx` - Tabla de ejecuciones con filtros
- `ExecutionDetails.tsx` - Detalles de ejecución individual
- `ComparisonView.tsx` - Comparación entre ejecuciones
- `StatusBadge.tsx` - Badge de estado con colores

**Flujo de datos:**
1. Carga historial de ejecuciones (mock)
2. Filtra por fecha, estado
3. Permite ver detalles de ejecución
4. Permite comparar ejecuciones

**Patrones a aplicar:**
- Container/Presenter
- Custom Hooks (`useHistory`)
- Repository Pattern
- Strategy Pattern (diferentes filtros)

### Módulo 7: Informes

**Objetivo:** Exportación de resultados en PDF y GTFS.

**Componentes:**
- `Reports.tsx` - Componente contenedor
- `ReportPreview.tsx` - Vista previa del informe
- `ExportOptions.tsx` - Opciones de exportación
- `PDFGenerator.tsx` - Generador de PDF (mock)
- `GTFSExporter.tsx` - Exportador GTFS (mock)

**Flujo de datos:**
1. Usuario selecciona ejecución
2. Vista previa del informe
3. Usuario elige formato (PDF/GTFS)
4. Simulación de generación y descarga

**Patrones a aplicar:**
- Container/Presenter
- Factory Pattern (diferentes exportadores)
- Custom Hooks (`useReports`)

---

## Prompt Completo para Desarrollo

A continuación, el prompt completo que puedes usar para desarrollar el frontend siguiendo todos los principios y patrones descritos.

---

```
# PROMPT COMPLETO PARA DESARROLLO FRONTEND DSS SIVA

## CONTEXTO GENERAL

Estás desarrollando el frontend de un Sistema de Soporte a Decisiones (DSS) para optimización de rutas de transporte público del SIVA Valledupar. El sistema tiene 7 módulos principales: Dashboard, Gestión de Datos, Motor de Optimización, Resultados, Editor de Rutas, Historial e Informes.

## REGLA CRÍTICA #1: NO HAY BACKEND TODAVÍA

- Usa DATOS ESTÁTICOS/MOCK para simular respuestas del API
- La arquitectura DEBE respetarse como si hubiera backend real
- NO llames a endpoints reales, usa los datos mock proporcionados
- Estructura el código para que sea fácil conectar al backend después

## REGLA CRÍTICA #2: PRINCIPIOS SOLID Y PATRONES DE DISEÑO

Esta es la PRIORIDAD ABSOLUTA. Todo el código debe seguir estrictamente:

### PRINCIPIOS SOLID (OBLIGATORIO)

1. **Single Responsibility Principle (SRP)**
   - Cada componente/hook debe tener UNA sola responsabilidad
   - Separa lógica de presentación de lógica de negocio
   - Separa obtención de datos de procesamiento de datos
   - Separa procesamiento de datos de renderizado UI

2. **Open/Closed Principle (OCP)**
   - Componentes abiertos para extensión, cerrados para modificación
   - Usa composición sobre herencia
   - Usa props para extender comportamiento

3. **Liskov Substitution Principle (LSP)**
   - Componentes con contratos claros (interfaces/types)
   - Subtipos sustituibles por tipos base
   - No violar contratos de componentes

4. **Interface Segregation Principle (ISP)**
   - Interfaces pequeñas y específicas
   - No interfaces gigantes con propiedades no usadas
   - Clientes solo dependen de lo que usan

5. **Dependency Inversion Principle (DIP)**
   - Depende de abstracciones (interfaces/types), no de implementaciones
   - Inyección de dependencias
   - Services layer con interfaces

### PATRONES DE DISEÑO (OBLIGATORIO)

1. **Container/Presenter Pattern** - Para TODOS los módulos
   - Container: lógica de negocio, obtención de datos
   - Presenter: presentación pura, solo props

2. **Custom Hooks Pattern** - Para lógica reutilizable
   - Encapsula lógica de negocio en hooks
   - Hooks específicos por dominio
   - Hooks composables

3. **Repository Pattern** - Para acceso a datos
   - Interface del repositorio
   - Implementación mock (ahora)
   - Implementación API (después)

4. **Factory Pattern** - Para creación de objetos complejos
   - Componentes factory
   - Services factory

5. **Strategy Pattern** - Para algoritmos intercambiables
   - Estrategias de evaluación
   - Estrategias de validación
   - Estrategias de visualización

6. **Observer Pattern** - Para estado reactivo
   - React Query para datos server-side
   - Custom hooks para estado local

7. **Singleton Pattern** - Para configuración global
   - AppConfig singleton

## REGLA CRÍTICA #3: CÓDIGO LIMPIO

- TypeScript estricto (no any)
- Nombres descriptivos
- Funciones pequeñas (< 20 líneas)
- Componentes pequeños (< 150 líneas)
- Comentarios solo cuando es necesario
- Formato consistente (Prettier)
- Linting (ESLint)

## STACK TECNOLÓGICO (FIJO)

- React 18+ con TypeScript
- Vite
- shadcn/ui (Radix UI + Tailwind)
- TailwindCSS
- Lucide React (iconos)
- React Query (TanStack Query)
- React Hook Form + Zod
- React Router v6
- React Leaflet (mapas)
- Recharts (gráficos)

## ESTRUCTURA DE CARPETAS (OBLIGATORIA)

```
src/
├── components/
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── layout/          # Sidebar, Header, MainLayout
│   ├── maps/            # Componentes de mapas
│   ├── charts/          # Componentes de gráficos
│   └── common/          # LoadingSpinner, ErrorBoundary, EmptyState
├── pages/               # 7 módulos principales
│   ├── Dashboard/
│   ├── DataManagement/
│   ├── OptimizationEngine/
│   ├── Results/
│   ├── RouteEditor/
│   ├── History/
│   └── Reports/
├── hooks/               # Custom hooks por dominio
├── services/
│   ├── api/             # Clientes API (interfaces)
│   ├── mock/            # Datos mock (implementaciones)
│   └── types/           # Tipos compartidos
├── lib/                 # Utilidades
├── config/              # Configuración
└── types/               # Tipos globales
```

## DATOS MOCK A USAR

Usa los datos mock proporcionados en la sección "Datos Estáticos de Ejemplo" de esta guía. Estos datos incluyen:

- `mockOperationalParams` - Parámetros operativos
- `mockGAParams` - Parámetros del algoritmo genético
- `mockFitnessWeights` - Pesos de fitness
- `mockStops` - Paradas de ejemplo
- `mockRoutes` - Rutas de ejemplo
- `mockKPIsBefore` - KPIs antes de optimización
- `mockKPIsAfter` - KPIs después de optimización
- `mockOptimizationResults` - Resultados completos
- `mockHistory` - Historial de ejecuciones

## ORDEN DE DESARROLLO

Desarrolla en este orden:

1. **Setup inicial** - Proyecto Vite + TypeScript + dependencias
2. **Layout base** - Sidebar, Header, MainLayout, routing
3. **Componentes UI base** - shadcn/ui (Button, Card, Input, etc.)
4. **Servicios mock** - Implementar repositorios mock
5. **Módulo Dashboard** - Primer módulo completo
6. **Módulo Gestión de Datos** - Segundo módulo
7. **Módulo Motor de Optimización** - Tercer módulo
8. **Módulo Resultados** - Cuarto módulo
9. **Módulo Editor de Rutas** - Quinto módulo
10. **Módulo Historial** - Sexto módulo
11. **Módulo Informes** - Séptimo módulo

## REQUISITOS POR MÓDULO

### Módulo 1: Dashboard

**Componentes:**
- Dashboard.tsx (Container)
- DashboardKPIs.tsx (Presenter)
- DashboardMap.tsx (Presenter)
- AlertsPanel.tsx (Presenter)
- QuickActions.tsx (Presenter)

**Hooks:**
- useDashboardData.ts

**Servicios:**
- OptimizationRepository (interface)
- MockOptimizationRepository (implementación)

**Patrones:**
- Container/Presenter
- Repository Pattern
- Custom Hooks

**Funcionalidad:**
- Mostrar KPIs actuales con tendencias
- Mapa con rutas activas (React Leaflet)
- Alertas de zonas problemáticas
- Acceso rápido a última optimización

### Módulo 2: Gestión de Datos

**Componentes:**
- DataManagement.tsx (Container)
- GTFSUpload.tsx (Presenter)
- DemandUpload.tsx (Presenter)
- DataPreview.tsx (Presenter)
- ValidationReport.tsx (Presenter)

**Hooks:**
- useDataManagement.ts

**Servicios:**
- DataRepository (interface)
- MockDataRepository (implementación)

**Patrones:**
- Container/Presenter
- Repository Pattern
- Strategy Pattern (validadores)
- Custom Hooks

**Funcionalidad:**
- Upload de archivos GTFS
- Upload de matriz demanda
- Vista previa tabular
- Validación de calidad de datos

### Módulo 3: Motor de Optimización

**Componentes:**
- OptimizationEngine.tsx (Container)
- OperationalParams.tsx (Presenter)
- GAParams.tsx (Presenter)
- FitnessSliders.tsx (Presenter)
- ExecutionLogs.tsx (Presenter)
- ProgressIndicator.tsx (Presenter)

**Hooks:**
- useOptimization.ts

**Servicios:**
- OptimizationRepository (interface)
- MockOptimizationRepository (implementación)

**Patrones:**
- Container/Presenter
- Repository Pattern
- Observer Pattern (logs)
- Factory Pattern (logs)
- Custom Hooks

**Funcionalidad:**
- Formulario parámetros operativos (mapear a mockOperationalParams)
- Formulario parámetros AG (mapear a mockGAParams)
- Sliders de fitness (mapear a mockFitnessWeights, validar suma 100%)
- Botón ejecutar con simulación de progreso
- Logs en tiempo real
- Indicador de progreso

### Módulo 4: Resultados

**Componentes:**
- Results.tsx (Container)
- ComparisonMap.tsx (Presenter)
- KPITable.tsx (Presenter)
- RoutesList.tsx (Presenter)
- RouteDetail.tsx (Presenter)

**Hooks:**
- useResults.ts

**Servicios:**
- OptimizationRepository (interface)
- MockOptimizationRepository (implementación)

**Patrones:**
- Container/Presenter
- Repository Pattern
- Strategy Pattern (visualizaciones)
- Custom Hooks

**Funcionalidad:**
- Mapa comparativo (actual vs propuesta)
- Tabla KPIs antes/después/variación
- Lista de rutas generadas
- Detalle de ruta individual
- Botón enviar al editor

### Módulo 5: Editor de Rutas

**Componentes:**
- RouteEditor.tsx (Container)
- EditorMap.tsx (Presenter)
- MetricsPanel.tsx (Presenter)
- StopEditor.tsx (Presenter)
- ActionButtons.tsx (Presenter)

**Hooks:**
- useRouteEditor.ts

**Servicios:**
- EvaluationRepository (interface)
- MockEvaluationRepository (implementación)

**Patrones:**
- Container/Presenter
- Repository Pattern
- Observer Pattern (evaluación tiempo real)
- Command Pattern (undo/restore)
- Custom Hooks

**Funcionalidad:**
- Mapa interactivo con paradas editables
- Arrastrar/agregar paradas
- Evaluación en tiempo real (mock)
- Alertas si métricas empeoran
- Botones aprobar/restaurar

### Módulo 6: Historial

**Componentes:**
- History.tsx (Container)
- ExecutionList.tsx (Presenter)
- ExecutionDetails.tsx (Presenter)
- ComparisonView.tsx (Presenter)
- StatusBadge.tsx (Presenter)

**Hooks:**
- useHistory.ts

**Servicios:**
- HistoryRepository (interface)
- MockHistoryRepository (implementación)

**Patrones:**
- Container/Presenter
- Repository Pattern
- Strategy Pattern (filtros)
- Custom Hooks

**Funcionalidad:**
- Tabla de ejecuciones con filtros
- Filtros por fecha, estado
- Detalles de ejecución
- Comparación entre ejecuciones

### Módulo 7: Informes

**Componentes:**
- Reports.tsx (Container)
- ReportPreview.tsx (Presenter)
- ExportOptions.tsx (Presenter)
- PDFGenerator.tsx (Presenter)
- GTFSExporter.tsx (Presenter)

**Hooks:**
- useReports.ts

**Servicios:**
- ReportsRepository (interface)
- MockReportsRepository (implementación)

**Patrones:**
- Container/Presenter
- Repository Pattern
- Factory Pattern (exportadores)
- Custom Hooks

**Funcionalidad:**
- Vista previa del informe
- Opciones de exportación (PDF/GTFS)
- Simulación de generación
- Simulación de descarga

## VALIDACIÓN DE CALIDAD

Antes de considerar un módulo completo, verifica:

1. **Principios SOLID**
   - [ ] Cada componente tiene una sola responsabilidad
   - [ ] Componentes son extensibles sin modificación
   - [ ] Contratos claros (interfaces/types)
   - [ ] Interfaces pequeñas y específicas
   - [ ] Dependencias de abstracciones

2. **Patrones de Diseño**
   - [ ] Container/Presenter implementado
   - [ ] Custom hooks para lógica reutilizable
   - [ ] Repository Pattern para datos
   - [ ] Patrones adicionales aplicados apropiadamente

3. **Código Limpio**
   - [ ] TypeScript estricto (no any)
   - [ ] Nombres descriptivos
   - [ ] Funciones pequeñas
   - [ ] Componentes pequeños
   - [ ] Sin comentarios innecesarios
   - [ ] Formato consistente

4. **Funcionalidad**
   - [ ] Todos los componentes del módulo funcionan
   - [ ] Datos mock se usan correctamente
   - [ ] Flujo de usuario completo
   - [ ] Validaciones implementadas
   - [ ] Manejo de errores

## ENTREGABLES

Por cada módulo, entrega:

1. Código fuente completo (TypeScript + React)
2. Tipos TypeScript bien definidos
3. Interfaces de repositorios
4. Implementaciones mock
5. Custom hooks
6. Componentes Container y Presenter separados
7. Documentación inline cuando sea necesario

## NOTAS FINALES

- NO te saltes los principios SOLID y patrones de diseño
- NO uses any en TypeScript
- NO mezcles lógica de negocio con presentación
- NO crees componentes gigantes
- SI usa los datos mock proporcionados
- SI sigue la estructura de carpetas obligatoria
- SI implementa Container/Presenter en cada módulo
- SI usa Repository Pattern para datos
- SI crea custom hooks para lógica reutilizable

El código debe estar listo para conectar al backend real sin modificaciones estructurales, solo cambiando las implementaciones mock por implementaciones API.
```

---

## Resumen

Esta guía proporciona:

1. ✅ **Planeación detallada** del frontend DSS
2. ✅ **Stack tecnológico** completo y justificado
3. ✅ **Arquitectura** con capas y principios
4. ✅ **Estructura de carpetas** obligatoria
5. ✅ **Principios SOLID** explicados con ejemplos React
6. ✅ **Patrones de diseño** con implementaciones React
7. ✅ **Datos estáticos de ejemplo** completos
8. ✅ **Guía por módulo** con componentes y patrones
9. ✅ **Prompt completo** para desarrollo

**ENFOQUE PRINCIPAL:** Principios SOLID y patrones de diseño básicos e intermedios. Todo el código debe seguir estrictamente estos principios.

**CONTEXTO CRÍTICO:** No hay backend todavía. Usar datos mock pero respetar arquitectura como si hubiera backend real.

---

**Próximos pasos:**
1. Crear proyecto Vite + TypeScript
2. Instalar dependencias del stack
3. Configurar estructura de carpetas
4. Implementar layout base
5. Comenzar con Módulo 1 (Dashboard)
