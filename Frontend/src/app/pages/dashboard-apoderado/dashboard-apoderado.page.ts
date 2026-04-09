import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Estudiante, Asistencia, Evaluacion, Anotacion, Curso, Recordatorio } from '../../shared/models';

@Component({
  selector: 'app-dashboard-apoderado',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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
  recordatorios = signal<Recordatorio[]>([]);
  
  // Modal state
  showRecordatorioModal = signal(false);
  recordatorioForm = {
    titulo: '',
    descripcion: '',
    fecha_limite: ''
  };
  saving = signal(false);
  successMessage = signal('');
  
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
    
    // Load recordatorios
    const userId = this.auth.user()?.id;
    if (userId) {
      this.api.getRecordatorios(userId).subscribe(data => this.recordatorios.set(data));
    }
  }
  
  // Recordatorio methods
  openRecordatorioDialog(): void {
    this.recordatorioForm = { titulo: '', descripcion: '', fecha_limite: '' };
    this.showRecordatorioModal.set(true);
  }
  
  closeRecordatorioModal(): void {
    this.showRecordatorioModal.set(false);
  }
  
  saveRecordatorio(): void {
    if (!this.recordatorioForm.titulo) {
      alert('Ingrese un título');
      return;
    }
    const userId = this.auth.user()?.id;
    if (!userId) return;
    
    this.saving.set(true);
    this.api.createRecordatorio({
      usuario_id: userId,
      titulo: this.recordatorioForm.titulo,
      descripcion: this.recordatorioForm.descripcion,
      fecha_limite: this.recordatorioForm.fecha_limite || undefined,
      completada: false
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.showSuccess('Recordatorio creado');
        this.closeRecordatorioModal();
        this.loadData();
      },
      error: () => {
        this.saving.set(false);
        alert('Error al crear recordatorio');
      }
    });
  }
  
  toggleRecordatorioCompleted(rec: Recordatorio): void {
    if (rec.id) {
      this.api.updateRecordatorio(rec.id, { completada: !rec.completada }).subscribe({
        next: () => this.loadData(),
        error: () => alert('Error')
      });
    }
  }
  
  deleteRecordatorio(rec: Recordatorio): void {
    if (rec.id && confirm('¿Eliminar?')) {
      this.api.deleteRecordatorio(rec.id).subscribe({
        next: () => { this.showSuccess('Eliminado'); this.loadData(); },
        error: () => alert('Error')
      });
    }
  }
  
  showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 3000);
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