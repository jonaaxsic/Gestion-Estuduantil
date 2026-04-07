import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Usuario,
  Estudiante,
  Curso,
  Asistencia,
  Evaluacion,
  Anotacion,
  Reunione,
  Apoderado,
  LoginResponse,
} from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  
  // Headers por defecto para JSON
  private readonly jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // ============ AUTH ============
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, {
      email,
      password,
    }, { headers: this.jsonHeaders });
  }

  // ============ USUARIOS ============
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, { headers: this.jsonHeaders });
  }

  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/${id}`, { headers: this.jsonHeaders });
  }

  createUsuario(data: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, data, { headers: this.jsonHeaders });
  }

  updateUsuario(id: string, data: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/usuarios/${id}`, data, { headers: this.jsonHeaders });
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/usuarios/${id}`, { headers: this.jsonHeaders });
  }

  // ============ ESTUDIANTES ============
  getEstudiantes(cursoId?: string): Observable<Estudiante[]> {
    const url = cursoId
      ? `${this.baseUrl}/estudiantes?curso_id=${cursoId}`
      : `${this.baseUrl}/estudiantes`;
    return this.http.get<Estudiante[]>(url, { headers: this.jsonHeaders });
  }

  getEstudiante(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.baseUrl}/estudiantes/${id}`, { headers: this.jsonHeaders });
  }

  createEstudiante(data: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.baseUrl}/estudiantes`, data, { headers: this.jsonHeaders });
  }

  updateEstudiante(id: string, data: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.baseUrl}/estudiantes/${id}`, data, { headers: this.jsonHeaders });
  }

  deleteEstudiante(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/estudiantes/${id}`, { headers: this.jsonHeaders });
  }

  // ============ CURSOS ============
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.baseUrl}/cursos`, { headers: this.jsonHeaders });
  }

  getCurso(id: string): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/cursos/${id}`, { headers: this.jsonHeaders });
  }

  createCurso(data: Partial<Curso>): Observable<Curso> {
    return this.http.post<Curso>(`${this.baseUrl}/cursos`, data, { headers: this.jsonHeaders });
  }

  updateCurso(id: string, data: Partial<Curso>): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseUrl}/cursos/${id}`, data, { headers: this.jsonHeaders });
  }

  deleteCurso(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cursos/${id}`, { headers: this.jsonHeaders });
  }

  // ============ ASISTENCIA ============
  getAsistencia(filters?: {
    estudiante_id?: string;
    curso_id?: string;
    fecha?: string;
  }): Observable<Asistencia[]> {
    let url = `${this.baseUrl}/asistencia`;
    const params = new URLSearchParams();
    if (filters?.estudiante_id) params.set('estudiante_id', filters.estudiante_id);
    if (filters?.curso_id) params.set('curso_id', filters.curso_id);
    if (filters?.fecha) params.set('fecha', filters.fecha);
    if (params.toString()) url += '?' + params.toString();
    return this.http.get<Asistencia[]>(url, { headers: this.jsonHeaders });
  }

  createAsistencia(data: Partial<Asistencia>): Observable<Asistencia> {
    return this.http.post<Asistencia>(`${this.baseUrl}/asistencia`, data, { headers: this.jsonHeaders });
  }

  createAsistenciaBulk(data: {
    curso_id: string;
    fecha: string;
    registros: { estudiante_id: string; presente: boolean; observacion?: string }[];
  }): Observable<{ created: number }> {
    return this.http.post<{ created: number }>(`${this.baseUrl}/asistencia/bulk`, data, { headers: this.jsonHeaders });
  }

  // ============ EVALUACIONES ============
  getEvaluaciones(cursoId?: string): Observable<Evaluacion[]> {
    const url = cursoId
      ? `${this.baseUrl}/evaluaciones?curso_id=${cursoId}`
      : `${this.baseUrl}/evaluaciones`;
    return this.http.get<Evaluacion[]>(url, { headers: this.jsonHeaders });
  }

  getEvaluacion(id: string): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(`${this.baseUrl}/evaluaciones/${id}`, { headers: this.jsonHeaders });
  }

  createEvaluacion(data: Partial<Evaluacion>): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(`${this.baseUrl}/evaluaciones`, data, { headers: this.jsonHeaders });
  }

  updateEvaluacion(id: string, data: Partial<Evaluacion>): Observable<Evaluacion> {
    return this.http.put<Evaluacion>(`${this.baseUrl}/evaluaciones/${id}`, data, { headers: this.jsonHeaders });
  }

  deleteEvaluacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/evaluaciones/${id}`, { headers: this.jsonHeaders });
  }

  // ============ ANOTACIONES ============
  getAnotaciones(estudianteId?: string): Observable<Anotacion[]> {
    const url = estudianteId
      ? `${this.baseUrl}/anotaciones?estudiante_id=${estudianteId}`
      : `${this.baseUrl}/anotaciones`;
    return this.http.get<Anotacion[]>(url, { headers: this.jsonHeaders });
  }

  getAnotacion(id: string): Observable<Anotacion> {
    return this.http.get<Anotacion>(`${this.baseUrl}/anotaciones/${id}`, { headers: this.jsonHeaders });
  }

  createAnotacion(data: Partial<Anotacion>): Observable<Anotacion> {
    return this.http.post<Anotacion>(`${this.baseUrl}/anotaciones`, data, { headers: this.jsonHeaders });
  }

  updateAnotacion(id: string, data: Partial<Anotacion>): Observable<Anotacion> {
    return this.http.put<Anotacion>(`${this.baseUrl}/anotaciones/${id}`, data, { headers: this.jsonHeaders });
  }

  deleteAnotacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/anotaciones/${id}`, { headers: this.jsonHeaders });
  }

  // ============ REUNIONES ============
  getReuniones(cursoId?: string): Observable<Reunione[]> {
    const url = cursoId
      ? `${this.baseUrl}/reuniones?curso_id=${cursoId}`
      : `${this.baseUrl}/reuniones`;
    return this.http.get<Reunione[]>(url, { headers: this.jsonHeaders });
  }

  getReunion(id: string): Observable<Reunione> {
    return this.http.get<Reunione>(`${this.baseUrl}/reuniones/${id}`, { headers: this.jsonHeaders });
  }

  createReunion(data: Partial<Reunione>): Observable<Reunione> {
    return this.http.post<Reunione>(`${this.baseUrl}/reuniones`, data, { headers: this.jsonHeaders });
  }

  updateReunion(id: string, data: Partial<Reunione>): Observable<Reunione> {
    return this.http.put<Reunione>(`${this.baseUrl}/reuniones/${id}`, data, { headers: this.jsonHeaders });
  }

  deleteReunion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reuniones/${id}`, { headers: this.jsonHeaders });
  }

  // ============ APODERADOS ============
  getApoderados(estudianteId?: string): Observable<Apoderado[]> {
    const url = estudianteId
      ? `${this.baseUrl}/apoderados?estudiante_id=${estudianteId}`
      : `${this.baseUrl}/apoderados`;
    return this.http.get<Apoderado[]>(url, { headers: this.jsonHeaders });
  }

  getApoderado(id: string): Observable<Apoderado> {
    return this.http.get<Apoderado>(`${this.baseUrl}/apoderados/${id}`, { headers: this.jsonHeaders });
  }

  createApoderado(data: Partial<Apoderado>): Observable<Apoderado> {
    return this.http.post<Apoderado>(`${this.baseUrl}/apoderados`, data, { headers: this.jsonHeaders });
  }

  updateApoderado(id: string, data: Partial<Apoderado>): Observable<Apoderado> {
    return this.http.put<Apoderado>(`${this.baseUrl}/apoderados/${id}`, data, { headers: this.jsonHeaders });
  }

  deleteApoderado(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/apoderados/${id}`, { headers: this.jsonHeaders });
  }
}
