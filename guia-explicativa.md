# Gestión Estudiantil — Documentación del Proyecto

## 1. Descripción General del Proyecto

### 1.1 Resumen

Gestión Estudiantil es una aplicación web diseñada para digitalizar y automatizar los procesos de gestión académica en instituciones educativas. El sistema permite a docentes y apoderados acceder a información clave como registro de asistencia, calendario de evaluaciones, anotaciones de comportamiento y notificaciones de reuniones de apoderados, todo mediante una interfaz moderna y accesible.

### 1.2 Objetivos del Proyecto

El objetivo principal de este proyecto es desarrollar un Producto Mínimo Viable (MVP) que permita validar la solución con usuarios reales, optimizando la gestión académica y la comunicación entre la institución educativa y las familias. El sistema busca eliminar las barreras de comunicación mediante una solución digital escalable, eficiente y centrada plenamente en el usuario.

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

El sistema sigue una arquitectura cliente-servidor con los siguientes componentes principales:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare Pages                         │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐ │
│  │   Frontend (Angular) │    │  Cloudflare Workers (API)       │ │
│  │   - SPA Routing      │    │  - Endpoints REST               │ │
│  │   - UI Components    │    │  - MongoDB Atlas Data API       │ │
│  │   - State Management │    │  - CORS Headers                 │ │
│  └─────────────────────┘    └─────────────────────────────────┘ │
│                 │                           │                    │
│                 └───────────┬─────────────────┘                    │
│                             ▼                                     │
│                  ┌──────────────────────┐                         │
│                  │   MongoDB Atlas      │                         │
│                  │   (Base de Datos)    │                         │
│                  └──────────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

El flujo de comunicación entre componentes es el siguiente: el usuario interactúa con el Frontend Angular a través del navegador web. Las solicitudes HTTP son enviadas al Cloudflare Worker que actúa como API REST, el cual procesa las peticiones y se comunica con MongoDB Atlas mediante la Data API. Finalmente, los datos son devueltos al cliente en formato JSON.

---

## 3. Tecnología Utilizada

### 3.1 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-------------|---------|
| Frontend | Angular | 19.x |
| Backend API | Cloudflare Workers | Latest |
| Base de Datos | MongoDB Atlas | Latest |
| Despliegue | Cloudflare Pages | Free Tier |
| Estilos | Angular Material | Latest |

### 3.2 Justificación de Tecnologías

Angular fue seleccionado como framework Frontend por su robusta arquitectura basada en componentes, su excelente sistema de manejo de estado y su compatibilidad con TypeScript para desarrollo tipado. Cloudflare Workers fue elegido como plataforma de backend por su modelo serverless con ejecución en edge, lo que proporciona tiempos de respuesta mínimas a nivel mundial sin necesidad de gestionar servidores. MongoDB Atlas fue seleccionado como base de datos por su flexibilidad con documentos JSON, su escalabilidad automática y su capa gratuita generosa para proyectos de desarrollo.

---

## 4. Estructura del Proyecto

### 4.1 Organización de Carpetas

El proyecto está organizado en dos carpetas principales:

```
Gestion-Estudiantil/
├── Backend/              # Código del backend Django (referencia)
│   ├── core/            # Aplicación principal
│   ├── settings.py      # Configuración de Django
│   ├── urls.py          # Rutas de la API
│   └── requirements.txt # Dependencias Python
│
└── Frontend/            # Aplicación Angular
    ├── src/
    │   ├── app/
    │   │   ├── core/           # Servicios, guards, modelos
    │   │   ├── pages/          # Páginas principales
    │   │   └── shared/         # Componentes compartidos
    │   ├── environments/       # Configuración por entorno
    │   └── styles.css         # Estilos globales
    ├── functions/             # Cloudflare Workers
    │   └── [[path]].ts        # API REST
    ├── wrangler.toml          # Configuración Cloudflare
    └── package.json           # Dependencias npm
```

---

## 5. API REST — Endpoints

### 5.1 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión con email y password |

### 5.2 Recursos Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/usuarios | Listar todos los usuarios |
| GET | /api/usuarios/:id | Obtener usuario por ID |
| POST | /api/usuarios | Crear nuevo usuario |
| PUT | /api/usuarios/:id | Actualizar usuario |
| DELETE | /api/usuarios/:id | Eliminar usuario |
| GET | /api/estudiantes | Listar estudiantes (opcional: ?curso_id=) |
| GET | /api/estudiantes/:id | Obtener estudiante por ID |
| POST | /api/estudiantes | Crear nuevo estudiante |
| PUT | /api/estudiantes/:id | Actualizar estudiante |
| DELETE | /api/estudiantes/:id | Eliminar estudiante |
| GET | /api/cursos | Listar todos los cursos |
| GET | /api/cursos/:id | Obtener curso por ID |
| POST | /api/cursos | Crear nuevo curso |
| GET | /api/asistencia | Listar asistencia (filtros: ?estudiante_id=, ?curso_id=) |
| POST | /api/asistencia | Registrar asistencia |
| GET | /api/evaluaciones | Listar evaluaciones (opcional: ?curso_id=) |
| POST | /api/evaluaciones | Crear nueva evaluación |
| GET | /api/anotaciones | Listar anotaciones (opcional: ?estudiante_id=) |
| POST | /api/anotaciones | Crear nueva anotación |
| GET | /api/reuniones | Listar reuniones |
| POST | /api/reuniones | Crear nueva reunión |
| GET | /api/apoderados | Listar apoderados (opcional: ?estudiante_id=) |
| POST | /api/apoderados | Crear nuevo apoderado |

### 5.3 Formato de Respuesta

Todas las respuestas se devuelven en formato JSON con la siguiente estructura:

```json
// Éxito
{ "success": true, "data": [...] }

// Error
{ "error": "Mensaje de error" }

// Login exitoso
{ "success": true, "user": { "_id": "...", "nombre": "...", "email": "...", "rol": "..." } }
```

---

## 6. Roles de Usuario

### 6.1 Roles Definidos

El sistema cuenta con tres roles principales que determinan las funcionalidades disponibles para cada usuario:

**Administrador**: tiene acceso completo a todas las funcionalidades del sistema, incluyendo gestión de usuarios, cursos, estudiantes y toda la información académica. Este rol puede realizar operaciones CRUD (crear, leer, actualizar, eliminar) en todos los módulos del sistema.

**Docente**: puede registrar asistencia, crear evaluaciones, generar anotaciones y programar reuniones. Tiene acceso restricted a la información de los cursos que imparte y los estudiantes asignados a dichos cursos.

**Apoderado**: puede visualizar la asistencia de su pupilo, ver el calendario de evaluaciones, revisar las anotaciones y recibir notificaciones de reuniones programadas por el establecimiento.

---

## 7. Módulos del Sistema

### 7.1 Módulo de Asistencia

El módulo de asistencia permite a los docentes registrar diariamente la presencia o ausencia de cada estudiante en sus respective cursos. El sistema guarda la fecha, el estado de presencia (presente/ausente) y una observación opcional. Los apoderados pueden consultar el historial de asistencia de sus hijos en cualquier momento.

### 7.2 Módulo de Evaluaciones

Este módulo gestiona el calendario de evaluaciones académicas. Los docentes pueden crear pruebas, ensayos y otras actividades evaluativas, asociándolas a un curso específico y estableciendo fecha de realización. Los apoderados reciben notificaciones sobre las evaluaciones próximas de sus hijos.

### 7.3 Módulo de Anotaciones

El sistema permite registrar anotaciones tanto positivas como negativas sobre el comportamiento de los estudiantes. Las anotaciones positivas destacan buenas acciones como participación destacada o tareas entregas a tiempo. Las anotaciones negativas documentan comportamientos que requieren atención como indisciplina o tareas no entregadas.

### 7.4 Módulo de Reuniones

Gestiona la programación y notificación de reuniones de apoderados. Los docentes pueden agendar reuniones especificando fecha, hora y lugar. El sistema notifica a los apoderados correspondientes sobre las reuniones programadas.

### 7.5 Módulo de Cursos

Permite la gestión de cursos académicos incluyendo la creación de cursos por nivel y año, la asignación de estudiantes a cursos y la asociación de docentes responsables.

---

## 8. Despliegue en Cloudflare

### 8.1 Configuración de Cloudflare Pages

El Frontend Angular está desplegado en Cloudflare Pages, que proporciona hosting gratuito con las siguientes características:

- Ancho de banda: 500 MB/mes
- Solicitudes: Ilimitadas
- Builds: 500/mes
- Dominio gratuito: *.pages.dev
- SSL automático
- CDN global

### 8.2 Cloudflare Workers (API)

La API REST está implementada como un Cloudflare Worker que se ejecuta en edge, proporcionando latencia mínima desde cualquier ubicación geográfica. El Worker se conecta a MongoDB Atlas mediante la Data API.

### 8.3 MongoDB Atlas

La base de datos está alojada en MongoDB Atlas con las siguientes características de la capa gratuita:

- 512 MB de almacenamiento
- shared RAM
-until punto de acceso
- Replica set básico

---

## 9. Rendimiento y Optimización

### 9.1 Estrategias Implementadas

El sistema implementa varias estrategias de optimización para garantizar tiempos de respuesta rápidos. La ejecución en edge mediante Cloudflare Workers garantiza que las solicitudes sean procesadas desde el data center más cercano al usuario. El CDN de Cloudflare almacena en caché los assets estáticos del Frontend. El código del Worker está optimizado para ejecutarse con el menor consumo de recursos posible. Los encabezados CORS están configurados para permitir comunicaciones eficientes entre dominios.

### 9.2 Límites del Plan Gratuito

Es importante considerar los siguientes límites del plan gratuito de Cloudflare: 100.000 solicitudes por día para Workers, 500 MB de ancho de banda por mes, y 500 builds por mes para Pages. Estos límites son suficientes para proyectos en fase de desarrollo y prueba.

---

## 10. Configuración para Desarrollo Local

### 10.1 Requisitos Previos

Para ejecutar el proyecto en entorno local se necesitan Node.js (versión 18 o superior), npm o bun como gestor de paquetes, y una cuenta de MongoDB Atlas con credenciales válidas.

### 10.2 Instalación del Frontend

Los pasos para instalar y ejecutar el Frontend son los siguientes: primero, navegar a la carpeta Frontend mediante el comando cd Frontend. Segundo, instalar las dependencias con npm install. Tercero, iniciar el servidor de desarrollo con npm start. El Frontend estará disponible en http://localhost:4200.

### 10.3 Configuración de Variables de Entorno

Para la conexión con MongoDB Atlas se debe configurar el archivo functions/[[path]].ts con los siguientes valores: ATLAS_DATA_API_KEY con la API key generada en MongoDB Atlas, ATLAS_DATA_API_URL con la URL del endpoint Data API, y ATLAS_DB_NAME con el nombre de la base de datos.

---

## 11. Credenciales de Prueba

### 11.1 Usuarios de Prueba

El sistema incluye las siguientes cuentas de prueba para verificación:

| Email | Password | Rol |
|-------|----------|-----|
| admin@colegio.cl | admin | Administrador |
| juan@colegio.cl | 123 | Docente |
| maria@colegio.cl | 123 | Administrador |

---

## 12. Comandos de Despliegue

### 12.1 Despliegue del Frontend

Para desplegar el Frontend en Cloudflare Pages se utilizan los siguientes comandos desde la carpeta Frontend:

```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Iniciar sesión en Cloudflare
wrangler login

# Desplegar
npm run deploy
```

### 12.2 Verificación del Despliegue

Una vez desplegado, verificar que el sitio esté disponible en la URL proporcionada por Cloudflare (generalmente https://tu-proyecto.pages.dev). Probar el endpoint de la API en https://tu-proyecto.pages.dev/api/ para confirmar que responde correctamente.

---

## 13. Futuras Mejoras

### 13.1 Funcionalidades Planeadas

Entre las funcionalidades planificadas para futuras iteraciones se encuentran: notificaciones push para dispositivos móviles, panel de administración completo, exportación de reportes en PDF, integración con sistemas de correo electrónico, módulo de analítica avanzada, aplicación móvil nativa, y autenticación con JWT más robusta.

### 13.2 Escalabilidad

El sistema está diseñado para escalar horizontalmente. La arquitectura serverless de Cloudflare Workers permite manejar incrementos de tráfico sin configuración adicional. MongoDB Atlas ofrece opciones de escalamiento vertical y horizontal según las necesidades del proyecto.

---

## 14. Información de Contacto

### 14.1 Repositorio

El código fuente del proyecto está disponible en GitHub: https://github.com/jonaaxsic/Gestion-Estuduantil

### 14.2 Despliegue Actual

El proyecto se encuentra actualmente desplegado y accesible en la URL de Cloudflare Pages proporcionada por el servicio de despliegue.

---

## 15. Conclusión

Este proyecto representa una solución moderna y escalable para la gestión de procesos estudiantiles en instituciones educativas. La combinación de tecnologías de vanguardia como Angular, Cloudflare Workers y MongoDB Atlas proporciona una plataforma robusta, performant y económicamente viable para instituciones educativas de cualquier tamaño. El sistema no solo mejora la eficiencia operativa, sino que también fortalece la comunicación entre docentes, estudiantes y familias.
