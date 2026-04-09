/**
 * Cloudflare Worker - Gestion Estudiantil API
 * Proxy que reenvía peticiones al backend de Render (MongoDB Atlas)
 */

const RENDER_API = "https://gestion-estuduantil.onrender.com";

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://gestionestudiantil.pages.dev",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
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

    // Si es una petición de API, reenviar al backend de Render
    if (path.startsWith("/api/")) {
      try {
        const renderPath = path.replace("/api", "");
        const renderUrl = `${RENDER_API}${renderPath}${url.search}`;
        
        const headers = {};
        request.headers.forEach((value, key) => {
          if (key.toLowerCase() !== "host") {
            headers[key] = value;
          }
        });

        const renderResponse = await fetch(renderUrl, {
          method: request.method,
          headers,
          body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
        });

        const responseText = await renderResponse.text();
        return new Response(responseText, {
          status: renderResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        return createResponse({ error: "Error de conexión con el servidor", details: error.message }, 502);
      }
    }

    // Para rutas que no son API, devolver null para que Cloudflare sirva archivos estáticos
    return null;
  },
};
