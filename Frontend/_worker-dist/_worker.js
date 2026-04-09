var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// functions/api.ts
var RENDER_API = "https://gestion-estuduantil.onrender.com";
var api_default = {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://gestionestudiantil.pages.dev",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true"
    };
    function createResponse(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    __name(createResponse, "createResponse");
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const url = new URL(request.url);
    const path = url.pathname;
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
          body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : void 0
        });
        const responseText = await renderResponse.text();
        return new Response(responseText, {
          status: renderResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (error) {
        return createResponse({ error: "Error de conexi\xF3n con el servidor", details: error.message }, 502);
      }
    }
    if (path === "/" || path === "") {
      return createResponse({
        status: "ok",
        message: "Gestion Estudiantil API - Cloudflare Pages"
      });
    }
    return createResponse({ error: "Endpoint no encontrado" }, 404);
  }
};
export {
  api_default as default
};
