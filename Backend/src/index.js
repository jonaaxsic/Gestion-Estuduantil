/**
 * Cloudflare Worker - Backend API para Gestión Estudiantil
 * Versión simple con datos de ejemplo para演示
 * Luego podés conectar MongoDB cuando quieras
 */

// ===========================================
// DATOS DE EJEMPLO (para que funcione inmediatamente)
// ===========================================
const mockData = {
  usuarios: [
    { _id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@colegio.cl", rol: "docente", activo: true },
    { _id: "2", nombre: "María", apellido: "García", email: "maria@colegio.cl", rol: "administrador", activo: true },
  ],
  estudiantes: [
    { _id: "1", nombre: "Pedro", apellido: "González", rut: "12345678-9", curso_id: "1" },
    { _id: "2", nombre: "Ana", apellido: "López", rut: "98765432-1", curso_id: "1" },
    { _id: "3", nombre: "Carlos", apellido: "Rodríguez", rut: "11223344-5", curso_id: "2" },
  ],
  cursos: [
    { _id: "1", nombre: "1° Básico A", nivel: "1° Básico", ano: 2025 },
    { _id: "2", nombre: "2° Básico A", nivel: "2° Básico", ano: 2025 },
    { _id: "3", nombre: "3° Básico A", nivel: "3° Básico", ano: 2025 },
  ],
  asistencia: [
    { _id: "1", estudiante_id: "1", curso_id: "1", fecha: "2026-04-01", presente: true },
    { _id: "2", estudiante_id: "2", curso_id: "1", fecha: "2026-04-01", presente: true },
    { _id: "3", estudiante_id: "1", curso_id: "1", fecha: "2026-04-02", presente: false },
  ],
  evaluaciones: [
    { _id: "1", curso_id: "1", materia: "Matemáticas", titulo: "Prueba 1", fecha: "2026-04-10" },
    { _id: "2", curso_id: "1", materia: "Lenguaje", titulo: "Ensayo", fecha: "2026-04-15" },
  ],
  anotaciones: [
    { _id: "1", estudiante_id: "1", tipo: "positiva", descripcion: "Buena participación", fecha: "2026-04-01" },
    { _id: "2", estudiante_id: "3", tipo: "negativa", descripcion: "Sin tarea", fecha: "2026-04-02" },
  ],
  reuniones: [
    { _id: "1", curso_id: "1", fecha: "2026-04-20", hora: "18:00", lugar: "Sala de Padres" },
  ],
  apoderados: [
    { _id: "1", nombre: "Roberto", apellido: "González", telefono: "+56912345678", estudiante_id: "1" },
  ]
};

// ===========================================
// CORS HEADERS
// ===========================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// ===========================================
// RESPONSE HELPERS
// ===========================================
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

// ===========================================
// ROUTER
// ===========================================
async function handleRequest(request) {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const method = request.method;

  // Root
  if (path === "" || path === "/") {
    return jsonResponse({ 
      status: "ok", 
      message: "API Backend - Gestión Estudiantil",
      demo: true,
      docs: "Endpoints: /usuarios, /estudiantes, /cursos, /asistencia, /evaluaciones, /anotaciones, /reuniones, /apoderados"
    });
  }

  try {
    // Auth - Login
    if (path === "/auth/login" && method === "POST") {
      const data = await request.json();
      const { email, password } = data;
      
      // Buscar usuario
      const usuario = mockData.usuarios.find(u => u.email === email && u.activo);
      
      if (usuario) {
        return jsonResponse({ success: true, user: usuario });
      }
      return errorResponse("Credenciales inválidas", 401);
    }

    // Usuarios
    if (path === "/usuarios" || path === "/usuarios/") {
      if (method === "GET") return jsonResponse(mockData.usuarios);
      if (method === "POST") return jsonResponse({ message: "Crear usuario" }, 201);
    }
    if (path.match(/^\/usuarios\/[^\/]+$/)) {
      const id = path.split("/")[2];
      const usuario = mockData.usuarios.find(u => u._id === id);
      if (!usuario) return errorResponse("Usuario no encontrado", 404);
      return jsonResponse(usuario);
    }

    // Estudiantes
    if (path === "/estudiantes" || path === "/estudiantes/") {
      if (method === "GET") {
        const cursoId = url.searchParams.get("curso_id");
        let estudiantes = mockData.estudiantes;
        if (cursoId) {
          estudiantes = mockData.estudiantes.filter(e => e.curso_id === cursoId);
        }
        return jsonResponse(estudiantes);
      }
      if (method === "POST") return jsonResponse({ message: "Crear estudiante" }, 201);
    }
    if (path.match(/^\/estudiantes\/[^\/]+$/)) {
      const id = path.split("/")[2];
      const estudiante = mockData.estudiantes.find(e => e._id === id);
      if (!estudiante) return errorResponse("Estudiante no encontrado", 404);
      return jsonResponse(estudiante);
    }

    // Cursos
    if (path === "/cursos" || path === "/cursos/") {
      if (method === "GET") return jsonResponse(mockData.cursos);
      if (method === "POST") return jsonResponse({ message: "Crear curso" }, 201);
    }
    if (path.match(/^\/cursos\/[^\/]+$/)) {
      const id = path.split("/")[2];
      const curso = mockData.cursos.find(c => c._id === id);
      if (!curso) return errorResponse("Curso no encontrado", 404);
      return jsonResponse(curso);
    }

    // Asistencia
    if (path === "/asistencia" || path === "/asistencia/") {
      if (method === "GET") {
        const estudianteId = url.searchParams.get("estudiante_id");
        const cursoId = url.searchParams.get("curso_id");
        let asistencia = mockData.asistencia;
        if (estudianteId) asistencia = asistencia.filter(a => a.estudiante_id === estudianteId);
        if (cursoId) asistencia = asistencia.filter(a => a.curso_id === cursoId);
        return jsonResponse(asistencia);
      }
      if (method === "POST") return jsonResponse({ message: "Registrar asistencia" }, 201);
    }

    // Evaluaciones
    if (path === "/evaluaciones" || path === "/evaluaciones/") {
      if (method === "GET") {
        const cursoId = url.searchParams.get("curso_id");
        let evaluaciones = mockData.evaluaciones;
        if (cursoId) evaluaciones = evaluaciones.filter(e => e.curso_id === cursoId);
        return jsonResponse(evaluaciones);
      }
      if (method === "POST") return jsonResponse({ message: "Crear evaluación" }, 201);
    }

    // Anotaciones
    if (path === "/anotaciones" || path === "/anotaciones/") {
      if (method === "GET") {
        const estudianteId = url.searchParams.get("estudiante_id");
        let anotaciones = mockData.anotaciones;
        if (estudianteId) anotaciones = anotaciones.filter(a => a.estudiante_id === estudianteId);
        return jsonResponse(anotaciones);
      }
      if (method === "POST") return jsonResponse({ message: "Crear anotación" }, 201);
    }

    // Reuniones
    if (path === "/reuniones" || path === "/reuniones/") {
      if (method === "GET") return jsonResponse(mockData.reuniones);
      if (method === "POST") return jsonResponse({ message: "Crear reunión" }, 201);
    }

    // Apoderados
    if (path === "/apoderados" || path === "/apoderados/") {
      if (method === "GET") return jsonResponse(mockData.apoderados);
      if (method === "POST") return jsonResponse({ message: "Crear apoderado" }, 201);
    }

    return errorResponse("Endpoint no encontrado. Prueba: /, /auth/login, /usuarios, /estudiantes, /cursos, /asistencia, /evaluaciones, /anotaciones, /reuniones, /apoderados", 404);
    
  } catch (e) {
    return errorResponse("Error: " + e.message, 500);
  }
}

// ===========================================
// WORKER ENTRY POINT
// ===========================================
export default {
  async fetch(request, env) {
    return handleRequest(request);
  }
};