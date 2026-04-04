/**
 * Cloudflare Worker - Backend API para Gestión Estudiantil
 * Conecta a MongoDB Atlas via Data API
 */

// ===========================================
// CONFIGURACIÓN - Variables de entorno en Cloudflare Dashboard
// ===========================================
const MONGODB_API_URL = MONGODB_API_URL || "";
const MONGODB_API_KEY = MONGODB_API_KEY || "";
const MONGODB_DB = MONGODB_DB || "App_estudiantil";

const COLLECTIONS = {
  usuarios: "usuarios",
  estudiantes: "estudiantes",
  cursos: "cursos",
  asistencia: "asistencia",
  evaluaciones: "evaluaciones",
  anotaciones: "anotaciones",
  reuniones: "reuniones",
  apoderados: "apoderados"
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
// MONGODB HELPERS
// ===========================================
async function mongodbRequest(endpoint, body) {
  const url = `${MONGODB_API_URL}/action/${endpoint}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": MONGODB_API_KEY
    },
    body: JSON.stringify({
      database: MONGODB_DB,
      ...body
    })
  });
  
  return response.json();
}

async function find(collection, query = {}, sort = null, limit = 0) {
  const result = await mongodbRequest("find", {
    collection: COLLECTIONS[collection] || collection,
    filter: query,
    sort: sort,
    limit: limit
  });
  return result.documents || [];
}

async function findOne(collection, query) {
  const result = await mongodbRequest("findOne", {
    collection: COLLECTIONS[collection] || collection,
    filter: query
  });
  return result.document || null;
}

async function insertOne(collection, document) {
  const result = await mongodbRequest("insertOne", {
    collection: COLLECTIONS[collection] || collection,
    document: {
      ...document,
      created_at: document.created_at || new Date().toISOString(),
      updated_at: document.updated_at || new Date().toISOString()
    }
  });
  return result;
}

async function updateOne(collection, query, update) {
  const result = await mongodbRequest("updateOne", {
    collection: COLLECTIONS[collection] || collection,
    filter: query,
    update: { $set: { ...update, updated_at: new Date().toISOString() } }
  });
  return result;
}

async function deleteOne(collection, query) {
  const result = await mongodbRequest("deleteOne", {
    collection: COLLECTIONS[collection] || collection,
    filter: query
  });
  return result;
}

function toObjectId(id) {
  // Convert string to MongoDB ObjectId format
  return { $oid: id };
}

function fromObjectId(doc) {
  if (doc && doc._id && doc._id.$oid) {
    doc._id = doc._id.$oid;
  }
  return doc;
}

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
  const path = url.pathname.replace(/\/+$/, ""); // Remove trailing slashes
  const method = request.method;

  // Root
  if (path === "" || path === "/") {
    return jsonResponse({ status: "ok", message: "API Backend - Gestión Estudiantil" });
  }

  try {
    // Auth
    if (path === "/auth/login" && method === "POST") {
      return await handleLogin(request);
    }

    // Usuarios
    if (path === "/usuarios") {
      if (method === "GET") return await handleGetUsuarios();
      if (method === "POST") return await handleCreateUsuario(request);
    }
    if (path.match(/^\/usuarios\/[^\/]+$/)) {
      const id = path.split("/")[2];
      if (method === "GET") return await handleGetUsuario(id);
      if (method === "PUT") return await handleUpdateUsuario(request, id);
      if (method === "DELETE") return await handleDeleteUsuario(id);
    }

    // Estudiantes
    if (path === "/estudiantes") {
      if (method === "GET") return await handleGetEstudiantes(request);
      if (method === "POST") return await handleCreateEstudiante(request);
    }
    if (path.match(/^\/estudiantes\/[^\/]+$/)) {
      const id = path.split("/")[2];
      if (method === "GET") return await handleGetEstudiante(id);
      if (method === "PUT") return await handleUpdateEstudiante(request, id);
      if (method === "DELETE") return await handleDeleteEstudiante(id);
    }

    // Cursos
    if (path === "/cursos") {
      if (method === "GET") return await handleGetCursos();
      if (method === "POST") return await handleCreateCurso(request);
    }
    if (path.match(/^\/cursos\/[^\/]+$/)) {
      const id = path.split("/")[2];
      if (method === "GET") return await handleGetCurso(id);
      if (method === "PUT") return await handleUpdateCurso(request, id);
      if (method === "DELETE") return await handleDeleteCurso(id);
    }

    // Asistencia
    if (path === "/asistencia") {
      if (method === "GET") return await handleGetAsistencia(request);
      if (method === "POST") return await handleCreateAsistencia(request);
    }
    if (path === "/asistencia/bulk" && method === "POST") {
      return await handleBulkAsistencia(request);
    }

    // Evaluaciones
    if (path === "/evaluaciones") {
      if (method === "GET") return await handleGetEvaluaciones(request);
      if (method === "POST") return await handleCreateEvaluacion(request);
    }

    // Anotaciones
    if (path === "/anotaciones") {
      if (method === "GET") return await handleGetAnotaciones(request);
      if (method === "POST") return await handleCreateAnotacion(request);
    }

    // Reuniones
    if (path === "/reuniones") {
      if (method === "GET") return await handleGetReuniones(request);
      if (method === "POST") return await handleCreateReunion(request);
    }

    // Apoderados
    if (path === "/apoderados") {
      if (method === "GET") return await handleGetApoderados(request);
      if (method === "POST") return await handleCreateApoderado(request);
    }

    // Dashboards
    if (path === "/dashboard/docente") {
      return await handleDashboardDocente(request);
    }
    if (path === "/dashboard/apoderado") {
      return await handleDashboardApoderado(request);
    }

    return errorResponse("Endpoint not found", 404);
  } catch (e) {
    return errorResponse(e.message || "Internal error", 500);
  }
}

// ===========================================
// HANDLERS - AUTH
// ===========================================
async function handleLogin(request) {
  const data = await request.json();
  const { email, password } = data;

  if (!email || !password) {
    return errorResponse("Email y password requeridos", 400);
  }

  const usuario = await findOne("usuarios", { email, password, activo: true });
  
  if (usuario) {
    return jsonResponse({ success: true, user: fromObjectId(usuario) });
  }
  
  return errorResponse("Credenciales inválidas", 401);
}

// ===========================================
// HANDLERS - USUARIOS
// ===========================================
async function handleGetUsuarios() {
  const usuarios = await find("usuarios", {}, [["created_at", -1]]);
  return jsonResponse(usuarios.map(fromObjectId));
}

async function handleCreateUsuario(request) {
  const data = await request.json();
  const result = await insertOne("usuarios", data);
  return jsonResponse(result, 201);
}

async function handleGetUsuario(id) {
  const usuario = await findOne("usuarios", toObjectId(id));
  if (!usuario) return errorResponse("Usuario no encontrado", 404);
  return jsonResponse(fromObjectId(usuario));
}

async function handleUpdateUsuario(request, id) {
  const data = await request.json();
  await updateOne("usuarios", toObjectId(id), data);
  return jsonResponse({ success: true });
}

async function handleDeleteUsuario(id) {
  await deleteOne("usuarios", toObjectId(id));
  return jsonResponse({ success: true });
}

// ===========================================
// HANDLERS - ESTUDIANTES
// ===========================================
async function handleGetEstudiantes(request) {
  const url = new URL(request.url);
  const query = {};
  if (url.searchParams.get("curso_id")) {
    query.curso_id = url.searchParams.get("curso_id");
  }
  const estudiantes = await find("estudiantes", query, [["apellido", 1]]);
  return jsonResponse(estudiantes.map(fromObjectId));
}

async function handleCreateEstudiante(request) {
  const data = await request.json();
  const result = await insertOne("estudiantes", data);
  return jsonResponse(result, 201);
}

async function handleGetEstudiante(id) {
  const estudiante = await findOne("estudiantes", toObjectId(id));
  if (!estudiante) return errorResponse("Estudiante no encontrado", 404);
  return jsonResponse(fromObjectId(estudiante));
}

async function handleUpdateEstudiante(request, id) {
  const data = await request.json();
  await updateOne("estudiantes", toObjectId(id), data);
  return jsonResponse({ success: true });
}

async function handleDeleteEstudiante(id) {
  await deleteOne("estudiantes", toObjectId(id));
  return jsonResponse({ success: true });
}

// ===========================================
// HANDLERS - CURSOS
// ===========================================
async function handleGetCursos() {
  const cursos = await find("cursos", {}, [["nombre", 1]]);
  return jsonResponse(cursos.map(fromObjectId));
}

async function handleCreateCurso(request) {
  const data = await request.json();
  const result = await insertOne("cursos", data);
  return jsonResponse(result, 201);
}

async function handleGetCurso(id) {
  const curso = await findOne("cursos", toObjectId(id));
  if (!curso) return errorResponse("Curso no encontrado", 404);
  return jsonResponse(fromObjectId(curso));
}

async function handleUpdateCurso(request, id) {
  const data = await request.json();
  await updateOne("cursos", toObjectId(id), data);
  return jsonResponse({ success: true });
}

async function handleDeleteCurso(id) {
  await deleteOne("cursos", toObjectId(id));
  return jsonResponse({ success: true });
}

// ===========================================
// HANDLERS - ASISTENCIA
// ===========================================
async function handleGetAsistencia(request) {
  const url = new URL(request.url);
  const query = {};
  if (url.searchParams.get("estudiante_id")) query.estudiante_id = url.searchParams.get("estudiante_id");
  if (url.searchParams.get("curso_id")) query.curso_id = url.searchParams.get("curso_id");
  if (url.searchParams.get("fecha")) query.fecha = url.searchParams.get("fecha");
  
  const asistencia = await find("asistencia", query, [["fecha", -1]]);
  return jsonResponse(asistencia.map(fromObjectId));
}

async function handleCreateAsistencia(request) {
  const data = await request.json();
  const result = await insertOne("asistencia", data);
  return jsonResponse(result, 201);
}

async function handleBulkAsistencia(request) {
  const data = await request.json();
  const { curso_id, fecha, registros } = data;
  
  if (!curso_id || !fecha || !registros) {
    return errorResponse("curso_id, fecha y registros requeridos", 400);
  }
  
  let created = 0;
  for (const registro of registros) {
    await insertOne("asistencia", {
      estudiante_id: registro.estudiante_id,
      curso_id,
      fecha,
      presente: registro.presente !== false,
      observacion: registro.observacion || null
    });
    created++;
  }
  
  return jsonResponse({ created }, 201);
}

// ===========================================
// HANDLERS - EVALUACIONES
// ===========================================
async function handleGetEvaluaciones(request) {
  const url = new URL(request.url);
  const query = {};
  if (url.searchParams.get("curso_id")) query.curso_id = url.searchParams.get("curso_id");
  if (url.searchParams.get("materia")) query.materia = url.searchParams.get("materia");
  
  const evaluaciones = await find("evaluaciones", query, [["fecha", -1]]);
  return jsonResponse(evaluaciones.map(fromObjectId));
}

async function handleCreateEvaluacion(request) {
  const data = await request.json();
  const result = await insertOne("evaluaciones", data);
  return jsonResponse(result, 201);
}

// ===========================================
// HANDLERS - ANOTACIONES
// ===========================================
async function handleGetAnotaciones(request) {
  const url = new URL(request.url);
  const query = {};
  if (url.searchParams.get("estudiante_id")) query.estudiante_id = url.searchParams.get("estudiante_id");
  if (url.searchParams.get("tipo")) query.tipo = url.searchParams.get("tipo");
  
  const anotaciones = await find("anotaciones", query, [["fecha", -1]]);
  return jsonResponse(anotaciones.map(fromObjectId));
}

async function handleCreateAnotacion(request) {
  const data = await request.json();
  const result = await insertOne("anotaciones", data);
  return jsonResponse(result, 201);
}

// ===========================================
// HANDLERS - REUNIONES
// ===========================================
async function handleGetReuniones(request) {
  const url = new URL(request.url);
  const query = {};
  if (url.searchParams.get("curso_id")) query.curso_id = url.searchParams.get("curso_id");
  
  const reuniones = await find("reuniones", query, [["fecha", 1]]);
  return jsonResponse(reuniones.map(fromObjectId));
}

async function handleCreateReunion(request) {
  const data = await request.json();
  const result = await insertOne("reuniones", data);
  return jsonResponse(result, 201);
}

// ===========================================
// HANDLERS - APODERADOS
// ===========================================
async function handleGetApoderados(request) {
  const url = new URL(request.url);
  const query = {};
  if (url.searchParams.get("estudiante_id")) query.estudiante_id = url.searchParams.get("estudiante_id");
  
  const apoderados = await find("apoderados", query, [["apellido", 1]]);
  return jsonResponse(apoderados.map(fromObjectId));
}

async function handleCreateApoderado(request) {
  const data = await request.json();
  const result = await insertOne("apoderados", data);
  return jsonResponse(result, 201);
}

// ===========================================
// HANDLERS - DASHBOARDS
// ===========================================
async function handleDashboardDocente(request) {
  const url = new URL(request.url);
  const docente_id = url.searchParams.get("docente_id");
  
  if (!docente_id) {
    return errorResponse("docente_id requerido", 400);
  }
  
  return jsonResponse({ message: "Dashboard docente" });
}

async function handleDashboardApoderado(request) {
  const url = new URL(request.url);
  const estudiante_id = url.searchParams.get("estudiante_id");
  
  if (!estudiante_id) {
    return errorResponse("estudiante_id requerido", 400);
  }
  
  const estudiante = await findOne("estudiantes", toObjectId(estudiante_id));
  if (!estudiante) {
    return errorResponse("Estudiante no encontrado", 404);
  }
  
  const asistencia = await find("asistencia", { estudiante_id }, [["fecha", -1]], 10);
  const anotaciones = await find("anotaciones", { estudiante_id }, [["fecha", -1]], 5);
  
  let evaluaciones = [];
  if (estudiante.curso_id) {
    evaluaciones = await find("evaluaciones", { curso_id: estudiante.curso_id }, [["fecha", 1]], 5);
  }
  
  return jsonResponse({
    estudiante: fromObjectId(estudiante),
    asistencia: asistencia.map(fromObjectId),
    evaluaciones: evaluaciones.map(fromObjectId),
    anotaciones: anotaciones.map(fromObjectId)
  });
}

// ===========================================
// WORKER ENTRY POINT
// ===========================================
export default {
  async fetch(request, env) {
    // Make env variables available globally
    globalThis.MONGODB_API_URL = env.MONGODB_API_URL;
    globalThis.MONGODB_API_KEY = env.MONGODB_API_KEY;
    globalThis.MONGODB_DB = env.MONGODB_DB || "App_estudiantil";
    
    return handleRequest(request);
  }
};