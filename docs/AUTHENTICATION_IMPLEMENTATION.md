# Documentación de Implementación de Autenticación
## Login y Register - Conexión con Backend

Este documento explica en detalle la implementación del sistema de autenticación del frontend, incluyendo la conexión con el backend y cómo realizar cambios futuros.

---

## 📋 Índice

1. [Estructura de Archivos](#estructura-de-archivos)
2. [Tipos de Datos](#tipos-de-datos)
3. [Interfaz AuthStrategy](#interfaz-authstrategy)
4. [Implementación del Backend (ApiAuthService)](#implementación-del-backend-apiauthservice)
5. [AuthContext](#authcontext)
6. [Componentes UI](#componentes-ui)
7. [Flujo de Autenticación](#flujo-de-autenticación)
8. [Cómo Agregar Nuevos Campos](#cómo-agregar-nuevos-campos)
9. [Configuración del Backend](#configuración-del-backend)

---

## 📁 Estructura de Archivos

```
src/auth/
├── components/
│   ├── Login.tsx          # Componente de Login
│   ├── Register.tsx       # Componente de Registro
│   └── ProtectedRoute.tsx # Ruta protegida
├── context/
│   └── AuthContext.tsx    # Contexto de autenticación
├── services/
│   ├── AuthService.ts     # Interfaz AuthStrategy
│   ├── ApiAuthService.ts  # Implementación real del backend
│   └── MockAuthService.ts # Implementación mock (pruebas)
└── types/
    └── auth.types.ts      # Tipos de autenticación
```

---

## 📝 Tipos de Datos

### User
Define la estructura del usuario en el frontend.

```typescript
// src/auth/types/auth.types.ts
export interface User {
  id: string;           // ID único del usuario
  username: string;     // Nombre de usuario (usado para login)
  name: string;         // Nombre completo
  city: string;         // Ciudad (ej: "TransMilenio Bogotá")
  createdAt?: string;   // Fecha de creación (opcional)
}
```

**Nota:** Actualmente usamos `username` para el login. Si en el futuro se requiere `email`, simplemente cambia el nombre del campo.

### Credentials
Define las credenciales para iniciar sesión.

```typescript
export interface Credentials {
  username: string;  // Usuario (o email en el futuro)
  password: string;  // Contraseña
}
```

### AuthResult
Define el resultado de una operación de autenticación.

```typescript
export interface AuthResult {
  success: boolean;   // Indica si la operación fue exitosa
  user?: User;         // Usuario (si fue exitoso)
  token?: string;      // Token de acceso (si fue exitoso)
  error?: string;      // Mensaje de error (si falló)
}
```

---

## 🔌 Interfaz AuthStrategy

Define el contrato que deben cumplir todas las implementaciones de autenticación.

```typescript
// src/auth/services/AuthService.ts
export interface AuthStrategy {
  login(credentials: Credentials): Promise<AuthResult>;
  register(name: string, username: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}
```

**Métodos:**
- `login()`: Inicia sesión con credenciales
- `register()`: Registra un nuevo usuario
- `logout()`: Cierra sesión
- `refreshToken()`: Refresca el token de acceso

---

## 🌐 Implementación del Backend (ApiAuthService)

Esta clase implementa la interfaz `AuthStrategy` y se conecta con el backend real.

```typescript
// src/auth/services/ApiAuthService.ts
import type { Credentials, AuthResult, User } from '../types/auth.types';
import type { AuthStrategy } from './AuthService';

const API_BASE_URL = 'http://127.0.0.1:8001';

export class ApiAuthStrategy implements AuthStrategy {
  // Implementación de métodos...
}
```

### Configuración del Backend

**URL del Backend:** `http://127.0.0.1:8001`

Esta constante define dónde está el backend. Si cambia la URL, solo actualiza esta constante.

### Método login()

```typescript
async login(credentials: Credentials): Promise<AuthResult> {
  try {
    // Crear FormData (el backend espera form-data, no JSON)
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    // Hacer petición POST al backend
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    
    // Obtener información del usuario con el token
    const user = await this.getCurrentUser(data.access_token);

    // Guardar tokens en localStorage
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('auth_refresh_token', data.refresh_token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    return { success: true, user, token: data.access_token };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al iniciar sesión' 
    };
  }
}
```

**Puntos clave:**
1. Usa `FormData` porque el backend espera form-data, no JSON
2. Mapea `credentials.username` al campo `username` del backend
3. Guarda tokens en localStorage: `auth_token`, `auth_refresh_token`, `auth_user`

### Método register()

```typescript
async register(_name: string, username: string, password: string): Promise<AuthResult> {
  try {
    // El backend espera JSON para registro
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al registrar usuario');
    }

    // Hacer login automático después del registro
    return await this.login({ username, password });
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al registrar usuario' 
    };
  }
}
```

**Puntos clave:**
1. Usa JSON porque el backend espera JSON para registro
2. Envía `username` y `password` al backend
3. Hace login automático después del registro
4. El parámetro `_name` tiene prefijo `_` porque no se usa actualmente (el backend no lo requiere)

### Método logout()

```typescript
async logout(): Promise<void> {
  try {
    const refreshToken = localStorage.getItem('auth_refresh_token');
    
    if (refreshToken) {
      // Enviar refresh_token al backend para invalidarlo
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });
    }
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar localStorage independientemente del resultado
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_user');
  }
}
```

**Puntos clave:**
1. Envía `refresh_token` al backend para invalidarlo
2. Siempre limpia localStorage, incluso si falla la petición al backend

### Método refreshToken()

```typescript
async refreshToken(): Promise<string> {
  try {
    const refreshToken = localStorage.getItem('auth_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al refrescar token');
    }

    const data = await response.json();
    
    // Guardar nuevo access token
    localStorage.setItem('auth_token', data.access_token);
    
    return data.access_token;
  } catch (error) {
    // Si falla el refresh, limpiar tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_user');
    throw error;
  }
}
```

**Puntos clave:**
1. Usa `refresh_token` para obtener un nuevo `access_token`
2. Si falla, limpia todos los tokens (sesión expirada)

### Método getCurrentUser()

```typescript
private async getCurrentUser(token: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuario');
    }

    const data = await response.json();
    
    // Mapear respuesta del backend a User
    return {
      id: data.id || data.username || Date.now().toString(),
      username: data.username || '',
      name: data.username || 'Usuario',
      city: 'TransMilenio Bogotá',
      createdAt: data.created_at || new Date().toISOString(),
    };
  } catch (error) {
    // Retornar usuario por defecto si falla
    return {
      id: Date.now().toString(),
      username: '',
      name: 'Usuario',
      city: 'TransMilenio Bogotá',
      createdAt: new Date().toISOString(),
    };
  }
}
```

**Puntos clave:**
1. Usa el token en el header `Authorization: Bearer <token>`
2. Mapea la respuesta del backend al tipo `User`
3. Si falla, retorna un usuario por defecto

---

## 🎭 AuthContext

El AuthContext proporciona el estado de autenticación global y las funciones para interactuar con el backend.

```typescript
// src/auth/context/AuthContext.tsx
interface AuthContextValue extends AuthState {
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
}
```

### Uso del AuthContext

```typescript
import { useAuth } from '../context/AuthContext';

const { user, isAuthenticated, login, logout, register } = useAuth();
```

### Implementación del AuthProvider

```typescript
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authStrategy = useMemo(() => new ApiAuthStrategy(), []);
  
  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSession();
  }, []);
  
  // Método login
  const login = useCallback(async (credentials: Credentials) => {
    const result = await authStrategy.login(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    } else {
      throw new Error(result.error || 'Error al iniciar sesión');
    }
  }, [authStrategy]);
  
  // Método register
  const register = useCallback(async (name: string, username: string, password: string) => {
    const result = await authStrategy.register(name, username, password);
    if (result.success && result.user) {
      setUser(result.user);
    } else {
      throw new Error(result.error || 'Error al registrar usuario');
    }
  }, [authStrategy]);
  
  // Método logout
  const logout = useCallback(async () => {
    await authStrategy.logout();
    setUser(null);
  }, [authStrategy]);
  
  // Proveer contexto a los hijos
  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**Puntos clave:**
1. Usa `ApiAuthStrategy` para la implementación real
2. Carga sesión desde localStorage al iniciar
3. Maneja errores y lanza excepciones
4. Proporciona estado y funciones a través del contexto

---

## 🎨 Componentes UI

### Login Component

El componente Login maneja el formulario de inicio de sesión.

```typescript
// src/auth/components/Login.tsx
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="demo"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};
```

**Puntos clave:**
1. Usa `username` y `password` como campos
2. Llama a `login()` del AuthContext
3. Navega a `/dashboard` después del login exitoso
4. Muestra errores si falla

### Register Component

El componente Register maneja el formulario de registro.

```typescript
// src/auth/components/Register.tsx
const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación: contraseñas coinciden
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación: longitud mínima
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register(name, username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre completo"
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmar contraseña"
      />
      <button type="submit">Registrarse</button>
    </form>
  );
};
```

**Puntos clave:**
1. Usa `name`, `username`, `password`, `confirmPassword` como campos
2. Valida que las contraseñas coincidan
3. Valida longitud mínima de contraseña
4. Llama a `register()` del AuthContext
5. Navega a `/dashboard` después del registro exitoso

---

## 🔄 Flujo de Autenticación

### Flujo de Login

```
1. Usuario ingresa username y password en Login.tsx
2. Login.tsx llama a login({ username, password })
3. AuthContext llama a authStrategy.login(credentials)
4. ApiAuthService.login() hace POST /auth/login con FormData
5. Backend retorna { access_token, refresh_token, token_type }
6. ApiAuthService llama a getCurrentUser(token)
7. ApiAuthService guarda tokens en localStorage
8. AuthContext actualiza estado user
9. Login.tsx navega a /dashboard
```

### Flujo de Register

```
1. Usuario ingresa name, username, password en Register.tsx
2. Register.tsx valida contraseñas coinciden
3. Register.tsx llama a register(name, username, password)
4. AuthContext llama a authStrategy.register(name, username, password)
5. ApiAuthService.register() hace POST /auth/register con JSON
6. Backend retorna usuario creado
7. ApiAuthService hace login automático
8. AuthContext actualiza estado user
9. Register.tsx navega a /dashboard
```

### Flujo de Logout

```
1. Usuario hace clic en "Cerrar Sesión"
2. Header llama a logout()
3. AuthContext llama a authStrategy.logout()
4. ApiAuthService.logout() hace POST /auth/logout con refresh_token
5. ApiAuthService limpia localStorage
6. AuthContext actualiza estado user a null
7. Usuario es redirigido a /login
```

---

## ✏️ Cómo Agregar Nuevos Campos

### Escenario 1: Agregar campo de email al registro

Si el backend requiere email además de username, sigue estos pasos:

#### Paso 1: Actualizar tipos

```typescript
// src/auth/types/auth.types.ts
export interface User {
  id: string;
  username: string;
  email?: string;        // Agregar email opcional
  name: string;
  city: string;
  createdAt?: string;
}

export interface Credentials {
  username: string;
  password: string;
}
// Credentials no cambia porque login sigue usando username
```

#### Paso 2: Actualizar interfaz AuthStrategy

```typescript
// src/auth/services/AuthService.ts
export interface AuthStrategy {
  login(credentials: Credentials): Promise<AuthResult>;
  register(name: string, username: string, email: string, password: string): Promise<AuthResult>; // Agregar email
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}
```

#### Paso 3: Actualizar ApiAuthService

```typescript
// src/auth/services/ApiAuthService.ts
async register(name: string, username: string, email: string, password: string): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,        // Agregar email
        password: password,
      }),
    });

    // ... resto del código
  } catch (error) {
    // ... manejo de errores
  }
}

private async getCurrentUser(token: string): Promise<User> {
  // ...
  return {
    id: data.id || data.username || Date.now().toString(),
    username: data.username || '',
    email: data.email || '',  // Agregar email
    name: data.username || 'Usuario',
    city: 'TransMilenio Bogotá',
    createdAt: data.created_at || new Date().toISOString(),
  };
}
```

#### Paso 4: Actualizar AuthContext

```typescript
// src/auth/context/AuthContext.tsx
interface AuthContextValue extends AuthState {
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>; // Agregar email
}

const register = useCallback(async (name: string, username: string, email: string, password: string) => {
  const result = await authStrategy.register(name, username, email, password);
  if (result.success && result.user) {
    setUser(result.user);
  } else {
    throw new Error(result.error || 'Error al registrar usuario');
  }
}, [authStrategy]);
```

#### Paso 5: Actualizar Register Component

```typescript
// src/auth/components/Register.tsx
const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');  // Agregar estado email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones existentes...

    try {
      await register(name, username, email, password);  // Agregar email
      navigate('/dashboard');
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre completo"
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
      />
      <input
        type="email"  // Agregar campo email
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmar contraseña"
      />
      <button type="submit">Registrarse</button>
    </form>
  );
};
```

### Escenario 2: Cambiar login de username a email

Si el backend requiere email en lugar de username para el login:

#### Paso 1: Actualizar tipos

```typescript
// src/auth/types/auth.types.ts
export interface User {
  id: string;
  username: string;
  email: string;  // Hacer email obligatorio
  name: string;
  city: string;
  createdAt?: string;
}

export interface Credentials {
  email: string;  // Cambiar de username a email
  password: string;
}
```

#### Paso 2: Actualizar Login Component

```typescript
// src/auth/components/Login.tsx
const Login = () => {
  const [email, setEmail] = useState('');  // Cambiar de username a email
  const [password, setPassword] = useState('');
  // ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });  // Cambiar de username a email
      navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"  // Cambiar tipo a email
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="demo@example.com"
      />
      {/* ... */}
    </form>
  );
};
```

#### Paso 3: Actualizar ApiAuthService

```typescript
// src/auth/services/ApiAuthService.ts
async login(credentials: Credentials): Promise<AuthResult> {
  try {
    const formData = new FormData();
    formData.append('username', credentials.email);  // Mapear email a username si backend usa username
    formData.append('password', credentials.password);
    // ... resto del código
  } catch (error) {
    // ... manejo de errores
  }
}
```

**Nota:** Si el backend también usa `email` en lugar de `username`, cambia `formData.append('username', ...)` a `formData.append('email', ...)`.

---

## ⚙️ Configuración del Backend

### Endpoints del Backend

El backend debe tener los siguientes endpoints:

#### POST /auth/login
- **Body:** FormData con `username` y `password`
- **Response:** JSON con `access_token`, `refresh_token`, `token_type`

#### POST /auth/register
- **Body:** JSON con `username` y `password`
- **Response:** JSON con usuario creado

#### POST /auth/logout
- **Body:** JSON con `refresh_token`
- **Response:** JSON con éxito

#### POST /auth/refresh
- **Body:** JSON con `refresh_token`
- **Response:** JSON con nuevo `access_token`

#### GET /auth/me
- **Headers:** `Authorization: Bearer <token>`
- **Response:** JSON con información del usuario

### Configuración de CORS

El backend debe tener CORS configurado para permitir peticiones desde el frontend.

**Ejemplo en FastAPI:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### URL del Backend

La URL del backend está configurada en:

```typescript
// src/auth/services/ApiAuthService.ts
const API_BASE_URL = 'http://127.0.0.1:8001';
```

Para cambiar la URL del backend, solo actualiza esta constante.

---

## 📞 Soporte

Si tienes dudas sobre la implementación o necesitas hacer cambios adicionales, consulta este documento o contacta al equipo de desarrollo.

---

**Última actualización:** 27 de mayo de 2026
**Versión:** 1.0.0
