# 🔧 Configuración del Backend Laravel - Sistema AMCA

## 📋 Requisitos Previos

### Software Necesario
- **PHP 8.0+** (recomendado 8.1 o superior)
- **Composer** (gestor de dependencias de PHP)
- **MySQL 8.0+** o **MariaDB 10.5+**
- **Laragon** (recomendado para Windows) o **XAMPP**
- **Node.js** (para el frontend React)

### Extensiones PHP Requeridas
```bash
# Extensiones necesarias para Laravel
php-bcmath
php-curl
php-json
php-mbstring
php-mysql
php-xml
php-zip
```

## 🚀 Instalación del Backend Laravel

### 1. Crear Proyecto Laravel
```bash
# Crear nuevo proyecto Laravel
composer create-project laravel/laravel amca-backend

# Navegar al directorio
cd amca-backend
```

### 2. Configurar Base de Datos
```bash
# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate
```

Editar el archivo `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=amca_db
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Crear Base de Datos
```sql
-- En MySQL/MariaDB
CREATE DATABASE amca_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Ejecutar Migraciones
```bash
# Ejecutar migraciones
php artisan migrate

# Si hay seeders
php artisan db:seed
```

## 📊 Estructura de la API

### Endpoints Principales

#### Agricultores
```
GET    /api/agricultores          # Listar todos
GET    /api/agricultores/{id}     # Obtener por ID
POST   /api/agricultores          # Crear nuevo
PUT    /api/agricultores/{id}     # Actualizar
DELETE /api/agricultores/{id}     # Eliminar
GET    /api/agricultores/search   # Búsqueda
```

#### Fincas
```
GET    /api/fincas                # Listar todas
GET    /api/fincas/{id}           # Obtener por ID
POST   /api/fincas                # Crear nueva
PUT    /api/fincas/{id}           # Actualizar
DELETE /api/fincas/{id}           # Eliminar
GET    /api/fincas/search         # Búsqueda
```

#### Animales
```
GET    /api/animales              # Listar todos
GET    /api/animales/{id}         # Obtener por ID
POST   /api/animales              # Crear nuevo
PUT    /api/animales/{id}         # Actualizar
DELETE /api/animales/{id}         # Eliminar
GET    /api/animales/search       # Búsqueda
```

#### Vegetales
```
GET    /api/vegetales             # Listar todos
GET    /api/vegetales/{id}        # Obtener por ID
POST   /api/vegetales             # Crear nuevo
PUT    /api/vegetales/{id}        # Actualizar
DELETE /api/vegetales/{id}        # Eliminar
GET    /api/vegetales/search      # Búsqueda
```

#### Preparados
```
GET    /api/preparados            # Listar todos
GET    /api/preparados/{id}       # Obtener por ID
POST   /api/preparados            # Crear nuevo
PUT    /api/preparados/{id}       # Actualizar
DELETE /api/preparados/{id}       # Eliminar
GET    /api/preparados/search     # Búsqueda
```

#### Búsqueda Global
```
GET    /api/search                # Búsqueda global
GET    /api/search/{category}     # Búsqueda por categoría
```

#### Autenticación
```
POST   /api/auth/login            # Iniciar sesión
POST   /api/auth/logout           # Cerrar sesión
POST   /api/auth/refresh          # Renovar token
GET    /api/auth/me               # Información del usuario
```

#### Health Check
```
GET    /api/health                # Estado del servidor
```

## 🔧 Configuración de CORS

### 1. Instalar paquete CORS
```bash
composer require fruitcake/laravel-cors
```

### 2. Publicar configuración
```bash
php artisan vendor:publish --provider="Fruitcake\Cors\CorsServiceProvider"
```

### 3. Configurar CORS en `config/cors.php`
```php
<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

## 🔐 Configuración de Autenticación

### 1. Instalar Laravel Sanctum
```bash
composer require laravel/sanctum
```

### 2. Publicar configuración
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Ejecutar migraciones
```bash
php artisan migrate
```

### 4. Configurar en `config/sanctum.php`
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
```

## 🚀 Ejecutar el Servidor

### Desarrollo
```bash
# Ejecutar servidor de desarrollo
php artisan serve

# El servidor estará disponible en http://localhost:8000
```

### Producción
```bash
# Configurar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Usar servidor web (Apache/Nginx)
```

## 📝 Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "data": {
    "id": 1,
    "nombres": "Juan Carlos",
    "apellidos": "García López",
    "telefono": "3001234567",
    "documento": "12345678",
    "created_at": "2024-12-01T10:00:00.000000Z",
    "updated_at": "2024-12-01T10:00:00.000000Z"
  },
  "message": "Agricultor creado exitosamente",
  "status": "success"
}
```

### Respuesta de Error
```json
{
  "message": "Error de validación",
  "errors": {
    "nombres": ["El campo nombres es obligatorio"],
    "telefono": ["El formato del teléfono no es válido"]
  },
  "status": "error"
}
```

## 🔍 Testing de la API

### Usando Postman o Insomnia
1. Importar colección de endpoints
2. Configurar URL base: `http://localhost:8000/api`
3. Probar endpoints individuales

### Usando cURL
```bash
# Ejemplo: Obtener agricultores
curl -X GET http://localhost:8000/api/agricultores

# Ejemplo: Crear agricultor
curl -X POST http://localhost:8000/api/agricultores \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Juan Carlos",
    "apellidos": "García López",
    "telefono": "3001234567",
    "documento": "12345678"
  }'
```

## 🛠️ Solución de Problemas

### Error de Conexión
```bash
# Verificar que el servidor esté ejecutándose
php artisan serve

# Verificar puerto disponible
netstat -an | findstr :8000
```

### Error de Base de Datos
```bash
# Verificar conexión
php artisan tinker
DB::connection()->getPdo();

# Recrear base de datos
php artisan migrate:fresh --seed
```

### Error de CORS
```bash
# Limpiar caché
php artisan config:clear
php artisan cache:clear

# Verificar configuración CORS
cat config/cors.php
```

## 📚 Recursos Adicionales

- [Documentación Laravel](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Laravel CORS](https://github.com/fruitcake/laravel-cors)
- [API Testing](https://laravel.com/docs/testing#testing-apis)

---

**Nota:** Este backend debe estar ejecutándose en `http://localhost:8000` para que el frontend React funcione correctamente. Si el backend no está disponible, el frontend funcionará con datos mock en modo desarrollo. 