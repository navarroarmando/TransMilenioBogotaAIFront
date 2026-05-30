# Documentación Completa de Integración Frontend-Backend
## Sistema de Soporte a Decisiones - TransMilenio Bogotá AI

Este documento proporciona toda la información necesaria para que el equipo de frontend se integre con el backend FastAPI y el algoritmo genético de optimización de rutas de transporte.

---

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Autenticación](#autenticación)
4. [Endpoints del Backend](#endpoints-del-backend)
5. [Modelos de Datos](#modelos-de-datos)
6. [WebSocket para Logs en Tiempo Real](#websocket-para-logs-en-tiempo-real)
7. [Parámetros del Algoritmo Genético](#parámetros-del-algoritmo-genético)
8. [Configuraciones del Sistema](#configuraciones-del-sistema)
9. [Flujos de Usuario](#flujos-de-usuario)
10. [Ejemplos de Implementación](#ejemplos-de-implementación)

---

## 🏗️ Arquitectura General

### Patrón Arquitectónico

```
Frontend (React) → FastAPI (REST API) → Servicios → AGTrainer → Genetic Algorithm
                                              ↓
                                         Modelos de Datos
                                              ↓
                                         Sistema de Archivos
                                              ↓
                                         Base de Datos (PostgreSQL)
```

### Componentes del Backend

**API Layer (FastAPI):**
- Endpoints REST para optimización, resultados, historial, informes
- WebSocket para streaming de logs en tiempo real
- Validación de requests con Pydantic

**Service Layer:**
- OptimizationService: Orquestación de entrenamiento del AG
- ResultsService: Recuperación de resultados y visualizaciones
- HistoryService: Gestión de historial de ejecuciones
- ReportsService: Generación de informes (PDF, Excel, HTML)
- DashboardService: Agregación de KPIs del sistema

**Integration Layer:**
- AGTrainer: API unificada para entrenamiento y reentrenamiento
- Genetic Algorithm: Algoritmo genético de optimización de rutas
- ModelService: Serialización y deserialización de modelos

**Storage Layer:**
- Sistema de archivos para modelos, checkpoints, visualizaciones
- Base de datos PostgreSQL para metadatos de ejecuciones
- S3 (opcional) para almacenamiento de archivos grandes

---

## 💻 Stack Tecnológico

### Backend

**Framework Web:**
- FastAPI 0.104+ - Framework web asíncrono
- Uvicorn 0.24+ - ASGI server
- WebSockets - Streaming de logs en tiempo real

**Validación de Datos:**
- Pydantic 2.0+ - Validación de datos y serialización
- Pydantic Settings 2.0+ - Configuración de settings

**Base de Datos:**
- PostgreSQL 14+ - Base de datos relacional
- SQLAlchemy 2.0+ - ORM
- Alembic - Migraciones

**Autenticación:**
- python-jose[cryptography] 3.3+ - JWT tokens
- passlib[bcrypt] 1.7+ - Password hashing
- python-dotenv 1.0+ - Variables de entorno

### Dependencias del Proyecto

- pandas, numpy, scipy - Procesamiento de datos
- networkx, osmnx - Grafos y redes
- geopandas, shapely - Datos geoespaciales
- gtfs-kit - Procesamiento GTFS
- matplotlib, folium, seaborn - Visualizaciones
- joblib, pyarrow - Serialización

---

## 🔐 Autenticación

### Flujo de Autenticación

#### POST /api/v1/auth/login

**Propósito:** Iniciar sesión y obtener token JWT

**Request:**
```json
{
  "email": "admin@siva.gov",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "1",
    "email": "admin@siva.gov",
    "name": "Administrador",
    "city": "TransMilenio Bogotá",
    "created_at": "2026-05-26T00:00:00Z"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Incorrect email or password"
}
```

**Uso en Frontend:**
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Guardar token en localStorage
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
};
```

#### POST /api/v1/auth/register

**Propósito:** Registrar nuevo usuario

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "2",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "city": "TransMilenio Bogotá",
    "created_at": "2026-05-26T00:00:00Z"
  }
}
```

### Uso del Token JWT

**Headers para endpoints protegidos:**
```
Authorization: Bearer {access_token}
```

**Ejemplo en Frontend:**
```typescript
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
```

---

## 🔌 Endpoints del Backend

### Resumen de Endpoints

| Categoría | Método | Endpoint | Propósito |
|-----------|--------|----------|-----------|
| Auth | POST | /api/v1/auth/login | Iniciar sesión |
| Auth | POST | /api/v1/auth/register | Registrar usuario |
| Optimization | POST | /api/v1/optimization/start | Iniciar optimización |
| Optimization | GET | /api/v1/optimization/status/{execution_id} | Verificar estado |
| Optimization | POST | /api/v1/optimization/cancel/{execution_id} | Cancelar optimización |
| Optimization | POST | /api/v1/optimization/retrain | Reentrenar desde checkpoint |
| Results | GET | /api/v1/results/{execution_id} | Obtener resultados |
| Results | GET | /api/v1/results/{execution_id}/visualization/{viz_type} | Obtener visualización |
| Dashboard | GET | /api/v1/dashboard | Obtener datos del dashboard |
| History | GET | /api/v1/history | Listar ejecuciones |
| History | GET | /api/v1/history/{execution_id} | Obtener detalles de ejecución |
| History | DELETE | /api/v1/history/{execution_id} | Eliminar ejecución |
| Reports | POST | /api/v1/reports/pdf | Generar informe PDF |
| Reports | POST | /api/v1/reports/excel | Generar informe Excel |
| Reports | POST | /api/v1/reports/html | Generar informe HTML |
| Reports | GET | /api/v1/reports/download/{report_id} | Descargar informe |
| WebSocket | WS | /api/v1/ws/logs/{execution_id} | Streaming de logs |

---

### Optimización

#### POST /api/v1/optimization/start

**Propósito:** Iniciar optimización (individual o MAP)

**Request:**
```json
{
  "config": {
    "mode": "individual",
    "parameters": {
      "population_size": 50,
      "generations": 100,
      "mutation_rate": 0.1,
      "crossover_rate": 0.8,
      "elitism_count": 2,
      "tournament_size": 3,
      "min_route_length": 5,
      "max_route_length": 25,
      "distance_bias_km": 30.0,
      "enable_dijkstra_decoding": true,
      "max_travel_time_min": 90.0,
      "bus_capacity": 80,
      "checkpoint_interval": 10,
      "log_interval": 10,
      "demand_sample_ratio": 0.0,
      "demand_filter_threshold": 0.0,
      "enable_numpy_vectorization": true,
      "enable_spatial_index": true,
      "enable_performance_timer": true,
      "enable_connectivity_validation": true,
      "connectivity_penalty": 1000,
      "enable_population_fitness_history": false
    },
    "fitness_weights": {
      "efficiency": 0.25,
      "economy": 0.15,
      "equity": 0.20,
      "coverage": 0.25,
      "transfers": 0.10,
      "speed": 0.05
    },
    "operational": {
      "service_hours_start": 6,
      "service_hours_end": 18,
      "time_slot_interval": 120,
      "num_routes_per_slot": 10,
      "enable_time_slots": true
    },
    "business_config": {
      "morning_peak_start": 6,
      "morning_peak_end": 9,
      "afternoon_peak_start": 17,
      "afternoon_peak_end": 20,
      "peak_hour_speed_factor": 0.6,
      "urban_default_speed": 30.0,
      "highway_default_speed": 60.0,
      "trunk_default_speed": 50.0,
      "residential_default_speed": 20.0,
      "max_speed": 80.0,
      "crs_target": "EPSG:3116",
      "crs_source": "EPSG:4326",
      "min_stops": 2,
      "max_stops": 50,
      "min_routes_per_stop": 1,
      "max_distance": 50.0,
      "min_distance": 2.0,
      "demand_default": 0.0,
      "demand_min_threshold": 1.0,
      "demand_max_threshold": 10000.0,
      "demand_peak_hour_factor": 1.5,
      "stratification_default": 2.5,
      "stratification_buckets": null,
      "stratification_weights": null,
      "max_transfers": 3,
      "transfer_average_time": 10,
      "coverage_stop_radius": 500,
      "coverage_min": 80.0,
      "coverage_target": 95.0
    },
    "parallel_config": {
      "enable_monitoring": true,
      "monitoring_interval": 10.0,
      "adjustment_cooldown": 10.0,
      "log_resource_usage": true,
      "max_cpu_percent": 95.0,
      "max_memory_percent": 95.0,
      "max_memory_mb": null,
      "throttle_on_limit": true,
      "throttle_factor": 0.5,
      "num_workers": 16,
      "enable_dynamic_workers": false,
      "min_workers": 2,
      "max_workers": 15,
      "ideal_workers": 8,
      "consecutive_threshold": 2,
      "ideal_cpu_percent": 70.0,
      "ideal_memory_percent": 70.0,
      "prolonged_usage_threshold": 300.0
    },
    "output_config": {
      "save_suggested_routes": true,
      "save_population": false,
      "save_fitness_history": true,
      "output_dir": "models"
    },
    "visualization_config": {
      "visualization_graph": "networkx",
      "enable_visualization": true
    }
  }
}
```

**Response (200 OK):**
```json
{
  "execution_id": "exec-123",
  "status": "running",
  "message": "Optimización iniciada",
  "websocket_url": "ws://localhost:8000/api/v1/ws/logs/exec-123"
}
```

**Response (400 Bad Request):**
```json
{
  "detail": "Invalid configuration: population_size must be between 10 and 200"
}
```

**Uso en Frontend:**
```typescript
const startOptimization = async (config: OptimizationConfig) => {
  const response = await fetchWithAuth('/api/v1/optimization/start', {
    method: 'POST',
    body: JSON.stringify({ config })
  });
  
  const data = await response.json();
  
  // Conectar al WebSocket para logs en tiempo real
  connectWebSocket(data.execution_id);
  
  return data;
};
```

#### GET /api/v1/optimization/status/{execution_id}

**Propósito:** Verificar estado de optimización

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "execution_id": "exec-123",
  "status": "running",
  "progress": 45,
  "current_generation": 45,
  "total_generations": 100,
  "current_time_slot": 1,
  "total_time_slots": 3,
  "best_fitness": 0.85,
  "started_at": "2026-05-27T12:00:00Z",
  "estimated_completion": "2026-05-27T12:05:00Z"
}
```

**Estados posibles:**
- `running`: Optimización en curso
- `completed`: Optimización completada exitosamente
- `failed`: Optimización falló
- `cancelled`: Optimización fue cancelada

#### POST /api/v1/optimization/cancel/{execution_id}

**Propósito:** Cancelar optimización en curso

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Optimización cancelada",
  "execution_id": "exec-123"
}
```

**Response (400 Bad Request):**
```json
{
  "detail": "Cannot cancel execution: already completed or not found"
}
```

#### POST /api/v1/optimization/retrain

**Propósito:** Reentrenar desde checkpoint

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "checkpoint_path": "models/basic_training_20260527_120103/train_20260527_120103/ga_model_checkpoint_gen10_20260527_115604.joblib",
  "additional_generations": 20,
  "parameters": {
    "population_size": 10,
    "generations": 20
  }
}
```

**Response (200 OK):**
```json
{
  "execution_id": "exec-124",
  "status": "running",
  "message": "Reentrenamiento iniciado",
  "websocket_url": "ws://localhost:8000/api/v1/ws/logs/exec-124"
}
```

**Notas:**
- El backend carga el checkpoint y continúa el entrenamiento desde donde quedó
- Puede especificar `additional_generations` para agregar más generaciones
- Puede sobrescribir parámetros específicos (population_size, etc.)
- Soporta ambos modos: individual y MAP
- Genera nuevo directorio de salida con timestamp

---

### Resultados

#### GET /api/v1/results/{execution_id}

**Propósito:** Obtener resultados de optimización

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "execution_id": "exec-123",
  "timestamp": "2026-05-27T12:05:00Z",
  "mode": "individual",
  "parameters": {
    "population_size": 50,
    "generations": 100
  },
  "fitness_weights": {
    "efficiency": 0.25,
    "coverage": 0.25
  },
  "results_by_slot": {
    "slot_0": [
      {
        "route_id": "route-1",
        "stops": [
          {
            "stop_id": "74141",
            "stop_name": "Parada 1",
            "lat": 4.544664,
            "lon": -74.142692,
            "demand": 100
          }
        ],
        "total_distance_km": 15.5,
        "total_travel_time_min": 45,
        "demand_served": 5000,
        "fitness_score": 0.85
      }
    ],
    "slot_1": [],
    "slot_2": []
  },
  "kpis": {
    "total_demand_served": 150000,
    "avg_travel_time_min": 42,
    "total_distance_km": 2500,
    "coverage_pct": 88,
    "equity_score": 0.75,
    "operating_cost": 5000000,
    "fleet_utilization": 0.82,
    "convergence_generation": 42,
    "initial_fitness": 0.55,
    "fitness_improvement": 0.37,
    "fitness_improvement_pct": 67.27,
    "avg_fitness_population": 0.78,
    "worst_fitness": 0.48,
    "population_diversity": 0.12,
    "num_routes_generated": 25,
    "avg_stops_per_route": 12.5,
    "time_per_generation": 36.0,
    "effective_mutation_rate": 0.08,
    "effective_crossover_rate": 0.75,
    "last_checkpoint": "/data/checkpoints/full-flow",
    "completed_time_slots": 1,
    "avg_fitness_per_slot": 0.92,
    "fitness_history_json": "[0.55, 0.60, 0.65, 0.70, 0.72, 0.75, 0.78, 0.80, 0.82, 0.84, 0.85, 0.86, 0.87, 0.88, 0.89, 0.90, 0.91, 0.92]",
    "hamming_distance_avg": 8.5,
    "genetic_entropy": 3.2,
    "selection_pressure": 0.18,
    "convergence_rate": 0.0074,
    "generations_to_threshold": 38,
    "hypervolume": null,
    "spacing_metric": null
  },
  "duration_seconds": 300
}
```

**Response (404 Not Found):**
```json
{
  "detail": "Results not found"
}
```

#### GET /api/v1/results/{execution_id}/visualization/{viz_type}

**Propósito:** Obtener visualización (mapa o grafo)

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `viz_type`: "map" o "graph"

**Response (200 OK):**
- Archivo HTML (mapa interactivo o grafo)

**Response (404 Not Found):**
```json
{
  "detail": "Visualization not found"
}
```

**Nota:** Actualmente retorna S3 key, en producción se descargaría el archivo de S3.

---

### Dashboard

#### GET /api/v1/dashboard

**Propósito:** Obtener datos del dashboard

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "kpis": {
    "total_executions": 50,
    "completed_executions": 45,
    "failed_executions": 5,
    "avg_duration_seconds": 300,
    "best_fitness_all_time": 0.92
  },
  "recent_executions": [
    {
      "execution_id": "exec-123",
      "timestamp": "2026-05-27T12:00:00Z",
      "mode": "individual",
      "status": "completed",
      "best_fitness": 0.85
    }
  ],
  "system_status": {
    "cpu_usage": 75.0,
    "memory_usage": 53.4,
    "disk_usage": 45.0
  }
}
```

---

### Historial

#### GET /api/v1/history

**Propósito:** Listar todas las ejecuciones

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `status`: Filtrar por estado (opcional)
- `mode`: Filtrar por modo (opcional)
- `start_date`: Filtrar por fecha inicio (opcional)
- `end_date`: Filtrar por fecha fin (opcional)
- `limit`: Límite de resultados (default: 50)
- `offset`: Offset para paginación (default: 0)

**Response (200 OK):**
```json
{
  "executions": [
    {
      "execution_id": "exec-123",
      "timestamp": "2026-05-27T12:00:00Z",
      "mode": "individual",
      "status": "completed",
      "duration_seconds": 300,
      "best_fitness": 0.85,
      "parameters": {
        "population_size": 50,
        "generations": 100
      }
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

#### GET /api/v1/history/{execution_id}

**Propósito:** Obtener detalles de ejecución

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
- (Mismo que GET /api/v1/results/{execution_id})

**Response (404 Not Found):**
```json
{
  "detail": "Execution not found"
}
```

#### DELETE /api/v1/history/{execution_id}

**Propósito:** Eliminar ejecución (archivos y metadatos)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ejecución eliminada"
}
```

**Response (404 Not Found):**
```json
{
  "detail": "Execution not found"
}
```

---

### Informes

#### POST /api/v1/reports/pdf

**Propósito:** Generar informe PDF

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "execution_id": "exec-123",
  "options": {
    "include_kpis": true,
    "include_routes": true,
    "include_comparison": true,
    "include_charts": true
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "report_id": "report-123",
  "download_url": "/api/v1/reports/download/report-123"
}
```

#### POST /api/v1/reports/excel

**Propósito:** Generar hoja de cálculo Excel

**Headers:**
```
Authorization: Bearer {token}
```

**Request:** (Mismo que PDF)

**Response (200 OK):**
```json
{
  "success": true,
  "report_id": "report-124",
  "download_url": "/api/v1/reports/download/report-124"
}
```

#### POST /api/v1/reports/html

**Propósito:** Generar informe HTML

**Headers:**
```
Authorization: Bearer {token}
```

**Request:** (Mismo que PDF)

**Response (200 OK):**
```json
{
  "success": true,
  "report_id": "report-125",
  "download_url": "/api/v1/reports/download/report-125"
}
```

#### GET /api/v1/reports/download/{report_id}

**Propósito:** Descargar informe

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
- Archivo (PDF, Excel o HTML)

**Response (404 Not Found):**
```json
{
  "detail": "Report not found"
}
```

**Nota:** Actualmente retorna S3 key, en producción se descargaría el archivo de S3.

---

## 📊 Modelos de Datos

### GAParameters

Parámetros del algoritmo genético.

```typescript
interface GAParameters {
  population_size: number;        // 10-200, default: 50
  generations: number;            // 10-1000, default: 100
  mutation_rate: number;          // 0.0-1.0, default: 0.1
  crossover_rate: number;          // 0.0-1.0, default: 0.8
  elitism_count: number;           // 0-20, default: 2
  tournament_size: number;         // 2-10, default: 3
  min_route_length: number;        // 3-20, default: 5
  max_route_length: number;        // 10-50, default: 25
  distance_bias_km: number;        // 15-50, default: 30.0
  enable_dijkstra_decoding: boolean; // default: true
  max_travel_time_min: number;     // 30-180, default: 90.0
  bus_capacity: number;           // 20-200, default: 80
  checkpoint_interval: number;     // 5-50, default: 10
  log_interval: number;            // 1-50, default: 10
  demand_sample_ratio: number;     // 0.0-1.0, default: 0.0
  demand_filter_threshold: number; // 0.0+, default: 0.0
  enable_numpy_vectorization: boolean; // default: true
  enable_spatial_index: boolean;   // default: true
  enable_performance_timer: boolean; // default: true
  enable_connectivity_validation: boolean; // default: true
  connectivity_penalty: number;    // default: 1000
  enable_population_fitness_history: boolean; // default: false
}
```

### FitnessWeights

Pesos de criterios de fitness (deben sumar 1.0).

```typescript
interface FitnessWeights {
  efficiency: number;  // 0.0-1.0, default: 0.35
  economy: number;     // 0.0-1.0, default: 0.10
  equity: number;      // 0.0-1.0, default: 0.20
  coverage: number;    // 0.0-1.0, default: 0.25
  transfers: number;   // 0.0-1.0, default: 0.05
  speed: number;       // 0.0-1.0, default: 0.05
}
```

### OperationalParams

Parámetros operativos del sistema.

```typescript
interface OperationalParams {
  service_hours_start: number;        // 0-23, default: 6
  service_hours_end: number;          // 1-24, default: 18
  time_slot_interval: number;        // 30-240 (minutos), default: 120
  num_routes_per_slot: number;        // 1-50, default: 10
  enable_time_slots: boolean;         // default: true
}
```

### BusinessConfig

Configuración de negocio del dominio.

```typescript
interface BusinessConfig {
  // Horas pico
  morning_peak_start: number;         // default: 6
  morning_peak_end: number;           // default: 9
  afternoon_peak_start: number;       // default: 17
  afternoon_peak_end: number;         // default: 20
  peak_hour_speed_factor: number;     // default: 0.6
  
  // Velocidades (km/h)
  urban_default_speed: number;        // default: 30.0
  highway_default_speed: number;      // default: 60.0
  trunk_default_speed: number;        // default: 50.0
  residential_default_speed: number;  // default: 20.0
  max_speed: number;                  // default: 80.0
  
  // CRS
  crs_target: string;                 // default: "EPSG:3116"
  crs_source: string;                 // default: "EPSG:4326"
  
  // Parámetros de rutas
  min_stops: number;                  // default: 2
  max_stops: number;                  // default: 50
  min_routes_per_stop: number;        // default: 1
  max_distance: number;               // default: 50.0 (km)
  min_distance: number;               // default: 2.0 (km)
  
  // Parámetros de demanda
  demand_default: number;             // default: 0.0
  demand_min_threshold: number;       // default: 1.0
  demand_max_threshold: number;       // default: 10000.0
  demand_peak_hour_factor: number;    // default: 1.5
  
  // Estratificación
  stratification_default: number;    // default: 2.5
  stratification_buckets: number[] | null; // default: null
  stratification_weights: Record<string, number> | null; // default: null
  
  // Transbordos
  max_transfers: number;              // default: 3
  transfer_average_time: number;     // default: 10 (minutos)
  
  // Cobertura
  coverage_stop_radius: number;       // default: 500 (metros)
  coverage_min: number;               // default: 80.0 (%)
  coverage_target: number;            // default: 95.0 (%)
}
```

### ParallelConfig

Configuración de paralelización y monitoreo de recursos.

```typescript
interface ParallelConfig {
  // Monitoreo
  enable_monitoring: boolean;         // default: true
  monitoring_interval: number;       // default: 10.0 (segundos)
  adjustment_cooldown: number;        // default: 10.0 (segundos)
  log_resource_usage: boolean;        // default: true
  
  // Límites de recursos
  max_cpu_percent: number;           // default: 95.0
  max_memory_percent: number;         // default: 95.0
  max_memory_mb: number | null;      // default: null
  throttle_on_limit: boolean;         // default: true
  throttle_factor: number;            // default: 0.5
  
  // Workers
  num_workers: number;                // default: 16
  enable_dynamic_workers: boolean;    // default: false
  min_workers: number;                // default: 2
  max_workers: number;                // default: 15
  ideal_workers: number;              // default: 8
  consecutive_threshold: number;     // default: 2
  ideal_cpu_percent: number;          // default: 70.0
  ideal_memory_percent: number;      // default: 70.0
  prolonged_usage_threshold: number;  // default: 300.0
}
```

### OutputConfig

Configuración de salida del algoritmo genético.

```typescript
interface OutputConfig {
  save_suggested_routes: boolean;    // default: true
  save_population: boolean;           // default: false
  save_fitness_history: boolean;      // default: true
  output_dir: string;                 // default: "models"
}
```

### VisualizationConfig

Configuración de visualizaciones.

```typescript
interface VisualizationConfig {
  visualization_graph: string;        // "networkx" o "integrated_osm"
  enable_visualization: boolean;      // default: true
}
```

### OptimizationConfig

Configuración completa de optimización.

```typescript
interface OptimizationConfig {
  mode: "individual" | "map";
  parameters: GAParameters;
  fitness_weights: FitnessWeights;
  operational: OperationalParams;
  business_config?: BusinessConfig;
  parallel_config?: ParallelConfig;
  output_config?: OutputConfig;
  visualization_config?: VisualizationConfig;
}
```

### Stop

Parada de transporte.

```typescript
interface Stop {
  stop_id: string;
  stop_name: string;
  lat: number;
  lon: number;
  demand: number;
}
```

### Route

Ruta optimizada.

```typescript
interface Route {
  route_id: string;
  stops: Stop[];
  total_distance_km: number;
  total_travel_time_min: number;
  demand_served: number;
  fitness_score: number;
}
```

### KPIs

Indicadores clave de rendimiento (30 KPIs totales).

```typescript
interface KPIs {
  // KPIs de negocio (7)
  total_demand_served: number;
  avg_travel_time_min: number;
  total_distance_km: number;
  coverage_pct: number;
  equity_score: number;
  operating_cost: number;
  fleet_utilization: number;
  
  // KPIs del algoritmo genético (15)
  convergence_generation: number | null;
  initial_fitness: number | null;
  fitness_improvement: number | null;
  fitness_improvement_pct: number | null;
  avg_fitness_population: number | null;
  worst_fitness: number | null;
  population_diversity: number | null;
  num_routes_generated: number | null;
  avg_stops_per_route: number | null;
  time_per_generation: number | null;
  effective_mutation_rate: number | null;
  effective_crossover_rate: number | null;
  last_checkpoint: string | null;
  completed_time_slots: number | null;
  avg_fitness_per_slot: number | null;
  
  // Métricas avanzadas del AG (8)
  fitness_history_json: string | null;  // JSON array
  hamming_distance_avg: number | null;
  genetic_entropy: number | null;
  selection_pressure: number | null;
  convergence_rate: number | null;
  generations_to_threshold: number | null;
  hypervolume: number | null;
  spacing_metric: number | null;
}
```

### OptimizationResults

Resultados de optimización.

```typescript
interface OptimizationResults {
  execution_id: string;
  timestamp: string;  // ISO 8601
  mode: "individual" | "map";
  parameters: Record<string, any> | null;
  fitness_weights: Record<string, any> | null;
  results_by_slot: Record<string, Route[]>;
  kpis: KPIs;
  duration_seconds: number;
}
```

### ExecutionStatus

Estado de ejecución de optimización.

```typescript
interface ExecutionStatus {
  execution_id: string;
  status: "running" | "completed" | "failed" | "cancelled";
  progress: number;  // 0.0-100.0
  current_generation?: number;
  total_generations?: number;
  current_time_slot?: number;
  total_time_slots?: number;
  best_fitness?: number;
  started_at?: string;  // ISO 8601
  estimated_completion?: string;  // ISO 8601
  error_message?: string;
}
```

---

## 🔄 WebSocket para Logs en Tiempo Real

### Conexión WebSocket

**URL:** `ws://localhost:8000/api/v1/ws/logs/{execution_id}`

**Propósito:** Streaming de logs en tiempo real durante la ejecución del algoritmo genético.

### Formato de Mensajes

```typescript
interface LogEntry {
  timestamp: string;  // ISO 8601
  level: "info" | "warning" | "error" | "debug";
  source: "ga" | "system" | "visualization";
  type: "info" | "timer" | "monitoring" | "checkpoint" | "progress" | "fitness" | "generation";
  message: string;
}
```

### Tipos de Logs

**info:** Información general
**timer:** Métricas de tiempo de ejecución
**monitoring:** Monitoreo de recursos (CPU, RAM)
**checkpoint:** Guardado de checkpoints
**progress:** Progreso de ejecución
**fitness:** Valores de fitness
**generation:** Información de generaciones

### Ejemplos de Logs

```json
{
  "timestamp": "2026-05-27T12:00:01Z",
  "level": "info",
  "source": "system",
  "type": "info",
  "message": "Conectado al streaming de logs para ejecución exec-123"
}
```

```json
{
  "timestamp": "2026-05-27T12:00:10Z",
  "level": "info",
  "source": "ga",
  "type": "generation",
  "message": "Generación 1 completada - Mejor fitness: 0.75"
}
```

```json
{
  "timestamp": "2026-05-27T12:00:15Z",
  "level": "info",
  "source": "ga",
  "type": "fitness",
  "message": "Fitness actual: 0.78 - Mejor fitness: 0.82"
}
```

```json
{
  "timestamp": "2026-05-27T12:01:00Z",
  "level": "info",
  "source": "ga",
  "type": "monitoring",
  "message": "[Monitor] CPU: 75.2%, RAM: 53.4%"
}
```

```json
{
  "timestamp": "2026-05-27T12:02:00Z",
  "level": "info",
  "source": "ga",
  "type": "checkpoint",
  "message": "[CHECKPOINT] Guardando checkpoint generación 10"
}
```

### Implementación en Frontend

```typescript
const connectWebSocket = (executionId: string) => {
  const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/logs/${executionId}`);
  
  ws.onopen = () => {
    console.log('WebSocket conectado');
  };
  
  ws.onmessage = (event) => {
    const log: LogEntry = JSON.parse(event.data);
    
    // Renderizar log en componente de terminal
    renderLog(log);
    
    // Actualizar progreso si es log de progreso
    if (log.type === 'progress') {
      updateProgress(log);
    }
    
    // Actualizar fitness si es log de fitness
    if (log.type === 'fitness') {
      updateFitnessChart(log);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket desconectado');
  };
  
  return ws;
};
```

### Componente de Terminal para Logs

```typescript
const TerminalLogs = ({ executionId }: { executionId: string }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    const ws = connectWebSocket(executionId);
    wsRef.current = ws;
    
    ws.onmessage = (event) => {
      const log: LogEntry = JSON.parse(event.data);
      setLogs(prev => [...prev, log]);
    };
    
    return () => {
      ws.close();
    };
  }, [executionId]);
  
  return (
    <div className="terminal">
      {logs.map((log, index) => (
        <div key={index} className={`log log-${log.level} log-${log.type}`}>
          <span className="timestamp">{log.timestamp}</span>
          <span className="source">[{log.source}]</span>
          <span className="message">{log.message}</span>
        </div>
      ))}
    </div>
  );
};
```

### Estilos para Terminal

```css
.terminal {
  background-color: #1a1a2e;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  padding: 1rem;
  border-radius: 8px;
  height: 400px;
  overflow-y: auto;
}

.log {
  padding: 0.25rem 0;
  border-bottom: 1px solid #333;
}

.log-info { color: #4fc3f7; }
.log-warning { color: #ffb74d; }
.log-error { color: #ef5350; }
.log-debug { color: #bdbdbd; }

.log-timer { color: #81c784; }
.log-monitoring { color: #ba68c8; }
.log-checkpoint { color: #4dd0e1; }
.log-progress { color: #fff176; }
.log-fitness { color: #ff8a65; }
.log-generation { color: #9575cd; }

.timestamp {
  color: #757575;
  margin-right: 0.5rem;
}

.source {
  color: #90a4ae;
  margin-right: 0.5rem;
}
```

---

## ⚙️ Parámetros del Algoritmo Genético

### Modos de Optimización

#### Modo Individual

**Propósito:** Optimizar rutas individuales de transporte.

**Características:**
- Cada cromosoma representa una sola ruta
- Fitness basado en demanda, distancia, tiempo de viaje, eficiencia
- Útil para optimizar rutas específicas existentes
- Menos computacionalmente intensivo

**Parámetros recomendados:**
- `population_size`: 50-100
- `generations`: 50-200
- `num_routes_per_slot`: No aplica

#### Modo MAP (Multi-Agent Planning)

**Propósito:** Optimizar conjuntos de rutas de transporte.

**Características:**
- Cada cromosoma representa un conjunto de rutas
- Fitness basado en cobertura, redundancia, equidad entre rutas
- Útil para optimizar la red completa de transporte
- Más computacionalmente intensivo

**Parámetros recomendados:**
- `population_size`: 10-30
- `generations`: 20-100
- `num_routes_per_slot`: 5-15

### Parámetros del Algoritmo Genético (GAParameters)

| Parámetro | Tipo | Rango | Default | Descripción |
|-----------|------|-------|---------|-------------|
| `population_size` | int | 10-200 | 50 | Tamaño de la población |
| `generations` | int | 10-1000 | 100 | Número de generaciones |
| `mutation_rate` | float | 0.0-1.0 | 0.1 | Tasa de mutación |
| `crossover_rate` | float | 0.0-1.0 | 0.8 | Tasa de cruce |
| `elitism_count` | int | 0-20 | 2 | Número de élites a preservar |
| `tournament_size` | int | 2-10 | 3 | Tamaño del torneo para selección |
| `min_route_length` | int | 3-20 | 5 | Longitud mínima de ruta en paradas |
| `max_route_length` | int | 10-50 | 25 | Longitud máxima de ruta en paradas |
| `distance_bias_km` | float | 15-50 | 30.0 | Sesgo de distancia para generación (km) |
| `enable_dijkstra_decoding` | bool | - | true | Habilitar decodificación con Dijkstra |
| `max_travel_time_min` | float | 30-180 | 90.0 | Tiempo máximo de viaje en minutos |
| `bus_capacity` | int | 20-200 | 80 | Capacidad del bus |
| `checkpoint_interval` | int | 5-50 | 10 | Intervalo para guardar checkpoints |
| `log_interval` | int | 1-50 | 10 | Intervalo para logging |
| `demand_sample_ratio` | float | 0.0-1.0 | 0.0 | Ratio de muestreo de demanda |
| `demand_filter_threshold` | float | 0.0+ | 0.0 | Umbral para filtrar demanda baja |
| `enable_numpy_vectorization` | bool | - | true | Habilitar vectorización numpy |
| `enable_spatial_index` | bool | - | true | Habilitar índice espacial (KDTree) |
| `enable_performance_timer` | bool | - | true | Habilitar timer de rendimiento |
| `enable_connectivity_validation` | bool | - | true | Habilitar validación de conectividad |
| `connectivity_penalty` | int | - | 1000 | Penalización por rutas no conectadas |
| `enable_population_fitness_history` | bool | - | false | Habilitar historial de fitness de población |

### Pesos de Fitness (FitnessWeights)

Los pesos de fitness determinan qué criterios son más importantes en la optimización. **Deben sumar 1.0.**

| Peso | Tipo | Rango | Default | Descripción |
|------|------|-------|---------|-------------|
| `efficiency` | float | 0.0-1.0 | 0.35 | Eficiencia - demanda por km |
| `economy` | float | 0.0-1.0 | 0.10 | Economía - inverso de distancia |
| `equity` | float | 0.0-1.0 | 0.20 | Equidad social - estratos bajos |
| `coverage` | float | 0.0-1.0 | 0.25 | Cobertura - demanda total |
| `transfers` | float | 0.0-1.0 | 0.05 | Transbordos - penalización |
| `speed` | float | 0.0-1.0 | 0.05 | Velocidad - penalización por baja velocidad |

**Ejemplos de configuración:**

```typescript
// Enfocado en eficiencia
const efficiencyFocused = {
  efficiency: 0.50,
  economy: 0.10,
  equity: 0.10,
  coverage: 0.20,
  transfers: 0.05,
  speed: 0.05
};

// Enfocado en equidad social
const equityFocused = {
  efficiency: 0.20,
  economy: 0.10,
  equity: 0.40,
  coverage: 0.20,
  transfers: 0.05,
  speed: 0.05
};

// Balanceado
const balanced = {
  efficiency: 0.35,
  economy: 0.10,
  equity: 0.20,
  coverage: 0.25,
  transfers: 0.05,
  speed: 0.05
};
```

### Parámetros Operativos (OperationalParams)

| Parámetro | Tipo | Rango | Default | Descripción |
|-----------|------|-------|---------|-------------|
| `service_hours_start` | int | 0-23 | 6 | Hora de inicio de servicio |
| `service_hours_end` | int | 1-24 | 18 | Hora de fin de servicio |
| `time_slot_interval` | int | 30-240 | 120 | Intervalo de franjas horarias (minutos) |
| `num_routes_per_slot` | int | 1-50 | 10 | Rutas por franja horaria (solo modo MAP) |
| `enable_time_slots` | bool | - | true | Habilitar franjas horarias |

### Parámetros de Negocio (BusinessConfig)

#### Horas Pico

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `morning_peak_start` | int | 6 | Inicio pico mañana |
| `morning_peak_end` | int | 9 | Fin pico mañana |
| `afternoon_peak_start` | int | 17 | Inicio pico tarde |
| `afternoon_peak_end` | int | 20 | Fin pico tarde |
| `peak_hour_speed_factor` | float | 0.6 | Factor de velocidad en hora pico |

#### Velocidades (km/h)

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `urban_default_speed` | float | 30.0 | Velocidad default en zona urbana |
| `highway_default_speed` | float | 60.0 | Velocidad default en carretera |
| `trunk_default_speed` | float | 50.0 | Velocidad default en vías principales |
| `residential_default_speed` | float | 20.0 | Velocidad default en zona residencial |
| `max_speed` | float | 80.0 | Velocidad máxima permitida |

#### Parámetros de Rutas

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `min_stops` | int | 2 | Mínimo de paradas por ruta |
| `max_stops` | int | 50 | Máximo de paradas por ruta |
| `min_routes_per_stop` | int | 1 | Mínimo de rutas por parada |
| `max_distance` | float | 50.0 | Distancia máxima de ruta (km) |
| `min_distance` | float | 2.0 | Distancia mínima de ruta (km) |

#### Parámetros de Demanda

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `demand_default` | float | 0.0 | Demanda default |
| `demand_min_threshold` | float | 1.0 | Umbral mínimo de demanda |
| `demand_max_threshold` | float | 10000.0 | Umbral máximo de demanda |
| `demand_peak_hour_factor` | float | 1.5 | Factor de demanda en hora pico |

#### Estratificación

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `stratification_default` | float | 2.5 | Estrato default |
| `stratification_buckets` | int[] | null | Buckets de estratificación |
| `stratification_weights` | Record<string, number> | null | Pesos por estrato |

#### Transbordos

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `max_transfers` | int | 3 | Máximo de transbordos permitidos |
| `transfer_average_time` | float | 10 | Tiempo promedio de transbordo (minutos) |

#### Cobertura

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `coverage_stop_radius` | int | 500 | Radio de cobertura de parada (metros) |
| `coverage_min` | float | 80.0 | Cobertura mínima (%) |
| `coverage_target` | float | 95.0 | Cobertura objetivo (%) |

### Parámetros de Paralelización (ParallelConfig)

#### Monitoreo

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `enable_monitoring` | bool | true | Habilitar monitoreo de recursos |
| `monitoring_interval` | float | 10.0 | Intervalo de monitoreo (segundos) |
| `adjustment_cooldown` | float | 10.0 | Cooldown entre ajustes (segundos) |
| `log_resource_usage` | bool | true | Logear uso de recursos |

#### Límites de Recursos

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `max_cpu_percent` | float | 95.0 | Máximo uso de CPU (%) |
| `max_memory_percent` | float | 95.0 | Máximo uso de RAM (%) |
| `max_memory_mb` | int | null | Máximo uso de RAM (MB) |
| `throttle_on_limit` | bool | true | Throttle al exceder límites |
| `throttle_factor` | float | 0.5 | Factor de throttle |

#### Workers

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `num_workers` | int | 16 | Número de workers |
| `enable_dynamic_workers` | bool | false | Habilitar ajuste dinámico de workers |
| `min_workers` | int | 2 | Mínimo de workers |
| `max_workers` | int | 15 | Máximo de workers |
| `ideal_workers` | int | 8 | Número ideal de workers |
| `consecutive_threshold` | int | 2 | Threshold para ajuste consecutivo |
| `ideal_cpu_percent` | float | 70.0 | Uso ideal de CPU (%) |
| `ideal_memory_percent` | float | 70.0 | Uso ideal de RAM (%) |
| `prolonged_usage_threshold` | float | 300.0 | Threshold de uso prolongado (segundos) |

### Parámetros de Salida (OutputConfig)

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `save_suggested_routes` | bool | true | Guardar rutas sugeridas |
| `save_population` | bool | false | Guardar población final |
| `save_fitness_history` | bool | true | Guardar historial de fitness |
| `output_dir` | string | "models" | Directorio de salida |

### Parámetros de Visualización (VisualizationConfig)

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `visualization_graph` | string | "networkx" | Tipo de grafo ("networkx" o "integrated_osm") |
| `enable_visualization` | bool | true | Habilitar generación de visualizaciones |

---

## 🔧 Configuraciones del Sistema

### Variables de Entorno

El backend usa variables de entorno para configuración. Ver `.env.example` para referencia.

**Variables principales:**

```bash
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/transmind

# JWT
SECRET_KEY=tu-secret-key-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:3000"]

# Algoritmo Genético
GA_OPTIMIZATION_MODE=individual
GA_POPULATION_SIZE=50
GA_GENERATIONS=100
GA_MUTATION_RATE=0.1
GA_CROSSOVER_RATE=0.8
```

### Configuración de Archivos

**Estructura de directorios:**

```
models/
├── basic_training_20260527_120000/
│   ├── train_20260527_120000/
│   │   ├── models/           # Modelos .joblib
│   │   ├── routes/           # Rutas CSV
│   │   ├── visualizations/   # Visualizaciones HTML
│   │   └── checkpoint/       # Checkpoints
│   └── metadata.json
└── retraining_20260527_121000/
    └── ...
```

---

## 🚀 Flujos de Usuario

### Flujo 1: Optimización Básica

```
1. Usuario hace login
   → POST /api/v1/auth/login
   → Guardar token en localStorage

2. Usuario navega a /optimization
   → GET /api/v1/dashboard (opcional, para ver estado del sistema)

3. Usuario configura parámetros
   → Selecciona modo (individual o MAP)
   → Ajusta parámetros del AG
   → Ajusta pesos de fitness
   → Ajusta parámetros operativos

4. Usuario hace clic en "Ejecutar Optimización"
   → POST /api/v1/optimization/start
   → Recibir execution_id y websocket_url

5. Frontend conecta al WebSocket
   → WS /api/v1/ws/logs/{execution_id}
   → Mostrar logs en tiempo real en componente de terminal

6. Frontend polling de estado (opcional)
   → GET /api/v1/optimization/status/{execution_id} cada 5 segundos
   → Actualizar barra de progreso

7. Cuando optimización completa
   → WebSocket envía mensaje de completion
   → Redirigir a /results/{execution_id}

8. Usuario ve resultados
   → GET /api/v1/results/{execution_id}
   → Mostrar KPIs, rutas, gráficos

9. Usuario descarga visualizaciones
   → GET /api/v1/results/{execution_id}/visualization/map
   → GET /api/v1/results/{execution_id}/visualization/graph
```

### Flujo 2: Reentrenamiento

```
1. Usuario navega a /history
   → GET /api/v1/history

2. Usuario selecciona ejecución previa
   → GET /api/v1/history/{execution_id}

3. Usuario hace clic en "Reentrenar"
   → Mostrar modal con configuración de reentrenamiento

4. Usuario configura reentrenamiento
   → Selecciona checkpoint
   → Especifica additional_generations
   → Ajusta parámetros opcionales

5. Usuario hace clic en "Iniciar Reentrenamiento"
   → POST /api/v1/optimization/retrain
   → Recibir nuevo execution_id y websocket_url

6. Flujo similar a optimización básica (pasos 5-9)
```

### Flujo 3: Generación de Informes

```
1. Usuario navega a /results/{execution_id}
   → GET /api/v1/results/{execution_id}

2. Usuario hace clic en "Generar Informe"
   → Mostrar modal con opciones de informe

3. Usuario selecciona tipo (PDF/Excel/HTML)
   → POST /api/v1/reports/pdf (o excel, html)
   → Recibir report_id y download_url

4. Usuario descarga informe
   → GET /api/v1/reports/download/{report_id}
   → Browser descarga archivo
```

---

## 💡 Ejemplos de Implementación

### Ejemplo 1: Hook de Optimización

```typescript
import { useState, useCallback, useRef } from 'react';

interface UseOptimizationReturn {
  startOptimization: (config: OptimizationConfig) => Promise<string>;
  getStatus: (executionId: string) => Promise<ExecutionStatus>;
  cancelOptimization: (executionId: string) => Promise<void>;
  retrain: (request: RetrainRequest) => Promise<string>;
  isRunning: boolean;
  error: string | null;
}

export const useOptimization = (): UseOptimizationReturn => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const startOptimization = useCallback(async (config: OptimizationConfig) => {
    setIsRunning(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth('/api/v1/optimization/start', {
        method: 'POST',
        body: JSON.stringify({ config })
      });
      
      const data = await response.json();
      
      // Conectar WebSocket
      wsRef.current = connectWebSocket(data.execution_id);
      
      return data.execution_id;
    } catch (err) {
      setError(err.message);
      setIsRunning(false);
      throw err;
    }
  }, []);

  const getStatus = useCallback(async (executionId: string) => {
    const response = await fetchWithAuth(`/api/v1/optimization/status/${executionId}`);
    return await response.json();
  }, []);

  const cancelOptimization = useCallback(async (executionId: string) => {
    await fetchWithAuth(`/api/v1/optimization/cancel/${executionId}`, {
      method: 'POST'
    });
    
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setIsRunning(false);
  }, []);

  const retrain = useCallback(async (request: RetrainRequest) => {
    setIsRunning(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth('/api/v1/optimization/retrain', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      
      const data = await response.json();
      
      // Conectar WebSocket
      wsRef.current = connectWebSocket(data.execution_id);
      
      return data.execution_id;
    } catch (err) {
      setError(err.message);
      setIsRunning(false);
      throw err;
    }
  }, []);

  return {
    startOptimization,
    getStatus,
    cancelOptimization,
    retrain,
    isRunning,
    error
  };
};
```

### Ejemplo 2: Componente de Configuración de Optimización

```typescript
import { useState } from 'react';

const OptimizationConfigForm = () => {
  const [mode, setMode] = useState<'individual' | 'map'>('individual');
  const [populationSize, setPopulationSize] = useState(50);
  const [generations, setGenerations] = useState(100);
  const [fitnessWeights, setFitnessWeights] = useState({
    efficiency: 0.35,
    economy: 0.10,
    equity: 0.20,
    coverage: 0.25,
    transfers: 0.05,
    speed: 0.05
  });

  const handleSubmit = () => {
    const config: OptimizationConfig = {
      mode,
      parameters: {
        population_size: populationSize,
        generations,
        mutation_rate: 0.1,
        crossover_rate: 0.8,
        elitism_count: 2,
        tournament_size: 3,
        min_route_length: 5,
        max_route_length: 25,
        distance_bias_km: 30.0,
        enable_dijkstra_decoding: true,
        max_travel_time_min: 90.0,
        bus_capacity: 80,
        checkpoint_interval: 10,
        log_interval: 10,
        demand_sample_ratio: 0.0,
        demand_filter_threshold: 0.0,
        enable_numpy_vectorization: true,
        enable_spatial_index: true,
        enable_performance_timer: true,
        enable_connectivity_validation: true,
        connectivity_penalty: 1000,
        enable_population_fitness_history: false
      },
      fitness_weights: fitnessWeights,
      operational: {
        service_hours_start: 6,
        service_hours_end: 18,
        time_slot_interval: 120,
        num_routes_per_slot: 10,
        enable_time_slots: true
      }
    };

    // Llamar a startOptimization(config)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Modo de Optimización</label>
        <select value={mode} onChange={(e) => setMode(e.target.value as 'individual' | 'map')}>
          <option value="individual">Individual</option>
          <option value="map">MAP (Conjunto de Rutas)</option>
        </select>
      </div>

      <div>
        <label>Tamaño de Población</label>
        <input
          type="number"
          value={populationSize}
          onChange={(e) => setPopulationSize(parseInt(e.target.value))}
          min={10}
          max={200}
        />
      </div>

      <div>
        <label>Generaciones</label>
        <input
          type="number"
          value={generations}
          onChange={(e) => setGenerations(parseInt(e.target.value))}
          min={10}
          max={1000}
        />
      </div>

      <div>
        <label>Pesos de Fitness</label>
        <div>
          <label>Eficiencia: {fitnessWeights.efficiency}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={fitnessWeights.efficiency}
            onChange={(e) => setFitnessWeights({
              ...fitnessWeights,
              efficiency: parseFloat(e.target.value)
            })}
          />
        </div>
        {/* Repetir para otros pesos */}
      </div>

      <button type="submit">Ejecutar Optimización</button>
    </form>
  );
};
```

### Ejemplo 3: Componente de Terminal con Logs

```typescript
import { useState, useEffect, useRef } from 'react';

const TerminalLogs = ({ executionId }: { executionId: string }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/logs/${executionId}`);
    
    ws.onmessage = (event) => {
      const log: LogEntry = JSON.parse(event.data);
      setLogs(prev => [...prev, log]);
      
      // Auto-scroll al final
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    };
    
    return () => {
      ws.close();
    };
  }, [executionId]);

  const getLogColor = (log: LogEntry) => {
    switch (log.type) {
      case 'error': return '#ef5350';
      case 'warning': return '#ffb74d';
      case 'fitness': return '#ff8a65';
      case 'generation': return '#9575cd';
      case 'checkpoint': return '#4dd0e1';
      case 'monitoring': return '#ba68c8';
      case 'progress': return '#fff176';
      case 'timer': return '#81c784';
      default: return '#4fc3f7';
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span>Terminal Logs - {executionId}</span>
        <button onClick={() => setLogs([])}>Limpiar</button>
      </div>
      <div ref={terminalRef} className="terminal">
        {logs.map((log, index) => (
          <div key={index} className="log-line" style={{ color: getLogColor(log) }}>
            <span className="timestamp">[{log.timestamp}]</span>
            <span className="source">[{log.source.toUpperCase()}</span>
            <span className="message">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Ejemplo 4: Componente de Visualización de KPIs

```typescript
const KPIsDisplay = ({ kpis }: { kpis: KPIs }) => {
  const businessKPIs = [
    { label: 'Demanda Atendida', value: kpis.total_demand_served, unit: 'pasajeros' },
    { label: 'Tiempo Promedio', value: kpis.avg_travel_time_min, unit: 'min' },
    { label: 'Distancia Total', value: kpis.total_distance_km, unit: 'km' },
    { label: 'Cobertura', value: kpis.coverage_pct, unit: '%' },
    { label: 'Equidad', value: kpis.equity_score, unit: '' },
    { label: 'Costo Operativo', value: kpis.operating_cost, unit: 'COP' },
    { label: 'Utilización Flota', value: kpis.fleet_utilization * 100, unit: '%' }
  ];

  const gaKPIs = [
    { label: 'Generación de Convergencia', value: kpis.convergence_generation, unit: '' },
    { label: 'Fitness Inicial', value: kpis.initial_fitness, unit: '' },
    { label: 'Mejora de Fitness', value: kpis.fitness_improvement, unit: '' },
    { label: 'Mejora %', value: kpis.fitness_improvement_pct, unit: '%' },
    { label: 'Fitness Promedio', value: kpis.avg_fitness_population, unit: '' },
    { label: 'Peor Fitness', value: kpis.worst_fitness, unit: '' },
    { label: 'Diversidad', value: kpis.population_diversity, unit: '' },
    { label: 'Rutas Generadas', value: kpis.num_routes_generated, unit: '' }
  ];

  return (
    <div className="kpis-container">
      <h2>KPIs de Negocio</h2>
      <div className="kpis-grid">
        {businessKPIs.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">
              {kpi.value.toLocaleString()} {kpi.unit}
            </div>
          </div>
        ))}
      </div>

      <h2>KPIs del Algoritmo Genético</h2>
      <div className="kpis-grid">
        {gaKPIs.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">
              {kpi.value !== null ? `${kpi.value} ${kpi.unit}` : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 📝 Notas Importantes

### Validaciones

**GAParameters:**
- `population_size`: 10-200
- `generations`: 10-1000
- `mutation_rate`: 0.0-1.0
- `crossover_rate`: 0.0-1.0
- `elitism_count`: 0-20
- `tournament_size`: 2-10
- `min_route_length`: 3-20
- `max_route_length`: 10-50
- `distance_bias_km`: 15-50
- `max_travel_time_min`: 30-180
- `bus_capacity`: 20-200

**FitnessWeights:**
- Todos los pesos deben ser 0.0-1.0
- La suma de pesos debe ser 1.0 (con tolerancia de 0.01)

**OperationalParams:**
- `service_hours_start`: 0-23
- `service_hours_end`: 1-24
- `time_slot_interval`: 30-240
- `num_routes_per_slot`: 1-50

### Códigos de Error HTTP

**400 Bad Request:**
- Parámetros inválidos
- Configuración inválida
- Pesos de fitness no suman 1.0

**401 Unauthorized:**
- Token inválido o expirado
- Credenciales incorrectas

**404 Not Found:**
- Ejecución no encontrada
- Checkpoint no encontrado
- Resultados no encontrados
- Visualización no encontrada

**500 Internal Server Error:**
- Error en el servidor
- Error en el algoritmo genético
- Error en generación de visualizaciones

### Tiempos de Ejecución Estimados

**Modo Individual:**
- Población 50, Generaciones 100: ~5-10 minutos
- Población 100, Generaciones 200: ~20-30 minutos

**Modo MAP:**
- Población 10, Generaciones 20: ~10-15 minutos
- Población 30, Generaciones 100: ~30-45 minutos

### Optimizaciones de Rendimiento

**Parámetros de Optimización:**
- `demand_sample_ratio`: 0.1-0.2 (muestreo de demanda)
- `demand_filter_threshold`: 10.0 (filtrar demanda baja)
- `enable_numpy_vectorization`: true (vectorización numpy)
- `enable_spatial_index`: true (KDTree para búsquedas espaciales)

**Checkpointing:**
- `checkpoint_interval`: 10 (guardar cada 10 generaciones)
- Permite reanudar entrenamientos
- Reduce tiempo de reentrenamiento

---

## 📚 Documentación Adicional

- **AG_TRAINER_API.md**: Documentación de la API AGTrainer
- **API_KPIS.md**: Documentación detallada de los 30 KPIs
- **BACKEND_IMPLEMENTATION_GUIDE.md**: Guía de implementación del backend
- **GENETIC_ALGORITHM.md**: Documentación completa del algoritmo genético
- **TESTING.md**: Guía de testing

---

**Última actualización:** 29 de mayo de 2026  
**Versión:** 1.0.0  
**Contacto:** Equipo de Backend
