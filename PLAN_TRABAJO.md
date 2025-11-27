# Plan de Trabajo - Tingeso 1 - ToolRent

## 📋 Descripción del Proyecto
Sistema web para gestión de arriendo de herramientas con:
- **Backend**: Spring Boot 3.3.4 + PostgreSQL (Java 17)
- **Frontend**: React + Vite + JavaScript

---

## 📊 RESUMEN EJECUTIVO

| Aspecto | Estado | Detalles |
|---------|--------|----------|
| **Entidades** | ✅ Completo | 6 entidades bien definidas |
| **Repositorios** | ✅ Completo | 6 repos + métodos custom en LoanRepository |
| **Services** | ⚠️ Casi | 5/6 implementados (RateService vacío) |
| **Controllers** | ⚠️ Incompleto | 5 controllers, falta: RateController, PUT methods |
| **Validaciones** | ❌ Falta | Sin validadores de RUT, email, teléfono |
| **DTOs** | ❌ Falta | Las entidades se envían directamente |
| **Error Handling** | ❌ Falta | Sin @ControllerAdvice global |
| **Documentación API** | ❌ Falta | Sin Swagger/OpenAPI |
| **Tests** | ❌ Falta | Solo clase test vacía |
| **Lógica de Negocios** | ✅ Completo | Reglas bien implementadas en services |

---

## ✅ Estado Actual del Backend

### Estructura Implementada
- ✅ **Entidades (Entities)**:
  - `UserEntity` - Usuarios del sistema (ADMIN/EMPLOYEE)
  - `ClientEntity` - Clientes (arriendo por RUT)
  - `ToolEntity` - Herramientas disponibles
  - `LoanEntity` - Préstamos de herramientas
  - `RateEntity` - Tasas de arriendo (diario, multa, reparación)
  - `MovementEntity` - Registro de movimientos

- ✅ **Repositories**: 6 interfaces para acceso a datos
- ✅ **Controllers**: 5 controladores REST básicos
- ✅ **Services**: 6 servicios con lógica de negocio

### Configuración Técnica
- ✅ PostgreSQL con variable de entorno (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS)
- ✅ JPA/Hibernate con ddl-auto=update
- ✅ Maven con Lombok
- ✅ CORS habilitado ("*")
- ✅ Validaciones con Jakarta Bean Validation

---

## 🎯 Requisitos por Evaluar

### RF1: Gestión de Usuarios
- [x] Crear usuarios (bootstrap si no existen)
- [x] Listar usuarios
- [x] Buscar usuario por username
- [x] Actualizar perfil (password, nombre, email)
- [x] Cambiar rol (solo ADMIN)
- [x] Habilitar/Deshabilitar (solo ADMIN)
- [x] Eliminar usuario (solo ADMIN)

### RF2: Gestión de Préstamos
- [x] RF2.1 Registrar préstamo
- [x] RF2.2 Validar cliente activo
- [x] RF2.3 Registrar devolución
- [x] RF2.4 Calcular multas por retraso
- [x] RF2.5 Validar disponibilidad de herramienta

### RF3: Gestión de Clientes
- [x] Crear cliente
- [x] Listar clientes
- [x] Buscar por RUT
- [x] Buscar por email
- [x] Eliminar cliente

### RF4: Gestión de Herramientas
- [x] Crear herramienta
- [x] Listar herramientas
- [x] Verificar existencia
- [x] Eliminar herramienta

### RF5: Gestión de Movimientos
- [x] Registrar movimiento
- [x] Listar movimientos
- [x] Filtrar por herramienta
- [x] Filtrar por cliente
- [x] Filtrar por usuario
- [x] Filtrar por tipo de movimiento

### RF6: Gestión de Tasas
- [ ] **PENDIENTE**: Endpoints de CRUD para tasas

---

## 🔧 Problemas Identificados

### 1. ❌ **RateService VACÍO**
   - `RateService` está implementado (vacío)
   - **Falta RateController** con endpoints GET, POST, PUT, DELETE para tasas

### 2. ❌ **Falta de Actualización en Clientes**
   - No existe endpoint PUT para actualizar clientes
   - `ClientService.update()` existe pero no se expone en controller
   - Solo existen: POST, GET, DELETE

### 3. ❌ **Actualizaciones en Herramientas**
   - `ToolService.update()` existe pero no se expone en controller
   - No existe endpoint PUT para actualizar herramientas
   - Falta filtrado por categoría y estado

### 4. ❌ **Validaciones Pendientes**
   - [ ] Validar formato de RUT (9 dígitos - 1 dígito verificador)
   - [ ] Validar email válido
   - [ ] Validar teléfono
   - [ ] Validar cantidad en movimientos

### 5. ❌ **Falta de DTOs**
   - No hay Data Transfer Objects
   - Las entidades se envían directamente en endpoints
   - Expone contraseñas de usuarios innecesariamente

### 6. ❌ **Falta de Manejo de Errores Global**
   - No hay `@ControllerAdvice` para excepciones
   - Cada controller maneja sus propios errores de forma inconsistente

### 7. ❌ **Falta de Documentación OpenAPI/Swagger**
   - No hay anotaciones para documentación de API
   - Dependencia Springdoc no está en pom.xml

### 8. ⚠️ **ClientController incompleto**
   - No hay endpoint para buscar por email con parámetro (ambigüedad con RUT)
   - El endpoint actual `/clients/email/{email}` causa conflicto potencial

---

## 📝 Plan de Trabajo Detallado

### **FASE 1: Completar Controladores (CRÍTICO)**

#### 1.1 - Crear `RateController`
- [ ] GET /rates - Listar todas las tasas
- [ ] GET /rates/{id} - Obtener tasa por ID
- [ ] POST /rates - Crear nueva tasa
- [ ] PUT /rates/{id} - Actualizar tasa
- [ ] DELETE /rates/{id} - Eliminar tasa

**Dependencias**: RateService, RateRepository

#### 1.2 - Mejorar `ClientController`
- [ ] PUT /clients/{rut} - Actualizar cliente (nombre, email, phone, status, debt)
- [ ] Validar RUT (formato válido)
- [ ] Validar email

**Dependencias**: Crear validadores

#### 1.3 - Mejorar `ToolController`
- [ ] PUT /tools/{id} - Actualizar herramienta
- [ ] GET /tools/category/{category} - Buscar por categoría
- [ ] GET /tools/status/{status} - Buscar por estado

**Dependencias**: ToolService

---

### **FASE 2: Validaciones y DTOs**

#### 2.1 - Crear Validadores
- [ ] `RutValidator` - Validar formato RUT chileno
- [ ] `EmailValidator` - Validar email
- [ ] `PhoneValidator` - Validar teléfono

#### 2.2 - Crear DTOs (Data Transfer Objects)
- [ ] `ClientDTO` - Para crear/actualizar clientes sin IDs generados
- [ ] `LoanDTO` - Para préstamos
- [ ] `ToolDTO` - Para herramientas
- [ ] `UserDTO` - Evitar exponer contraseñas
- [ ] `RateDTO` - Para tasas

---

### **FASE 3: Manejo de Errores Global**

#### 3.1 - Crear `@ControllerAdvice`
- [ ] `GlobalExceptionHandler` - Centralizar manejo de excepciones
- [ ] Definir respuestas estándar para errores

#### 3.2 - Crear Custom Exceptions
- [ ] `ResourceNotFoundException`
- [ ] `InvalidInputException`
- [ ] `BusinessLogicException`

---

### **FASE 4: Documentación API (Swagger/OpenAPI)**

#### 4.1 - Agregar Springdoc OpenAPI
- [ ] Dependencia en pom.xml
- [ ] Anotaciones @Operation, @Tag en controllers
- [ ] Configuración de Swagger UI

---

### **FASE 5: Testing**

#### 5.1 - Tests Unitarios
- [ ] Tests para cada service
- [ ] Tests para validadores

#### 5.2 - Tests de Integración
- [ ] Tests para cada controller
- [ ] Tests de endpoints REST

---

## 📊 Prioridad de Trabajo

| Prioridad | Tarea | Impacto |
|-----------|-------|--------|
| 🔴 ALTA | Crear RateController | RF6 completo |
| 🔴 ALTA | Mejorar ClientController (PUT) | RF3 completo |
| 🔴 ALTA | Mejorar ToolController (PUT) | RF4 completo |
| 🟠 MEDIA | Crear DTOs | Mejor práctica |
| 🟠 MEDIA | Validadores (RUT, email) | Integridad datos |
| 🟡 BAJA | Exception Handler global | Mejor manejo errores |
| 🟡 BAJA | Swagger/OpenAPI | Documentación |

---

## 🚀 Próximos Pasos Recomendados

1. ✅ **Inmediato**: Crear `RateController` (falta RF6)
2. ✅ **Inmediato**: Agregar PUT en `ClientController` y `ToolController`
3. ⏳ **Corto plazo**: Validadores y DTOs
4. ⏳ **Mediano plazo**: Exception Handler global
5. ⏳ **Largo plazo**: Documentación Swagger

---

## 📌 Notas Técnicas

- **Base de datos**: PostgreSQL (definida en application.properties)
- **Autenticación**: Simple header X-User (no JWT, no OAuth2)
- **Autorización**: Basada en roles ADMIN/EMPLOYEE
- **BD creada automáticamente**: hibernate ddl-auto=update
- **Puerto**: 8090

---

## 📁 Estructura de Carpetas del Backend

```
toolrent-back/
├── toolrent/
│   ├── pom.xml (Spring Boot 3.3.4)
│   ├── src/main/java/cl/toolrent/toolrent/
│   │   ├── ToolrentApplication.java
│   │   ├── controllers/ (5 + falta RateController)
│   │   ├── entities/ (6 entities)
│   │   ├── repositories/ (6 repositories)
│   │   └── services/ (6 services)
│   └── src/main/resources/
│       └── application.properties
```

---

## 🎓 Criterios de Evaluación (Estimado)

- Funcionalidad completa de CRUD para todas las entidades ✅ (Casi)
- Validaciones de datos ❌ (Pendiente)
- Manejo de errores coherente ❌ (Pendiente)
- Documentación de API ❌ (Pendiente)
- Tests unitarios ❌ (Pendiente)
- Tests de integración ❌ (Pendiente)

---

**Última actualización**: Noviembre 25, 2025
**Estado**: En revisión de requisitos

---

## 🔍 ANÁLISIS DETALLADO DE IMPLEMENTACIÓN

### Services - Análisis Línea por Línea

#### ✅ **UserService** (Completo)
- `findAll()` ✅
- `findByUsername()` ✅
- `create()` ✅ - Bootstrap si está vacío, por defecto EMPLOYEE
- `updateProfile()` ✅ - Solo actualiza password, fullName, email
- `changeRole()` ✅ - Solo ADMIN puede llamar desde controller
- `setEnabled()` ✅
- `delete()` ✅

#### ✅ **ClientService** (Completo)
- `findAll()` ✅
- `findById()` ✅
- `findByEmail()` ✅
- `create()` ✅
- `update()` ✅ - **Existe pero NO se expone en controller**
- `deleteById()` ✅
- Métodos para deuda: `getDebt()`, `increaseDebt()`, `payDebt()`, `setDebt()` ✅

#### ✅ **ToolService** (Completo)
- `findAll()` ✅
- `findById()` ✅
- `save()` ✅
- `update()` ✅ - **Existe pero NO se expone en controller**
- `deleteById()` ✅
- `createTool()` ✅
- `getAllTools()` ✅ (redundante con findAll)

#### ✅ **LoanService** (Muy Completo - Lógica Crítica)
- Validaciones robustas antes de crear préstamo:
  - ✅ Cliente debe existir y estar ACTIVO
  - ✅ Cliente sin deudas/multas
  - ✅ Stock disponible
  - ✅ Máximo 5 préstamos activos por cliente
  - ✅ No permitir 2x misma herramienta al mismo cliente
  - ✅ No permitir préstamo si hay otro vencido sin regularizar
- ✅ Cálculo automático de multa: 1000 por día de atraso
- ✅ Actualización automática de stock al prestar y devolver
- ✅ Transaccional (@Transactional)

#### ✅ **MovementService** (Completo)
- `create()` ✅ - Normaliza IDs, asigna timestamp automático
- `findAll()` ✅
- `findById()` ✅
- `deleteById()` ✅
- `findByToolId()` ✅
- `findByClientId()` ✅
- `findByUserId()` ✅
- `findByTypeMovement()` ✅

#### ❌ **RateService** (VACÍO - Necesita Implementación)
```java
public class RateService {
}
```
- **Falta TODO**: findAll(), findById(), create(), update(), delete()

### Controllers - Análisis

#### ✅ **UserController** (Muy Bueno)
- ✅ Endpoints completos (CRUD + role + enabled)
- ✅ Autenticación por header X-User
- ✅ Validación de permisos ADMIN
- ✅ Bootstrap automático
- Rutas: POST, GET, GET/{id}, PUT, PUT/{id}/role, PUT/{id}/enabled, DELETE/{id}

#### ⚠️ **ClientController** (Incompleto)
- ✅ POST /clients - Crear
- ✅ GET /clients - Listar
- ✅ GET /clients/{rut} - Buscar por RUT
- ✅ GET /clients/email/{email} - Buscar por email (⚠️ conflicto de rutas)
- ❌ PUT /clients/{rut} - **NO EXISTE** (service existe)
- ✅ DELETE /clients/{rut} - Eliminar

#### ⚠️ **ToolController** (Incompleto)
- ✅ POST /tools - Crear
- ✅ GET /tools - Listar
- ✅ DELETE /tools/{id} - Eliminar
- ✅ GET /tools/{id}/exists - Verificar
- ❌ PUT /tools/{id} - **NO EXISTE** (service existe)
- ❌ GET /tools/category/{category} - No existe
- ❌ GET /tools/status/{status} - No existe

#### ✅ **LoanController** (Muy Bueno)
- ✅ POST /loan - Crear préstamo
- ✅ POST /loan/{id}/return - Registrar devolución
- ✅ GET /loan - Listar
- ✅ GET /loan/{id} - Buscar
- ✅ DELETE /loan/{id} - Eliminar

#### ✅ **MovementController** (Excelente)
- ✅ POST /movement - Crear
- ✅ GET /movement - Listar
- ✅ GET /movement/{id} - Buscar
- ✅ GET /movement/tool/{toolId} - Filtrar por herramienta
- ✅ GET /movement/client/{clientId} - Filtrar por cliente
- ✅ GET /movement/user/{userId} - Filtrar por usuario
- ✅ GET /movement/type/{typeMovement} - Filtrar por tipo
- ✅ DELETE /movement/{id} - Eliminar
- ✅ DELETE /movement - Eliminar todo

#### ❌ **RateController** (NO EXISTE - Necesita Crearse)

---
