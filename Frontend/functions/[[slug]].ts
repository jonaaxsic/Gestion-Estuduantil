/**
 * Cloudflare Pages Function - API Backend
 * Funciona en el mismo dominio: gestionestudiantil.pages.dev/api/*
 */

export const onRequest = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "").replace(/\/+$/, "") || "/";
  const method = request.method;

  // ===========================================
  // CORS
  // ===========================================
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  if (method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders });
  }

  // ===========================================
  // DATOS DE EJEMPLO
  // ===========================================
  const mockData = {
    usuarios: [
      { _id: "1", nombre: "Juan", apellido: "Pérez", email: "juan@colegio.cl", rol: "docente", password: "123", activo: true },
      { _id: "2", nombre: "María", apellido: "García", email: "maria@colegio.cl", rol: "administrador", password: "123", activo: true },
      { _id: "3", nombre: "Pedro", apellido: "Rodríguez", email: "admin@colegio.cl", rol: "administrador", password: "admin", activo: true },
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
      { _id: "1", nombre: "Roberto", apellido: "González", telefono: "+56912345678", email: "roberto@email.cl", estudiante_id: "1" },
    ]
  };

  // ===========================================
  // HELPERS
  // ===========================================
  const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  };

  const errorResponse = (message, status = 400) => {
    return jsonResponse({ error: message }, status);
  };

  // ===========================================
  // ROUTES
  // ===========================================
  
  // Root /api
  if (path === "") {
    return jsonResponse({ 
      status: "ok", 
      message: "API Backend - Gestión Estudiantil",
      demo: true,
      login: "POST /api/auth/login con {email, password}"
    });
  }

  // Auth - Login
  if (path === "/auth/login" && method === "POST") {
    try {
      const data = await request.json();
      const { email, password } = data;
      
      if (!email || !password) {
        return errorResponse("Email y password requeridos", 400);
      }
      
      const usuario = mockData.usuarios.find(u => u.email === email && u.activo);
      
      if (usuario && usuario.password === password) {
        const { password: _, ...userWithoutPassword } = usuario;
        return jsonResponse({ success: true, user: userWithoutPassword });
      }
      return errorResponse("Credenciales inválidas", 401);
    } catch (e) {
      return errorResponse("Error en el request", 400);
    }
  }

  // Usuarios
  if (path === "/usuarios" && method === "GET") {
    const usuarios = mockData.usuarios.map(({ password, ...u }) => u);
    return jsonResponse(usuarios);
  }

  // Estudiantes
  if (path === "/estudiantes" && method === "GET") {
    const cursoId = url.searchParams.get("curso_id");
    let estudiantes = mockData.estudiantes;
    if (cursoId) estudiantes = estudiantes.filter(e => e.curso_id === cursoId);
    return jsonResponse(estudiantes);
  }

  // Cursos
  if (path === "/cursos" && method === "GET") {
    return jsonResponse(mockData.cursos);
  }

  // Asistencia
  if (path === "/asistencia" && method === "GET") {
    const estudianteId = url.searchParams.get("estudiante_id");
    const cursoId = url.searchParams.get("curso_id");
    let asistencia = mockData.asistencia;
    if (estudianteId) asistencia = asistencia.filter(a => a.estudiante_id === estudianteId);
    if (cursoId) asistencia = asistencia.filter(a => a.curso_id === cursoId);
    return jsonResponse(asistencia);
  }

  // Evaluaciones
  if (path === "/evaluaciones" && method === "GET") {
    const cursoId = url.searchParams.get("curso_id");
    let evaluaciones = mockData.evaluaciones;
    if (cursoId) evaluaciones = evaluaciones.filter(e => e.curso_id === cursoId);
    return jsonResponse(evaluaciones);
  }

  // Anotaciones
  if (path === "/anotaciones" && method === "GET") {
    const estudianteId = url.searchParams.get("estudiante_id");
    let anotaciones = mockData.anotaciones;
    if (estudianteId) anotaciones = anotaciones.filter(a => a.estudiante_id === estudianteId);
    return jsonResponse(anotaciones);
  }

  // Reuniones
  if (path === "/reuniones" && method === "GET") {
    return jsonResponse(mockData.reuniones);
  }

  // Apoderados
  if (path === "/apoderados" && method === "GET") {
    return jsonResponse(mockData.apoderados);
  }

  // 404
  return errorResponse("Endpoint no encontrado", 404);
};