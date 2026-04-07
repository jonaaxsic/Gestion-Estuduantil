# Gestión Estudiantil

<!-- Shields - Technologies -->
<div align="center">

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)

</div>

---

## 📋 Descripción del Proyecto

**Gestión Estudiantil** es una aplicación web desarrollada para digitalizar y automatizar los procesos de gestión académica en instituciones educativas. El sistema permite a docentes y apoderados acceder a información clave como:

- 📊 Registro de asistencia
- 📅 Calendario de evaluaciones
- 📝 Anotaciones (positivas/negativas)
- 📢 Notificaciones de reuniones de apoderados
- 💬 Comunicación institucional

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare Pages                         │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐ │
│  │   Frontend (Angular) │    │  Cloudflare Workers (API)        │ │
│  │   - SPA Routing      │    │  - Endpoints REST               │ │
│  │   - Angular Material│    │  - MongoDB Connection           │ │
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

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
|------|------------|-------------|
| **Frontend** | Angular 19 | Framework JavaScript tipo seguro |
| **UI** | Angular Material | Componentes UI profesionales |
| **Backend API** | Cloudflare Workers | API serverless en edge |
| **Base de Datos** | MongoDB Atlas | Base de datos NoSQL en la nube |
| **Despliegue** | Cloudflare Pages | Hosting gratuito con CDN global |

---

## 🚀 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Autenticación de usuarios |
| GET/POST | `/api/usuarios` | Gestión de usuarios |
| GET/POST | `/api/estudiantes` | Gestión de estudiantes |
| GET/POST | `/api/cursos` | Gestión de cursos |
| GET/POST | `/api/asistencia` | Registro de asistencia |
| GET/POST | `/api/evaluaciones` | Calendario de evaluaciones |
| GET/POST | `/api/anotaciones` | Anotaciones de comportamiento |
| GET/POST | `/api/reuniones` | Reuniones de apoderados |
| GET/POST | `/api/apoderados` | Gestión de apoderados |

---

## 👥 Roles de Usuario

| Rol | Descripción |
|-----|-------------|
| **Admin** | Acceso completo al sistema |
| **Docente** | Registro de asistencia, evaluaciones, anotaciones |
| **Apoderado** | Visualización de información de sus pupilos |

---

## 💻 Desarrollo Local

### Prerrequisitos

- Node.js 18+
- Python 3.10+
- MongoDB Atlas cuenta

### Instalación

```bash
# Frontend
cd Frontend
npm install
npm start

# Backend (Django)
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Credenciales de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@colegio.cl | admin | Administrador |
| juan@colegio.cl | 123 | Docente |

---

## ☁️ Despliegue en Producción

###Frontend → Cloudflare Pages

```bash
cd Frontend
npm install -g wrangler
wrangler login
npm run deploy
```

### Configuración de MongoDB Data API

1. Ve a **MongoDB Atlas** → **Data Services** → **Data API**
2. Crea una API Key
3. Configura en **Cloudflare Dashboard** → **Workers** → **Settings** → **Variables**:
   - `ATLAS_DATA_API_KEY`: Tu API key
   - `ATLAS_DATA_API_URL`: URL del endpoint
   - `ATLAS_DB_NAME`: App_estudiantil

---

## 📁 Estructura del Proyecto

```
Gestion-Estudiantil/
├── Backend/              # Django API (referencia)
│   ├── core/            # Aplicación principal
│   ├── settings.py      # Configuración
│   └── requirements.txt # Dependencias
│
└── Frontend/            # Angular SPA
    ├── src/
    │   ├── app/
    │   │   ├── core/           # Servicios, guards
    │   │   ├── pages/          # Páginas
    │   │   └── shared/         # Componentes
    │   └── environments/       # Configuración
    ├── functions/              # Cloudflare Workers
    │   └── [[path]].ts        # API REST
    └── wrangler.toml          # Configuración
```

---

## 📄 Licencia

Este proyecto está desarrollado con fines educativos.

---

## 👨‍💻 Autor

**Jonathan Anomisar**
- GitHub: [@jonaaxsic](https://github.com/jonaaxsic)

---

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/jonaaxsic/Gestion-Estuduantil)
![GitHub last commit](https://img.shields.io/github/last-commit/jonaaxsic/Gestion-Estuduantil)

</div>
