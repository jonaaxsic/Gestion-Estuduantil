/**
 * Cloudflare Worker - Gestion Estudiantil API
 * Usa D1 (SQL) - base de datos integrada en Cloudflare
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    function createResponse(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ============ AUTH LOGIN ============
    if (path === "/api/auth/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
          return createResponse({ error: "Email y password requeridos" }, 400);
        }

        // Query D1 - buscar usuario
        const stmt = env.DB.prepare(
          "SELECT id, email, nombre, apellido, rol, rut FROM usuarios WHERE email = ? AND password = ? AND activo = 1"
        ).bind(email, password);
        
        const user = await stmt.first();

        if (user) {
          return createResponse({ success: true, user });
        }

        return createResponse({ error: "Credenciales inválidas" }, 401);
      } catch (error) {
        return createResponse({ error: "Error de conexión. Intenta más tarde.", details: error.message }, 500);
      }
    }

    // ============ USUARIOS ============
    if (path === "/api/usuarios" || path === "/api/usuarios/") {
      if (request.method === "GET") {
        try {
          const stmt = env.DB.prepare("SELECT id, email, nombre, apellido, rol, rut, activo, created_at FROM usuarios ORDER BY created_at DESC");
          const users = await stmt.all();
          return createResponse(users.results || []);
        } catch (error) {
          return createResponse({ error: error.message }, 500);
        }
      }
    }

    // ============ ESTUDIANTES ============
    if (path === "/api/estudiantes" || path === "/api/estudiantes/") {
      if (request.method === "GET") {
        try {
          const stmt = env.DB.prepare("SELECT * FROM estudiantes ORDER BY apellido ASC");
          const results = await stmt.all();
          return createResponse(results.results || []);
        } catch (error) {
          return createResponse({ error: error.message }, 500);
        }
      }
    }

    // ============ CURSOS ============
    if (path === "/api/cursos" || path === "/api/cursos/") {
      if (request.method === "GET") {
        try {
          const stmt = env.DB.prepare("SELECT * FROM cursos ORDER BY nombre ASC");
          const results = await stmt.all();
          return createResponse(results.results || []);
        } catch (error) {
          return createResponse({ error: error.message }, 500);
        }
      }
    }

    // ============ ASISTENCIA ============
    if (path === "/api/asistencia" || path === "/api/asistencia/") {
      if (request.method === "GET") {
        try {
          const stmt = env.DB.prepare("SELECT * FROM asistencia ORDER BY fecha DESC");
          const results = await stmt.all();
          return createResponse(results.results || []);
        } catch (error) {
          return createResponse({ error: error.message }, 500);
        }
      }
    }

    // ============ EVALUACIONES ============
    if (path === "/api/evaluaciones" || path === "/api/evaluaciones/") {
      if (request.method === "GET") {
        try {
          const stmt = env.DB.prepare("SELECT * FROM evaluaciones ORDER BY fecha DESC");
          const results = await stmt.all();
          return createResponse(results.results || []);
        } catch (error) {
          return createResponse({ error: error.message }, 500);
        }
      }
    }

    // ============ ANOTACIONES ============
    if (path === "/api/anotaciones" || path === "/api/anotaciones/") {
      if (request.method === "GET") {
        try {
          const stmt = env.DB.prepare("SELECT * FROM anotaciones ORDER BY fecha DESC");
          const results = await stmt.all();
          return createResponse(results.results || []);
        } catch (error) {
          return createResponse({ error: error.message }, 500);
        }
      }
    }

    // ============ REUNIONES ============
    if (path === "/api/reuniones" || path === "/api/reuniones/") {
      if (request.method === "GET") {
        try {
          const stmt = env.DB.prepare("SELECT * FROM reuniones ORDER BY fecha ASC");
          const results = await stmt.all();
          return createResponse(results.results || []);
        } catch (error) {
          return createResponse({ error: error.message }, 500);
        }
      }
    }

    // ============ APODERADOS ============
    if (path === "/api/apoderados" || path === "/api/apoderados/") {
      if (request.method === "GET") {
        try {
          const stmt = env.DB.prepare("SELECT * FROM apoderados ORDER BY apellido ASC");
          const results = await stmt.all();
          return createResponse(results.results || []);
        } catch (error) {
          return createResponse({ error: error.message }, 500);
        }
      }
    }

    // Root
    if (path === "/" || path === "") {
      return createResponse({
        status: "ok",
        message: "Gestion Estudiantil API - Cloudflare D1"
      });
    }

    return createResponse({ error: "Endpoint no encontrado" }, 404);
  },
};
