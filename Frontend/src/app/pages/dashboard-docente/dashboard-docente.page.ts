import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Curso, Evaluacion, Anotacion, Estudiante, Asistencia, Reunione } from '../../shared/models';

@Component({
  selector: 'app-dashboard-docente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  templateUrl: './dashboard-docente.page.html',
  styleUrls: ['./dashboard-docente.page.css']
})
export class DashboardDocentePage implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  
  cursos = signal<Curso[]>([]);
  estudiantes = signal<Estudiante[]>([]);
  evaluaciones = signal<Evaluacion[]>([]);
  anotaciones = signal<Anotacion[]>([]);
  
  // Modal states
  showAsistenciaModal = signal(false);
  showEvaluacionModal = signal(false);
  showAnotacionModal = signal(false);
  showReunionModal = signal(false);
  saving = signal(false);
  successMessage = signal('');
  
  // Form data
  asistenciaForm = {
    cursoId: '',
    fecha: new Date().toISOString().split('T')[0],
    registros: {} as Record<string, boolean>
  };
  
  evaluacionForm = {
    cursoId: '',
    materia: '',
    titulo: '',
    descripcion: '',
    fecha: '',
    ponderacion: 20
  };
  
  anotacionForm = {
    estudianteId: '',
    tipo: 'negativa' as 'positiva' | 'negativa',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  };
  
  reunionForm = {
    cursoId: '',
    fecha: '',
    hora: '',
    lugar: '',
    descripcion: ''
  };
  
  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    this.api.getCursos().subscribe(data => this.cursos.set(data));
    this.api.getEstudiantes().subscribe(data => this.estudiantes.set(data));
    this.api.getEvaluaciones().subscribe(data => this.evaluaciones.set(data));
    this.api.getAnotaciones().subscribe(data => this.anotaciones.set(data));
  }
  
  loadEstudiantesPorCurso(): void {
    if (this.asistenciaForm.cursoId) {
      this.api.getEstudiantes(this.asistenciaForm.cursoId).subscribe(data => {
        this.estudiantes.set(data);
        this.asistenciaForm.registros = {};
        data.forEach(est => {
          if (est.id) this.asistenciaForm.registros[est.id] = true;
        });
      });
    }
  }
  
  setAttendance(estudianteId: string, presente: boolean): void {
    this.asistenciaForm.registros[estudianteId] = presente;
  }
  
  // Modal controls
  openAsistenciaDialog(): void {
    this.asistenciaForm = {
      cursoId: '',
      fecha: new Date().toISOString().split('T')[0],
      registros: {}
    };
    this.showAsistenciaModal.set(true);
  }
  
  openEvaluacionDialog(): void {
    this.evaluacionForm = {
      cursoId: '',
      materia: '',
      titulo: '',
      descripcion: '',
      fecha: '',
      ponderacion: 20
    };
    this.showEvaluacionModal.set(true);
  }
  
  openAnotacionDialog(): void {
    this.anotacionForm = {
      estudianteId: '',
      tipo: 'negativa',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0]
    };
    this.showAnotacionModal.set(true);
  }
  
  openReunionDialog(): void {
    this.reunionForm = {
      cursoId: '',
      fecha: '',
      hora: '',
      lugar: '',
      descripcion: ''
    };
    this.showReunionModal.set(true);
  }
  
  closeModals(): void {
    this.showAsistenciaModal.set(false);
    this.showEvaluacionModal.set(false);
    this.showAnotacionModal.set(false);
    this.showReunionModal.set(false);
  }
  
  showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 3000);
  }
  
  // Save methods
  saveAsistencia(): void {
    if (!this.asistenciaForm.cursoId || !this.asistenciaForm.fecha) {
      alert('Por favor complete el curso y la fecha');
      return;
    }
    
    const registros = Object.entries(this.asistenciaForm.registros).map(([estudiante_id, presente]) => ({
      estudiante_id,
      presente
    }));
    
    this.saving.set(true);
    this.api.createAsistenciaBulk({
      curso_id: this.asistenciaForm.cursoId,
      fecha: this.asistenciaForm.fecha,
      registros
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModals();
        this.showSuccess('Asistencia registrada correctamente');
        this.api.getAsistencia().subscribe(data => {});
      },
      error: () => {
        this.saving.set(false);
        alert('Error al registrar asistencia');
      }
    });
  }
  
  saveEvaluacion(): void {
    if (!this.evaluacionForm.cursoId || !this.evaluacionForm.materia || !this.evaluacionForm.titulo || !this.evaluacionForm.fecha) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    this.saving.set(true);
    this.api.createEvaluacion({
      curso_id: this.evaluacionForm.cursoId,
      materia: this.evaluacionForm.materia,
      titulo: this.evaluacionForm.titulo,
      descripcion: this.evaluacionForm.descripcion,
      fecha: this.evaluacionForm.fecha,
      ponderacion: this.evaluacionForm.ponderacion
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModals();
        this.showSuccess('Evaluación creada correctamente');
        this.loadData();
      },
      error: () => {
        this.saving.set(false);
        alert('Error al crear evaluación');
      }
    });
  }
  
  saveAnotacion(): void {
    if (!this.anotacionForm.estudianteId || !this.anotacionForm.descripcion) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    this.saving.set(true);
    this.api.createAnotacion({
      estudiante_id: this.anotacionForm.estudianteId,
      tipo: this.anotacionForm.tipo,
      descripcion: this.anotacionForm.descripcion,
      fecha: this.anotacionForm.fecha
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModals();
        this.showSuccess('Anotación creada correctamente');
        this.loadData();
      },
      error: () => {
        this.saving.set(false);
        alert('Error al crear anotación');
      }
    });
  }
  
  saveReunion(): void {
    if (!this.reunionForm.cursoId || !this.reunionForm.fecha || !this.reunionForm.hora || !this.reunionForm.lugar) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    this.saving.set(true);
    this.api.createReunion({
      curso_id: this.reunionForm.cursoId,
      fecha: this.reunionForm.fecha,
      hora: this.reunionForm.hora,
      lugar: this.reunionForm.lugar,
      descripcion: this.reunionForm.descripcion,
      notificacion_enviada: false
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModals();
        this.showSuccess('Reunión programada correctamente');
        this.loadData();
      },
      error: () => {
        this.saving.set(false);
        alert('Error al programar reunión');
      }
    });
  }
  
  logout(): void {
    this.auth.logout();
  }
}