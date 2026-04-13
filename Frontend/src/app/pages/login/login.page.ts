import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage implements OnDestroy {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  
  email = '';
  password = '';
  error = signal('');
  slowConnectionWarning = signal('');
  
  private slowConnectionTimer: ReturnType<typeof setTimeout> | null = null;
  
  ngOnDestroy(): void {
    if (this.slowConnectionTimer) {
      clearTimeout(this.slowConnectionTimer);
    }
  }
  
  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.error.set('Por favor ingresa tu correo y contraseña');
      return;
    }
    
    this.error.set('');
    this.slowConnectionWarning.set('');
    
    // Mostrar mensaje de carga lenta después de 5 segundos
    this.slowConnectionTimer = setTimeout(() => {
      this.slowConnectionWarning.set('El servidor está despertando, puede tardar hasta 60 segundos la primera vez...');
    }, 5000);
    
    const success = await this.auth.login(this.email, this.password);
    
    // Limpiar timer
    if (this.slowConnectionTimer) {
      clearTimeout(this.slowConnectionTimer);
      this.slowConnectionTimer = null;
    }
    
    if (success) {
      this.slowConnectionWarning.set('');
      this.auth.redirectByRole();
    } else {
      this.slowConnectionWarning.set('');
      this.error.set('Credenciales inválidas. Intenta nuevamente.');
    }
  }
}