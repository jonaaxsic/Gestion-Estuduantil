import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Estudiante, Asistencia, Evaluacion, Anotacion, Curso } from '../../shared/models';

@Component({
  selector: 'app-dashboard-apoderado',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard-apoderado.page.html',
  styleUrls: ['./dashboard-apoderado.page.css']
})
export class DashboardApoderadoPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  
  estudiante = signal<Estudiante | null>(null);
  asistencia = signal<Asistencia[]>([]);
  evaluaciones = signal<Evaluacion[]>([]);
  anotaciones = signal<Anotacion[]>([]);
  cursos = signal<Curso[]>([]);
  
  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    // Get student based on logged-in user's ID (apoderado)
    const userId = this.auth.user()?.id;
    
    // Load cursos first
    this.api.getCursos().subscribe(data => this.cursos.set(data));
    
    this.api.getEstudiantes().subscribe(data => {
      // Find student where estudiante.apoderado_id matches user.id
      const student = data.find(s => s.apoderado_id === userId);
      if (student) {
        this.estudiante.set(student);
        // Load related data for this student
        this.loadStudentData(student.id!);
      }
      // If no student found, estudiante stays null and shows empty state
    });
  }
  
  loadStudentData(studentId: string): void {
    this.api.getAsistencia({ estudiante_id: studentId }).subscribe(data => this.asistencia.set(data));
    this.api.getEvaluaciones().subscribe(data => this.evaluaciones.set(data));
    this.api.getAnotaciones(studentId).subscribe(data => this.anotaciones.set(data));
  }
  
  getPresentes(): number {
    return this.asistencia().filter(a => a.presente).length;
  }
  
  getAnotacionesPositivas(): number {
    return this.anotaciones().filter(a => a.tipo === 'positiva').length;
  }
  
  getAnotacionesNegativas(): number {
    return this.anotaciones().filter(a => a.tipo === 'negativa').length;
  }
  
  getCursoNombre(cursoId: string | undefined): string {
    if (!cursoId) return 'Sin curso';
    const curso = this.cursos().find(c => c.id === cursoId);
    if (curso) {
      return curso.nivel || curso.nombre || 'Sin curso';
    }
    return 'Sin curso';
  }
  
  logout(): void {
    this.auth.logout();
  }
}