# Sistema de Gestión Escolar — Requerimientos de Mejora

## Contexto y Restricciones Globales

- El sistema está actualmente en producción.
- Todas las conexiones existentes entre el frontend, la API y el backend funcionan correctamente.
- Todos los endpoints existentes funcionan correctamente.
- **No modificar ninguna conexión ni endpoint existente.**
- Las nuevas funcionalidades deben implementarse sin romper lo que ya funciona.
- Si se requieren cambios en el esquema de la base de datos, deben hacerse con cuidado para soportar las nuevas funcionalidades sin afectar las existentes.
- Luego de todos los cambios, ejecutar todos los tests y asegurarse de que pasen antes de desplegar.
- Desplegar en Render (backend/API) y Cloudflare (frontend).

---

## 1. Autenticación — Login y Registro

### 1.1 Agregar Página de Registro para Apoderados

- Agregar una opción "Registrarse" en la pantalla de login.
- El registro debe estar restringido únicamente al rol **"apoderado"**.
- El formulario de registro debe usar los **mismos campos y estructura** que el formulario del panel de administrador para crear un apoderado.
- Reutilizar el componente de formulario de registro del admin si es posible.

### 1.2 Mejorar los Tiempos de Carga de la Primera Sesión

- Investigar y optimizar el rendimiento de la carga inicial.
- Implementar persistencia de sesión mediante cookies.
- Usar las funcionalidades del plan gratuito de Cloudflare para la gestión de cookies/sesiones — **sin incurrir en costos adicionales**.

---

## 2. Todos los Dashboards — Mejoras Generales

### 2.1 Botón de Recordatorio

- El botón "Recordatorio" debe agregarse al menú de navegación de **todos los dashboards de usuario**, ya sea en la barra superior o en el menú lateral.

### 2.2 Rediseño Visual de Todos los Dashboards

- Aplicar un **diseño profesional** a cada dashboard de usuario (administrador, docente, apoderado).
- Mejorar la calidad visual de todos los componentes.
- Reorganizar y reestructurar el diseño visual y la posición de cada elemento.
- Usar las skills de diseño de componentes Angular disponibles en el directorio de skills globales del proyecto.
- Reemplazar el favicon por defecto de Angular por uno apropiado para este proyecto.

### 2.3 Navegación Móvil vs Escritorio

- La mayoría de los paneles laterales desplegables deben estar diseñados **principalmente para móvil**.
- Solo un subconjunto limitado de opciones de navegación debe mostrarse en la versión de **escritorio**.

---

## 3. Dashboard del Administrador

### 3.1 Menú Lateral en Móvil

- En móvil, mover los siguientes elementos de navegación a un **menú lateral desplegable**:
  - Usuarios
  - Estudiantes
  - Cursos
  - Docentes

### 3.2 Correcciones de Diseño

- El botón "Docentes" es más ancho que los demás — normalizar el ancho de todos los botones.
- El título "Asignación de Docentes a Cursos" no queda centrado en móvil — corregir su alineación.

### 3.3 Problema de Scroll Horizontal en Móvil

- La barra de navegación horizontal de Usuarios, Estudiantes, Cursos y Docentes genera scroll horizontal en móvil.
- Reemplazar esta barra por una **lista desplegable o integrarla dentro del menú lateral**.
- Usar las skills de diseño de componentes Angular del directorio global.

### 3.4 Reemplazar el Panel Lateral Actual

- Eliminar el panel lateral desplegable actual que muestra los cursos.
- Reemplazarlo por un **menú lateral de navegación completo** que contenga:
  - Usuarios
  - Estudiantes
  - Cursos
  - Docentes
  - Mis Recordatorios
  - Gestión de Usuarios
  - (cualquier otra opción existente del administrador)

---

## 4. Dashboard del Docente

### 4.1 Mover Acciones Rápidas al Menú Lateral

Mover las siguientes "Acciones Rápidas" al menú lateral:

- Registrar Asistencia
- Crear Evaluación
- Nueva Anotación
- Programar Reunión

### 4.2 Cursos Asignados

- Mostrar la lista de cursos asignados al docente.
- Cada curso debe ser seleccionable y navegar a una **vista de detalle del curso**.
- Dentro de la vista de detalle, incluir un botón para **ver la lista de alumnos** de ese curso.

### 4.3 Control de Asistencia (Pasar Lista)

- Implementar el registro de asistencia por curso.
- El docente selecciona un curso, ve la lista de alumnos y marca la asistencia de cada uno.
- Cada sesión de asistencia debe guardarse como un **registro en la base de datos**.
- Definir y documentar dónde se almacenarán los registros en MongoDB (por ejemplo, como un documento con fecha, curso y estado por alumno — **no como archivos .txt**).

### 4.4 Control de Reuniones

- Implementar una vista para registrar y consultar **reuniones pasadas y futuras**.
- Las reuniones deben poder filtrarse por fecha (pasadas vs. próximas).

### 4.5 Gestión de Notas

#### Reglas de Negocio:

- Cada docente es asignado a uno o más cursos y a una asignatura específica.
- Cada alumno tiene **6 notas por asignatura por año**, durante el año escolar (marzo a diciembre).
- Antes del 25 de diciembre, **todas las notas deben estar ingresadas y todos los ramos cerrados**.
- Esto aplica para los cursos de 1° a 8° básico.

#### Flujo de Trabajo:

1. El docente selecciona un curso.
2. El docente selecciona la asignatura (la que le fue asignada).
3. Se muestra la lista de alumnos de ese curso.
4. El docente ingresa y guarda una nota para cada alumno.

#### Ordenamiento de la Lista de Alumnos:

- Los alumnos deben estar ordenados alfabéticamente por:
  1. Apellido paterno (primer apellido)
  2. Apellido materno (segundo apellido)
  3. Nombres

#### Ejemplo:

- Alumno: Diego Rodríguez — 6° Básico A — Historia
- Notas registradas: 5,5 y 5,2 (de un total de 6 notas anuales, con 8 slots disponibles al completar el año)

---

## 5. Dashboard del Apoderado

### 5.1 Filosofía de Diseño

- La interfaz debe ser **simple y fácil de usar**.
- Considerar que algunos apoderados pueden ser adultos mayores o abuelos a cargo de los alumnos, que no están familiarizados con la tecnología actual.
- Priorizar claridad, texto grande, pasos mínimos y navegación intuitiva.

### 5.2 Funcionalidades a Implementar

Definir e implementar funcionalidades apropiadas para el dashboard del apoderado. Funcionalidades sugeridas:

- Ver el rendimiento académico (notas) de su hijo/a o pupilo/a.
- Ver registros de asistencia.
- Ver y recibir recordatorios.
- Ver reuniones programadas o próximas.
- Contactar o enviar mensajes al docente (si aplica).

---

## 6. Base de Datos (MongoDB)

- Revisar el esquema actual y realizar las modificaciones necesarias para soportar las nuevas funcionalidades.
- Áreas que probablemente requieran cambios en el esquema:
  - Registros de asistencia (nueva colección o subdocumento).
  - Notas por alumno, asignatura, curso y año.
  - Historial de reuniones.
  - Registro de apoderados con restricción de rol.
- Todos los cambios deben ser **retrocompatibles** con los datos existentes.

---

## 7. Testing y Despliegue

- Luego de implementar todos los cambios, **ejecutar todos los tests** (existentes y nuevos) y asegurarse de que pasen.
- Desplegar los cambios en:
  - **Render** (backend/API)
  - **Cloudflare** (frontend)
- Verificar que toda la funcionalidad existente siga funcionando correctamente después del despliegue.
