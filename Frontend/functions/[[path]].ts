/**
 * Cloudflare Workers API - Gestión Estudiantil
 * Conecta directamente a MongoDB Atlas usando Data API
 * 
 * Para configurar:
 * 1. Ve a MongoDB Atlas > Data API
 * 2. Crea una Data API key
 * 3. Configura las variables en Cloudflare Dashboard > Workers > Settings > Variables
 *    - ATLAS_DATA_API_KEY: tu-api-key
 *    - ATLAS_DATA_API_URL: https://data.mongodb-api.com/data/<cluster>/endpoint/data/beta
 *    - ATLAS_DB_NAME: App_estudiantil
 */

// ===========================================
// CONFIGURACIÓN - Variables de entorno
// ===========================================
const ATLAS_DATA_API_KEY = 'rWnGRFxWviVPHxqMMPMeqIuK8K6s9O8O9O9O9O9O9O9O9O9O9O9O';
const ATLAS_DATA_API_URL = 'https://data.mongodb-api.com/data/main-database/endpoint/data/beta';
const ATLAS_DB_NAME = 'App_estudiantil';

const getEnv = (key, fallback) => {
  return typeof globalThis !== 'undefined' ? (globalThis[key] || fallback) : fallback;
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
// MONGODB ATLAS DATA API
// ===========================================
async function mongoFind(collection, filter = {}, projection = null) {
  const body = { collection, filter };
  if (projection) body.projection = projection;
  
  const res = await fetch(`${ATLAS_DATA_API_URL}/action/find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': ATLAS_DATA_API_KEY
    },
    body: JSON.stringify(body)
  });
  
  const data = await res.json();
  return data.documents || [];
}

async function mongoFindOne(collection, filter = {}) {
  const res = await fetch(`${ATLAS_DATA_API_URL}/action/findOne`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': ATLAS_DATA_API_KEY
    },
    body: JSON.stringify({ collection, filter })
  });
  
  const data = await res.json();
  return data.document;
}

async function mongoInsertOne(collection, document) {
  const res = await fetch(`${ATLAS_DATA_API_URL}/action/insertOne`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': ATLAS_DATA_API_KEY
    },
    body: JSON.stringify({ collection, document })
  });
  
  return res.json();
}

async function mongoUpdateOne(collection, filter, update) {
  const res = await fetch(`${ATLAS_DATA_API_URL}/action/updateOne`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': ATLAS_DATA_API_KEY
    },
    body: JSON.stringify({ collection, filter, update })
  });
  
  return res.json();
}

async function mongoDeleteOne(collection, filter) {
  const res = await fetch(`${ATLAS_DATA_API_URL}/action/deleteOne`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': ATLAS_DATA_API_KEY
    },
    body: JSON.stringify({ collection, filter })
  });
  
  return res.json();
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
      mongo: "connected",
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
      
      // Buscar usuario en MongoDB
      const usuario = await mongoFindOne("usuarios", { email, activo: true });
      
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
        const usuarios = await mongoFind("usuarios", {});
        // Remover passwords
        const safe = usuarios.map(({ password, ...u }) => u);
        return jsonResponse(safe);
      }
      if (method === "POST") {
        const data = await request.json();
        const result = await mongoInsertOne("usuarios", { ...data, activo: true });
        return jsonResponse({ id: result.insertedId }, 201);
      }
    }
    
    if (path.match(/^\/usuarios\/[^\/]+$/)) {
      const id = path.split("/")[2];
      if (method === "GET") {
        const usuario = await mongoFindOne("usuarios", { _id: { $oid: id } });
        if (!usuario) return errorResponse("Usuario no encontrado", 404);
        const { password, ...u } = usuario;
        return jsonResponse(u);
      }
      if (method === "PUT") {
        const data = await request.json();
        await mongoUpdateOne("usuarios", { _id: { $oid: id } }, { $set: data });
        return jsonResponse({ success: true });
      }
      if (method === "DELETE") {
        await mongoDeleteOne("usuarios", { _id: { $oid: id } });
        return jsonResponse({ success: true });
      }
    }

    // ===========================================
    // ESTUDIANTES
    // ===========================================
    if (path === "/estudiantes" || path === "/estudiantes/") {
      if (method === "GET") {
        const cursoId = url.searchParams.get("curso_id");
        const filter = cursoId ? { curso_id: cursoId } : {};
        const estudiantes = await mongoFind("estudiantes", filter);
        return jsonResponse(estudiantes);
      }
      if (method === "POST") {
        const data = await request.json();
        const result = await mongoInsertOne("estudiantes", data);
        return jsonResponse({ id: result.insertedId }, 201);
      }
    }
    
    if (path.match(/^\/estudiantes\/[^\/]+$/)) {
      const id = path.split("/")[2];
      if (method === "GET") {
        const estudiante = await mongoFindOne("estudiantes", { _id: { $oid: id } });
        if (!estudiante) return errorResponse("Estudiante no encontrado", 404);
        return jsonResponse(estudiante);
      }
      if (method === "PUT") {
        const data = await request.json();
        await mongoUpdateOne("estudiantes", { _id: { $oid: id } }, { $set: data });
        return jsonResponse({ success: true });
      }
      if (method === "DELETE") {
        await mongoDeleteOne("estudiantes", { _id: { $oid: id } });
        return jsonResponse({ success: true });
      }
    }

    // ===========================================
    // CURSOS
    // ===========================================
    if (path === "/cursos" || path === "/cursos/") {
      if (method === "GET") {
        const cursos = await mongoFind("cursos", {});
        return jsonResponse(cursos);
      }
      if (method === "POST") {
        const data = await request.json();
        const result = await mongoInsertOne("cursos", data);
        return jsonResponse({ id: result.insertedId }, 201);
      }
    }
    
    if (path.match(/^\/cursos\/[^\/]+$/)) {
      const id = path.split("/")[2];
      if (method === "GET") {
        const curso = await mongoFindOne("cursos", { _id: { $oid: id } });
        if (!curso) return errorResponse("Curso no encontrado", 404);
        return jsonResponse(curso);
      }
    }

    // ===========================================
    // ASISTENCIA
    // ===========================================
    if (path === "/asistencia" || path === "/asistencia/") {
      if (method === "GET") {
        const estudianteId = url.searchParams.get("estudiante_id");
        const cursoId = url.searchParams.get("curso_id");
        let filter = {};
        if (estudianteId) filter.estudiante_id = estudianteId;
        if (cursoId) filter.curso_id = cursoId;
        const asistencia = await mongoFind("asistencia", filter);
        return jsonResponse(asistencia);
      }
      if (method === "POST") {
        const data = await request.json();
        const result = await mongoInsertOne("asistencia", data);
        return jsonResponse({ id: result.insertedId }, 201);
      }
    }

    // ===========================================
    // EVALUACIONES
    // ===========================================
    if (path === "/evaluaciones" || path === "/evaluaciones/") {
      if (method === "GET") {
        const cursoId = url.searchParams.get("curso_id");
        const filter = cursoId ? { curso_id: cursoId } : {};
        const evaluaciones = await mongoFind("evaluaciones", filter);
        return jsonResponse(evaluaciones);
      }
      if (method === "POST") {
        const data = await request.json();
        const result = await mongoInsertOne("evaluaciones", data);
        return jsonResponse({ id: result.insertedId }, 201);
      }
    }

    // ===========================================
    // ANOTACIONES
    // ===========================================
    if (path === "/anotaciones" || path === "/anotaciones/") {
      if (method === "GET") {
        const estudianteId = url.searchParams.get("estudiante_id");
        const filter = estudianteId ? { estudiante_id: estudianteId } : {};
        const anotaciones = await mongoFind("anotaciones", filter);
        return jsonResponse(anotaciones);
      }
      if (method === "POST") {
        const data = await request.json();
        const result = await mongoInsertOne("anotaciones", data);
        return jsonResponse({ id: result.insertedId }, 201);
      }
    }

    // ===========================================
    // REUNIONES
    // ===========================================
    if (path === "/reuniones" || path === "/reuniones/") {
      if (method === "GET") {
        const reuniones = await mongoFind("reuniones", {});
        return jsonResponse(reuniones);
      }
      if (method === "POST") {
        const data = await request.json();
        const result = await mongoInsertOne("reuniones", data);
        return jsonResponse({ id: result.insertedId }, 201);
      }
    }

    // ===========================================
    // APODERADOS
    // ===========================================
    if (path === "/apoderados" || path === "/apoderados/") {
      if (method === "GET") {
        const estudianteId = url.searchParams.get("estudiante_id");
        const filter = estudianteId ? { estudiante_id: estudianteId } : {};
        const apoderados = await mongoFind("apoderados", filter);
        return jsonResponse(apoderados);
      }
      if (method === "POST") {
        const data = await request.json();
        const result = await mongoInsertOne("apoderados", data);
        return jsonResponse({ id: result.insertedId }, 201);
      }
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
