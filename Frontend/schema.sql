-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'apoderado',
  rut TEXT,
  activo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create estudiantes table
CREATE TABLE IF NOT EXISTS estudiantes (
  id TEXT PRIMARY KEY,
  rut TEXT UNIQUE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  fecha_nacimiento TEXT,
  curso_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create cursos table
CREATE TABLE IF NOT EXISTS cursos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  nivel TEXT,
  ano INTEGER DEFAULT 2026,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create asistencia table
CREATE TABLE IF NOT EXISTS asistencia (
  id TEXT PRIMARY KEY,
  estudiante_id TEXT NOT NULL,
  curso_id TEXT NOT NULL,
  fecha TEXT NOT NULL,
  presente INTEGER DEFAULT 1,
  observacion TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create evaluaciones table
CREATE TABLE IF NOT EXISTS evaluaciones (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  materia TEXT NOT NULL,
  curso_id TEXT NOT NULL,
  fecha TEXT NOT NULL,
  puntaje_max REAL DEFAULT 100,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create anotaciones table
CREATE TABLE IF NOT EXISTS anotaciones (
  id TEXT PRIMARY KEY,
  estudiante_id TEXT NOT NULL,
  tipo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create reuniones table
CREATE TABLE IF NOT EXISTS reuniones (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha TEXT NOT NULL,
  hora TEXT,
  curso_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create apoderados table
CREATE TABLE IF NOT EXISTS apoderados (
  id TEXT PRIMARY KEY,
  estudiante_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo admin user
INSERT INTO usuarios (id, email, password, nombre, apellido, rol, rut, activo) 
VALUES ('admin-001', 'admin@colegio.cl', 'admin123', 'Admin', 'Sistema', 'administrador', '12345678-9', 1);
