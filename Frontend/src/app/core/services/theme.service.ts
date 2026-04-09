import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'ge-theme';

  /** Señal reactiva: 'light' | 'dark' */
  readonly theme = signal<Theme>(this._getSaved());

  constructor() {
    // Aplica el tema inicial al arrancar
    this._apply(this.theme());

    // Cada vez que cambie la señal, aplica la clase y guarda en localStorage
    effect(() => {
      const t = this.theme();
      this._apply(t);
      localStorage.setItem(this.STORAGE_KEY, t);
    });
  }

  toggle(): void {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  private _getSaved(): Theme {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Si no hay preferencia guardada, usa la del sistema operativo
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private _apply(theme: Theme): void {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }
}
