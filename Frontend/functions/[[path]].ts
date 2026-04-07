/**
 * Cloudflare Pages Function API - Gestión Estudiantil
 * API integrada con datos de ejemplo para funcionamiento inmediato
 */

// ===========================================
// CORS HEADERS
// ===========================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// ===========================================
// DATOS DE EJEMPLO
// ===========================================
const mockData = {
  usuarios: [
    { _id: "1", nombre: "Admin", apellido: "Sistema", email: "admin@colegio.cl", rol: "admin", password: "admin", activo: true },
    { _id: "2", nombre: "Juan", apellido: "Pérez", email: "juan@colegio.cl", rol: "docente", password: "123", activo: true },
    { _id: "3", nombre: "María", apellido: "García", email: "maria@colegio.cl", rol: "admin", password: "123", activo: true },
  ],
  estudiantes: [
    { _id: "1", nombre: "Pedro", apellido: "González", rut: "12345678-9", curso_id: "1" },
    { _id: "2", nombre: "Ana", apellido: "López", rut: "98765432-1", curso_id: "1" },
  ],
  cursos: [
    { _id: "1", nombre: "1° Básico A", nivel: "1° Básico", ano: 2025 },
    { _id: "2", nombre: "2° Básico A", nivel: "2° Básico", ano: 2025 },
  ],
  asistencia: [
    { _id: "1", estudiante_id: "1", curso_id: "1", fecha: "2026-04-07", presente: true },
  ],
  evaluaciones: [
    { _id: "1", curso_id: "1", materia: "Matemáticas", titulo: "Prueba 1", fecha: "2026-04-10" },
  ],
  anotaciones: [
    { _id: "1", estudiante_id: "1", tipo: "positiva", descripcion: "Buena participación", fecha: "2026-04-07" },
  ],
  reuniones: [
    { _id: "1", curso_id: "1", fecha: "2026-04-20", hora: "18:00", lugar: "Sala de Padres" },
  ],
  apoderados: [
    { _id: "1", nombre: "Roberto", apellido: "González", telefono: "+56912345678", estudiante_id: "1" },
  ]
};

// Pages Function export format
export const onRequest = async (context) => {
  return handleRequest(context.request);
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
      mode: "demo",
      docs: "Endpoints: /auth/login, /usuarios, /estudiantes, /cursos, /asistencia, /evaluaciones, /anotaciones, /reuniones, /apoderados"
    });
  }

  try {
    // ===========================================
    // AUTH - Login
    // ===========================================
    if (path === "/auth/login" && method === "POST") {
      const data = await request.json();
      const { email, password } = data;
      
      if (!email || !password) {
        return errorResponse("Email y password requeridos", 400);
      }
      
      // Buscar usuario en datos de ejemplo
      const usuario = mockData.usuarios.find(u => u.email === email && u.activo);
      
      if (usuario && usuario.password === password) {
        const { password: _, ...userSafe } = usuario;
        return jsonResponse({ success: true, user: userSafe });
      }
      return errorResponse("Credenciales inválidas", 401);
    }

    // ===========================================
    // USUARIOS
    // ===========================================
    if (path === "/usuarios" || path === "/usuarios/") {
      if (method === "GET") {
        const usuarios = mockData.usuarios.map(({ password, ...u }) => u);
        return jsonResponse(usuarios);
      }
    }

    // ===========================================
    // ESTUDIANTES
    // ===========================================
    if (path === "/estudiantes" || path === "/estudiantes/") {
      if (method === "GET") {
        const cursoId = url.searchParams.get("curso_id");
        let estudiantes = mockData.estudiantes;
        if (cursoId) {
          estudiantes = estudiantes.filter(e => e.curso_id === cursoId);
        }
        return jsonResponse(estudiantes);
      }
    }

    // ===========================================
    // CURSOS
    // ===========================================
    if (path === "/cursos" || path === "/cursos/") {
      if (method === "GET") {
        return jsonResponse(mockData.cursos);
      }
    }

    // ===========================================
    // ASISTENCIA
    // ===========================================
    if (path === "/asistencia" || path === "/asistencia/") {
      if (method === "GET") {
        const estudianteId = url.searchParams.get("estudiante_id");
        const cursoId = url.searchParams.get("curso_id");
        let asistencia = mockData.asistencia;
        if (estudianteId) asistencia = asistencia.filter(a => a.estudiante_id === estudianteId);
        if (cursoId) asistencia = asistencia.filter(a => a.curso_id === cursoId);
        return jsonResponse(asistencia);
      }
    }

    // ===========================================
    // EVALUACIONES
    // ===========================================
    if (path === "/evaluaciones" || path === "/evaluaciones/") {
      if (method === "GET") {
        const cursoId = url.searchParams.get("curso_id");
        let evaluaciones = mockData.evaluaciones;
        if (cursoId) evaluaciones = evaluaciones.filter(e => e.curso_id === cursoId);
        return jsonResponse(evaluaciones);
      }
    }

    // ===========================================
    // ANOTACIONES
    // ===========================================
    if (path === "/anotaciones" || path === "/anotaciones/") {
      if (method === "GET") {
        const estudianteId = url.searchParams.get("estudiante_id");
        let anotaciones = mockData.anotaciones;
        if (estudianteId) anotaciones = anotaciones.filter(a => a.estudiante_id === estudianteId);
        return jsonResponse(anotaciones);
      }
    }

    // ===========================================
    // REUNIONES
    // ===========================================
    if (path === "/reuniones" || path === "/reuniones/") {
      if (method === "GET") {
        return jsonResponse(mockData.reuniones);
      }
    }

    // ===========================================
    // APODERADOS
    // ===========================================
    if (path === "/apoderados" || path === "/apoderados/") {
      if (method === "GET") {
        const estudianteId = url.searchParams.get("estudiante_id");
        let apoderados = mockData.apoderados;
        if (estudianteId) apoderados = apoderos.filter(a => a.estudiante_id === estudianteId);
        return jsonResponse(apoderados);
      }
    }

    return errorResponse("Endpoint no encontrado. Prueba: /, /auth/login, /usuarios, /estudiantes, /cursos, /asistencia, /evaluaciones, /anotaciones, /reuniones, /apoderados", 404);
    
  } catch (e) {
    return errorResponse("Error: " + e.message, 500);
  }
}
