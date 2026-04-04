"""
Cloudflare Worker - Backend API para Gestión Estudiantil
Replica los endpoints de Django para MongoDB Atlas
"""

import asyncio
from datetime import datetime

# ===========================================
# MONGODB CONNECTION (via HTTP API o Workers KV)
# ===========================================
# Para Cloudflare Workers, necesitamos usar MongoDB HTTP API
# o un proxy. Aquí usamos mongo-hunter o similar

# Por ahora, usamos una implementación básica
# que se conecta via MongoDB Atlas Data API

# ===========================================
# CONFIGURACIÓN
# ===========================================
MONGO_URI = ""  # Se configurará como variable de entorno
MONGO_DB = "App_estudiantil"
ATLAS_API_URL = ""  # MongoDB Atlas Data API URL

# ===========================================
# BASE DE DATOS - MongoDB Atlas HTTP API
# ===========================================
class MongoDB:
    def __init__(self):
        self.api_url = ATLAS_API_URL or "https://data.mongodb-api.com/data/endpoint"
        self.api_key = MONGO_URI  # Usamos la URI como API key
        self.db = MONGO_DB
    
    async def find(self, collection, query=None, sort=None, limit=0):
        """Buscar documentos"""
        url = f"{self.api_url}/find/{self.db}/{collection}"
        data = {
            "filter": query or {},
            "sort": sort,
            "limit": limit
        }
        return await self._post(url, data)
    
    async def find_one(self, collection, query):
        """Buscar un documento"""
        url = f"{self.api_url}/findOne/{self.db}/{collection}"
        data = {"filter": query}
        return await self._post(url, data)
    
    async def insert_one(self, collection, document):
        """Insertar documento"""
        url = f"{self.api_url}/insertOne/{self.db}/{collection}"
        data = {"document": document}
        return await self._post(url, data)
    
    async def update_one(self, collection, query, update):
        """Actualizar documento"""
        url = f"{self.api_url}/updateOne/{self.db}/{collection}"
        data = {"filter": query, "update": update}
        return await self._post(url, data)
    
    async def delete_one(self, collection, query):
        """Eliminar documento"""
        url = f"{self.api_url}/deleteOne/{self.db}/{collection}"
        data = {"filter": query}
        return await self._post(url, data)
    
    async def aggregate(self, collection, pipeline):
        """Ejecutar agregación"""
        url = f"{self.api_url}/aggregate/{self.db}/{collection}"
        data = {"pipeline": pipeline}
        return await self._post(url, data)
    
    async def _post(self, url, data):
        """Ejecutar request HTTP"""
        headers = {
            "Content-Type": "application/json",
            "api-key": self.api_key
        }
        try:
            response = await fetch(url, {
                "method": "POST",
                "headers": headers,
                "body": JSON.stringify(data)
            })
            return await response.json()
        except:
            return {"error": "Database connection failed"}

# Instancia global de base de datos
db = MongoDB()

# ===========================================
# HELPERS
# ===========================================
def get_json_body(request):
    """Obtener body como JSON"""
    return request.json() or {}

def create_response(data, status=200):
    """Crear respuesta JSON"""
    return new Response(JSON.stringify(data), {
        "status": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    })

def cors_response(data):
    """Respuesta con CORS"""
    return new Response(JSON.stringify(data), {
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    })

# ===========================================
# RUTAS / ENDPOINTS
# ===========================================
async def handle_request(request):
    """Manejar todas las peticiones"""
    
    # CORS preflight
    if request.method == "OPTIONS":
        return new Response("", {
            "status": 204,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }
        })
    
    path = request.path
    method = method
    
    # Routing básico
    if path == "/" or path == "":
        return create_response({"status": "ok", "message": "API Backend - Gestión Estudiantil"})
    
    # Auth
    if path == "/auth/login" and method == "POST":
        return await login(request)
    
    # Usuarios
    if path == "/usuarios" or path == "/usuarios/":
        if method == "GET":
            return await list_usuarios()
        if method == "POST":
            return await create_usuario(request)
    
    if path.startswith("/usuarios/") and len(path) > 9:
        id = path.split("/")[2]
        if method == "GET":
            return await get_usuario(id)
        if method == "PUT":
            return await update_usuario(request, id)
        if method == "DELETE":
            return await delete_usuario(id)
    
    # Estudiantes
    if path == "/estudiantes" or path == "/estudiantes/":
        if method == "GET":
            return await list_estudiantes(request)
        if method == "POST":
            return await create_estudiante(request)
    
    if path.startswith("/estudiantes/") and len(path) > 12:
        id = path.split("/")[2]
        if method == "GET":
            return await get_estudiante(id)
        if method == "PUT":
            return await update_estudiante(request, id)
        if method == "DELETE":
            return await delete_estudiante(id)
    
    # Cursos
    if path == "/cursos" or path == "/cursos/":
        if method == "GET":
            return await list_cursos()
        if method == "POST":
            return await create_curso(request)
    
    if path.startswith("/cursos/") and len(path) > 8:
        id = path.split("/")[2]
        if method == "GET":
            return await get_curso(id)
        if method == "PUT":
            return await update_curso(request, id)
        if method == "DELETE":
            return await delete_curso(id)
    
    # Asistencia
    if path == "/asistencia" or path == "/asistencia/":
        if method == "GET":
            return await list_asistencia(request)
        if method == "POST":
            return await create_asistencia(request)
    
    if path == "/asistencia/bulk" and method == "POST":
        return await bulk_asistencia(request)
    
    # Evaluaciones
    if path == "/evaluaciones" or path == "/evaluaciones/":
        if method == "GET":
            return await list_evaluaciones(request)
        if method == "POST":
            return await create_evaluacion(request)
    
    # Anotaciones
    if path == "/anotaciones" or path == "/anotaciones/":
        if method == "GET":
            return await list_anotaciones(request)
        if method == "POST":
            return await create_anotacion(request)
    
    # Reuniones
    if path == "/reuniones" or path == "/reuniones/":
        if method == "GET":
            return await list_reuniones(request)
        if method == "POST":
            return await create_reunion(request)
    
    # Apoderados
    if path == "/apoderados" or path == "/apoderados/":
        if method == "GET":
            return await list_apoderados(request)
        if method == "POST":
            return await create_apoderado(request)
    
    # Dashboards
    if path == "/dashboard/docente":
        return await dashboard_docente(request)
    
    if path == "/dashboard/apoderado":
        return await dashboard_apoderado(request)
    
    # 404
    return create_response({"error": "Endpoint not found"}, 404)

# ===========================================
# AUTH
# ===========================================
async def login(request):
    data = await get_json_body(request)
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return create_response({"error": "Email y password requeridos"}, 400)
    
    # Buscar en MongoDB
    result = await db.find_one("usuarios", {"email": email, "password": password, "activo": True})
    
    if result and "document" in result:
        doc = result["document"]
        doc["_id"] = doc.get("_id", {}).get("$oid", "")
        return create_response({"success": True, "user": doc})
    
    return create_response({"error": "Credenciales inválidas"}, 401)

# ===========================================
# USUARIOS
# ===========================================
async def list_usuarios():
    result = await db.find("usuarios", sort=[("created_at", -1)])
    return create_response(result.get("documents", []))

async def create_usuario(request):
    data = await get_json_body(request)
    data["created_at"] = datetime.now().isoformat()
    data["updated_at"] = datetime.now().isoformat()
    result = await db.insert_one("usuarios", data)
    return create_response(result, 201)

async def get_usuario(id):
    result = await db.find_one("usuarios", {"_id": {"$oid": id}})
    if result and "document" in result:
        doc = result["document"]
        doc["_id"] = id
        return create_response(doc)
    return create_response({"error": "Usuario no encontrado"}, 404)

async def update_usuario(request, id):
    data = await get_json_body(request)
    data["updated_at"] = datetime.now().isoformat()
    result = await db.update_one("usuarios", {"_id": {"$oid": id}}, {"$set": data})
    return create_response(result)

async def delete_usuario(id):
    result = await db.delete_one("usuarios", {"_id": {"$oid": id}})
    return create_response(result)

# ===========================================
# ESTUDIANTES
# ===========================================
async def list_estudiantes(request):
    query = {}
    curso_id = request.query.get("curso_id")
    if curso_id:
        query["curso_id"] = curso_id
    
    result = await db.find("estudiantes", query, sort=[("apellido", 1)])
    return create_response(result.get("documents", []))

async def create_estudiante(request):
    data = await get_json_body(request)
    data["created_at"] = datetime.now().isoformat()
    data["updated_at"] = datetime.now().isoformat()
    result = await db.insert_one("estudiantes", data)
    return create_response(result, 201)

async def get_estudiante(id):
    result = await db.find_one("estudiantes", {"_id": {"$oid": id}})
    if result and "document" in result:
        doc = result["document"]
        doc["_id"] = id
        return create_response(doc)
    return create_response({"error": "Estudiante no encontrado"}, 404)

async def update_estudiante(request, id):
    data = await get_json_body(request)
    data["updated_at"] = datetime.now().isoformat()
    result = await db.update_one("estudiantes", {"_id": {"$oid": id}}, {"$set": data})
    return create_response(result)

async def delete_estudiante(id):
    result = await db.delete_one("estudiantes", {"_id": {"$oid": id}})
    return create_response(result)

# ===========================================
# CURSOS
# ===========================================
async def list_cursos():
    result = await db.find("cursos", sort=[("nombre", 1)])
    return create_response(result.get("documents", []))

async def create_curso(request):
    data = await get_json_body(request)
    data["created_at"] = datetime.now().isoformat()
    data["updated_at"] = datetime.now().isoformat()
    result = await db.insert_one("cursos", data)
    return create_response(result, 201)

async def get_curso(id):
    result = await db.find_one("cursos", {"_id": {"$oid": id}})
    if result and "document" in result:
        doc = result["document"]
        doc["_id"] = id
        return create_response(doc)
    return create_response({"error": "Curso no encontrado"}, 404)

async def update_curso(request, id):
    data = await get_json_body(request)
    data["updated_at"] = datetime.now().isoformat()
    result = await db.update_one("cursos", {"_id": {"$oid": id}}, {"$set": data})
    return create_response(result)

async def delete_curso(id):
    result = await db.delete_one("cursos", {"_id": {"$oid": id}})
    return create_response(result)

# ===========================================
# ASISTENCIA
# ===========================================
async def list_asistencia(request):
    query = {}
    if request.query.get("estudiante_id"):
        query["estudiante_id"] = request.query.get("estudiante_id")
    if request.query.get("curso_id"):
        query["curso_id"] = request.query.get("curso_id")
    if request.query.get("fecha"):
        query["fecha"] = request.query.get("fecha")
    
    result = await db.find("asistencia", query, sort=[("fecha", -1)])
    return create_response(result.get("documents", []))

async def create_asistencia(request):
    data = await get_json_body(request)
    data["created_at"] = datetime.now().isoformat()
    data["updated_at"] = datetime.now().isoformat()
    result = await db.insert_one("asistencia", data)
    return create_response(result, 201)

async def bulk_asistencia(request):
    data = await get_json_body(request)
    curso_id = data.get("curso_id")
    fecha = data.get("fecha")
    registros = data.get("registros", [])
    
    if not curso_id or not fecha or not registros:
        return create_response({"error": "curso_id, fecha y registros requeridos"}, 400)
    
    created = 0
    for registro in registro in registros:
        doc = {
            "estudiante_id": registro.get("estudiante_id"),
            "curso_id": curso_id,
            "fecha": fecha,
            "presente": registro.get("presente", True),
            "observacion": registro.get("observacion"),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        await db.insert_one("asistencia", doc)
        created += 1
    
    return create_response({"created": created}, 201)

# ===========================================
# EVALUACIONES
# ===========================================
async def list_evaluaciones(request):
    query = {}
    if request.query.get("curso_id"):
        query["curso_id"] = request.query.get("curso_id")
    if request.query.get("materia"):
        query["materia"] = request.query.get("materia")
    
    result = await db.find("evaluaciones", query, sort=[("fecha", -1)])
    return create_response(result.get("documents", []))

async def create_evaluacion(request):
    data = await get_json_body(request)
    data["created_at"] = datetime.now().isoformat()
    data["updated_at"] = datetime.now().isoformat()
    result = await db.insert_one("evaluaciones", data)
    return create_response(result, 201)

# ===========================================
# ANOTACIONES
# ===========================================
async def list_anotaciones(request):
    query = {}
    if request.query.get("estudiante_id"):
        query["estudiante_id"] = request.query.get("estudiante_id")
    if request.query.get("tipo"):
        query["tipo"] = request.query.get("tipo")
    
    result = await db.find("anotaciones", query, sort=[("fecha", -1)])
    return create_response(result.get("documents", []))

async def create_anotacion(request):
    data = await get_json_body(request)
    data["created_at"] = datetime.now().isoformat()
    data["updated_at"] = datetime.now().isoformat()
    result = await db.insert_one("anotaciones", data)
    return create_response(result, 201)

# ===========================================
# REUNIONES
# ===========================================
async def list_reuniones(request):
    query = {}
    if request.query.get("curso_id"):
        query["curso_id"] = request.query.get("curso_id")
    
    result = await db.find("reuniones", query, sort=[("fecha", 1)])
    return create_response(result.get("documents", []))

async def create_reunion(request):
    data = await get_json_body(request)
    data["created_at"] = datetime.now().isoformat()
    data["updated_at"] = datetime.now().isoformat()
    result = await db.insert_one("reuniones", data)
    return create_response(result, 201)

# ===========================================
# APODERADOS
# ===========================================
async def list_apoderados(request):
    query = {}
    if request.query.get("estudiante_id"):
        query["estudiante_id"] = request.query.get("estudiante_id")
    
    result = await db.find("apoderados", query, sort=[("apellido", 1)])
    return create_response(result.get("documents", []))

async def create_apoderado(request):
    data = await get_json_body(request)
    data["created_at"] = datetime.now().isoformat()
    data["updated_at"] = datetime.now().isoformat()
    result = await db.insert_one("apoderados", data)
    return create_response(result, 201)

# ===========================================
# DASHBOARDS
# ===========================================
async def dashboard_docente(request):
    docente_id = request.query.get("docente_id")
    if not docente_id:
        return create_response({"error": "docente_id requerido"}, 400)
    
    return create_response({"message": "Dashboard docente"})

async def dashboard_apoderado(request):
    estudiante_id = request.query.get("estudiante_id")
    if not estudiante_id:
        return create_response({"error": "estudiante_id requerido"}, 400)
    
    # Obtener estudiante
    estudiante = await db.find_one("estudiantes", {"_id": {"$oid": estudiante_id})
    if not estudiante or "document" not in estudiante:
        return create_response({"error": "Estudiante no encontrado"}, 404)
    
    # Obtener asistencia
    asistencia = await db.find("asistencia", {"estudiante_id": estudiante_id}, sort=[("fecha", -1)], limit=10)
    
    # Obtener evaluaciones
    curso_id = estudiante["document"].get("curso_id")
    evaluaciones = []
    if curso_id:
        evaluaciones = await db.find("evaluaciones", {"curso_id": curso_id}, sort=[("fecha", 1)], limit=5)
    
    # Obtener anotaciones
    anotaciones = await db.find("anotaciones", {"estudiante_id": estudiante_id}, sort=[("fecha", -1)], limit=5)
    
    return create_response({
        "estudiante": estudiante["document"],
        "asistencia": asistencia.get("documents", []),
        "evaluaciones": evaluaciones.get("documents", []),
        "anotaciones": anotaciones.get("documents", [])
    })

# ===========================================
# WORKER ENTRY POINT
# ===========================================
async def on_fetch(request, env):
    # Configurar MongoDB desde variables de entorno
    global MONGO_URI, ATLAS_API_URL
    
    MONGO_URI = env.get("MONGO_URI", "")
    ATLAS_API_URL = env.get("ATLAS_API_URL", "")
    
    return await handle_request(request)